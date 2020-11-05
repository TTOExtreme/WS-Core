const groupManipulator = require('../../../../database/_group/serverManipulator').GroupServer;
const class_user = require('../../../../database/_user/class_user').User;
const class_group = require('../../../../database/_group/class_group').Group;

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
        this._groupServer = new groupManipulator(WSMainServer);
        this._myself = new class_user(WSMainServer);
        this._grupself = new class_user(WSMainServer);
    }

    /**
     * Create Listeners for Socket
     * @param {SocketIO} io 
     * @param {class_group} Myself
     */
    socket(socket, Myself) {
        this._log.task("api-mod-group", "Api Groups Loaded", 1);
        this._myself = Myself;
        /**
         * List all groups
         */
        socket.on("adm/grp/lst", (data) => {
            this._myself.checkPermission("menu/adm/grp").then(() => {
                this._groupServer.listGroup().then((data) => {
                    socket.emit("ClientEvents", {
                        event: "adm/grp/lst",
                        data: data
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
         * Group permissions
         * Get list of permissions from certain group
         */
        socket.on("adm/grp/perm/data", (data) => {
            this._myself.checkPermission("adm/grp/perm").then(() => {
                let search_group = new class_group(this._WSMainServer);
                search_group.findmeid(data[0].id).then(() => {
                    socket.emit("ClientEvents", {
                        event: "adm/grp/perm/data",
                        data: search_group.listPermissions()
                    })
                })
            }).catch((err) => {
                this._log.error(err);
                if (!this._myself.isLogged()) {
                    socket.emit("logout", "");
                }
                socket.emit("ClientEvents", {
                    event: "system_mess",
                    data: {
                        mess: "Acesso Negado",
                        status: "ERROR"
                    }
                })
            })
        })

        /**
         * Group Groups
         * Get list of group hierarchy
         */
        socket.on("adm/grp/grp/data", (data) => {
            this._myself.checkPermission("adm/grp/grp").then(() => {
                let search_group = new class_group(this._WSMainServer);
                search_group.findmeid(data[0].id).then(() => {
                    socket.emit("ClientEvents", {
                        event: "adm/grp/grp/data",
                        data: search_group.listGroups()
                    })
                }).catch((err) => {
                    this._log.error(err);
                    if (!this._myself.isLogged()) {
                        socket.emit("logout", "");
                    }
                    socket.emit("ClientEvents", {
                        event: "system_mess",
                        data: {
                            mess: "Acesso Negado",
                            status: "ERROR"
                        }
                    })
                })
            }).catch((err) => {
                this._log.error(err);
                if (!this._myself.isLogged()) {
                    socket.emit("logout", "");
                }
                socket.emit("ClientEvents", {
                    event: "system_mess",
                    data: {
                        mess: "Acesso Negado",
                        status: "ERROR"
                    }
                })
            })
        })

        /**
         * group permissions set (server)
         */
        socket.on("adm/grp/perm/set", (data) => {
            this._myself.checkPermission("adm/grp/perm").then(() => {
                this._groupServer.attribPermissions(data[0].id_group, data[0].code, this._myself.myself.id, data[0].active).then(() => {
                    socket.emit("ClientEvents", {
                        event: "system_mess",
                        data: {
                            mess: "Alterado com sucesso",
                            status: "OK"
                        }
                    })
                })
            }).catch(() => {
                if (!this._myself.isLogged()) {
                    socket.emit("logout", "");
                }
                socket.emit("ClientEvents", {
                    event: "system_mess",
                    data: {
                        mess: "Acesso Negado",
                        status: "ERROR"
                    }
                })
            })
        })

        /**
         * group Group set (server)
         */
        socket.on("adm/grp/grp/set", (data) => {
            this._myself.checkPermission("adm/grp/grp").then(() => {
                if (data[0].id_origin != undefined || data[0].id_group != undefined) {
                    this._groupServer.attribGroup(data[0].id_origin, data[0].id_group, this._myself.myself.id, data[0].active).then(() => {
                        let group_search = new class_group(this._WSMainServer)
                        group_search.checkRecursive(data[0].id_origin).then(() => {

                            socket.emit("ClientEvents", {
                                event: "system_mess",
                                data: {
                                    mess: "Alterado com sucesso",
                                    status: "OK"
                                }
                            })
                        }).catch(() => {
                            console.log(data);
                            this._groupServer.attribGroup(data[0].id_origin, data[0].id_group, this._myself.myself.id, ((data[0].active == 0) ? 1 : 0)).then(() => {

                                socket.emit("ClientEvents", {
                                    event: "system_mess",
                                    data: {
                                        mess: "Erro de Recursividade, Favor checar se não existe loop de hierarquia.",
                                        status: "ERROR"
                                    }
                                })
                            })
                        })
                    }).catch(() => {
                        if (!this._myself.isLogged()) {
                            socket.emit("logout", "");
                        }
                        socket.emit("ClientEvents", {
                            event: "system_mess",
                            data: {
                                mess: "Acesso Negado",
                                status: "ERROR"
                            }
                        })

                    })
                } else {
                    if (!this._myself.isLogged()) {
                        socket.emit("logout", "");
                    }
                    socket.emit("ClientEvents", {
                        event: "system_mess",
                        data: {
                            mess: "Erro de dados .",
                            status: "ERROR"
                        }
                    })
                }
            })
        });

        /**
         * group Add
         */
        socket.on("adm/grp/add/save", (data) => {
            this._myself.checkPermission("adm/grp/add").then(() => {
                this._groupServer.createGroup(data[0].id_group, data[0].name, data[0].active, this._myself.myself.id).then(() => {
                    socket.emit("ClientEvents", {
                        event: "system_mess",
                        data: {
                            mess: "Adicionado com sucesso",
                            status: "OK",
                            call: "SendSocket",
                            data: "adm/grp/lst"
                        }
                    })
                })
            }).catch(() => {
                if (!this._myself.isLogged()) {
                    socket.emit("logout", "");
                }
                socket.emit("ClientEvents", {
                    event: "system_mess",
                    data: {
                        mess: "Acesso Negado",
                        status: "ERROR"
                    }
                })
            })
        })

        /**
         * group edt
         */
        socket.on("adm/grp/edt/save", (data) => {
            this._myself.checkPermission("adm/grp/edt").then(() => {
                this._groupServer.edtGroup(data[0].id_group, data[0].name, data[0].active, this._myself.myself.id).then(() => {
                    socket.emit("ClientEvents", {
                        event: "system_mess",
                        data: {
                            mess: "Editado com sucesso",
                            status: "OK",
                            call: "SendSocket",
                            data: "adm/grp/lst"
                        }
                    })
                })
            }).catch((err) => {
                console.log(err)
                if (!this._myself.isLogged()) {
                    socket.emit("logout", "");
                }
                socket.emit("ClientEvents", {
                    event: "system_mess",
                    data: {
                        mess: "Acesso Negado",
                        status: "ERROR"
                    }
                })
            })
        })

        /**
         * Group Disable
         */
        socket.on("adm/grp/disable/save", (data) => {
            this._myself.checkPermission("adm/grp/disable").then(() => {
                this._groupServer.edtGroup(data[0].id_group, undefined, data[0].active, this._myself.myself.id).then(() => {
                    socket.emit("ClientEvents", {
                        event: "system_mess",
                        data: {
                            mess: ((data[0].active) ? "Ativado" : "Desativado") + " com sucesso",
                            status: "OK",
                            call: "SendSocket",
                            data: "adm/grp/lst"
                        }
                    })
                })
            }).catch((err) => {
                this._log.error(err);
                if (!this._myself.isLogged()) {
                    socket.emit("logout", "");
                }
                socket.emit("ClientEvents", {
                    event: "system_mess",
                    data: {
                        mess: "Acesso Negado",
                        status: "ERROR"
                    }
                })
            })
        })


        /**
         * Context Menu List items with it calls for list of groups
         */
        socket.on("adm/grp/lst/ctx", (data) => {
            let itemList = [];
            if (this._myself.checkPermissionSync("adm/usr/edt")) {
                itemList.push({
                    name: "Editar",
                    active: true,
                    event: {
                        call: "grp/edt",
                        data: data[0].row
                    }
                });
            } else {
                itemList.push({
                    name: "Editar",
                    active: false
                });
            }

            if (this._myself.checkPermissionSync("adm/grp/disable")) {
                itemList.push({
                    name: ((data[0].row.active == 1) ? "Desativar" : "Ativar"),
                    active: true,
                    event: {
                        call: "grp/disable",
                        data: data[0].row
                    }
                });
            } else {
                itemList.push({
                    name: ((data[0].row.active == 1) ? "Desativar" : "Ativar"),
                    active: false
                });
            }
            //*/
            if (this._myself.checkPermissionSync("adm/grp/perm")) {
                itemList.push({
                    name: "Permissões",
                    active: true,
                    event: {
                        call: "grp/perm",
                        data: data[0].row
                    }
                });
            } else {
                itemList.push({
                    name: "Permissões",
                    active: false
                });
            }
            if (this._myself.checkPermissionSync("adm/grp/grp")) {
                itemList.push({
                    name: "Grupos",
                    active: true,
                    event: {
                        call: "grp/grp",
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