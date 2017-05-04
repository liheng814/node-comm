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
        if( this.isCommOpen ) throw new Error("SerialComm has been open.");

        var serialPort = new SerialPort(this.config.portName, this.config.portConfig);

        const clientSocket = net.connect(this.config, () => {
            // Connected
            this.emit("comm-on-connect", data.toString());
        });
        serialPort.on('open', (data) => {
            this.emit("comm-on-connect");
            this.isCommOpen = true;
            console.log("SerialComm: Connected to " + this.config.portName);
        });
        serialPort.on('data', (data) => {
            this.emit("comm-on-data", data.toString());
        });
        serialPort.on('disconnect', () => {
            this.emit("comm-on-disconnect");
            this.isCommOpen = false;
            console.log("SerialComm: Disconnected to " + this.config.portName);
        });

        // Put socket into Class property.
        this.commExecObj = serialPort;
    }

    close() {
        // Check if Comm close.
        if( !this.isCommOpen ) throw new Error("SerialComm has been close or not open yet.");

        this.commExecObj.close();
        this.isCommOpen = false;
    }

    write( data, isSync = false ) {
        // Check if Comm close.
        if( !this.isCommOpen ) throw new Error("SerialComm closed now, open() before write data out.");

        this.commExecObj.write(data);
    }
}

module.exports = SerialComm;