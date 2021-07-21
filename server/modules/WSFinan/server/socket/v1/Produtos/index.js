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
        this._log.task("api-mod-WSFinan-produtos", "Api WSFinan-produtos Loaded", 1);
    }

    /**
     * Create Listeners for Socket
     * @param {SocketIO} io 
     * @param {class_group} Myself
     */
    socket(socket, Myself) {
        this._myself = Myself;

        /**
         * List all clientes
         */
        socket.on("WSFinan/produtos/lst", (req) => {
            this._myself.checkPermission("WSFinan/financeiro/produtos").then(() => {
                this._ProdutosClass.ListAll().then((res) => {
                    socket.emit("ClientEvents", {
                        event: "WSFinan/produtos/lst",
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
         * List all clientes para Criação de OS
         */
        socket.on("WSFinan/produtos/lst", (req) => {
            this._myself.checkPermission("WSFinan/financeiro/produtos").then(() => {
                if (req[0]) {
                    this._ProdutosClass.ListProdutosFiltered(req[0].name).then((res) => {
                        socket.emit("ClientEvents", {
                            event: "wsfinan/produtos/lst",
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
                }
            })
        })

        /**
         * add cliente
         */
        socket.on("WSFinan/produtos/add", (req) => {
            this._myself.checkPermission("WSFinan/produtos/add").then(() => {
                if (req[0].name &&
                    req[0].description &&
                    req[0].barcode
                ) {
                    this._ProdutosClass.createProdutos(
                        req[0].name,
                        req[0].description,
                        req[0].barcode,
                        req[0].active,
                        this._myself.myself.id).then(() => {
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
        socket.on("WSFinan/produtos/edt", (req) => {
            this._myself.checkPermission("WSFinan/produtos/edt").then(() => {
                if (req[0].name &&
                    req[0].description &&
                    req[0].barcode
                ) {
                    this._ProdutosClass.editProdutos(
                        req[0].id,
                        req[0].name,
                        req[0].description,
                        req[0].barcode,
                        req[0].active,
                        this._myself.myself.id).then(() => {
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
         * Context Menu List items with it calls for list of groups
         */
        socket.on("WSFinan/lst/clientes/ctx", (req) => {
            let itemList = [];

            /*/
            if (this._myself.checkPermissionSync("WSFinan/cliente/edt")) {
                itemList.push({
                    name: "Editar",
                    active: true,
                    event: {
                        call: "WSFinan/produtos/edt",
                        data: req[0].row
                    }
                });
            } else {
                itemList.push({
                    name: "Editar",
                    active: false
                });
            }
            if (this._myself.checkPermissionSync("WSFinan/cliente/del")) {
                itemList.push({
                    name: "Excluir",
                    active: true,
                    event: {
                        call: "WSFinan/produtos/del",
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
            //*/
        });
    }
}

module.exports = {
    Socket
};