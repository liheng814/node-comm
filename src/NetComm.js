/* jshint esversion: 6 */
const net = require('net');

const Comm = require("./Comm.js");

// @ref https://nodejs.org/api/net.html#net_socket_connect_options_connectlistener
let config = {
    host: "localhost",
    port: 50001,
    family: 4   // IPv4 | IPv6
};

/**
 * Socket Communication Class. Raise an event when receiving data.
 * @extends Comm
 */
class NetComm extends Comm {
    open() {
        // Check port, host will default as 'localhost' if it's null.
        if( !this.config ) throw new Error("NetComm: Should configure this Class via constructor.");
        if( !this.config.port ) throw new Error("NetComm: port is neccessary.");

        // Check if Comm open.
        if( this.isOpen() ) return;

        const clientSocket = net.connect(this.config, () => {
            // Connected
            this.setOpen(true);
            this.emit("comm-on-connect");
        });
        clientSocket.on('data', (data) => {
            this.emit("comm-on-data", data.toString());
        });
        clientSocket.on('close', () => {
            this.setOpen(false);
            this.emit("comm-on-disconnect");
        });
        clientSocket.on("error", function(err) {
            this.emit("comm-on-error", err);
        });
        // Put socket into Class property.
        this.setCommExecObj(clientSocket);
    }

    close() {
        // Check if Comm close.
        if( !this.isOpen() ) return;

        this.getCommExecObj().destroy();
    }

    write( data, isSync = false ) {
        // Check if Comm close.
        if( !this.isOpen() ) throw new Error("NetComm closed now, open() before write data out.");

        this.getCommExecObj().write(data);
    }
}

module.exports = NetComm;