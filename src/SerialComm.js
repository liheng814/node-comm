/* jshint esversion: 6 */
var SerialPort = require('serialport');

const Comm = require("./Comm.js");

var config = {
    portName: "/dev/tty-usbserial1",
    // https://github.com/EmergingTechnologyAdvisors/node-serialport#module_serialport--SerialPort..openOptions
    portConfig: {
        baudRate: 9600,
        parity: "none", // none*|even|odd|mark|space
        dataBits: 8,    // 8*|7|6|5
        stopBits: 1,    // 1*|2
        rtscts: false,  // false*|true flow control
        xon: false,     // false*|true flow control
        xoff: false,    // false*|true flow control
        xany: false     // false*|true flow control
    }
};

/**
 * SerialPort Communication Class. Raise an event when receiving data.
 * @extends Comm
 */
class SerialComm extends Comm {
    
    open() {
        // Check port, host will default as 'localhost' if it's null.
        if( !this.config ) throw new Error("SerialComm: Should configure this Class via constructor.");
        if( !this.config.portName ) throw new Error("SerialComm: portName is neccessary.");

        // Check if Comm open.
        if( this.isOpen() ) return;

        var serialPort = new SerialPort(this.config.portName, this.config.portConfig);

        serialPort.on("open", (data) => {
            this.emit("comm-on-connect");
            this.setOpen(true);
            console.log("SerialComm: Connected to " + this.config.portName);
        });
        serialPort.on("data", (data) => {
            this.emit("comm-on-data", data.toString());
        });
        serialPort.on("disconnect", () => {
            this.emit("comm-on-disconnect");
            this.setOpen(false);
            console.log("SerialComm: Disconnected to " + this.config.portName);
        });
        serialPort.on("error", (err) => {
            this.emit("comm-on-error", err);
        });

        // Put socket into Class property.
        this.setCommExecObj(serialPort);
    }

    close() {
        // Check if Comm close.
        if( !this.isOpen() ) return;

        this.getCommExecObj().close();
        this.setOpen(false);
    }

    write( data, isSync = false ) {
        // Check if Comm close.
        if( !this.isOpen() ) throw new Error("SerialComm closed now, open() before write data out.");

        this.getCommExecObj().write(data);
    }
}

module.exports = SerialComm;