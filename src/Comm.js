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
        
        // isCommReady is a flag of Comm ready to open.
        this.isCommReady = false;

        // isCommOpen is a flag of Comm open status.
        this.isCommOpen = false;
    }

    /**
     * Comm ready status.
     * @param {Boolean} isReady If comm ready.
     */
    setReady(isReady) {
        this.isCommReady = isReady;
    }
    /**
     * Comm ready status.
     * @return {Boolean} If comm ready.
     */
    isReady() {
        return this.isCommReady;
    }

    /**
     * Comm opem status.
     * @param {Boolean} isOpen If comm open.
     */
    setOpen(isOpen) {
        this.isCommOpen = isOpen;
    }
    /**
     * Comm open status.
     * @return {Boolean} If comm open.
     */
    isOpen() {
        return this.isCommOpen;
    }

    /**
     * Set current comm object.
     * @param {Object} comm Comm Object.
     */
    setCommExecObj(comm) {
        this.commExecObj = comm;
    }
    /**
     * Get current comm object.
     * @return {Object} Comm Object.
     */
    getCommExecObj() {
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