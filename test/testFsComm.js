/* jshint esversion: 6 */
const fs = require("fs");
const path = require("path");

const assert = require('assert');

const FsComm = require(path.join("..", "src", "FsComm.js"));

let config = {
    targetPath: path.join(__dirname, "testFiles"),
    finalizeFile: "move",   // move | delete
    successPath: path.join(__dirname, "testFiles", "ok"),
    failedPath: path.join(__dirname, "testFiles", "bad"),
    encodeing: "UTF-8",
    isPolling: false,
    pollingInterval: 60     // second
};

describe("FsComm", function() {
    var fsComm = new FsComm(config);

    it("should catch comm-on-connect event", function(done) {
        fsComm.on("comm-on-connect", function() {
            done();
        });
        fsComm.open();
    });

    it("isCommOpen should be true", function() {
        assert.equal(true, fsComm.isOpen());
    });

    it("should catch comm-on-data event", function(done) {
        fsComm.on("comm-on-data", function(data) {
            assert.equal(data, "Hello World!");
            done();
        });
        fsComm.on("comm-on-data-error", function(err) {
            done(err);
        });
        fs.writeFileSync(path.join(__dirname, "testFiles", "test1.txt"), "Hello World!");

    });

    it("should catch comm-on-disconnect event", function(done) {
        fsComm.on("comm-on-disconnect", function() {
            done();
        });
        fsComm.close();
    });

    it("isCommOpen should be false", function() {
        assert.equal(false, fsComm.isOpen());
    });
});
