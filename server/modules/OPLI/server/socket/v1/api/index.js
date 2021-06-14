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
        this._log.task("api-mod-opli-api", "Api opli-api Loaded", 1);
        this._myself = Myself;

        /**
         *  get API data
         */
        socket.on("opli/api/lst", (req) => {
            this._myself.checkPermission("OPLI/menu/Api").then(() => {
                this._ApiClass.ListAll().then((res) => {
                    socket.emit("ClientEvents", {
                        event: "OPLI/api/edt",
                        data: res[0] || {
                            api: "",
                            aplication: "",
                            pullproducts: true,
                            pullsells: true,
                            pullclients: true,
                            active: 1,
                        }
                    })
                }).catch((err) => {
                    this._log.error("On loading api for Loja Integrada")
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
         * edit Application keys
         */
        socket.on("opli/api/edt", (req) => {
            this._myself.checkPermission("OPLI/menu/Api").then(() => {
                this._ApiClass.saveApi(req[0].api, req[0].aplication, req[0].pullproducts, req[0].pullsells, req[0].pullclients, req[0].trelloKey, req[0].trelloToken, req[0].trelloBoard, req[0].trelloList, req[0].trelloLabels, req[0].active, this._myself.myself.id).then((results) => {
                    socket.emit("ClientEvents", {
                        event: "system/edited/api",
                        data: { id: results.insertId }
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
         * List all Site itens
         */
        socket.on("WSOP/site/lst", (req) => {
            console.log("list Site")
            this._myself.checkPermission("WSOP/menu/os").then(() => {
                this._ApiClass.ListAllSite().then((results) => {
                    socket.emit("ClientEvents", {
                        event: "wsop/site/lst",
                        data: results
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
         * List Site by id (View)
         */
        socket.on("WSOP/site/lstid", (req) => {
            if (req[0].id != undefined) {
                this._ApiClass.ListSingleSite(req[0].id).then((results) => {
                    socket.emit("ClientEvents", {
                        event: "wsop/site/view",
                        data: results
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
            } else {
                socket.emit("ClientEvents", {
                    event: "system_mess",
                    data: {
                        status: "ERROR",
                        mess: "Request Incomplete",
                        time: 1000
                    }
                })
            }
        })
        /**
         * List Site by id DOWNLOAD
         */
        socket.on("WSOP/site/lstdownload", (req) => {
            if (req[0].id != undefined) {
                this._myself.checkPermission("WSOP/menu/os").then(() => {
                    this._ApiClass.ListSite(req[0].id).then((results) => {
                        socket.emit("ClientEvents", {
                            event: "wsop/site/download",
                            data: results
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
            } else {
                socket.emit("ClientEvents", {
                    event: "system_mess",
                    data: {
                        status: "ERROR",
                        mess: "Request Incomplete",
                        time: 1000
                    }
                })
            }
        })

        /**
         * Change Site status
         */
        socket.on("WSOP/site/edtstatus", (req) => {
            this._myself.checkPermission("WSOP/menu/os").then(() => {
                if (req[0].id &&
                    req[0].status
                ) {
                    this._ApiClass.editStatusOS(req[0].id, req[0].status, this._myself.myself.id).then((results) => {
                        socket.emit("ClientEvents", {
                            event: "system/edited/site"
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
                } else {
                    socket.emit("ClientEvents", {
                        event: "system_mess",
                        data: {
                            status: "INFO",
                            mess: "Favor Preencher todos os campos",
                            time: 1000
                        }
                    })
                }
            })
        })

        /**
         * Update Database Products
         */
        socket.on("opli/api/loadproducts", (req) => {
            this._myself.checkPermission("OPLI/menu/Api").then(() => {
                this._ApiClass.updateProducts(socket, req[0].offset).then(() => {
                    socket.emit("ClientEvents", {
                        event: "system/updated/products",
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
         * Update Database clients
         */
        socket.on("opli/api/loadclients", (req) => {
            this._myself.checkPermission("OPLI/menu/Api").then(() => {
                this._ApiClass.updateClients(socket).then(() => {
                    socket.emit("ClientEvents", {
                        event: "system/updated/clients",
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
         * Update Database Sells
         */
        socket.on("opli/api/loadsells", (req) => {
            this._myself.checkPermission("OPLI/menu/Api").then(() => {
                this._ApiClass.updateSells(socket, req[0].offset).then(() => {
                    socket.emit("ClientEvents", {
                        event: "system/updated/sells",
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
         * Update Database Sells trello
         */
        socket.on("opli/api/loadsellstrello", (req) => {
            this._myself.checkPermission("OPLI/menu/Api").then(() => {
                this._ApiClass.updateSellsTrello(socket, req[0].offset).then(() => {
                    socket.emit("ClientEvents", {
                        event: "system/updated/sells",
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
         * Update Database Paid Sells
         */
        socket.on("opli/api/loadpaidsells", (req) => {
            this._myself.checkPermission("OPLI/menu/Api").then(() => {
                this._ApiClass.updatePaidSells(socket).then(() => {
                    socket.emit("ClientEvents", {
                        event: "system/updated/sells",
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