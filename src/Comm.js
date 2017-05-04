/* jshint esversion: 6 */
const EventEmitter = require("events");

/**
 * Abstract Class for Communication
 * @extends EventEmitter
 */
class Comm extends EventEmitter {
    /**
     * Create a Comm object by input specific config object.
     * @param {Object} config - Comm config.
     */
    constructor( config = {} ) {
        super();
        this.config = config;

        // isCommOpen is a flag of Comm status.
        this.isCommOpen = false;
    }

    /**
     * Comm open status.
     * @return {Boolean} If comm open.
     */
    isOpen() {
        return this.isCommOpen;
    }

    /**
     * Get current comm object.
     * @return {Object} Comm Object.
     */
    getCurrentCommObj() {
        // Check if Comm open.
        if( !this.isCommOpen ) throw new Error("Comm not open yet.");

        return this.commExecObj;
    }

    /**
     * Abstract function. Open Comm function.
     */
    open() {}

    /**
     * Abstract function. Close Comm function.
     */
    close() {}

    /**
     * Abstract function. Open Comm function.
     * @param {String} data - Data need to be write.
     * @param {Boolean} isSync - Is run with blocking or not.
     */
    write( data, isSync = false ) {}
}

module.exports = Comm;