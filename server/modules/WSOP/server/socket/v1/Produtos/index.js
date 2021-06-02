const ProdutosManipulator = require('./dbManipulator').ProdutosManipulator;
const fs = require('fs');
const path = require('path').join;
const BCypher = require('../../../../../../core/utils/bcypher').Bcypher;
const imageManipulator = require('../utils/ImageManipulator').ImageManipulator;

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
        this._imageClass = new imageManipulator();
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
            }).catch((err) => {
                this._log.warning("User Access Denied to show Products: " + this._myself.myself.id)
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
         * List all Produtos para Edição de OS
         */
        socket.on("wsop/os/produtos/lst", (req) => {
            this._myself.checkPermission("WSOP/menu/produtos").then(() => {
                this._ProdutosClass.ListAllOs().then((res) => {
                    socket.emit("ClientEvents", {
                        event: "wsop/os/produtos/lst",
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
            }).catch((err) => {
                this._log.warning("User Access Denied to List OS Products: " + this._myself.myself.id)
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
         * add produto
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
                    this._ProdutosClass.createProduto(req[0].name, req[0].description, req[0].barcode, req[0].price, req[0].priceRevenda, req[0].cost, req[0].img, req[0].url, req[0].inventory, req[0].active, req[0].revenda, req[0].privatelabel, this._myself.myself.id).then(() => {
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
                    //console.log(req)
                    socket.emit("ClientEvents", {
                        event: "system_mess",
                        data: {
                            status: "INFO",
                            mess: "Favor Preencher todos os campos",
                            time: 1000
                        }
                    })
                }
            }).catch((err) => {
                this._log.warning("User Access Denied to Add Products: " + this._myself.myself.id)
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
         * add file
         */
        socket.on("wsop/produtos/file", (req) => {
            this._myself.checkPermission("WSOP/produtos/add").then(() => {
                try {
                    let name = new BCypher().generate_salt(48) + req[0].ext;
                    let filepath = path(__dirname + "/../../../../web/img/produtos/")
                    if (!fs.existsSync(filepath)) { fs.mkdirSync(filepath); }

                    while (fs.existsSync(filepath + name)) { // necessario para criar arquivo com nome unico
                        name = new BCypher().generate_salt(48) + req[0].ext;
                    }

                    fs.writeFileSync(filepath + name, req[0].stream);

                    if (req[0].ext == ".png" || req[0].ext == ".jpeg" || req[0].ext == ".gif" || req[0].ext == ".bmp" || req[0].ext == ".jpg") {

                        this._imageClass.thumb(filepath + name, (filepath + name).replace(".", "_thumb."), 300, 170).then(() => {

                            socket.emit("ClientEvents", {
                                event: "wsop/produtos/fileuploaded",
                                data: {
                                    file: "produtos/" + name
                                }
                            })
                        });
                    } else {
                        socket.emit("ClientEvents", {
                            event: "wsop/produtos/fileuploaded",
                            data: {
                                file: "file.png"
                            }
                        })
                    }

                } catch (err) {
                    if (!this._myself.isLogged()) {
                        socket.emit("logout", "");
                    }
                    this._log.error("On Uploading file to Product")
                    this._log.error(err);
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
                this._log.warning("User Access Denied to Add Products File: " + this._myself.myself.id)
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
         * edt produto
         */
        socket.on("wsop/produtos/edt", (req) => {
            this._myself.checkPermission("WSOP/produtos/add").then(() => {
                if (req[0].id &&
                    req[0].img
                ) {
                    this._ProdutosClass.editProduto(req[0].id, req[0].name, req[0].description, req[0].barcode, req[0].price, req[0].priceRevenda, req[0].cost, req[0].img, req[0].url, req[0].inventory, req[0].active, this._myself.myself.id).then(() => {
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
                    //console.log(req)
                    socket.emit("ClientEvents", {
                        event: "system_mess",
                        data: {
                            status: "INFO",
                            mess: "Favor Preencher todos os campos",
                            time: 1000
                        }
                    })
                }
            }).catch((err) => {
                this._log.warning("User Access Denied to edt Products: " + this._myself.myself.id)
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
         * Diable cliente
         */
        socket.on("wsop/produtos/del", (req) => {
            this._myself.checkPermission("WSOP/produtos/del").then(() => {
                this._ProdutosClass.disableProduto(req[0].id, req[0].active, this._myself.myself.id).then(() => {
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
            }).catch((err) => {
                this._log.warning("User Access Denied to Delete Products: " + this._myself.myself.id)
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