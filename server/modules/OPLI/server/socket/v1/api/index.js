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
        this._log.task("api-mod-opli-api", "Api opli-api Loaded", 1);
    }

    /**
     * Create Listeners for Socket
     * @param {SocketIO} io 
     * @param {class_group} Myself
     */
    socket(socket, Myself) {
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
            this._myself.checkPermission("OPLI/menu/site").then(() => {
                this._ApiClass.ListAllSite(0, 100, req[0].id_li, req[0].name, req[0].nome_cliente, req[0].status).then((results) => {

                    socket.emit("ClientEvents", {
                        event: "wsop/site/lst",
                        data: results
                    })

                    /*
                    let res = results, counter = 0, last = results.length;
                    function nextPackage(_ApiClass, id, limit) {
                        if (res.length > 0 && counter < 10) {
                            _ApiClass.ListAllSite(id, 100).then((results2) => {

                                socket.emit("ClientEvents", {
                                    event: "wsop/site/lst/append",
                                    data: results2
                                })
                                res = results2;
                                counter++;
                                last += results2.length;
                                nextPackage(_ApiClass, last, limit);
                            })
                        }
                    }
                    nextPackage(this._ApiClass, last, 100); //SET LIMIT FOR EACH SEND
                    //*/

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
                this._myself.checkPermission("OPLI/menu/site").then(() => {
                    this._ApiClass.ListSite(req[0].id).then((results) => {
                        socket.emit("ClientEvents", {
                            event: "wsop/site/download",
                            data: { results: results, last: req[0].last }
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
         * List Site by id DOWNLOAD
         */
        socket.on("WSOP/site/lstdownload/emproducao", (req) => {
            //if (req[0].status != undefined) {
            this._myself.checkPermission("OPLI/menu/site").then(() => {
                this._ApiClass.DownloadSite(req[0].status).then((results) => {
                    socket.emit("ClientEvents", {
                        event: "wsop/site/download/emproducao",
                        data: { results: results, last: req[0].last }
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
            /*
        } else {
            socket.emit("ClientEvents", {
                event: "system_mess",
                data: {
                    status: "ERROR",
                    mess: "Request Incomplete",
                    time: 1000
                }
            })
        }//*/
        })

        /**
         * Change Site status
         */
        socket.on("WSOP/site/edtstatus", (req) => {
            this._myself.checkPermission("OPLI/menu/site").then(() => {
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
        * Change Site Data
        */
        socket.on("WSOP/site/edt", (req) => {
            this._myself.checkPermission("OPLI/menu/site").then(() => {
                if (req[0].id
                ) {
                    this._ApiClass.editSite(req[0].id, req[0].obs, req[0].peso, this._myself.myself.id).then((results) => {
                        socket.emit("ClientEvents", {
                            event: "system/edited/sitedata"
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