/* jshint esversion: 6 */
const Comm = require("./NetComm.js");

class ContinuousNetComm extends NetComm {
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