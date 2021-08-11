const FornecedorManipulator = require('./dbManipulator').FornecedorManipulator;

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
        this._FornecedorClass = new FornecedorManipulator(WSMainServer);
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
         * List all produtos
         */
        socket.on("WSFinan/fornecedor/lst", (req) => {
            this._myself.checkPermission("WSFinan/financeiro/fornecedor").then(() => {
                this._FornecedorClass.ListAll().then((res) => {
                    socket.emit("ClientEvents", {
                        event: "WSFinan/fornecedor/lst",
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
        socket.on("WSfinan/requisicao/fornecedor/lst", (req) => {
            this._myself.checkPermission("WSFinan/financeiro/fornecedor").then(() => {
                if (req[0]) {
                    this._FornecedorClass.ListFornecedorFiltered(req[0].name).then((res) => {
                        socket.emit("ClientEvents", {
                            event: "wsfinan/requisicao/fornecedor/lst",
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
        socket.on("WSFinan/fornecedor/add", (req) => {
            this._myself.checkPermission("WSFinan/fornecedor/add").then(() => {
                if (req[0].name &&
                    req[0].responsavel &&
                    req[0].cpf_cnpj &&
                    req[0].cep &&
                    req[0].logradouro &&
                    req[0].complemento &&
                    req[0].numero &&
                    req[0].bairro &&
                    req[0].municipio &&
                    req[0].uf &&
                    req[0].country &&
                    req[0].telefone &&
                    req[0].email &&
                    req[0].responsavel
                ) {
                    this._FornecedorClass.createFornecedor(
                        req[0].name,
                        req[0].responsavel,
                        req[0].description,
                        req[0].cpf_cnpj,
                        req[0].iscnpj,
                        req[0].cep,
                        req[0].logradouro,
                        req[0].complemento,
                        req[0].numero,
                        req[0].bairro,
                        req[0].municipio,
                        req[0].uf,
                        req[0].country,
                        req[0].telefone,
                        req[0].email,
                        req[0].active,
                        this._myself.myself.id).then(() => {
                            socket.emit("ClientEvents", {
                                event: "system/added/fornecedor",
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
        socket.on("WSFinan/fornecedor/edt", (req) => {
            this._myself.checkPermission("WSFinan/fornecedor/add").then(() => {
                if (req[0].name &&
                    req[0].responsavel &&
                    req[0].cpf_cnpj &&
                    req[0].cep &&
                    req[0].logradouro &&
                    req[0].complemento &&
                    req[0].numero &&
                    req[0].bairro &&
                    req[0].municipio &&
                    req[0].uf &&
                    req[0].country &&
                    req[0].telefone &&
                    req[0].email &&
                    req[0].responsavel
                ) {
                    this._FornecedorClass.editFornecedor(
                        req[0].id,
                        req[0].name,
                        req[0].responsavel,
                        req[0].description,
                        req[0].cpf_cnpj,
                        req[0].iscnpj,
                        req[0].cep,
                        req[0].logradouro,
                        req[0].complemento,
                        req[0].numero,
                        req[0].bairro,
                        req[0].municipio,
                        req[0].uf,
                        req[0].country,
                        req[0].telefone,
                        req[0].email,
                        req[0].active,
                        this._myself.myself.id).then(() => {
                            socket.emit("ClientEvents", {
                                event: "system/edited/fornecedor",
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
                        call: "WSFinan/fornecedor/edt",
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
                        call: "WSFinan/fornecedor/del",
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