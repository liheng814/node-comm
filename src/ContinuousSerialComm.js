/* jshint esversion: 6 */
const SerialComm = require("./SerialComm.js");

class ContinuousSerialComm extends SerialComm {
    constructor( config = {} ) {
        super();
        this.config = config;

        this.on("comm-on-disconnect", function() {
            setTimeout(this.open, this.config.retryTime | 60000);
        });

        this.on("comm-on-error", function(err) {
            if( !this.isOpen() ) {
                setTimeout(this.open, this.config.retryTime | 60000);
            }
        });
    }
}
module.exports = ContinuousSerialComm;