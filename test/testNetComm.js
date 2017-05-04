/* jshint esversion: 6 */
const net = require("net");
const path = require("path");

const assert = require('assert');

const NetComm = require(path.join("..", "src", "NetComm.js"));

// Start an echo server
const server = net.createServer((c) => {
    c.on("data", function(data) {
        c.write(data);
    });
});
server.on('error', (err) => {
    throw err;
});
server.listen(50001, () => {});
// End echo server

let config = {
    host: "localhost",
    port: 50001,
    family: 4   // IPv4 | IPv6
};

describe("NetComm", function() {
    var netComm = new NetComm(config);

    it("should catch comm-on-connect event", function(done) {
        netComm.on("comm-on-connect", function() {
            done();
        });
        netComm.open();
    });

    it("isCommOpen should be true", function() {
        assert.equal(true, netComm.isOpen());
    });

    it("should catch comm-on-data event", function(done) {
        netComm.on("comm-on-data", function(data) {
            assert.equal(data, "Hello World!");
            done();
        });
        netComm.on("comm-on-data-error", function(err) {
            done(err);
        });
        netComm.write("Hello World!");

    });

    it("should catch comm-on-disconnect event", function(done) {
        netComm.on("comm-on-disconnect", function() {
            done();
        });
        netComm.close();
    });

    it("isCommOpen should be false", function() {
        assert.equal(false, netComm.isOpen());
    });
});
