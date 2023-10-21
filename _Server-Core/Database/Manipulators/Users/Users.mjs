import { Socket } from "socket.io";
import BCypher from "../../../Utils/BCypher_2.0.mjs";
import ErrorMessages from "../../../Utils/ErrorMessages.mjs";
import DatabaseStructure from "../DatabaseStructure.mjs";


/**
 * Modulo de gerencia do usuario
 */
export default class User extends DatabaseStructure {

    //instancia do usuario connectado
    myself = {
        name: null,
        username: null,
        password: null,
        salt: null,
        groups: null,
        preferences: null,
        UUID: null,
        active: false
    }

    BCypher = new BCypher();

    /**
     * Chamada para alteração de predefiniçoes da classe mae
     */
    PreinitClass() {
        this._tablename = "_Users"
        this._tablestruct.username = {
            create: " VARCHAR(128)",
            descricao: "Nome do usuario ou email",
            viewInLog: true
        }
        this._tablestruct.email = {
            create: " VARCHAR(512)",
            descricao: "Email",
            viewInLog: true
        }
        this._tablestruct.nome = {
            create: " VARCHAR(512)",
            descricao: "Nome visual do Usuario",
            viewInLog: true
        }
        this._tablestruct.password = {
            create: " TEXT",
            descricao: "Hash da senha",
            viewInLog: false
        }
        this._tablestruct.hash_salt = {
            create: " TEXT",
            descricao: "Hash de salt para adicionar ao hash da senha",
            viewInLog: false
        }
        this._tablestruct.UUID = {
            create: " TEXT",
            descricao: "Chave de autenticação sem login, todo login gerara um novo",
            viewInLog: true
        }
        this._tablestruct.preferences = {
            create: " MEDIUMTEXT",
            descricao: "JSON contendo todas as preferencias do usuário",
            viewInLog: true
        }
        this._tablestruct.online = {
            create: " INT(1) DEFAULT 0",
            descricao: "Estado do usuário se o mesmo esta online ou não",
            viewInLog: true
        }

        const usalt = new BCypher().generateString();
        this._initialValues = [
            {
                username: "Admin",
                password: new BCypher().SHA2(usalt + new BCypher().SHA2("admin")),
                hash_salt: usalt,
                UUID: new BCypher().generateString(),
                nome: "Adimistrador WS-Core",
                email: "Admin@wscore"
            }
        ];
    }

    /**
     * Realiza o login usando usuario e senha
     * @param {String} username 
     * @param {HASH} password 
     * @returns {JSON} Dados do Usuário
     */
    LogIn(username, password) {
        return new Promise((resolv, reject) => {

            const sql_select_username = "SELECT username, hash_salt FROM " + this._tablename + " WHERE username = ?;"
            const sql_select_password = "SELECT username,UUID FROM " + this._tablename + " WHERE username = ? AND password = ?;"
            this._db.Query(sql_select_username, [username]).then((results, err) => {
                if (err) {
                    this._events.emit("Log.erros", "Erros encontrados no login: " + username, err);
                    throw "Erros encontrados ao tentar executar Select do usuário: " + username;
                }
                if (results[0] != undefined) {
                    //Valida Senha
                    const user_salt = results[0][0].hash_salt
                    const user_password = this.BCypher.SHA2(user_salt + password);
                    this._db.Query(sql_select_password, [username, user_password]).then((results, err) => {
                        if (err) {
                            this._events.emit("Log.erros", "Erros encontrados no login: " + username, err);
                            throw "Erros encontrados ao executar Select com senha do Usuário: " + username;
                        }
                        if (results[0] != undefined) {
                            //Valida Senha
                            if (results[0].length > 0) {
                                resolv(results[0].length > 0)
                            } else {
                                reject("Usuário ou Senha invalidos")
                            }

                        }
                    }).catch(reject)
                }
            }).catch(reject)
        })
    }

    /**
     * Realiza o login usando o UUID
     * @param {UUID} UUID 
     * @returns {Promise} Dados do Usuário
     */
    LogInUUID(UUID) {
        return new Promise((res, rej) => {
            this.users.findOne({ UUID: UUID }, { projection: { password: 0, salt: 0 } })
                .then(result => {
                    if (result.UUID != undefined) {
                        this.myself = result;
                        res(this.myself);
                    } else {
                        rej(ErrorMessages.user_not_found);
                    }
                }).catch(err => {
                    //this.log.error("Na busca de UUID", err);
                    rej(ErrorMessages.error_system);
                })

        })
    }

    /**
     * Login como usuario de sistema, só deve ser chamado para meios de instalação
     * @returns {Promise} Dados do Usuário
     */
    LogInSYSTEM() {
        return new Promise((res, rej) => {
            this.myself = {
                name: "SYSTEM",
                username: "SYSTEM",
                password: null,
                salt: null,
                groups: null,
                preferences: null,
                UUID: "Z00000000000000000000000000000000000000000000000000000000system0",
                active: false
            }
            res(this.myself);
        })
    }

    /**
     * Cria um usuario para acesso ao sistema
     * @param {String} name 
     * @param {String} username 
     * @param {HASH} password 
     * @param {HASH} salt 
     * @param {Array} groups 
     * @param {JSON} preferences 
     * @param {HASH} UUID 
     * @param {Boolean} active 
     * @returns {Promise}
     */
    AddUser(name = "",
        username = "",
        password = "",
        salt = "",
        groups = "",
        preferences = "",
        UUID = "",
        active = true) {
        return new Promise((res, rej) => {
            this.users.findOne({ username: username, active: true }, { projection: { password: 0, salt: 0 } }).then(usr1 => {
                if (usr1 == undefined) {
                    this.users.insertOne({
                        name: name,
                        username: username,
                        password: password,
                        salt,
                        salt,
                        groups: groups,
                        preferences: preferences,
                        UUID: UUID,
                        active: active,
                        createdIn: new Date().getTime(),
                        createdBy: this.myself.UUID
                    }).then((usr) => {
                        if (usr.acknowledged != undefined) {
                            this.users.findOne({ username: username }, { projection: { password: 0, salt: 0 } }).then(usr2 => {
                                res(usr2);
                            });
                        } else {
                            rej(ErrorMessages.add_to_db)
                        }
                    }).catch(err => {
                        this.log.error("On insert User of class User", err)
                        rej(err);
                    });
                } else {
                    rej(ErrorMessages.user_exists)
                }
            }).catch(err => {
                this.log.error("On findOne User on AddUser of class User", err)
                rej(err);
            });
        })
    }

    /**
     * 
     * @param {UUID} UUID UUID do usuario a ser desabilitado
     * @returns {JSON} Dados do Usuário
     */
    DisableUser(UUID) {
        return new Promise((res, rej) => {
            this.users.findOne({ UUID: UUID, active: true }, { projection: { UUID: 1, password: 0, salt: 0 } }).then(usr => {
                if (usr != undefined) {
                    this.users.findOneAndUpdate({ UUID: UUID, active: true, disabledIn: new Date().getTime(), disabledBy: this.myself.UUID }, { $set: { active: false } })
                        .then(result => {
                            if (result.acknowledged != undefined) {
                                this.users.findOne({ UUID: UUID }, { projection: { password: 0, salt: 0 } }).then(usr2 => {
                                    res(usr2);
                                });
                            } else {
                                rej(ErrorMessages.disable_user)
                            }
                        }).catch(err => {
                            rej(err);
                        })
                } else {
                    rej(ErrorMessages.user_not_found);
                }
            })
        })
    }

    /**
     * Adiciona um grupo ao usuário
     * @param {UUID} UUID 
     * @param {GUID} GUID 
     * @returns {Promise} contendo o retorno da operação
     */
    AddGroup(UUID, GUID) {
        return new Promise((res, rej) => {
            this.users.findOne({ UUID: UUID }, { projection: { groups: 1, UUID: 1 } }).then(usr => {
                if (usr != undefined) {
                    this.users.updateOne({ UUID: UUID }, { $addToSet: { groups: { GUID: GUID, addedBy: this.myself.UUID, addedIn: new Date().getTime(), active: true } } })
                        .then(result => {
                            res(result);
                        }).catch(err => {
                            rej(err);
                        })
                } else {
                    rej(ErrorMessages.user_not_found);
                }
            })
        })
    }

    /**
     * Adiciona um grupo ao usuário
     * @param {UUID} UUID 
     * @param {GUID} GUID 
     * @returns {Promise} contendo o retorno da operação
     */
    RemoveGroup(UUID, GUID) {
        return new Promise((res, rej) => {
            this.users.findOne({ UUID: UUID, "groups.group": GUID }, { projection: { groups: 1, UUID: 1 } }).then(usr => {
                if (usr != undefined) {
                    this.users.updateOne({ UUID: UUID, "groups.group": GUID }, { $set: { "groups.$.active": false, "groups.$.disabledBy": this.myself.UUID, "groups.$.disabledIn": new Date().getTime() } })
                        .then(result => {
                            res(result);
                        }).catch(err => {
                            rej(err);
                        })
                } else {
                    rej(ErrorMessages.user_not_found);
                }
            })
        })
    }

    /**
     * Retorna a UUID do usuário instanciado
     * @returns {UUID} do usuário instanciado
     */
    GetUUID() {
        return this.myself.UUID;
    }

    /**
     * Retorna a UUID do usuário pelo username
     * @param {String} username Nome do Usuário
     * @returns {UUID} do usuário instanciado
     */
    GetUserUUID(username) {
        return new Promise((res, rej) => {
            this.users.findOne({ username: username }, { projection: { UUID: 1 } }).then(usr => {
                if (usr != undefined) {
                    return usr.UUID;
                } else {
                    rej(ErrorMessages.user_not_found);
                }
            })
        })
    }

    GetUserGroups(UUID) {
        return new Promise((res, rej) => {
            this.users.aggregate({ username: username }, { projection: { UUID: 1 } }).then(usr => {
                if (usr != undefined) {
                    return usr.UUID;
                } else {
                    rej(ErrorMessages.user_not_found);
                }
            })
        })
    }

    /**
     * Inicializa o basico de funções para login
     * @param {Socket} socket_connection 
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
     */
    SocketFull(socket_connection) {

    }
}