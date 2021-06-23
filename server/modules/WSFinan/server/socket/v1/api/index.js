const apiManipulator = require('./dbManipulator').apiManipulator;

class Socket {

    _log;
    _config;
    _WSMainServer;
    _myself;
    _events;

    /**
     * Constructor for Class
     * @param {WSMainServer} WSMain
     */
    constructor(WSMainServer) {
        this._log = WSMainServer.log;
        this._config = WSMainServer.config;
        this._WSMainServer = WSMainServer;
        this._events = WSMainServer.events;
        this._ApiClass = new apiManipulator(WSMainServer);
        this._db = WSMainServer.db;
    }

    /**
     * Create Listeners for Socket
     * @param {SocketIO} io 
     * @param {class_group} Myself
     */
    socket(socket, Myself) {
        this._log.task("api-mod-wsfinan-api", "Api WSFinan Loaded", 1);
        this._myself = Myself;

        /**
         *  List Fichas
         */
        socket.on("wsfinan/fichas/lst", (req) => {
            this._ApiClass.ListFichas(req[0].id, req[0].name, req[0].description).then((res) => {
                socket.emit("ClientEvents", {
                    event: "wsfinan/fichas/lst",
                    data: res
                })
            }).catch((err) => {
                this._log.error("On loading Fichas on WSFinan")
                this._log.error(err);
                if (!this._myself.isLogged()) {
                    socket.emit("logout", "");
                }
                socket.emit("ClientEvents", {
                    event: "system_mess",
                    data: {
                        status: "ERROR",
                        mess: err,
                        time: 1000
                    }
                })
            })
        })
    }

}

module.exports = {
    Socket
};