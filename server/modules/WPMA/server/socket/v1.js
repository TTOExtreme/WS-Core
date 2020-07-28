const class_user = require('../../../../core/database/_user/class_user').User;
const fs = require('fs');
const path = require('path').join;

class Socket {

    _log;
    _WSMainServer;

    /**
     * Constructor for User Class
     * @param {WSMainServer} WSMain
     */
    constructor(WSMainServer) {
        this._log = WSMainServer.log;
        this._WSMainServer = WSMainServer;
    }

    /**
     * Create Listeners for Socket
     * @param {SocketIO} io 
     * @param {class_user} Myself
     */
    socket(socket, Myself) {
        /**
         * Load all Classes for this route v1
         */
        this._loadModules(socket, Myself);

        this._log.task("api-mod-WPMA", "Api WPMA Loaded", 1);
    }

    /**
     * Load all Modules from ./v1 
     * @param {SocketIO} socket 
     * @param {UserClass} Myself 
     */
    _loadModules(socket, Myself) {
        //load core modules
        fs.readdirSync(path(__dirname + '/v1/')).forEach((mod) => {
            try {
                this._log.task("api-mod-WPMA-" + mod.replace(".js", ""), "Loading WPMA API " + mod.replace(".js", ""), 0);
                let modSocket = require(__dirname + '/v1/' + mod)
                let modClass = new modSocket.Socket(this._WSMainServer);
                modClass.socket(socket, Myself);
            } catch (err) {
                this._log.task("api-mod-WPMA-" + mod.replace(".js", ""), "Api " + mod.replace(".js", "") + " Failed to Load", 3);
                this._log.error(err);
            }
        })
    }
}

module.exports = {
    Socket
};