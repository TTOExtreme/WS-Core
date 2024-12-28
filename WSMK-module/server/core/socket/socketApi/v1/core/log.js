
class Socket {

    _log;
    _config;
    _WSMainServer;
    _myself;
    _events;

    /**
     * Constructor for User Class
     * @param {WSMainServer} WSMain
     */
    constructor(WSMainServer) {
        this._log = WSMainServer.log;
        this._config = WSMainServer.config;
        this._WSMainServer = WSMainServer;
        this._events = WSMainServer.events;
        this._db = WSMainServer.db;
    }

    /**
     * Create Listeners for Socket
     * @param {SocketIO} io 
     * @param {class_user} Myself
     */
    socket(socket, Myself) {
        this._log.task("api-mod-log", "Api Log Loaded", 1);
        this._myself = Myself;
        /**
         * List logs from name
         */
        socket.on("log/lst", (data) => {
            if (data["name"] != undefined) {
                this._db.query("SELECT * FROM " + this.db.DatabaseName + "._Log" +
                    " WHERE name='" + data.name + "';")
                    .then(result => {
                        socket.emit("ClientEvents", {
                            event: "log/lst",
                            data: result
                        })
                    })
                    .catch((err) => {
                        if (!this._myself.isLogged()) {
                            socket.emit("logout", "");
                        }
                        this._log.error("On Listing Log")
                        this._log.error(err);
                        socket.emit("ClientEvents", {
                            event: "system_mess",
                            data: {
                                status: "ERROR",
                                mess: err,
                                time: 1000
                            }
                        })
                    })
            } else {
                this._log.error("On Listing Log 'name' is not defined")
                this._log.error(data);
            }
        })

        /**
         * Add log to database
         */
        socket.on("log/add", (data) => {

        })
    }
}

module.exports = {
    Socket
};