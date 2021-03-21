const emitenteManipulator = require('./dbManipulator').emitenteManipulator;
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
        this._EmitenteClass = new emitenteManipulator(WSMainServer);
        this._imageClass = new imageManipulator();
    }

    /**
     * Create Listeners for Socket
     * @param {SocketIO} io 
     * @param {class_group} Myself
     */
    socket(socket, Myself) {
        this._log.task("api-mod-wsop-emitente", "Api wsop-emitente Loaded", 1);
        this._myself = Myself;

        /**
         * List all os
         */
        socket.on("wsop/emitente/lst", (req) => {
            this._myself.checkPermission("WSOP/menu/emitente").then(() => {
                this._EmitenteClass.ListAll().then((res) => {
                    socket.emit("ClientEvents", {
                        event: "wsop/emitente/add",
                        data: res[0] || {
                            name: "",
                            responsavel: "",
                            iscnpj: true,
                            cpf_cnpj: "",
                            cep: "",
                            logradouro: "",
                            numero: "",
                            bairro: "",
                            municipio: "",
                            uf: "",
                            logradouro: "",
                            telefone: "",
                            email: "",
                            active: 1,
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
         * add OS
         */
        socket.on("wsop/emitente/add", (req) => {
            this._myself.checkPermission("WSOP/emitente/add").then(() => {
                this._EmitenteClass.saveEmitente(req[0].name, req[0].responsavel, req[0].cpf_cnpj, req[0].iscnpj, req[0].cep, req[0].logradouro, req[0].numero, req[0].bairro, req[0].municipio, req[0].uf, req[0].telefone, req[0].email, req[0].img, this._myself.myself.id).then((results) => {
                    socket.emit("ClientEvents", {
                        event: "system/added/emitente",
                        data: { id: results.insertId }
                    })
                }).catch((err) => {
                    if (!this._myself.isLogged()) {
                        socket.emit("logout", "");
                    }
                    this._log.error("On Editing Emitente")
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
        socket.on("wsop/emitente/file", (req) => {
            this._myself.checkPermission("WSOP/emitente/add").then(() => {
                try {
                    let name = new BCypher().generate_salt(48) + req[0].ext;
                    let filepath = path(__dirname + "/../../../../web/img/emitente/")
                    if (!fs.existsSync(filepath)) { fs.mkdirSync(filepath); }

                    while (fs.existsSync(filepath + name)) { // necessario para criar arquivo com nome unico
                        name = new BCypher().generate_salt(48) + req[0].ext;
                    }

                    fs.writeFileSync(filepath + name, req[0].stream);

                    if (req[0].ext == ".png" || req[0].ext == ".jpeg" || req[0].ext == ".gif" || req[0].ext == ".bmp" || req[0].ext == ".png") {

                        this._imageClass.thumb(filepath + name, (filepath + name).replace(".", "_thumb."), 300, 170).then(() => {

                            socket.emit("ClientEvents", {
                                event: "wsop/emitente/fileuploaded",
                                data: {
                                    file: "emitente/" + name
                                }
                            })
                        });
                    } else {
                        socket.emit("ClientEvents", {
                            event: "wsop/emitente/fileuploaded",
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
            })

        })

        /**
         * Editar OS
         */
        socket.on("wsop/emitente/edt", (req) => {
            this._myself.checkPermission("WSOP/emitente/add").then(() => {
                if (req[0].id &&
                    req[0].description &&
                    req[0].status
                ) {
                    this._EmitenteClass.editOS(req[0].id, req[0].description, req[0].status, req[0].active, this._myself.myself.id).then(() => {
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
        socket.on("wsop/emitente/del", (req) => {
            this._myself.checkPermission("WSOP/emitente/del").then(() => {
                this._EmitenteClass.disableOS(req[0].id, req[0].active, this._myself.myself.id).then(() => {
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
        socket.on("wsop/lst/emitente/ctx", (req) => {
            let itemList = [];

            //*/
            if (this._myself.checkPermissionSync("WSOP/emitente/edt")) {
                itemList.push({
                    name: "Editar",
                    active: true,
                    event: {
                        call: "wsop/emitente/edt",
                        data: req[0].row
                    }
                });
            } else {
                itemList.push({
                    name: "Editar",
                    active: false
                });
            }
            if (this._myself.checkPermissionSync("WSOP/emitente/del")) {
                itemList.push({
                    name: "Excluir",
                    active: true,
                    event: {
                        call: "wsop/emitente/del",
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