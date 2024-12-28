const SitesManipulator = require('../../db/class/sites').Sites;
const class_user = require('../../../../../core/database/_user/class_user').User;

class Socket {

    _log;
    _config;
    _WSMainServer;
    _myself;
    _events;

    /**
     * Constructor for User Class
     * @param {WSMainServer} WSMain
     */
    constructor(WSMainServer) {
        this._log = WSMainServer.log;
        this._config = WSMainServer.config;
        this._WSMainServer = WSMainServer;
        this._events = WSMainServer.events;
        this._myself = new class_user(WSMainServer);

        this._sites = new SitesManipulator(WSMainServer);
    }

    /**
     * Create Listeners for Socket
     * @param {SocketIO} io 
     * @param {class_user} Myself
     */
    socket(socket, Myself) {
        this._log.task("api-mod-user", "Api User Loaded", 1);
        this._myself = Myself;
        /**
         * List all Users
         */
        socket.on("adm/WPMA/sites/lst", (data) => {
            this._myself.checkPermission("menu/adm/WPMA/sites").then(() => {
                this._sites.getAllSites().then((data) => {
                    socket.emit("ClientEvents", {
                        event: "adm/WPMA/sites/lst",
                        data: data
                    })
                }).catch((err) => {
                    this._log.error("On Get Sites List");
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
         * Add Sites
         */
        socket.on("adm/WPMA/sites/add/save", (data) => {
            this._myself.checkPermission("wpma/sites/add").then(() => {
                try {
                    if (data[0]) {
                        if (data[0].name == "") { throw "Favor preencher o campo 'Nome'" }
                        if (data[0].description == "") { throw "Favor preencher o campo 'Descrição'" }
                        if (data[0].route == "") { throw "Favor preencher o campo 'Rota'" }
                        if (data[0].subdomain == "") { throw "Favor preencher o campo 'Subdomínio'" }
                        if (data[0].folder == "") { throw "Favor preencher o campo 'Pasta'" }
                        this._sites.add(data[0].name,
                            data[0].description,
                            this._myself.myself.id,
                            data[0].route,
                            data[0].subdomain,
                            data[0].folder,
                            data[0].log,
                            data[0].active, 0).then(() => {
                                this._events.emit("WPMA/restartHosts",{});
                                socket.emit("ClientEvents", {
                                    event: "system_mess",
                                    data: {
                                        status: "OK",
                                        mess: "Site criado com sucesso",
                                        time: 1000,
                                        call:"SendSocket",
                                        data: "adm/WPMA/sites/lst"
                                    }
                                })
                            }).catch(err => {
                                console.log(err);
                                socket.emit("ClientEvents", {
                                    event: "system_mess",
                                    data: {
                                        status: "ERROR",
                                        mess: err,
                                        time: 1000
                                    }
                                })
                            });
                    } else {
                        socket.emit("ClientEvents", {
                            event: "system_mess",
                            data: {
                                status: "ERROR",
                                mess: "Request Incorreto",
                                time: 1000
                            }
                        })
                    }
                } catch (err) {
                    socket.emit("ClientEvents", {
                        event: "system_mess",
                        data: {
                            status: "INFO",
                            mess: err,
                            time: 1000
                        }
                    })
                }
            }).catch((err) => {
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
         * Editar Sites
         */
        socket.on("adm/WPMA/sites/edt/save", (data) => {
            this._myself.checkPermission("wpma/sites/edt").then(() => {
                try {
                    if (data[0]) {
                        if (data[0].name == "") { throw "Favor preencher o campo 'Nome'" }
                        if (data[0].description == "") { throw "Favor preencher o campo 'Descrição'" }
                        if (data[0].route == "") { throw "Favor preencher o campo 'Rota'" }
                        if (data[0].subdomain == "") { throw "Favor preencher o campo 'Subdomínio'" }
                        if (data[0].folder == "") { throw "Favor preencher o campo 'Pasta'" }
                        this._sites.edt(
                            data[0].id,
                            data[0].name,
                            data[0].description,
                            this._myself.myself.id,
                            data[0].route,
                            data[0].subdomain,
                            data[0].folder,
                            data[0].log,
                            data[0].active, 0).then(() => {
                                this._events.emit("WPMA/restartHosts",{});
                                socket.emit("ClientEvents", {
                                    event: "system_mess",
                                    data: {
                                        status: "OK",
                                        mess: "Site editado com sucesso",
                                        time: 1000,
                                        call:"SendSocket",
                                        data: "adm/WPMA/sites/lst"
                                    }
                                })
                            }).catch(err => {
                                socket.emit("ClientEvents", {
                                    event: "system_mess",
                                    data: {
                                        status: "ERROR",
                                        mess: err,
                                        time: 1000
                                    }
                                })
                            });
                    } else {
                        socket.emit("ClientEvents", {
                            event: "system_mess",
                            data: {
                                status: "ERROR",
                                mess: "Request Incorreto",
                                time: 1000
                            }
                        })
                    }
                } catch (err) {
                    socket.emit("ClientEvents", {
                        event: "system_mess",
                        data: {
                            status: "INFO",
                            mess: err,
                            time: 1000
                        }
                    })
                }
            }).catch((err) => {
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
         * Remover Sites
         */
        socket.on("adm/WPMA/sites/rem/save", (data) => {
            this._myself.checkPermission("wpma/sites/del").then(() => {
                try {
                    if (data[0]) {
                        this._sites.rem(
                            data[0].id,
                            this._myself.myself.id,
                            data[0].deleted).then(() => {
                                this._events.emit("WPMA/restartHosts",{});
                                socket.emit("ClientEvents", {
                                    event: "system_mess",
                                    data: {
                                        status: "OK",
                                        mess: "Site removido com sucesso",
                                        time: 1000,
                                        call:"SendSocket",
                                        data: "adm/WPMA/sites/lst"
                                    }
                                })
                            }).catch(err => {
                                console.log(err);
                                socket.emit("ClientEvents", {
                                    event: "system_mess",
                                    data: {
                                        status: "ERROR",
                                        mess: err,
                                        time: 1000
                                    }
                                })
                            });
                    } else {
                        socket.emit("ClientEvents", {
                            event: "system_mess",
                            data: {
                                status: "ERROR",
                                mess: "Request Incorreto",
                                time: 1000
                            }
                        })
                    }
                } catch (err) {
                    console.log(err);
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
         * Ativar/desativar Sites
         */
        socket.on("adm/WPMA/sites/disable/save", (data) => {
            this._myself.checkPermission("wpma/sites/disable").then(() => {
                try {
                    if (data[0]) {
                        this._sites.disable(
                            data[0].id,
                            this._myself.myself.id,
                            data[0].active).then(() => {
                                this._events.emit("WPMA/restartHosts",{});
                                socket.emit("ClientEvents", {
                                    event: "system_mess",
                                    data: {
                                        status: "OK",
                                        mess: "Site "+ ((data[0].active==0)?"desativado":"ativado")+" com sucesso",
                                        time: 1000,
                                        call:"SendSocket",
                                        data: "adm/WPMA/sites/lst"
                                    }
                                })
                            }).catch(err => {
                                console.log(err);
                                socket.emit("ClientEvents", {
                                    event: "system_mess",
                                    data: {
                                        status: "ERROR",
                                        mess: err,
                                        time: 1000
                                    }
                                })
                            });
                    } else {
                        socket.emit("ClientEvents", {
                            event: "system_mess",
                            data: {
                                status: "ERROR",
                                mess: "Request Incorreto",
                                time: 1000
                            }
                        })
                    }
                } catch (err) {
                    console.log(err);
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
         * Context Menu List items with it calls for list of users
         */
        socket.on("adm/WPMA/sites/lst/ctx", (data) => {
            let itemList = [];
            if (this._myself.checkPermissionSync("wpma/sites/edt")) {
                itemList.push({
                    name: "Editar",
                    active: true,
                    event: {
                        call: "WPMA/sites/edt",
                        data: data[0].row
                    }
                });
            } else {
                itemList.push({
                    name: "Editar",
                    active: false
                });
            }

            if (this._myself.checkPermissionSync("wpma/sites/disable")) {
                itemList.push({
                    name: ((data[0].row.active == 1) ? "Desativar" : "Ativar"),
                    active: true,
                    event: {
                        call: "WPMA/sites/disable",
                        data: data[0].row
                    }
                });
            } else {
                itemList.push({
                    name: ((data[0].row.active == 1) ? "Desativar" : "Ativar"),
                    active: false
                });
            }

            if (this._myself.checkPermissionSync("wpma/sites/del")) {
                itemList.push({
                    name: "Remover",
                    active: true,
                    event: {
                        call: "WPMA/sites/rem",
                        data: data[0].row
                    }
                });
            } else {
                itemList.push({
                    name: "Remover",
                    active: false
                });
            }

            if (this._myself.checkPermissionSync("adm/WPMA/sites/grp")) {
                itemList.push({
                    name: "Grupos",
                    active: true,
                    event: {
                        call: "WPMA/sites/grp",
                        data: data[0].row
                    }
                });
            } else {
                itemList.push({
                    name: "Grupos",
                    active: false
                });
            }


            socket.emit("ClientEvents", {
                event: "CreateContext",
                data: {
                    data: data,
                    items: itemList
                }
            })
        });

    }


}

module.exports = {
    Socket
};