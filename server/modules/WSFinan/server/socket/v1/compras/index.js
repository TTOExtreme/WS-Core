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
        this._log.task("api-mod-wsfinan-compras", "Api WSFinan Compras Loaded", 1);
    }

    /**
     * 
     * @param {ID_OS} id_os 
     * @param {string} content 
     * @param {string} data 
     * @param {ID_User} UserID 
     * @returns 
     */
    saveLog(id_item = 0, content, data, UserID) {
        this._db.query("INSERT INTO " + this._db.DatabaseName + "._WSFinan_Requisicao_Log" +
            " (id_item,content,data, createdBy, createdIn)" +
            " VALUES " +
            " (" + id_item + ",'" + JSON.stringify(content) + "','" + JSON.stringify(data) + "'," + UserID + "," + Date.now() + ");").catch(err => {
                this._log.error("On saving Log WSFinan");
                this._log.error(err);
            });
    }
    /**
     * Create Listeners for Socket
     * @param {SocketIO} io 
     * @param {class_group} Myself
     */
    socket(socket, Myself) {
        this._myself = Myself;


        /**
         *  List Requisições
         */
        socket.on("WSFinan/requisicao/lst", (req) => {
            this._myself.checkPermission("WSFinan/requisicao/lst").then(() => {
                this._ApiClass.ListRequisicao(req[0].id, req[0].name, req[0].description).then((res) => {
                    this.saveLog(0, "WSFinan/requisicao/lst", res, this._myself.myself.id);
                    socket.emit("ClientEvents", {
                        event: "wsfinan/requisicao/lst",
                        data: res
                    })
                }).catch((err) => {
                    this._log.error("On loading Requisicao on WSFinan")
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
            }).catch((err) => {
                this._log.warning("User Access Denied to List Ficha Financeira: " + this._myself.myself.id)
                socket.emit("ClientEvents", {
                    event: "system_mess",
                    data: {
                        status: "ERROR",
                        mess: "Acesso Negado",
                        time: 1000
                    }
                })
            })
        })

        /**
         *  List Requisicao
         */
        socket.on("WSFinan/requisicao/lstauto", (req) => {
            this._ApiClass.ListRequisicaoAutocomplete().then((res) => {
                this.saveLog(0, "WSFinan/requisicao/lst", res, this._myself.myself.id);
                socket.emit("ClientEvents", {
                    event: "wsfinan/requisicao/lstauto",
                    data: res
                })
            }).catch((err) => {
                this._log.error("On loading Requisicao on WSFinan")
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


        /**
         *  List Hist
         */
        socket.on("WSFinan/requisicao/lsthist", (req) => {
            this._ApiClass.ListRequisicaoHistory(req[0].id).then((res) => {
                this.saveLog(0, "WSFinan/requisicao/lsthist", res, this._myself.myself.id);
                socket.emit("ClientEvents", {
                    event: "wsfinan/requisicao/lsthist",
                    data: { ficha: req[0], data: res }
                })
            }).catch((err) => {
                this._log.error("On loading history of Requisicao on WSFinan")
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


        /**
         *  Add Requisicao
         */
        socket.on("WSFinan/requisicao/add", (req) => {
            this._myself.checkPermission("WSFinan/requisicao/add").then(() => {
                this._ApiClass.AddRequisicao(req[0].name, req[0].description, req[0].valueAttached, req[0].valueReserved, req[0].valuePending, req[0].active, this._myself.myself.id).then((res) => {
                    this.saveLog(0, "WSFinan/requisicao/add", req[0], this._myself.myself.id);
                    socket.emit("ClientEvents", {
                        event: "system/added/ficha",
                        data: ""
                    })
                }).catch((err) => {
                    this._log.error("On Adding Requisicao on WSFinan")
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
            }).catch((err) => {
                this._log.warning("User Access Denied to Add Ficha Financeira: " + this._myself.myself.id)
                socket.emit("ClientEvents", {
                    event: "system_mess",
                    data: {
                        status: "ERROR",
                        mess: "Acesso Negado",
                        time: 1000
                    }
                })
            })
        })

        /**
         *  Edt Requisicao
         */
        socket.on("WSFinan/requisicao/edt", (req) => {
            this._myself.checkPermission("WSFinan/requisicao/edt").then(() => {
                this._ApiClass.EdtRequisicao(req[0].id, req[0].name, req[0].description, req[0].active, this._myself.myself.id).then((res) => {
                    this.saveLog(req[0].id, "WSFinan/requisicao/edt", req[0], this._myself.myself.id);
                    socket.emit("ClientEvents", {
                        event: "system/edited/ficha",
                        data: ""
                    })
                }).catch((err) => {
                    this._log.error("On Adding Requisicao on WSFinan")
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
            }).catch((err) => {
                this._log.warning("User Access Denied to Edt Ficha Financeira: " + this._myself.myself.id)
                socket.emit("ClientEvents", {
                    event: "system_mess",
                    data: {
                        status: "ERROR",
                        mess: "Acesso Negado",
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