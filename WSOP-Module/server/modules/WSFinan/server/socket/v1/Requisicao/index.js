const requisicaiManipulator = require('./dbManipulator').requisicaiManipulator;
const BCypher = require('../../../../../../core/utils/bcypher').Bcypher;
const path = require("path").join;
const fs = require("fs");
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
        this._RequisicaoClass = new requisicaiManipulator(WSMainServer);
        this._db = WSMainServer.db;
        this._log.task("api-mod-wsfinan-compras", "Api WSFinan Compras Loaded", 1);
        this._imageClass = new imageManipulator();
    }

    /**
     * 
     * @param {ID_req} id_req 
     * @param {string} content 
     * @param {string} data 
     * @param {ID_User} UserID 
     * @returns 
     */
    saveLog(id_item = 0, content, data, UserID) {
        this._db.query("INSERT INTO " + this._db.DatabaseName + "._WSFinan_Requisicao_Log" +
            " (id_item,content,data, createdBy, createdIn)" +
            " VALUES " +
            " (" + id_item + ",'" + JSON.stringify(content) + "','" + JSON.stringify(data) + "'," + UserID + "," + Date.now() + ");").catch(err => {
                this._log.error("On saving Log WSFinan");
                this._log.error(err);
            });
    }
    /**
     * Create Listeners for Socket
     * @param {SocketIO} io 
     * @param {class_group} Myself
     */
    socket(socket, Myself) {
        this._myself = Myself;


        /**
         *  List Requisições
         */
        socket.on("WSFinan/requisicao/lst", (req) => {
            this._myself.checkPermission("WSFinan/requisicao/lst").then(() => {
                this._RequisicaoClass.ListRequisicao(req[0].id, req[0].name, req[0].description).then((res) => {
                    this.saveLog(0, "WSFinan/requisicao/lst", res, this._myself.myself.id);
                    socket.emit("ClientEvents", {
                        event: "wsfinan/requisicao/lst",
                        data: res
                    })
                }).catch((err) => {
                    this._log.error("On loading Requisicao on WSFinan")
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
                this._log.warning("User Access Denied to List Ficha Financeira: " + this._myself.myself.id)
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
         *  List Requisições para edição
         */
        socket.on("WSFinan/requisicao/edtview", (req) => {
            this._myself.checkPermission("WSFinan/requisicao/lst").then(() => {
                this._RequisicaoClass.GetRequisicao(req[0].id).then((res) => {
                    this.saveLog(0, "WSFinan/requisicao/view", res, this._myself.myself.id);
                    socket.emit("ClientEvents", {
                        event: "WSFinan/requisicao/edt",
                        data: res[0]
                    })
                }).catch((err) => {
                    this._log.error("On loading Requisicao on WSFinan")
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
                this._log.warning("User Access Denied to Edit Requisição: " + this._myself.myself.id)
                this._log.error(err)
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
         *  List Requisicao
         */
        socket.on("WSFinan/requisicao/lstauto", (req) => {
            this._RequisicaoClass.ListRequisicaoAutocomplete().then((res) => {
                this.saveLog(0, "WSFinan/requisicao/lst", res, this._myself.myself.id);
                socket.emit("ClientEvents", {
                    event: "wsfinan/requisicao/lstauto",
                    data: res
                })
            }).catch((err) => {
                this._log.error("On loading Requisicao on WSFinan")
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
         *  List Hist
         */
        socket.on("WSFinan/requisicao/lsthist", (req) => {
            this._RequisicaoClass.ListRequisicaoHistory(req[0].id).then((res) => {
                this.saveLog(0, "WSFinan/requisicao/lsthist", res, this._myself.myself.id);
                socket.emit("ClientEvents", {
                    event: "wsfinan/requisicao/lsthist",
                    data: { ficha: req[0], data: res }
                })
            }).catch((err) => {
                this._log.error("On loading history of Requisicao on WSFinan")
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
         *  Add Requisicao
         */
        socket.on("WSFinan/requisicao/add", (req) => {
            this._myself.checkPermission("WSFinan/requisicao/add").then(() => {
                this._RequisicaoClass.AddRequisicao(req[0].name, req[0].id_fornecedor, req[0].description, req[0].active, this._myself.myself.id).then((res) => {
                    this.saveLog(0, "WSFinan/requisicao/add", req[0], this._myself.myself.id);
                    socket.emit("ClientEvents", {
                        event: "system/added/requisicao",
                        data: { id: res.insertId }
                    })
                }).catch((err) => {
                    this._log.error("On Adding Requisicao on WSFinan")
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
                this._log.warning("User Access Denied to Add Ficha Financeira: " + this._myself.myself.id)
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
         *  Edt Requisicao
         */
        socket.on("WSFinan/requisicao/edt", (req) => {
            this._myself.checkPermission("WSFinan/requisicao/edt").then(() => {
                this._RequisicaoClass.EdtRequisicao(req[0].id, req[0].name, req[0].description, req[0].active, this._myself.myself.id).then((res) => {
                    this.saveLog(req[0].id, "WSFinan/requisicao/edt", req[0], this._myself.myself.id);
                    socket.emit("ClientEvents", {
                        event: "WSFinan/requisicao/edited",
                        data: req[0]
                    })
                }).catch((err) => {
                    this._log.error("On Editing Requisicao on WSFinan")
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
                this._log.warning("User Access Denied to Edt Requisicao: " + this._myself.myself.id)
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
         * Editar status Requisicao
         */
        socket.on("WSFinan/requisicao/edtstatus", (req) => {
            this._myself.checkPermission("WSFinan/requisicao/edt").then(() => {
                if (req[0].id &&
                    req[0].status &&
                    req[0].oldStatus
                ) {
                    let statusChange = []
                    if (req[0].statusChange == undefined) {

                    } else {
                        try {
                            statusChange = JSON.parse(JSON.parse(req[0].statusChange));
                        } catch (err) {
                            statusChange = [];
                        }
                    }
                    // writes to last change the timestamp
                    if (statusChange.length > 0) {
                        statusChange[statusChange.length - 1].out = new Date().getTime();
                        statusChange[statusChange.length - 1].outUser = this._myself.myself.name;
                    }
                    //writes a new input
                    statusChange.push({ status: req[0].status, in: new Date().getTime(), obs: req[0].statusobs, inUser: this._myself.myself.name });

                    this.saveLog(req.id, "Changing OS Status", "", this._myself.myself.id);
                    this._RequisicaoClass.editStatusRequisicao(req[0].id, req[0].status, JSON.stringify(statusChange), this._myself.myself.id).then(() => {
                        return this._RequisicaoClass.ListRequisicao(req[0].id).then((result) => {
                            socket.emit("ClientEvents", {
                                event: "system/edited/requisicaostatus",
                                data: result[0]
                            })
                        });
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
                this._log.warning("User Access Denied to change status OS: " + this._myself.myself.id)
                this._log.error(err);
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
        socket.on("WSFinan/requisicao/file", (req) => {
            this._myself.checkPermission("WSFinan/requisicao/add").then(() => {
                try {
                    req[0].ext = (req[0].ext).toLowerCase()
                    let name = new BCypher().generate_salt(48) + req[0].ext;
                    let filepath = path(__dirname + "/../../../../web/img/requisicao/")
                    if (!fs.existsSync(filepath)) { fs.mkdirSync(filepath); }
                    while (fs.existsSync(filepath + name)) { // necessario para criar arquivo com nome unico
                        name = new BCypher().generate_salt(48) + req[0].ext;
                    }
                    fs.writeFileSync(filepath + name, req[0].stream);

                    let thumb = "requisicao/" + name;
                    if (req[0].ext != ".png" && req[0].ext != ".jpeg" && req[0].ext != ".gif" && req[0].ext != ".bmp" && req[0].ext != ".jpg" && req[0].ext != ".jfif") {
                        thumb = "file_thumb.png";
                        this._RequisicaoClass.appendAnexo(req[0].id, req[0].name, "requisicao/" + name, thumb, this._myself.myself.id).then((res) => {
                            this.saveLog(req[0].id, "Adding file", JSON.stringify(req[0]), this._myself.myself.id);
                            socket.emit("ClientEvents", {
                                event: "WSFinan/requisicao/fileuploaded",
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
                            thumb = ("requisicao/" + name).replace(".", "_thumb.");
                            this._RequisicaoClass.appendAnexo(req[0].id, req[0].name, "requisicao/" + name, thumb, this._myself.myself.id).then((res) => {
                                this.saveLog(req[0].id, "Adding file", JSON.stringify(req[0]), this._myself.myself.id);
                                socket.emit("ClientEvents", {
                                    event: "WSFinan/requisicao/fileuploaded",
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
                                    event: "WSFinan/requisicao/fileuploaded",
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
                this._log.error(err)
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
         * add Produto a requisicao
         */
        socket.on("WSFinan/requisicao/produto/add", (req) => {
            this._myself.checkPermission("WSFinan/requisicao/add").then(() => {
                if (req[0].id &&
                    req[0].qnt &&
                    req[0].price
                ) {
                    this._RequisicaoClass.appendProduto(req[0].id_req, req[0].id, req[0].qnt, req[0].obs, req[0].price, this._myself.myself.id).then((id) => {
                        this.saveLog(req[0].id_req, "Adding Products", JSON.stringify(req[0]), this._myself.myself.id);
                        socket.emit("ClientEvents", {
                            event: "WSFinan/requisicao/produto/added",
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
                    this._log.error("On Adding prod to OS", req)
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
                this._log.error(err)
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
        socket.on("WSFinan/requisicao/produto/edt", (req) => {
            this._myself.checkPermission("WSFinan/requisicao/edt").then(() => {
                if (req[0].id &&
                    req[0].qnt &&
                    req[0].price
                ) {
                    this._RequisicaoClass.edtProduto(req[0].id, req[0].qnt, req[0].obs, req[0].price, this._myself.myself.id).then((id) => {
                        this.saveLog(req[0].id, "Editing Product on OS", JSON.stringify(req[0]), this._myself.myself.id);
                        socket.emit("ClientEvents", {
                            event: "WSFinan/requisicao/produto/edited",
                            data: req[0]
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
                this._log.error(err)
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
        socket.on("WSFinan/requisicao/produto/del", (req) => {
            this._myself.checkPermission("WSFinan/requisicao/add").then(() => {
                if (req[0].id
                ) {
                    this._RequisicaoClass.delProduto(req[0].id, this._myself.myself.id).then((id) => {
                        this.saveLog(req[0].id_req, "Removing Product from OS", JSON.stringify(req[0]), this._myself.myself.id);
                        socket.emit("ClientEvents", {
                            event: "WSFinan/requisicao/produto/deleted",
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
                this._log.error(err)
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
         * Delete Anexo da OS
         */
        socket.on("WSFinan/requisicao/anexo/del", (req) => {
            this._myself.checkPermission("WSFinan/requisicao/edt").then(() => {
                this._RequisicaoClass.delAnexo(req[0].id, this._myself.myself.id).then(() => {
                    this.saveLog(req[0].id_req, "Removing Attachment from OS", JSON.stringify(req[0]), this._myself.myself.id);
                    socket.emit("ClientEvents", {
                        event: "WSFinan/requisicao/anexo/deleted",
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
                this._log.error(err)
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
    }
}

module.exports = {
    Socket
};