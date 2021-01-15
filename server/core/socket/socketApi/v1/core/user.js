const userManipulator = require('../../../../database/_user/serverManipulator').UserServer;
const class_user = require('../../../../database/_user/class_user').User;
const class_group = require('../../../../database/_group/class_group').Group;

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
        this._userServer = new userManipulator(WSMainServer);
        this._myself = new class_user(WSMainServer);
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
        socket.on("adm/user/lst", (data) => {
            this._myself.checkPermission("menu/adm/usr").then(() => {
                this._userServer.listUser().then((data) => {
                    socket.emit("ClientEvents", {
                        event: "adm/usr/lst",
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
         * User menus
         */
        socket.on("usr/lst/menu", (data) => {
            socket.emit("ClientEvents", {
                event: "LeftMenu-SetItems",
                data: this._myself.GetMenus()
            })
        })

        /**
         * User permissions
         * Get list of permissions from certain user
         */
        socket.on("adm/usr/perm/data", (data) => {
            this._myself.checkPermission("adm/usr/perm").then(() => {
                let search_user = new class_user(this._WSMainServer);
                search_user.findmeid(data[0].id).then(() => {
                    socket.emit("ClientEvents", {
                        event: "adm/usr/perm/data",
                        data: search_user.listPermissions()
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
         * User Groups
         * Get list of group hierarchy
         */
        socket.on("adm/usr/grp/data", (data) => {
            this._myself.checkPermission("adm/usr/grp").then(() => {
                let search_user = new class_user(this._WSMainServer);
                search_user.findmeid(data[0].id).then(() => {
                    return search_user._loadHierarchyGroups().then((user) => {
                        socket.emit("ClientEvents", {
                            event: "adm/usr/grp/data",
                            data: search_user.GetGroups()
                        })
                    }).catch(err => {
                        this._log.error("error on loading groups from user")
                        this._log.error(err)
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
         * User permissions set (server)
         */
        socket.on("adm/usr/perm/set", (data) => {
            this._myself.checkPermission("adm/usr/perm").then(() => {
                this._userServer.attribPermissions(data[0].id_user, data[0].code, this._myself.myself.id, data[0].active).then(() => {
                    socket.emit("ClientEvents", {
                        event: "system_mess",
                        data: {
                            mess: "Alterado com sucesso",
                            status: "OK"
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
         * User Group set (server)
         */
        socket.on("adm/usr/grp/set", (data) => {
            this._myself.checkPermission("adm/usr/grp").then(() => {
                this._userServer.attribGroup(data[0].id_user, data[0].id_group, this._myself.myself.id, data[0].active).then(() => {
                    socket.emit("ClientEvents", {
                        event: "system_mess",
                        data: {
                            mess: "Alterado com sucesso",
                            status: "OK"
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
         * User Add
         */
        socket.on("adm/usr/add/save", (data) => {
            this._myself.checkPermission("adm/usr/add").then(() => {
                this._userServer.createUser(data[0].id_user, data[0].name, data[0].username, data[0].pass, data[0].email, data[0].telefone, data[0].active, this._myself.myself.id).then(() => {
                    socket.emit("ClientEvents", {
                        event: "system_mess",
                        data: {
                            mess: "Adicionado com sucesso",
                            status: "OK",
                            call: "SendSocket",
                            data: "adm/user/lst"
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
         * User edt
         */
        socket.on("adm/usr/edt/save", (data) => {
            this._myself.checkPermission("adm/usr/edt").then(() => {
                this._userServer.edtUser(data[0].id_user, data[0].name, data[0].pass, data[0].email, data[0].telefone, this._myself.myself.id).then(() => {
                    socket.emit("ClientEvents", {
                        event: "system_mess",
                        data: {
                            mess: "Editado com sucesso",
                            status: "OK",
                            call: "SendSocket",
                            data: "adm/user/lst"
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
         * User ChangePass
         */
        socket.on("usr/edt/pass", (data) => {
            this._myself.checkPermission("def/usr/chgpass").then(() => {
                this._myself.changePass(data[0].pass).then(() => {
                    socket.emit("ClientEvents", {
                        event: "system_mess",
                        data: {
                            mess: "Alterado com sucesso",
                            status: "OK"
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
         * User Set Preferences
         */
        socket.on("usr/edt/preferences", (data) => {
            this._myself.checkPermission("def/usr/login").then(() => {
                this._myself.savePreferences(data[0].preferences).then(() => {
                    socket.emit("ClientEvents", {
                        event: "savedPreferences",
                        data: {}
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
                        mess: "Erro ao salvar Preferencias do Usuário",
                        status: "ERROR"
                    }
                })
            })
        })

        /**
         * User Get Preferences
         */
        socket.on("usr/get/preferences", (data) => {
            this._myself.checkPermission("def/usr/login").then(() => {
                this._myself.loadPreferences().then((prefs) => {
                    socket.emit("ClientEvents", {
                        event: "usr/get/preferences",
                        data: prefs
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
                        mess: "Erro ao salvar Preferencias do Usuário",
                        status: "ERROR"
                    }
                })
            })
        })

        /**
         * User Disable
         */
        socket.on("adm/usr/disable/save", (data) => {
            this._myself.checkPermission("adm/usr/disable").then(() => {
                this._userServer.edtUser(data[0].id_user, undefined, undefined, data[0].active, this._myself.myself.id).then(() => {
                    socket.emit("ClientEvents", {
                        event: "system_mess",
                        data: {
                            mess: ((data[0].active) ? "Ativado" : "Desativado") + " com sucesso",
                            status: "OK",
                            call: "SendSocket",
                            data: "adm/user/lst"
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
         * Context Menu List items with it calls for list of users
         */
        socket.on("adm/usr/lst/ctx", (data) => {
            let itemList = [];
            if (this._myself.checkPermissionSync("adm/usr/edt")) {
                itemList.push({
                    name: "Editar",
                    active: true,
                    event: {
                        call: "usr/edt",
                        data: data[0].row
                    }
                });
            } else {
                itemList.push({
                    name: "Editar",
                    active: false
                });
            }

            if (this._myself.checkPermissionSync("adm/usr/disable")) {
                itemList.push({
                    name: ((data[0].row.active == 1) ? "Desativar" : "Ativar"),
                    active: true,
                    event: {
                        call: "usr/disable",
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
            if (this._myself.checkPermissionSync("adm/usr/perm")) {
                itemList.push({
                    name: "Permissões",
                    active: true,
                    event: {
                        call: "usr/perm",
                        data: data[0].row
                    }
                });
            } else {
                itemList.push({
                    name: "Permissões",
                    active: false
                });
            }
            if (this._myself.checkPermissionSync("adm/usr/grp")) {
                itemList.push({
                    name: "Grupos",
                    active: true,
                    event: {
                        call: "usr/grp",
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