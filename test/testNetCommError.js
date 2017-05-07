/* jshint esversion: 6 */
const net = require("net");
const path = require("path");

const assert = require('assert');

const NetComm = require(path.join("..", "src", "NetComm.js"));

// Start an echo server
const server = net.createServer((c) => {
    c.on("data", function(data) {
        if(data.toString() === "closeMe") {
            c.destroy();
        } else {
            c.write(data);
        }
    });
});
server.on('error', (err) => {
    console.error(err);
    throw err;
});
server.listen(50001, () => {});
// End echo server

let config = {
    host: "localhost",
    port: 50001,
    family: 4   // IPv4 | IPv6
};

describe("NetComm Error", function() {
    var netComm2 = new NetComm(config);

    it("should catch comm-on-connect event 2", function(done) {
        netComm2.on("comm-on-connect", function() {
            done();
        });
        netComm2.open();
    });

    it("should catch comm-on-error event", function(done) {
        netComm2.once("comm-on-disconnect", function() {
            server.close();
            done();
        });
        netComm2.once("comm-on-error", function(err) {
            server.close();
            assert.equal(err.code, "ECONNRESET");
            done();
        });
        netComm2.write("closeMe");
    });


    it("should catch comm-on-error event", function(done) {
        netComm2.once("comm-on-error", function(err) {
            console.error(err);
            assert.equal(err.code, "ECONNREFUSED");
            done();
        });
        netComm2.open();
    });

    it("isCommOpen should be false", function() {
        assert.equal(false, netComm2.isOpen());
    });
});
