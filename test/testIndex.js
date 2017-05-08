/* jshint esversion: 6 */
const net = require("net");
const path = require("path");

const CommBuilder = require(path.join("..", "index.js"));

// Start an echo server
const server = net.createServer((c) => {
    c.on("data", function(data) {
        if(data.toString() === "closeMe") {
            c.close();
        } else {
            c.write(data);
        }
    });
});
server.on('error', (err) => {
    throw err;
});
server.listen(50003, () => {});
// End echo server

let config = {
    type: "client",
    host: "localhost",
    port: 50003,
    family: 4,  // IPv4 | IPv6
    isContinuous: true
};
let socketComm = new CommBuilder().setType("socket").setConfig(config).build();

describe("NetComm", function() {
    it("should connect", function(done) {
        socketComm.on("comm-on-connect", function() {
            done();
        });
        socketComm.open();
    });
});