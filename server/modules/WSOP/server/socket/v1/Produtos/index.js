const ProdutosManipulator = require('./dbManipulator').ProdutosManipulator;

class Socket {

    _log;
    _config;
    _WSMainServer;
    _myself;
    _events;

    /**
     * Constructor for group Class
     * @param {WSMainServer} WSMain
     */
    constructor(WSMainServer) {
        this._log = WSMainServer.log;
        this._config = WSMainServer.config;
        this._WSMainServer = WSMainServer;
        this._events = WSMainServer.events;
        this._ProdutosClass = new ProdutosManipulator(WSMainServer);
    }

    /**
     * Create Listeners for Socket
     * @param {SocketIO} io 
     * @param {class_group} Myself
     */
    socket(socket, Myself) {
        this._log.task("api-mod-wsop-produto", "Api wsop-produtos Loaded", 1);
        this._myself = Myself;

        /**
         * List all produtos
         */
        socket.on("wsop/produtos/lst", (req) => {
            this._myself.checkPermission("WSOP/menu/produtos").then(() => {
                this._ProdutosClass.ListAll().then((res) => {
                    socket.emit("ClientEvents", {
                        event: "wsop/produtos/lst",
                        data: res
                    })
                }).catch((err) => {
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
         * add cliente
         */
        socket.on("wsop/produtos/add", (req) => {
            this._myself.checkPermission("WSOP/produtos/add").then(() => {
                if (req[0].name &&
                    req[0].description &&
                    req[0].barcode &&
                    req[0].price &&
                    req[0].cost &&
                    req[0].img &&
                    req[0].inventory
                ) {
                    this._ProdutosClass.createCliente(req[0].name, req[0].description, req[0].barcode, req[0].price, req[0].cost, req[0].img, req[0].inventory, req[0].img, req[0].active, this._myself.myself.id).then(() => {
                        socket.emit("ClientEvents", {
                            event: "system/added/produtos",
                            data: req
                        })
                    }).catch((err) => {
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
                } else {
                    console.log(req)
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
         * add cliente
         */
        socket.on("wsop/produtos/edt", (req) => {
            this._myself.checkPermission("WSOP/produtos/add").then(() => {
                if (req[0].id &&
                    req[0].name &&
                    req[0].description &&
                    req[0].barcode &&
                    req[0].price &&
                    req[0].cost &&
                    req[0].img &&
                    req[0].inventory
                ) {
                    this._ProdutosClass.editCliente(req[0].id, req[0].name, req[0].description, req[0].barcode, req[0].price, req[0].cost, req[0].img, req[0].inventory, req[0].img, req[0].active, this._myself.myself.id).then(() => {
                        socket.emit("ClientEvents", {
                            event: "system/edited/produtos",
                            data: req
                        })
                    }).catch((err) => {
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
                } else {
                    console.log(req)
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
         * Diable cliente
         */
        socket.on("wsop/produtos/del", (req) => {
            this._myself.checkPermission("WSOP/produtos/del").then(() => {
                this._ProdutosClass.disableCliente(req[0].id, req[0].active, this._myself.myself.id).then(() => {
                    socket.emit("ClientEvents", {
                        event: "system/removed/produtos",
                        data: req
                    })
                }).catch((err) => {
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
         * Context Menu List items with it calls for list of groups
         */
        socket.on("wsop/lst/produtos/ctx", (req) => {
            let itemList = [];

            //*/
            if (this._myself.checkPermissionSync("WSOP/produtos/edt")) {
                itemList.push({
                    name: "Editar",
                    active: true,
                    event: {
                        call: "wsop/produtos/edt",
                        data: req[0].row
                    }
                });
            } else {
                itemList.push({
                    name: "Editar",
                    active: false
                });
            }
            if (this._myself.checkPermissionSync("WSOP/produtos/del")) {
                itemList.push({
                    name: "Excluir",
                    active: true,
                    event: {
                        call: "wsop/produtos/del",
                        data: req[0].row
                    }
                });
            } else {
                itemList.push({
                    name: "Excluir",
                    active: false
                });
            }


            socket.emit("ClientEvents", {
                event: "CreateContext",
                data: {
                    data: req,
                    items: itemList
                }
            })
        });

    }


}

module.exports = {
    Socket
};