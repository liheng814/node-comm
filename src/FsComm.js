/* jshint esversion: 6 */
const fs = require("fs");
const path = require("path");

const Comm = require("./Comm.js");

// let config = {
//     targetPath: "./",
//     finalizeFile: "move",   // move | delete
//     successPath: "./ok/",
//     failedPath: "./bad/",
//     encodeing: "UTF-8",
//     isPolling: false,
//     pollingInterval: 60     // second
// };

let processFile = function(_config, _emitter, _filename) {
    let _fullPathName = path.join(_config.targetPath, _filename);

    fs.readFile(_fullPathName, _config.encoding, function(_err, _data) {
        // Processing
        let _destPath;
        if( _err ) {
            _emitter.emit("comm-on-data-error", _err);
            _destPath = path.join(_config.failedPath, _filename);
        } else {
            _emitter.emit("comm-on-data", _data);
            _destPath = path.join(_config.successPath, _filename);
        }

        // Finalize
        if(_config.finalizeFile === "move") {
            fs.rename(_fullPathName, _destPath, function(_errExc) {
                if( _errExc ) {
                    console.error(_errExc);
                    _emitter.emit("comm-on-error", _err);
                }
            });
        } else {
            fs.unlink(_fullPathName, function(_errExc) {
                console.error(_errExc);
            });
        }
    });
};

let scanFolder = function(_config, _emitter) {
    fs.readdir(_config.targetPath, function(_err, _files) {
        if(_err) {
            console.error(_err);
            _emitter.emit("comm-on-error", _err);
        } else {
            for(var i in _files) {
                processFile(_config, _emitter, _files[i]);
            }
        }
    });
};

/**
 * File Communication Class. Monitor a directory and raise an event when file changes.
 * @extends Comm
 */
class FsComm extends Comm {
    
    open() {
        // Check null
        if( !this.config ) throw new Error("FsComm: Should configure this Class via constructor.");
        if( !this.config.targetPath ) throw new Error("FsComm: targetPath is neccessary.");

        // Check path availability.
        fs.stat(this.config.targetPath, function(_err, _stat) {
            if(_err) throw new Error(_err);
            if(!_stat.isDirectory()) throw new Error("FsComm: targetPath is not a folder.");
        });
        
        // Check conditional variable
        if( this.config.finalizeFile === "move" && (!this.config.successPath || !this.config.failedPath))
            throw new Error("FsComm: successPath and failedPath are neccessary when finalizeFile = 'move'.");
        
        // Check if Comm open.
        if( this.isCommOpen ) throw new Error("FsComm has been open.");

        // Open
        if(this.config.isPolling) {
            this.commExecObj = setInterval(scanFolder, this.config.pollingInterval * 1000, this.config, this);
        } else {
            this.commExecObj = fs.watch(this.config.targetPath, {encoding: this.config.encoding}, (_eventType, _filename) => {
                if (_filename) {
                    processFile(this.config, this, _filename);
                }
            });
        }

        this.isCommOpen = true;
        this.emit("comm-on-connect");
    }

    close() {
        // Check if Comm close.
        if( !this.isCommOpen ) throw new Error("FsComm has been close or not open yet.");

        if(this.config.isPolling) {
            clearInterval(this.commExecObj);
        } else {
            this.commExecObj.close();
        }

        this.isCommOpen = false;
        this.emit("comm-on-disconnect");
    }

    write( data, isSync = false ) {
        // Nothing happened.
    }
}

module.exports = FsComm;