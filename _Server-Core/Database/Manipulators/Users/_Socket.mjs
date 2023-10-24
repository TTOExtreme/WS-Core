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
                                callback("Usuário ou senha invalida", null);
                            })
                        } else {
                            this._events.emit('Log.error', 'UUID Invalido:' + (Preferences).toString() + " UUID: " + (client_instance.UUID).toString())
                            callback("Erro Preferencia Get", null);
                        }
                    })
                    socket_connection.on('Users.Preferences.Set', (Preferences = null, callback = (err, result) => { }) => {
                        if (Preferences != null) {
                            this.Preferences_Set(client_instance.UUID, Preferences).then(() => {
                                callback(null, "");
                            }).catch(err => {
                                this._events.emit('Log.error', "Tentativa de acesso Invalida: Preferences_Set UUID: " + (client_instance.UUID).toString())
                                callback("Usuário ou senha invalida", null);
                            })
                        } else {
                            this._events.emit('Log.error', 'Preferencia Invalida:' + (Preferences) + " UUID: " + (client_instance.UUID).toString())
                            callback("Erro Preferencia Invalida", null);
                        }
                    })
                    /**
                     * Fim dos Listeners apos login
                     */
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
