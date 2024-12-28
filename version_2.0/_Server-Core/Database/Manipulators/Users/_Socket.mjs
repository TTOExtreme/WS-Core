import NavBarStructure from "../ServerConfig/NavBarStructure.mjs";
import User from "./Users.mjs";

export default class Users_Socket extends User {

    /**
     * Inicializa o basico de funções para login
     * @param {Socket} socket_connection 
     * @override
     */
    SocketBasic(socket_connection) {
        socket_connection.on('Users.Login', (username = null, password = null, callback = (err, result) => { }) => {
            if (username != null && password != null) {
                this.LogIn(username, password).then((UUID) => {
                    this._events.emit('Log.info', 'Login:' + (username).toString());
                    callback(null, UUID);
                }).catch(err => {
                    this._events.emit('Log.error', 'Tentativa de acesso Invalida:' + (username).toString() + " Pass: " + (password).toString())
                    callback("Usuário ou senha invalida", null);
                })
            } else {
                this._events.emit('Log.error', 'Tentativa de acesso com username ou password nulo:' + (username).toString() + " Pass: " + (password).toString())
                callback("Erro Usuário ou senha Invalidos", null);
            }
        })
    }

    /**
     * Inicializa o todas as funçoes de acordo com as permissoes do servidor
     * @param {Socket} socket_connection 
     * @param {JSON} client_instance Instancia dos dados do Usuário com a Conexão
     * @override
     */
    SocketFull(socket_connection, client_instance) {
        socket_connection.on('Users.Validar', (UUID = null, callback = (err, result) => { }) => {
            if (UUID != null && UUID != undefined) {
                this.LogInUUID(UUID).then((userdata) => {
                    if (userdata.username == undefined) {
                        this._events.emit('Log.error', 'UUID Invalido:', UUID);
                        return;
                    }
                    this._events.emit('Log.info', 'Login:' + (userdata.username).toString());
                    client_instance.UUID = userdata.UUID;
                    client_instance.ID = userdata.id;
                    client_instance.USERNAME = userdata.username;
                    client_instance.EMAIL = userdata.email;

                    this.SetOnline(client_instance.ID, 1).then(() => {
                        callback(null, { username: userdata.username, name: userdata.nome });

                        socket_connection.on('Users.Preferences.Get', (...args) => { this.Socket_Preferences_Get(socket_connection, client_instance, ...args) });
                        socket_connection.on('Users.Preferences.Set', (...args) => { this.Socket_Preferences_Set(socket_connection, client_instance, ...args) });
                        socket_connection.on('Users.Preferences.Load', (...args) => { this.Socket_Preferences_Load(socket_connection, client_instance, ...args) });

                        this.Permissions_Get_Specific(client_instance.UUID, "user/list").then(() => {
                            socket_connection.on('Users.List', (...args) => { this.Socket_Users_List(socket_connection, client_instance, ...args) });
                        }).catch(err => { })
                        this.Permissions_Get_Specific(client_instance.UUID, "user/edit").then(() => {
                            socket_connection.on('Users.Edit', (...args) => { this.Socket_Users_Edit(socket_connection, client_instance, ...args) });
                        }).catch(err => { })
                        this.Permissions_Get_Specific(client_instance.UUID, "user/edit/pass").then(() => {
                            socket_connection.on('Users.Edit.Pass', (...args) => { this.Socket_Users_Edit_Pass(socket_connection, client_instance, ...args) });
                        }).catch(err => { })
                        this.Permissions_Get_Specific(client_instance.UUID, "user/add").then(() => {
                            socket_connection.on('Users.Add', (...args) => { this.Socket_Users_Add(socket_connection, client_instance, ...args) });
                        }).catch(err => { })
                        this.Permissions_Get_Specific(client_instance.UUID, "user/delete").then(() => {
                            socket_connection.on('Users.Delete', (...args) => { this.Socket_Users_Delete(socket_connection, client_instance, ...args) });
                        }).catch(err => { })
                        this.Permissions_Get_Specific(client_instance.UUID, "user/active").then(() => {
                            socket_connection.on('Users.Active', (...args) => { this.Socket_Users_Active(socket_connection, client_instance, ...args) });
                        }).catch(err => { })
                        /**
                         * Fim dos Listeners apos login
                         */

                        /*
                        this._events.emit("Log.info", "N Listenters: ", socket_connection.eventNames().length);
                        this._events.emit("Log.info", "Listenters: ", socket_connection.eventNames());
                        //*/

                        this._events.emit("Users.Validado", client_instance);

                    }).catch((err) => {
                        this._events.emit('Log.error', "Tentativa de alterar estado do usuário: UUID: " + (client_instance.ID), err);
                    });
                }).catch(err => {
                    this._events.emit('Log.error', "Tentativa de acesso Invalida: Users.Validar UUID: " + (UUID), err);
                    callback("Usuário ou senha invalida", null);
                })
            } else {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Users.Validar UUID: " + (UUID));
                callback("Erro Usuário ou senha Invalidos", null);
            }
        })
    }

    /**
     * Carrega as preferencias do usuário
     */
    Socket_Preferences_Load(socket_connection, client_instance) {
        if (client_instance.UUID != undefined) {
            /**
             * Carrega as abas favoritadas
             */

            this.Permissions_Get(client_instance.ID, client_instance.UUID).then(async (Permissions) => {
                this.Preferences_Get(client_instance.ID, client_instance.UUID).then((Preferences) => {
                    if (Preferences != undefined && Preferences != "" && Preferences != null) {
                        let Pref = JSON.parse(Preferences)

                        if (Permissions.length > 1) {
                            for (let index = 0; index < Object.keys(client_instance.NavBarStructure).length; index++) {
                                const navbarstruct = client_instance.NavBarStructure[Object.keys(client_instance.NavBarStructure)[index]];
                                if (Permissions.findIndex((value) => { return (value.permissao == navbarstruct.permissao && value.tipo == 1) }) != -1) {
                                    if (Permissions.findIndex((value) => { return (value.permissao == navbarstruct.permissao && value.tipo == 2) }) == -1) {
                                        //Verifica se é um sub botão ou o principal da barra de navegação
                                        if (Pref.Favoritos != undefined) {
                                            for (let index = 0; index < Pref.Favoritos.length; index++) {
                                                const element = Pref.Favoritos[index];
                                                if (element.title != undefined && element.title == navbarstruct.title) {
                                                    socket_connection.emit('Navbar.fav.load', navbarstruct.icon, navbarstruct.title, navbarstruct.onclick)
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }).catch(err => {
                    this._events.emit('Log.error', "Tentativa de acesso Invalida: Preferences_Load UUID: " + (client_instance.UUID).toString(), err)
                    //callback("UUID invalida", null);
                })
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Preferences_Load UUID: " + (client_instance.UUID).toString(), err)
                //callback("UUID invalida", null);
            })
            /**
             * Carrega as Abas laterais
             */
            this.Permissions_Get(client_instance.ID, client_instance.UUID).then(async (Permissions) => {
                if (Permissions != undefined) {
                    //let Perms = JSON.parse(Permissions)
                    if (Permissions.length > 1) {
                        for (let index = 0; index < Object.keys(client_instance.NavBarStructure).length; index++) {
                            const navbarstruct = client_instance.NavBarStructure[Object.keys(client_instance.NavBarStructure)[index]];
                            if (Permissions.findIndex((value) => { return (value.permissao == navbarstruct.permissao && value.tipo == 1) }) != -1) {
                                if (Permissions.findIndex((value) => { return (value.permissao == navbarstruct.permissao && value.tipo == 2) }) == -1) {
                                    //Verifica se é um sub botão ou o principal da barra de navegação
                                    if (navbarstruct.parent == undefined) {
                                        socket_connection.emit('Navbar.Left.Add', navbarstruct.icon, navbarstruct.icon_class, navbarstruct.title, navbarstruct.onclick)
                                    } else {
                                        socket_connection.emit('Navbar.subLeft.Add', navbarstruct.icon, navbarstruct.icon_class, navbarstruct.title, navbarstruct.onclick, navbarstruct.parent)
                                    }

                                }
                            }
                        }
                    }
                }
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Preferences_Load UUID: " + (client_instance.UUID).toString(), err)
                //callback("UUID invalida", null);
            })

        } else {
            this._events.emit('Log.error', 'UUID Invalido:' + (Preferences).toString() + " UUID: " + (client_instance.UUID).toString())
            //Callback("Erro Preferencia Get", null);
        }
    }

    /**
     * Seta as preferencias para o usuario
     * @param {JSON} Preferences 
     * @param {Function} callback 
     */
    Socket_Preferences_Set(socket_connection, client_instance, Preferences = null, callback = (err, result) => { }) {
        if (Preferences != null) {
            console.log(Preferences)
            this.Preferences_Set(client_instance.ID, client_instance.UUID, Preferences).then(() => {
                //callback(null, "");
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Preferences_Set UUID: " + (client_instance.UUID).toString())
                //callback("UUID invalida", null);
            })
        } else {
            this._events.emit('Log.error', 'Preferencia Invalida:' + (Preferences) + " UUID: " + (client_instance.UUID).toString())
            //callback("Erro Preferencia Invalida", null);
        }
    }

    /**
     * Retorna as preferencias do Usuário
     * @param {Function} callback 
     */
    Socket_Preferences_Get(socket_connection, client_instance, callback = (err, result) => { }) {
        if (client_instance.UUID != undefined) {
            this.Preferences_Get(client_instance.ID, client_instance.UUID).then((Preferences) => {
                callback(null, Preferences);
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Preferences_Get UUID: " + (client_instance.UUID).toString(), err)
                callback("UUID invalida", null);
            })
        } else {
            this._events.emit('Log.error', 'UUID Invalido: UUID: ' + (client_instance.UUID).toString())
            callback("Erro Preferencia Get", null);
        }
    }

    /**
     * Retorna as preferencias do Usuário
     * @param {Function} callback 
     */
    Socket_Users_List(socket_connection, client_instance, callback = (err, result) => { }) {
        if (client_instance.UUID != undefined) {
            this.Permissions_Get_Specific(client_instance.UUID, "user/list").then(() => {
                this.ListUsers(client_instance.ID, client_instance.UUID).then((Users) => {
                    callback(null, Users[0]);
                }).catch(err => {
                    this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Users_List UUID: " + (client_instance.UUID).toString(), err)
                    callback("Acesso Negado", null);
                })
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Users_List UUID: " + (client_instance.UUID).toString(), err)
                callback("Acesso Negado", null);
            })
        } else {
            this._events.emit('Log.error', 'UUID Invalido: UUID: ' + (client_instance.UUID).toString())
            callback("Erro UUID Invalido", null);
        }
    }

    /**
     * Retorna as preferencias do Usuário
     * @param {Function} callback 
     * @param {JSON} UserData Dados do Usuario a ser realizado a operação
     */
    Socket_Users_Delete(socket_connection, client_instance, UserData, callback = (err, result) => { }) {
        if (client_instance.UUID != undefined) {
            this.Permissions_Get_Specific(client_instance.UUID, "user/delete").then(() => {
                this.DeleteUser(client_instance.ID, UserData.id, UserData.excluido).then(() => {
                    callback(null, "Excluido");
                }).catch(err => {
                    this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Users_Delete UUID: " + client_instance.UUID, err)
                    callback("Acesso Negado", null);
                })
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Users_Delete UUID: " + client_instance.UUID, err)
                callback("Acesso Negado", null);
            })
        } else {
            this._events.emit('Log.error', 'UUID Invalido: UUID: ' + (client_instance.UUID).toString())
            callback("Erro UUID Invalido", null);
        }
    }
    /**
     * Retorna as preferencias do Usuário
     * @param {Function} callback 
     * @param {JSON} UserData Dados do Usuario a ser realizado a operação
     */
    Socket_Users_Active(socket_connection, client_instance, UserData, callback = (err, result) => { }) {
        if (client_instance.UUID != undefined) {
            this.Permissions_Get_Specific(client_instance.UUID, "user/active").then(() => {
                this.DisableUser(client_instance.ID, UserData.id, UserData.ativo).then((Users) => {
                    callback(null, "Alterado estado do Usuário");
                }).catch(err => {
                    this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Users_Delete UUID: " + client_instance.UUID, err)
                    callback("Acesso Negado", null);
                })
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Users_Delete UUID: " + client_instance.UUID, err)
                callback("Acesso Negado", null);
            })
        } else {
            this._events.emit('Log.error', 'UUID Invalido: UUID: ' + (client_instance.UUID).toString())
            callback("Erro UUID Invalido", null);
        }
    }

    /**
     * 
     * @param {Socket} socket_connection 
     * @param {JSON} client_instance 
     * @param {JSON} UserData Dados do Usuario a ser realizado a operação
     * @param {Function} callback 
     */
    Socket_Users_Edit(socket_connection, client_instance, UserData, callback = (err, result) => { }) {
        if (client_instance.UUID != undefined) {
            this.Permissions_Get_Specific(client_instance.UUID, "user/edit").then(() => {
                this.EditUser(client_instance.ID, UserData.id, UserData.email, UserData.nome).then(() => {
                    this.GetUserByID(client_instance.ID, UserData.id).then((userDataReturn) => {
                        if (userDataReturn[0] != undefined) {
                            callback(null, userDataReturn[0][0]);
                        } else {
                            callback("Usuário Invalido", null);
                        }
                    }).catch(err => {
                        this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Users_Edit UUID: " + (client_instance.UUID).toString(), err)
                        callback("Acesso Negado", null);
                    })
                }).catch(err => {
                    this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Users_Edit UUID: " + (client_instance.UUID).toString(), err)
                    callback("Acesso Negado", null);
                })
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Users_Edit UUID: " + (client_instance.UUID).toString(), err)
                callback("Acesso Negado", null);
            })
        } else {
            this._events.emit('Log.error', 'UUID Invalido: UUID: ' + (client_instance.UUID).toString())
            callback("Erro UUID Invalido", null);
        }
    }

    /**
     * 
     * @param {Socket} socket_connection 
     * @param {JSON} client_instance 
     * @param {JSON} UserData Dados do Usuario a ser realizado a operação
     * @param {Function} callback  
     */
    Socket_Users_Edit_Pass(socket_connection, client_instance, UserData, callback = (err, result) => { }) {
        if (client_instance.UUID != undefined) {
            this.Permissions_Get_Specific(client_instance.UUID, "user/edit").then(() => {

                //let salt = this.BCypher.generateString();
                let salt = "";
                this._events.emit('Log.error', "salt pass: " + (UserData.password))
                let npassword = this.BCypher.SHA2(salt + (UserData.password));

                this.EditUserPass(client_instance.ID, UserData.id, npassword, salt).then(() => {
                    this.GetUserByID(client_instance.ID, UserData.id).then((userDataReturn) => {
                        if (userDataReturn[0] != undefined) {
                            callback(null, userDataReturn[0][0]);
                        } else {
                            callback("Usuário Invalido", null);
                        }
                    }).catch(err => {
                        this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Users_Edit_Pass UUID: " + (client_instance.UUID).toString(), err)
                        callback("Acesso Negado", null);
                    })
                }).catch(err => {
                    this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Users_Edit_Pass UUID: " + (client_instance.UUID).toString(), err)
                    callback("Acesso Negado", null);
                })
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Users_Edit_Pass UUID: " + (client_instance.UUID).toString(), err)
                callback("Acesso Negado", null);
            })
        } else {
            this._events.emit('Log.error', 'UUID Invalido: UUID: ' + (client_instance.UUID).toString())
            callback("Erro UUID Invalido", null);
        }
    }

    /**
     * Realiza a criação de um novo usuário
     * @param {Socket} socket_connection 
     * @param {JSON} client_instance 
     * @param {JSON} UserData Dados do Usuario a ser realizado a operação
     * @param {Function} callback 
     */
    Socket_Users_Add(socket_connection, client_instance, UserData, callback = (err, result) => { }) {
        if (client_instance.UUID != undefined) {
            this.Permissions_Get_Specific(client_instance.UUID, "user/add").then(() => {
                let salt = this.BCypher.generateString();
                let npassword = this.BCypher.SHA2(salt + (UserData.password));

                this.AddUser(client_instance.ID, UserData.nome, UserData.username, npassword, salt, UserData.email, UserData.ativo).then((Users) => {
                    callback(null, Users[0]);
                }).catch(err => {
                    this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Users_Add UUID: " + (client_instance.UUID).toString(), err)
                    callback("Acesso Negado", null);
                })
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Users_Add UUID: " + (client_instance.UUID).toString(), err)
                callback("Acesso Negado", null);
            })
        } else {
            this._events.emit('Log.error', 'UUID Invalido: UUID: ' + (client_instance.UUID).toString())
            callback("Erro UUID Invalido", null);
        }
    }
}
