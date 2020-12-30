const ClienteManipulator = require('./dbManipulator').ClienteManipulator;

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
        this._ClienteClass = new ClienteManipulator(WSMainServer);
    }

    /**
     * Create Listeners for Socket
     * @param {SocketIO} io 
     * @param {class_group} Myself
     */
    socket(socket, Myself) {
        this._log.task("api-mod-wsop-cliente", "Api wsop-clientes Loaded", 1);
        this._myself = Myself;

        /**
         * List all clientes
         */
        socket.on("wsop/clientes/lst", (req) => {
            this._myself.checkPermission("WSOP/menu/cliente").then(() => {
                this._ClienteClass.ListAll().then((res) => {
                    socket.emit("ClientEvents", {
                        event: "wsop/clientes/lst",
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
        socket.on("wsop/os/clientes/lst", (req) => {
            this._myself.checkPermission("WSOP/menu/cliente").then(() => {
                this._ClienteClass.ListAllOs().then((res) => {
                    socket.emit("ClientEvents", {
                        event: "wsop/os/clientes/lst",
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
        socket.on("wsop/clientes/add", (req) => {
            this._myself.checkPermission("WSOP/cliente/add").then(() => {
                if (req[0].nome &&
                    req[0].responsavel &&
                    req[0].cpf_cnpj &&
                    req[0].cep &&
                    req[0].logradouro &&
                    req[0].numero &&
                    req[0].bairro &&
                    req[0].municipio &&
                    req[0].uf &&
                    req[0].telefone &&
                    req[0].email &&
                    req[0].responsavel
                ) {
                    this._ClienteClass.createCliente(req[0].nome, req[0].responsavel, req[0].cpf_cnpj, req[0].iscnpj, req[0].cep, req[0].logradouro, req[0].numero, req[0].bairro, req[0].municipio, req[0].uf, req[0].telefone, req[0].email, req[0].active, this._myself.myself.id).then(() => {
                        socket.emit("ClientEvents", {
                            event: "system/added/clientes",
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
        socket.on("wsop/clientes/edt", (req) => {
            this._myself.checkPermission("WSOP/cliente/add").then(() => {
                if (req[0].id &&
                    req[0].nome &&
                    req[0].responsavel &&
                    req[0].cpf_cnpj &&
                    req[0].iscnpj &&
                    req[0].cep &&
                    req[0].logradouro &&
                    req[0].numero &&
                    req[0].bairro &&
                    req[0].municipio &&
                    req[0].uf &&
                    req[0].telefone &&
                    req[0].email &&
                    req[0].responsavel
                ) {
                    this._ClienteClass.editCliente(req[0].id, req[0].nome, req[0].responsavel, req[0].cpf_cnpj, req[0].iscnpj, req[0].cep, req[0].logradouro, req[0].numero, req[0].bairro, req[0].municipio, req[0].uf, req[0].telefone, req[0].email, req[0].active, this._myself.myself.id).then(() => {
                        socket.emit("ClientEvents", {
                            event: "system/edited/clientes",
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
        socket.on("wsop/clientes/del", (req) => {
            this._myself.checkPermission("WSOP/cliente/del").then(() => {
                this._ClienteClass.disableCliente(req[0].id, req[0].active, this._myself.myself.id).then(() => {
                    socket.emit("ClientEvents", {
                        event: "system/removed/clientes",
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
        socket.on("wsop/lst/clientes/ctx", (req) => {
            let itemList = [];

            //*/
            if (this._myself.checkPermissionSync("WSOP/cliente/edt")) {
                itemList.push({
                    name: "Editar",
                    active: true,
                    event: {
                        call: "wsop/clientes/edt",
                        data: req[0].row
                    }
                });
            } else {
                itemList.push({
                    name: "Editar",
                    active: false
                });
            }
            if (this._myself.checkPermissionSync("WSOP/cliente/del")) {
                itemList.push({
                    name: "Excluir",
                    active: true,
                    event: {
                        call: "wsop/clientes/del",
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