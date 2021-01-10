const osManipulator = require('./dbManipulator').osManipulator;
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
     * Constructor for Class
     * @param {WSMainServer} WSMain
     */
    constructor(WSMainServer) {
        this._log = WSMainServer.log;
        this._config = WSMainServer.config;
        this._WSMainServer = WSMainServer;
        this._events = WSMainServer.events;
        this._OsClass = new osManipulator(WSMainServer);
        this._imageClass = new imageManipulator();
    }

    /**
     * Create Listeners for Socket
     * @param {SocketIO} io 
     * @param {class_group} Myself
     */
    socket(socket, Myself) {
        this._log.task("api-mod-wsop-os", "Api wsop-os Loaded", 1);
        this._myself = Myself;

        /**
         * List all os
         */
        socket.on("wsop/os/lst", (req) => {
            this._myself.checkPermission("WSOP/menu/os").then(() => {
                this._OsClass.ListAll().then((res) => {
                    socket.emit("ClientEvents", {
                        event: "wsop/os/lst",
                        data: res
                    })
                }).catch((err) => {
                    this._log.error("On Listing OS")
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
         * Reload Edt os
         */
        socket.on("wsop/os/lst/edt", (req) => {
            this._myself.checkPermission("WSOP/menu/os").then(() => {
                this._OsClass.ListAll(req[0].id).then((res) => {
                    socket.emit("ClientEvents", {
                        event: "wsop/os/edt",
                        data: res[0]
                    })
                }).catch((err) => {
                    this._log.error("On getting OS: " + req[0].id)
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
         * add OS
         */
        socket.on("wsop/os/add", (req) => {
            this._myself.checkPermission("WSOP/os/add").then(() => {
                this._OsClass.createOS(req[0].id_cliente, req[0].description, req[0].status, req[0].active, this._myself.myself.id).then((results) => {
                    socket.emit("ClientEvents", {
                        event: "system/added/os",
                        data: { id: results.insertId }
                    })
                }).catch((err) => {
                    if (!this._myself.isLogged()) {
                        socket.emit("logout", "");
                    }
                    this._log.error("On Adding OS")
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
         * add file
         */
        socket.on("wsop/os/file", (req) => {
            this._myself.checkPermission("WSOP/os/add").then(() => {
                try {
                    let name = new BCypher().generate_salt(48) + req[0].ext;
                    let filepath = path(__dirname + "/../../../../web/img/os/")
                    if (!fs.existsSync(filepath)) { fs.mkdirSync(filepath); }
                    while (fs.existsSync(filepath + name)) { // necessario para criar arquivo com nome unico
                        name = new BCypher().generate_salt(48) + req[0].ext;
                    }
                    fs.writeFileSync(filepath + name, req[0].stream);

                    let thumb = "os/" + name;
                    if (req[0].ext != ".png" && req[0].ext != ".jpeg" && req[0].ext != ".gif" && req[0].ext != ".bmp" && req[0].ext != ".png") {
                        thumb = "file_thumb.png";
                        this._OsClass.appendAnexo(req[0].id, req[0].name, "os/" + name, thumb, this._myself.myself.id).then((res) => {
                            socket.emit("ClientEvents", {
                                event: "wsop/os/fileuploaded",
                                data: {
                                    id: req[0].id,
                                    file: name,
                                    thumb: thumb,
                                }
                            })
                        })
                    } else {
                        thumb = (filepath + name).replace(".", "_thumb.");
                        this._imageClass.thumb(filepath + name, thumb, 300, 170).then(() => {
                            thumb = ("os/" + name).replace(".", "_thumb.");
                            this._OsClass.appendAnexo(req[0].id, req[0].name, "os/" + name, thumb, this._myself.myself.id).then((res) => {
                                socket.emit("ClientEvents", {
                                    event: "wsop/os/fileuploaded",
                                    data: {
                                        id: req[0].id,
                                        file: name,
                                        thumb: thumb,
                                    }
                                })
                            })

                        }).catch((err) => {
                            if (err == "Timeout") {
                                socket.emit("ClientEvents", {
                                    event: "wsop/os/fileuploaded",
                                    data: {}
                                })
                                socket.emit("ClientEvents", {
                                    event: "system_mess",
                                    data: {
                                        status: "ERROR",
                                        mess: err,
                                        time: 1000
                                    }
                                })
                            } else {
                                this._log.error("On creating thumbnail to Product")
                                this._log.error("Check instalation of ImageMagick and GraphicsMagick in server\nyum install GraphicsMagick ImageMagick\n");
                                this._log.error(err);
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
            })

        })

        /**
         * add Produto
         */
        socket.on("wsop/os/produto/add", (req) => {
            this._myself.checkPermission("WSOP/os/add").then(() => {
                if (req[0].id &&
                    req[0].qnt
                ) {
                    this._OsClass.appendProduto(req[0].id_os, req[0].id, req[0].qnt, req[0].obs, this._myself.myself.id).then((id) => {
                        socket.emit("ClientEvents", {
                            event: "wsop/os/produto/added",
                            data: {
                            }
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
                    this._log.error("On Adding OS")
                    this._log.error(err);
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
         * delete Produto
         */
        socket.on("wsop/os/produto/del", (req) => {
            this._myself.checkPermission("WSOP/os/add").then(() => {
                if (req[0].id
                ) {
                    this._OsClass.delProduto(req[0].id, this._myself.myself.id).then((id) => {
                        socket.emit("ClientEvents", {
                            event: "wsop/os/produto/added",
                            data: {
                            }
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
                    this._log.error("On Adding OS")
                    this._log.error(err);
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

        //

        /**
         * Delete Anexo da OS
         */
        socket.on("wsop/os/anexo/del", (req) => {
            this._myself.checkPermission("WSOP/menu/os").then(() => {
                this._OsClass.delAnexo(req[0].id, this._myself.myself.id).then(() => {
                    socket.emit("ClientEvents", {
                        event: "wsop/os/fileuploaded",
                        data: {
                        }
                    })
                }).catch((err) => {
                    this._log.error("On Listing OS")
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
         * Editar OS
         */
        socket.on("wsop/os/edt", (req) => {
            this._myself.checkPermission("WSOP/os/add").then(() => {
                if (req[0].id &&
                    req[0].description &&
                    req[0].status
                ) {
                    this._OsClass.editOS(req[0].id, req[0].description, req[0].status, req[0].active, this._myself.myself.id).then(() => {
                        socket.emit("ClientEvents", {
                            event: "system/edited/os",
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
         * Diable cliente
         */
        socket.on("wsop/os/del", (req) => {
            this._myself.checkPermission("WSOP/os/del").then(() => {
                this._OsClass.disableOS(req[0].id, req[0].active, this._myself.myself.id).then(() => {
                    socket.emit("ClientEvents", {
                        event: "system/removed/os",
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
        socket.on("wsop/lst/os/ctx", (req) => {
            let itemList = [];
            itemList.push({
                name: "Visualizar",
                active: true,
                event: {
                    call: "wsop/os/view",
                    data: req[0].row
                }
            });
            itemList.push({
                name: "Imprimir",
                active: true,
                event: {
                    call: "wsop/os/print",
                    data: req[0].row
                }
            });
            //*/
            if (this._myself.checkPermissionSync("WSOP/os/edt")) {
                itemList.push({
                    name: "Editar",
                    active: true,
                    event: {
                        call: "wsop/os/edt",
                        data: req[0].row
                    }
                });
            } else {
                itemList.push({
                    name: "Editar",
                    active: false
                });
            }
            if (this._myself.checkPermissionSync("WSOP/os/del")) {
                itemList.push({
                    name: "Excluir",
                    active: true,
                    event: {
                        call: "wsop/os/del",
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