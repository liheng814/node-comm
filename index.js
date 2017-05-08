/* jshint esversion: 6 */
const path = require("path");

const NetComm = require(path.join(__dirname, "src", "NetComm.js"));
const ContinuousNetComm = require(path.join(__dirname, "src", "ContinuousNetComm.js"));
const NetServerComm = require(path.join(__dirname, "src", "NetServerComm.js"));
const SerialComm = require(path.join(__dirname, "src", "SerialComm.js"));
const ContinuousSerialComm = require(path.join(__dirname, "src", "ContinuousSerialComm.js"));
const FsComm = require(path.join(__dirname, "src", "FsComm.js"));

class CommBuilder {
    /**
     * Constructor with nothing.
     */
    constructor() {
        super();
    }

    /**
     * Set up type.
     * @param {String} _commType - String of comm type.
     */
    setType( _commType ) {
        this.commType = _commType;
        return this;
    }
    /**
     * Set up config.
     * @param {Object} _config - Config object.
     */
    setConfig( _config ) {
        this.config = _config;
        return this;
    }

    /**
     * Build a new Comm object and return.
     * @return {Object} Comm Object.
     */
    build() {
        if( this.commType === "socket" ) {
            if( this.config.type === "client" ) {
                return (this.config.isContinuous) ? new ContinuousNetComm(this.config) : new NetComm(this.config);
            } else {
                return new NetServerComm(this.config);
            }
        } else if( this.commType === "serial" ) {
            return (this.config.isContinuous) ? new ContinuousSerialComm(this.config) : new SerialComm(this.config);
        } else if( this.commType === "file" ) {
            return new FsComm(this.config);
        }
    }
}

module.exports = CommBuilder;