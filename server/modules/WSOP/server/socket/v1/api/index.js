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
        this._log.task("api-mod-wsop-api", "Api WSOP-api Loaded", 1);
        this._myself = Myself;

        /**
         *  get API data
         */
        socket.on("WSOP/api/lst", (req) => {
            this._myself.checkPermission("WSOP/menu/Api").then(() => {
                this._ApiClass.GetAPI().then((res) => {
                    socket.emit("ClientEvents", {
                        event: "wsop/api/edt",
                        data: res[0] || {
                            data: {
                                gmail: {
                                    api: "",
                                    key: "",
                                },
                                pagarme: {
                                    api: "",
                                    key: "",
                                }
                            }
                        }
                    })
                }).catch((err) => {
                    this._log.error("On loading api for WSOP")
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
        })

        /**
         * edit API WSOP
         */
        socket.on("WSOP/api/edt", (req) => {
            this._myself.checkPermission("WSOP/menu/api").then(() => {
                this._ApiClass.saveApi(req[0].data, this._myself.myself.id).then((results) => {
                    socket.emit("ClientEvents", {
                        event: "system/edited/api",
                        data: ""
                    })
                }).catch((err) => {
                    if (!this._myself.isLogged()) {
                        socket.emit("logout", "");
                    }
                    this._log.error("On Editing Api for Loja Integrada")
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
            })
        })

        /**
         * Gerar link pelo Pagar.me
         */
        socket.on("WSOP/api/pagarme/gerarlink", (req) => {
            this._myself.checkPermission("WSOP/menu/api/pagarme/gerarlink").then(() => {
                this._ApiClass.gerarLinkPagarMe(req[0]).then((results) => {
                    socket.emit("ClientEvents", {
                        event: "system/reloaded/os",
                        data: "",
                    })
                    socket.emit("ClientEvents", {
                        event: "wsop/api/pagarme/linkgerado",
                        data: results,
                    })
                }).catch((err) => {
                    if (!this._myself.isLogged()) {
                        socket.emit("logout", "");
                    }
                    this._log.error("On Editing Api for Loja Integrada")
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
            })
        })

        /**
         * Carregar pagamentos do Link
         */
        socket.on("WSOP/api/pagarme/refreshpayment", (req) => {
            this._myself.checkPermission("WSOP/menu/api/pagarme/gerarlink").then(() => {
                this._ApiClass.loadPagarMePayments(req[0]).then((results) => {
                    socket.emit("ClientEvents", {
                        event: "system/reloaded/os",
                        data: "",
                    })
                }).catch((err) => {
                    if (!this._myself.isLogged()) {
                        socket.emit("logout", "");
                    }
                    this._log.error("On Editing Api for Loja Integrada")
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
            })
        })
    }
}

module.exports = {
    Socket
};