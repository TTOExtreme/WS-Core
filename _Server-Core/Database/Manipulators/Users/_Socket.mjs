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
            if (UUID != null) {
                this.LogInUUID(UUID).then((username, name) => {
                    this._events.emit('Log.info', 'Login:' + (username).toString());
                    client_instance.UUID = UUID;
                    client_instance.username = username;
                    callback(null, { username: username, name: name });

                    /**
                     * Pos Login completo Adiciona os listeners
                     */
                    socket_connection.on('Users.Preferences.Get', (callback = (err, result) => { }) => {
                        if (client_instance.UUID != undefined) {
                            this.Preferences_Get(client_instance.UUID).then((Preferences) => {
                                callback(null, Preferences);
                            }).catch(err => {
                                this._events.emit('Log.error', "Tentativa de acesso Invalida: Preferences_Get UUID: " + (client_instance.UUID).toString(), err)
                                callback("UUID invalida", null);
                            })
                        } else {
                            this._events.emit('Log.error', 'UUID Invalido:' + (Preferences).toString() + " UUID: " + (client_instance.UUID).toString())
                            callback("Erro Preferencia Get", null);
                        }
                    })
                    socket_connection.on('Users.Preferences.Load', () => {
                        if (client_instance.UUID != undefined) {
                            /**
                             * Carrega as abas favoritadas
                             */
                            this.Preferences_Get(client_instance.UUID).then((Preferences) => {
                                if (Preferences != undefined) {
                                    let Pref = JSON.parse(Preferences)
                                    if (Pref.Favoritos != undefined) {
                                        for (let index = 0; index < Pref.Favoritos.length; index++) {
                                            const element = Pref.Favoritos[index];
                                            if (element.title != undefined && element.icon != undefined) {
                                                socket_connection.emit('Navbar.Top.Add', element.icon, element.title, (ev) => {
                                                    console.log("Open Terminal")
                                                }, true)
                                            }
                                        }
                                    }
                                }
                            }).catch(err => {
                                this._events.emit('Log.error', "Tentativa de acesso Invalida: Preferences_Load UUID: " + (client_instance.UUID).toString(), err)
                                callback("UUID invalida", null);
                            })
                            /**
                             * Carrega as Abas laterais
                             */
                            this.Permissions_Get(client_instance.UUID).then((Permissions) => {
                                if (Permissions != undefined) {
                                    //let Perms = JSON.parse(Permissions)
                                    if (Permissions.length > 1) {
                                        for (let index = 0; index < Permissions.length; index++) {
                                            const element = Permissions[index];
                                            //Verifica se a permissão é Allow
                                            if (element.tipo == 1) {
                                                //Valida se não existe nenhuma atribuida que seja Deny
                                                if (Permissions.findIndex((value) => { return (value.permissao == element.permissao && value.tipo == 2) }) == -1) {
                                                    const navbarstruct = NavBarStructure[element.permissao];
                                                    if (navbarstruct != undefined) {
                                                        socket_connection.emit('Navbar.Left.Add', navbarstruct.icon, navbarstruct.icon_class, navbarstruct.title, (ev) => {
                                                            console.log("Open ", element.title)
                                                        }, true)
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }).catch(err => {
                                this._events.emit('Log.error', "Tentativa de acesso Invalida: Preferences_Load UUID: " + (client_instance.UUID).toString(), err)
                                callback("UUID invalida", null);
                            })

                        } else {
                            this._events.emit('Log.error', 'UUID Invalido:' + (Preferences).toString() + " UUID: " + (client_instance.UUID).toString())
                            callback("Erro Preferencia Get", null);
                        }
                    })
                    socket_connection.on('Users.Preferences.Set', (Preferences = null, callback = (err, result) => { }) => {
                        if (Preferences != null) {
                            console.log(Preferences)
                            this.Preferences_Set(client_instance.UUID, Preferences).then(() => {
                                callback(null, "");
                            }).catch(err => {
                                this._events.emit('Log.error', "Tentativa de acesso Invalida: Preferences_Set UUID: " + (client_instance.UUID).toString())
                                callback("UUID invalida", null);
                            })
                        } else {
                            this._events.emit('Log.error', 'Preferencia Invalida:' + (Preferences) + " UUID: " + (client_instance.UUID).toString())
                            callback("Erro Preferencia Invalida", null);
                        }
                    })
                    /**
                     * Fim dos Listeners apos login
                     */

                    this._events.emit("Log.info", "N Listenters: ", socket_connection.eventNames().length);
                    this._events.emit("Log.info", "Listenters: ", socket_connection.eventNames());
                }).catch(err => {
                    this._events.emit('Log.error', "Tentativa de acesso Invalida: Users.Validar UUID: " + (UUID).toString(), err);
                    callback("Usuário ou senha invalida", null);
                })
            } else {
                this._events.emit('Log.error', 'Tentativa de acesso com username ou password nulo:' + (username).toString() + " Pass: " + (password).toString())
                callback("Erro Usuário ou senha Invalidos", null);
            }
        })
    }
}
