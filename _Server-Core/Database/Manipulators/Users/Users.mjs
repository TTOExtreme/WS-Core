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
                    this._db.Query(sql_select_password, [username, user_password]).then((results1, err) => {
                        if (err) {
                            this._events.emit("Log.erros", "Erros encontrados no login: " + username, err);
                            throw "Erros encontrados ao executar Select com senha do Usuário: " + username;
                        }
                        if (results1[0] != undefined) {
                            if (results[0].length > 0) {
                                resolv(results1[0][0])
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
        return new Promise((resolv, reject) => {
            const sql_select_username = "SELECT username FROM " + this._tablename + " WHERE UUID = ?;"
            this._db.Query(sql_select_username, [UUID]).then((results, err) => {
                if (err) {
                    this._events.emit("Log.erros", "Erros encontrados no login: " + username, err);
                    throw "Erros encontrados ao tentar executar Select do usuário: " + username;
                }
                if (results[0] != undefined) {
                    const username = results[0][0].username;
                    const name = results[0][0].nome;
                    resolv(username, name);
                } else {
                    reject("UUID invalido")
                }
            }).catch(reject)
        })
    }

    /**
     * Realiza o retorno das preferencias do Usuário
     * @param {UUID} UUID 
     * @returns {Promise} Dados do Usuário
     */
    Preferences_Get(UUID) {
        return new Promise((resolv, reject) => {
            const sql_select_username = "SELECT username,preferences FROM " + this._tablename + " WHERE UUID = ?;"
            this._db.Query(sql_select_username, [UUID]).then((results, err) => {
                if (err) {
                    this._events.emit("Log.erros", "Erros encontrados no Preferences_Get: " + UUID, err);
                    throw "Erros encontrados ao tentar executar Select do Preferences_Get: " + UUID;
                }
                if (results[0] != undefined) {
                    if (results[0][0] != undefined) {
                        const preferences = results[0][0].preferences;
                        resolv(preferences);
                    } else {
                        reject("UUID invalido")
                    }
                } else {
                    reject("UUID invalido")
                }
            }).catch(reject)
        })
    }
    /**
     * Realiza o salvamento das preferencias do Usuário
     * @param {UUID} UUID 
     * @param {JSON} Preferences 
     * @returns {Promise} Dados do Usuário
     */
    Preferences_Set(UUID, Preferences) {
        return new Promise((resolv, reject) => {
            const sql_select_username = "UPDATE " + this._tablename + " SET preferences = ? WHERE UUID = ?;"
            this._db.Query(sql_select_username, [JSON.stringify(Preferences), UUID]).then((results, err) => {
                if (err) {
                    this._events.emit("Log.erros", "Erros encontrados no Preferences_Set: " + UUID, err);
                    throw "Erros encontrados ao tentar executar Select do Preferences_Set: " + UUID;
                }
                if (results[0] != undefined) {
                    resolv();
                } else {
                    reject("UUID invalido")
                }
            }).catch(reject)
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


        })
    }

    /**
     * 
     * @param {UUID} UUID UUID do usuario a ser desabilitado
     * @returns {JSON} Dados do Usuário
     */
    DisableUser(UUID) {
        return new Promise((res, rej) => {


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


        })
    }

    /**
     * Retorna a UUID do usuário pelo username
     * @param {String} username Nome do Usuário
     * @returns {UUID} do usuário instanciado
     */
    GetUserUUID(username) {
        return new Promise((res, rej) => {


        })
    }

    GetUserGroups(UUID) {
        return new Promise((res, rej) => {


        })
    }

}