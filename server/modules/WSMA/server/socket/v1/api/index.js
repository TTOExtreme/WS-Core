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
        this._MateriaisClass = new apiManipulator(WSMainServer);
        this._db = WSMainServer.db;
        this._log.task("api-mod-wsma", "Api WSMA Loaded", 1);
    }

    /**
     * Create Listeners for Socket
     * @param {SocketIO} io 
     * @param {class_group} Myself
     */
    socket(socket, Myself) {
        this._myself = Myself;

        /**
         *  Lista os produtos por nome ou id Limit 30
         */
        socket.on("WSMA/materiais/lst", (req) => {
            this._MateriaisClass.ListMateriais(req[0].id, req[0].name, req[0].description).then((res) => {
                socket.emit("ClientEvents", {
                    event: "WSMA/materiais/lst",
                    data: res
                })
            }).catch((err) => {
                this._log.error("On listing Materiais")
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
         *  Lista os produtos por nome ou id Limit 30
         */
        socket.on("WSMA/servicos/lst", (req) => {
            this._MateriaisClass.ListServicos(req[0].id, req[0].name, req[0].description).then((res) => {
                socket.emit("ClientEvents", {
                    event: "WSMA/servicos/lst",
                    data: res || []
                })
            }).catch((err) => {
                this._log.error("On listing Materiais")
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
         *  Lista os produtos por nome ou id Limit 30
         */
        socket.on("WSMA/materiais/lstauto", (req) => {
            this._MateriaisClass.ListMateriaisauto(req[0].name).then((res) => {
                socket.emit("ClientEvents", {
                    event: "WSMA/materiais/lstauto",
                    data: res
                })
            }).catch((err) => {
                this._log.error("On listing Materiais")
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
         *  Lista os produtos por nome ou id Limit 30
         */
        socket.on("WSMA/servicos/lstauto", (req) => {
            this._MateriaisClass.ListServicosauto(req[0].name).then((res) => {
                socket.emit("ClientEvents", {
                    event: "WSMA/servicos/listauto",
                    data: res || []
                })
            }).catch((err) => {
                this._log.error("On listing Materiais")
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
         * Add material
         */
        socket.on("WSMA/materiais/add", (req) => {
            this._myself.checkPermission("WSMA/materiais/add").then(() => {
                this._MateriaisClass.AddMaterial(req[0].name, req[0].description, req[0].inventory, req[0].inventoryMin, req[0].inventoryMax, req[0].active, this._myself.myself.id).then((results) => {
                    socket.emit("ClientEvents", {
                        event: "system/added/materiais",
                        data: { id: results.insertId }
                    })
                }).catch((err) => {
                    if (!this._myself.isLogged()) {
                        socket.emit("logout", "");
                    }
                    this._log.error("On Adding Material")
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
         * edit Material
         */
        socket.on("WSMA/materiais/edt", (req) => {
            this._myself.checkPermission("WSMA/materiais/edt").then(() => {
                this._MateriaisClass.EdtMaterial(req[0].id, req[0].name, req[0].description, req[0].inventory, req[0].inventoryMin, req[0].inventoryMax, req[0].active, this._myself.myself.id).then((results) => {
                    socket.emit("ClientEvents", {
                        event: "system/edited/materiais",
                        data: { id: results.insertId }
                    })
                }).catch((err) => {
                    if (!this._myself.isLogged()) {
                        socket.emit("logout", "");
                    }
                    this._log.error("On Editing Material")
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
         * Add servico
         */
        socket.on("WSMA/servicos/add", (req) => {
            this._myself.checkPermission("WSMA/servico/add").then(() => {
                this._MateriaisClass.AddServico(req[0].name, req[0].description, req[0].active, this._myself.myself.id).then((results) => {
                    socket.emit("ClientEvents", {
                        event: "system/added/servicos",
                        data: { id: results.insertId }
                    })
                }).catch((err) => {
                    if (!this._myself.isLogged()) {
                        socket.emit("logout", "");
                    }
                    this._log.error("On Adding Servico")
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
         * edit servico
         */
        socket.on("WSMA/servicos/edt", (req) => {
            this._myself.checkPermission("WSMA/servico/edt").then(() => {
                this._MateriaisClass.EdtServico(req[0].id, req[0].name, req[0].description, req[0].active, this._myself.myself.id).then((results) => {
                    socket.emit("ClientEvents", {
                        event: "system/edited/servicos",
                        data: { id: results.insertId }
                    })
                }).catch((err) => {
                    if (!this._myself.isLogged()) {
                        socket.emit("logout", "");
                    }
                    this._log.error("On Adding Material")
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