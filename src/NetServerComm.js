/* jshint esversion: 6 */
const net = require('net');

const Comm = require("./Comm.js");

// @ref https://nodejs.org/api/net.html#net_socket_connect_options_connectlistener
let config = {
    host: "localhost",
    port: 50001
};

/**
 * Socket Communication Class. Raise an event when receiving data.
 * @extends Comm
 */
class NetServerComm extends Comm {
    
    open() {
        // Check port, host will default as 'localhost' if it's null.
        if( !this.config ) throw new Error("NetServerComm: Should configure this Class via constructor.");
        if( !this.config.port ) throw new Error("NetServerComm: port is neccessary.");

        // Check if Comm open.
        if( this.isCommOpen ) throw new Error("NetServerComm has been open.");

        const server = net.createServer((clientSocket) => {
            // Connected
            this.isCommOpen = true;
            this.emit("comm-on-connect");

            clientSocket.on("data", function(data) {
                this.emit("comm-on-data", data.toString());
            });

            clientSocket.on('close', () => {
                this.emit("comm-on-disconnect");
                this.isCommOpen = false;
            });

            // Put socket into Class property.
            this.commExecObj = clientSocket;
        });
        server.maxConnections = 1;
        server.on('error', (err) => {
            throw err;
        });
        server.listen(this.config.port , () => {});
        this.emit("comm-on-ready");
    }

    close() {
        // Check if Comm close.
        if( !this.isCommOpen ) throw new Error("NetServerComm has been close or not open yet.");

        this.commExecObj.destroy();
        this.isCommOpen = false;
        
    }

    write( data, isSync = false ) {
        // Check if Comm close.
        if( !this.isCommOpen ) throw new Error("NetServerComm closed now, open() before write data out.");

        this.commExecObj.write(data);
    }
}

module.exports = NetServerComm;