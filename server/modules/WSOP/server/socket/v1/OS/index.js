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
        this.db = WSMainServer.db;
    }

    /**
     * 
     * @param {ID_OS} id_os 
     * @param {string} content 
     * @param {string} data 
     * @param {ID_User} UserID 
     * @returns 
     */
    saveLog(id_os = 0, content, data, UserID) {
        this.db.query("INSERT INTO " + this.db.DatabaseName + "._WSOP_Log" +
            " (id_os,content,data, createdBy, createdIn)" +
            " VALUES " +
            " (" + id_os + ",\"" + content + "\",'" + data + "'," + UserID + "," + Date.now() + ");").catch(err => {
                this._log.error("On saving Log WSOP");
                this._log.error(err);
            });
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
            this._OsClass.ListAll().then((res) => {
                this.saveLog(0, "Listing All OS's", "", this._myself.myself.id);
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


        /**
         * Reload Edt os
         */
        socket.on("wsop/os/lst/edt", (req) => {
            this._myself.checkPermission("WSOP/os/edt").then(() => {
                this._OsClass.ListID(req[0].id).then((res) => {
                    this.saveLog(0, "Get OS data: " + req[0].id, "", this._myself.myself.id);
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
            }).catch((err) => {
                this._log.warning("User Access Denied to get OS: " + this._myself.myself.id)
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
         * Reload View os
         */
        socket.on("wsop/os/lst/view", (req) => {
            this._myself.checkPermission("WSOP/os/edt").then(() => {
                this._OsClass.ListID(req[0].id).then((res) => {
                    this.saveLog(0, "Get OS data: " + req[0].id, "", this._myself.myself.id);
                    socket.emit("ClientEvents", {
                        event: "wsop/os/view",
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
            }).catch((err) => {
                this._log.warning("User Access Denied to see OS from User: " + this._myself.myself.id)
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
         * Reload View os
         */
        socket.on("wsop/os/lst/viewos", (req) => {
            this._myself.checkPermission("WSOP/os/edt").then(() => {
                this._OsClass.ListID(req[0].id).then((res) => {
                    this.saveLog(0, "Get OS data: " + req[0].id, "", this._myself.myself.id);
                    socket.emit("ClientEvents", {
                        event: "wsop/os/print",
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
            }).catch((err) => {
                this._log.warning("User Access Denied to see OS from User: " + this._myself.myself.id)
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
         * Reload View os
         */
        socket.on("wsop/os/lst/viewop", (req) => {
            this._myself.checkPermission("WSOP/os/edt").then(() => {
                this._OsClass.ListID(req[0].id).then((res) => {
                    this.saveLog(0, "Get OS data: " + req[0].id, "", this._myself.myself.id);
                    socket.emit("ClientEvents", {
                        event: "wsop/os/printop",
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
            }).catch((err) => {
                this._log.warning("User Access Denied to see OS from User: " + this._myself.myself.id)
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
         * add OS
         */
        socket.on("wsop/os/add", (req) => {
            this._myself.checkPermission("WSOP/os/add").then(() => {


                let statusChange = []
                if (req[0].statusChange == undefined) {

                } else {
                    statusChange = JSON.parse(JSON.parse(req[0].statusChange));
                }
                // writes to last change the timestamp
                if (statusChange.length > 0) {
                    statusChange[statusChange.length - 1].out = new Date().getTime();
                    statusChange[statusChange.length - 1].outUser = this._myself.myself.name;
                }
                //writes a new input
                statusChange.push({ status: req[0].status, in: new Date().getTime(), inUser: this._myself.myself.name, out: null });


                this._OsClass.createOS(req[0].id_cliente, req[0].description, req[0].status, JSON.stringify(statusChange), req[0].formaEnvio, req[0].caixa, req[0].country, req[0].uf, req[0].prazo, req[0].endingIn, req[0].active, this._myself.myself.id).then((results) => {

                    this.saveLog(results.insertId, "Adding OS's", JSON.stringify(req[0]), this._myself.myself.id);
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
            }).catch((err) => {
                this._log.warning("User Access Denied to Add OS: " + this._myself.myself.id)
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
                    if (req[0].ext != ".png" && req[0].ext != ".jpeg" && req[0].ext != ".gif" && req[0].ext != ".bmp" && req[0].ext != ".jpg") {
                        thumb = "file_thumb.png";
                        this._OsClass.appendAnexo(req[0].id, req[0].name, "os/" + name, thumb, this._myself.myself.id).then((res) => {
                            this.saveLog(req[0].id, "Adding file", JSON.stringify(req[0]), this._myself.myself.id);
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
                                this.saveLog(req[0].id, "Adding file", JSON.stringify(req[0]), this._myself.myself.id);
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
            }).catch((err) => {
                this._log.warning("User Access Denied to Add Attachment to OS: " + this._myself.myself.id)
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
         * add Produto
         */
        socket.on("wsop/os/produto/add", (req) => {
            this._myself.checkPermission("WSOP/os/add").then(() => {
                if (req[0].id &&
                    req[0].qnt
                ) {
                    this._OsClass.appendProduto(req[0].id_os, req[0].id, req[0].qnt, req[0].obs, this._myself.myself.id).then((id) => {
                        this.saveLog(req[0].id_os, "Adding Products", JSON.stringify(req[0]), this._myself.myself.id);
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
            }).catch((err) => {
                this._log.warning("User Access Denied to Add Product to OS: " + this._myself.myself.id)
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
         * Edt Produto
         */
        socket.on("wsop/os/produto/edt", (req) => {
            this._myself.checkPermission("WSOP/os/edt").then(() => {
                if (req[0].id &&
                    req[0].qnt
                ) {
                    console.log(req[0])
                    this._OsClass.edtProduto(req[0].id, req[0].qnt, req[0].obs, this._myself.myself.id).then((id) => {
                        this.saveLog(req[0].id, "Editing Product on OS", JSON.stringify(req[0]), this._myself.myself.id);
                        socket.emit("ClientEvents", {
                            event: "wsop/os/produto/edited",
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
                    this._log.error("On Editing Product OS")
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
                this._log.warning("User Access Denied to edt Product on OS: " + this._myself.myself.id)
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
         * delete Produto
         */
        socket.on("wsop/os/produto/del", (req) => {
            this._myself.checkPermission("WSOP/os/add").then(() => {
                if (req[0].id
                ) {
                    this._OsClass.delProduto(req[0].id, this._myself.myself.id).then((id) => {
                        this.saveLog(req[0].id_os, "Removing Product from OS", JSON.stringify(req[0]), this._myself.myself.id);
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
            }).catch((err) => {
                this._log.warning("User Access Denied to Delete Product OS: " + this._myself.myself.id)
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

        //

        /**
         * Delete Anexo da OS
         */
        socket.on("wsop/os/anexo/del", (req) => {
            this._myself.checkPermission("WSOP/menu/os").then(() => {
                this._OsClass.delAnexo(req[0].id, this._myself.myself.id).then(() => {
                    this.saveLog(req[0].id_os, "Removing Attachment from OS", JSON.stringify(req[0]), this._myself.myself.id);
                    socket.emit("ClientEvents", {
                        event: "wsop/os/fileuploaded",
                        data: {
                        }
                    })
                }).catch((err) => {
                    this._log.error("On Removing Attachment from OS")
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
                this._log.warning("User Access Denied to Delete Attachment OS: " + this._myself.myself.id)
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
         * Editar OS
         */
        socket.on("wsop/os/edt", (req) => {
            this._myself.checkPermission("WSOP/os/add").then(() => {
                if (req[0].id &&
                    req[0].status
                ) {
                    this._OsClass.editOS(req[0].id, req[0].description, req[0].status, req[0].formaEnvio, req[0].caixa, req[0].country, req[0].uf, req[0].statusChange, req[0].precoEnvio, req[0].desconto, req[0].prazo, req[0].price, req[0].endingIn, req[0].active, this._myself.myself.id).then(() => {
                        this.saveLog(req[0].id, "Editing OS", JSON.stringify(req[0]), this._myself.myself.id);
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
            }).catch((err) => {
                this._log.warning("User Access Denied to edt OS: " + this._myself.myself.id)
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
         * Editar status OS
         */
        socket.on("wsop/os/edtstatus", (req) => {
            this._myself.checkPermission("WSOP/os/add").then(() => {
                if (req[0].id &&
                    req[0].status &&
                    req[0].oldStatus
                ) {

                    let statusChange = []
                    if (req[0].statusChange == undefined) {

                    } else {
                        statusChange = JSON.parse(JSON.parse(req[0].statusChange));
                    }
                    // writes to last change the timestamp
                    if (statusChange.length > 0) {
                        statusChange[statusChange.length - 1].out = new Date().getTime();
                        statusChange[statusChange.length - 1].outUser = this._myself.myself.name;
                    }
                    //writes a new input
                    statusChange.push({ status: req[0].status, in: new Date().getTime(), inUser: this._myself.myself.name, out: null });

                    this._OsClass.editStatusOS(req[0].id, req[0].status, JSON.stringify(statusChange), this._myself.myself.id).then(() => {
                        this.saveLog(req.id, "Changing OS Status", "", this._myself.myself.id);
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
            }).catch((err) => {
                this._log.error(err);
                this._log.warning("User Access Denied to change status OS: " + this._myself.myself.id)
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
         * Diable OS
         */
        socket.on("wsop/os/del", (req) => {
            this._myself.checkPermission("WSOP/os/del").then(() => {
                this._OsClass.disableOS(req[0].id, req[0].active, this._myself.myself.id).then(() => {
                    this.saveLog(req.id, "Deleted OS", "", this._myself.myself.id);
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
            }).catch((err) => {
                this._log.warning("User Access Denied to disable/delete OS: " + this._myself.myself.id)
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
                name: "Imprimir OS",
                active: true,
                event: {
                    call: "wsop/os/print",
                    data: req[0].row
                }
            });
            itemList.push({
                name: "Imprimir OP",
                active: true,
                event: {
                    call: "wsop/os/printop",
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