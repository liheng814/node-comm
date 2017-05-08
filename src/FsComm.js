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
//     pollingInterval: 60000     // milli-second
// };

let onFileChange = function(_filename, _comm) {
    let _fullPathName = path.join(_comm.config.targetPath, _filename);

    // check file exists, check file or directory
    fs.stat(_fullPathName, function(_err, _stat) {
        if( _err ) {
            // File deleted
            return;
        }

        if( !_stat.isFile() ) {
            // Not file
            return;
        }

        fs.readFile(_fullPathName, _comm.config.encoding, function(_err, _data) {
            // Processing
            if( _err ) {
                _comm.emit("comm-on-data-error", _err);
            } else {
                _comm.emit("comm-on-data", _data);
            }
            let _destPath = path.join( (_err) ? _comm.config.failedPath : _comm.config.successPath, _filename);

            // Finalize
            if(_comm.config.finalizeFile === "move") {
                fs.rename(_fullPathName, _destPath, function(_errExc) {
                    if( _errExc ) _comm.emit("comm-on-error", _err);
                });
            } else {
                fs.unlink(_fullPathName, function(_errExc) {
                    if( _errExc ) _comm.emit("comm-on-error", _err);
                });
            }
        });

    });

};

let filenameTmp = {};
let fsWatcherEventHandler = function(_event, _filename, _comm) {
    if( _event === "change" ) {
        if( filenameTmp[_filename] ) {
            clearTimeout(filenameTmp[_filename]);
        }

        filenameTmp[_filename] = setTimeout(onFileChange, 500, _filename, _comm);
    }
};

let scanFolder = function(_comm) {
    fs.readdir(_comm.config.targetPath, function(_err, _files) {
        if(_err) {
            _comm.emit("comm-on-error", _err);
        } else {
            for(var i in _files) {
                onFileChange(_files[i], _comm);
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
        if( this.isOpen() ) throw new Error("FsComm has been open.");

        // Default config value
        this.config.pollingInterval = this.config.pollingInterval | 60000;
        this.config.finalizeFile = this.config.finalizeFile | "delete";
        this.config.encoding = this.config.encoding | "UTF-8";

        // Open
        var execObj;
        if(this.config.isPolling) {
            execObj = setInterval(scanFolder, this.config.pollingInterval, this)
        } else {
            execObj = fs.watch(this.config.targetPath, {encoding: this.config.encoding}, (_event, _filename) => {
                fsWatcherEventHandler(_event, _filename, this);
            });
        }
        this.setCommExecObj(execObj);

        this.setOpen(true);
        this.emit("comm-on-connect");
    }

    close() {
        // Check if Comm close.
        if( !this.isOpen() ) return;

        if(this.config.isPolling) {
            clearInterval(this.commExecObj);
        } else {
            this.getCommExecObj().close();
        }

        this.setOpen(false);
        this.emit("comm-on-disconnect");
    }

    write( data, isSync = false ) {
        // Nothing happened.
    }
}

module.exports = FsComm;