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
        this._log.task("api-mod-wsfinan-api", "Api WSFinan Loaded", 1);
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
        this._db.query("INSERT INTO " + this._db.DatabaseName + "._WSFinan_Log" +
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
         *  List Fichas
         */
        socket.on("WSFinan/fichas/lst", (req) => {
            this._myself.checkPermission("WSFinan/financeiro/ficha").then(() => {
                this._ApiClass.ListFichas(req[0].id, req[0].name, req[0].description).then((res) => {
                    this.saveLog(0, "WSFinan/fichas/lst", res, this._myself.myself.id);
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
         *  List Fichas
         */
        socket.on("WSFinan/fichas/lstauto", (req) => {
            this._ApiClass.ListFichasAutocomplete().then((res) => {
                this.saveLog(0, "WSFinan/fichas/lst", res, this._myself.myself.id);
                socket.emit("ClientEvents", {
                    event: "wsfinan/fichas/lstauto",
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


        /**
         *  List Hist
         */
        socket.on("WSFinan/fichas/lsthist", (req) => {
            this._ApiClass.ListFichasHistory(req[0].id).then((res) => {
                this.saveLog(0, "WSFinan/fichas/lsthist", res, this._myself.myself.id);
                socket.emit("ClientEvents", {
                    event: "wsfinan/fichas/lsthist",
                    data: { ficha: req[0], data: res }
                })
            }).catch((err) => {
                this._log.error("On loading history of Fichas on WSFinan")
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
         *  Add Fichas
         */
        socket.on("WSFinan/ficha/add", (req) => {
            this._myself.checkPermission("WSFinan/ficha/add").then(() => {
                this._ApiClass.AddFichas(req[0].name, req[0].description, req[0].valueAttached, req[0].valueReserved, req[0].valuePending, req[0].active, this._myself.myself.id).then((res) => {
                    this.saveLog(0, "WSFinan/fichas/add", req[0], this._myself.myself.id);
                    socket.emit("ClientEvents", {
                        event: "system/added/ficha",
                        data: ""
                    })
                }).catch((err) => {
                    this._log.error("On Adding Fichas on WSFinan")
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
         *  Edt Fichas
         */
        socket.on("WSFinan/ficha/edt", (req) => {
            this._myself.checkPermission("WSFinan/ficha/edt").then(() => {
                this._ApiClass.EdtFichas(req[0].id, req[0].name, req[0].description, req[0].active, this._myself.myself.id).then((res) => {
                    this.saveLog(req[0].id, "WSFinan/fichas/edt", req[0], this._myself.myself.id);
                    socket.emit("ClientEvents", {
                        event: "system/edited/ficha",
                        data: ""
                    })
                }).catch((err) => {
                    this._log.error("On Adding Fichas on WSFinan")
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


        /**
         *  Move ficha
         */
        socket.on("WSFinan/ficha/move", (req) => {
            if (req[0].motivo != "") {
                this._myself.checkPermission("WSFinan/ficha/movevalor").then(() => {

                    //Log da operação
                    this.saveLog(req[0].id_out, "Saida de Valor para ficha ID: " + req[0].id_in, req[0], this._myself.myself.id);
                    this.saveLog(req[0].id_in, "Recebimento de Valor da ficha ID: " + req[0].id_out, req[0], this._myself.myself.id);

                    try {
                        //coleta os valores das fichas atuais

                        //primeira ficha
                        this._ApiClass.GetFicha(req[0].id_out).then((fichaOut) => {
                            if (fichaOut[0] != undefined) {

                                //segunda ficha
                                this._ApiClass.GetFicha(req[0].id_in).then((fichaIn) => {
                                    if (fichaIn[0] != undefined) {

                                        //itera a operação e realiza
                                        fichaOut[0].valueAttached = (parseFloat(fichaOut[0].valueAttached) - parseFloat(req[0].value));
                                        fichaIn[0].valueAttached = (parseFloat(fichaIn[0].valueAttached) + parseFloat(req[0].value));

                                        this._ApiClass.SetAttachedValue(fichaIn[0].id, fichaIn[0].valueAttached).then(() => {
                                            this._ApiClass.SetAttachedValue(fichaOut[0].id, fichaOut[0].valueAttached).then(() => {
                                                //sucesso operação
                                                socket.emit("ClientEvents", {
                                                    event: "system/moved/ficha",
                                                    data: ""
                                                })
                                            })
                                        })
                                    }
                                })
                            }
                        })


                    } catch (err) {
                        this._log.error("On Moving Values in Fichas on WSFinan")
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
                    }



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
            } else {
                if (!this._myself.isLogged()) {
                    socket.emit("logout", "");
                }
                socket.emit("ClientEvents", {
                    event: "system_mess",
                    data: {
                        status: "ERROR",
                        mess: "Favor preencher todos os campos",
                        time: 1000
                    }
                })
            }
        })

    }
}

module.exports = {
    Socket
};