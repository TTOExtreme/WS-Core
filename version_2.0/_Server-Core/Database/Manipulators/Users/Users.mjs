import { Socket } from "socket.io";
import BCypher from "../../../Utils/BCypher_2.0.mjs";
import ErrorMessages from "../../../Utils/ErrorMessages.mjs";
import DatabaseStructure from "../DatabaseStructure.mjs";
import Users_SQLs from "./Users_SQLs.mjs";
import LogAudit from "../LogAudit/LogAudit.mjs";


/**
 * Modulo de gerencia do usuario
 */
export default class User extends DatabaseStructure {

    BCypher = new BCypher();
    LogDatabase = null;

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
        this._tablestruct.ultimo_login = {
            create: " TIMESTAMP",
            descricao: "Data do ultimo login",
            viewInLog: true
        }
        this._tablestruct.ultimo_logout = {
            create: " TIMESTAMP",
            descricao: "Data do ultimo Logout",
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
                email: "Admin@wscore",
                ativo: 1
            }
        ];
        this.LogDatabase = new LogAudit(this._db, this._events);
    }

    /**
     * Realiza o login usando usuario e senha
     * @param {String} username 
     * @param {HASH} password 
     * @returns {JSON} Dados do Usuário
     */
    LogIn(username, password) {
        if (this.LogDatabase == null) { this.LogDatabase = new LogAudit(this._db, this._events); }
        return new Promise((resolv, reject) => {

            this._db.Query(Users_SQLs.sql_select_username, [username]).then((results, err) => {
                if (err) {
                    this._events.emit("Log.erros", "Erros encontrados no login: " + username, err);
                    throw "Erros encontrados ao tentar executar Select do usuário: " + username;
                }
                if (results[0] != undefined) {
                    //Valida Senha
                    const user_salt = results[0][0].hash_salt
                    const user_password = this.BCypher.SHA2(user_salt + password);
                    this._db.Query(Users_SQLs.sql_select_password, [username, user_password]).then((results1, err) => {
                        if (err) {
                            this._events.emit("Log.erros", "Erros encontrados no login: " + username, err);
                            throw "Erros encontrados ao executar Select com senha do Usuário: " + username;
                        }
                        if (results1[0] != undefined) {
                            if (results[0].length > 0) {
                                this.Permissions_Get_Specific(results1[0][0].UUID, 'adm/login').then(() => {
                                    this.LogDatabase.LogDatabase(results1[0][0].id, "Login", { username: username, password: user_password }, this.LogDatabase.EstadoLog.SUCESSO).then().catch();
                                    resolv(results1[0][0])
                                }).catch(() => {
                                    this.LogDatabase.LogDatabase(results1[0][0].id, "Login", { username: username, password: user_password, err: "Usuário sem permissão de login" }, this.LogDatabase.EstadoLog.ERRO).then().catch();
                                    reject("Usuário ou Senha invalidos")
                                })
                            } else {
                                this.LogDatabase.LogDatabase(results1[0][0].id, "Login", { username: username, password: user_password, err: "Usuário ou Senha invalido" }, this.LogDatabase.EstadoLog.ERRO).then().catch();
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
        if (this.LogDatabase == null) { this.LogDatabase = new LogAudit(this._db, this._events); }
        return new Promise((resolv, reject) => {
            this._db.Query(Users_SQLs.sql_username_get, [UUID]).then((results, err) => {
                if (err) {
                    this._events.emit("Log.erros", "Erros encontrados no login: " + UUID, err);
                    throw "Erros encontrados ao tentar executar Select do usuário: " + UUID;
                }
                if (results[0] != undefined) {
                    this.LogDatabase.LogDatabase(results[0][0].id, "Login.UUID", { UUID: UUID }, this.LogDatabase.EstadoLog.SUCESSO).then().catch();
                    resolv(results[0][0]);
                } else {
                    this.LogDatabase.LogDatabase('0', "Login.UUID", { UUID: UUID, err: "UUID invalido" }, this.LogDatabase.EstadoLog.ERRO).then().catch();
                    reject("UUID invalido")
                }
            }).catch(reject)
        })
    }

    /**
     * Realiza o retorno das preferencias do Usuário
     * @param {Integer} ID_Responsavel 
     * @param {UUID} UUID 
     * @returns {Promise} Dados do Usuário
     */
    Preferences_Get(ID_Responsavel, UUID) {
        if (this.LogDatabase == null) { this.LogDatabase = new LogAudit(this._db, this._events); }
        return new Promise((resolv, reject) => {
            this._db.Query(Users_SQLs.sql_preferences_get, [UUID]).then((results, err) => {
                if (err) {
                    this._events.emit("Log.erros", "Erros encontrados no Preferences_Get: " + UUID, err);
                    throw "Erros encontrados ao tentar executar Select do Preferences_Get: " + UUID;
                }
                if (results[0] != undefined) {
                    if (results[0][0] != undefined) {
                        this.LogDatabase.LogDatabase(results[0][0].id, "Preferences.Get", { UUID: UUID }, this.LogDatabase.EstadoLog.SUCESSO).then().catch();
                        const preferences = results[0][0].preferences;
                        resolv(preferences);
                    } else {
                        this.LogDatabase.LogDatabase(results[0][0].id, "Preferences.Get", { UUID: UUID, err: "UUID Invalido" }, this.LogDatabase.EstadoLog.ERRO).then().catch();
                        reject("UUID invalido")
                    }
                } else {
                    this.LogDatabase.LogDatabase(results[0][0].id, "Preferences.Get", { UUID: UUID, err: "UUID Invalido" }, this.LogDatabase.EstadoLog.ERRO).then().catch();
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
    Preferences_Set(ID_Responsavel, UUID, Preferences) {
        if (this.LogDatabase == null) { this.LogDatabase = new LogAudit(this._db, this._events); }
        return new Promise((resolv, reject) => {
            this._db.Query(Users_SQLs.sql_preferences_set, [JSON.stringify(Preferences), UUID]).then((results, err) => {
                if (err) {
                    this.LogDatabase.LogDatabase('0', "Preferences.Set", { UUID: UUID, preferences: Preferences, err: err }, this.LogDatabase.EstadoLog.ERRO).then().catch();
                    this._events.emit("Log.erros", "Erros encontrados no Preferences_Set: " + UUID, err);
                    throw "Erros encontrados ao tentar executar Select do Preferences_Set: " + UUID;
                }
                if (results[0] != undefined) {
                    this.LogDatabase.LogDatabase('0', "Preferences.Set", { UUID: UUID, preferences: Preferences }, this.LogDatabase.EstadoLog.SUCESSO).then().catch();
                    resolv();
                } else {
                    this.LogDatabase.LogDatabase('0', "Preferences.Set", { UUID: UUID, preferences: Preferences, err: "UUID Invalido" }, this.LogDatabase.EstadoLog.ERRO).then().catch();
                    reject("UUID invalido")
                }
            }).catch(reject)
        })
    }

    /**
     * Cria um usuario para acesso ao sistema
     * @param {Integer} ID_Responsavel 
     * @param {String} nome 
     * @param {String} username 
     * @param {HASH} password 
     * @param {string} email 
     * @returns {Promise}
     */
    AddUser(ID_Responsavel = null, nome = "", username = "", password = "", salt = "", email = "", ativo = 0) {
        if (this.LogDatabase == null) { this.LogDatabase = new LogAudit(this._db, this._events); }
        return new Promise((resolv, reject) => {
            this._db.Query(Users_SQLs.sql_add_user, [ID_Responsavel, username, email, nome, password, salt, ativo]).then((results, err) => {
                if (err) {
                    this.LogDatabase.LogDatabase(ID_Responsavel, "Add.User", { ID_Responsavel: ID_Responsavel, username: username, email: email, nome: nome, password: password, salt: salt, err: err }, this.LogDatabase.EstadoLog.ERRO).then().catch();
                    this._events.emit("Log.erros", "Erros encontrados no AddUser: " + ID_Responsavel, err);
                    throw "Erros encontrados ao tentar executar Select do AddUser: " + ID_Responsavel;
                }
                this.LogDatabase.LogDatabase(ID_Responsavel, "Add.User", { ID_Responsavel: ID_Responsavel, username: username, email: email, nome: nome, password: password, salt: salt }, this.LogDatabase.EstadoLog.SUCESSO).then().catch();
                this._db.Query(Users_SQLs.sql_user_list_single_id, [results[0].insertId]).then((results_inserted, err_inserted) => {
                    if (err_inserted) {
                        this.LogDatabase.LogDatabase(ID_Responsavel, "Add.User", { ID_Responsavel: ID_Responsavel, username: username, email: email, nome: nome, password: password, salt: salt, err: err_inserted }, this.LogDatabase.EstadoLog.ERRO).then().catch();
                        this._events.emit("Log.erros", "Erros encontrados no AddUser: " + ID_Responsavel, err_inserted);
                        throw "Erros encontrados ao tentar executar Select do AddUser: " + ID_Responsavel;
                    }
                    resolv(results_inserted[0]);
                }).catch(reject)
            }).catch(reject)
        })
    }

    /**
     * 
     * @param {Integer} ID ID do usuario a ser desabilitado
     * @returns {Promise} 
     */
    DisableUser(ID_Responsavel, ID, Estado = 0) {
        if (this.LogDatabase == null) { this.LogDatabase = new LogAudit(this._db, this._events); }
        return new Promise((resolv, reject) => {
            this._db.Query(Users_SQLs.sql_active_user, [ID_Responsavel, Estado, ID], true).then((results, err) => {
                if (err) {
                    this.LogDatabase.LogDatabase(ID_Responsavel, "Disable.User", { ID_Responsavel: ID_Responsavel, ID: ID, err: err }, this.LogDatabase.EstadoLog.ERRO).then().catch();
                    this._events.emit("Log.erros", "Erros encontrados no DisableUser: " + ID_Responsavel, err);
                    throw "Erros encontrados ao tentar executar Select do DisableUser: " + ID_Responsavel;
                }
                this.LogDatabase.LogDatabase(ID_Responsavel, "Disable.User", { ID_Responsavel: ID_Responsavel, ID: ID }, this.LogDatabase.EstadoLog.SUCESSO).then().catch();
                resolv();
            }).catch(reject)
        })
    }

    /**
     * Altera os dados do usuario informado
     * @param {Integer} ID_Responsavel 
     * @param {Integer} ID 
     * @param {String} Email 
     * @param {String} Nome 
     * @returns 
     */
    EditUser(ID_Responsavel, ID, Email, Nome) {
        if (this.LogDatabase == null) { this.LogDatabase = new LogAudit(this._db, this._events); }
        return new Promise((resolv, reject) => {
            this._db.Query(Users_SQLs.sql_edit_user, [Email, Nome, ID_Responsavel, ID], true).then((results, err) => {
                if (err) {
                    this.LogDatabase.LogDatabase(ID_Responsavel, "Edit.User", { Email: Email, Nome: Nome, ID_Responsavel: ID_Responsavel, ID: ID, err: err }, this.LogDatabase.EstadoLog.ERRO).then().catch();
                    this._events.emit("Log.erros", "Erros encontrados no EditUser: " + UUID, err);
                    throw "Erros encontrados ao tentar executar Select do EditUser: " + UUID;
                }
                this.LogDatabase.LogDatabase(ID_Responsavel, "Edit.User", { Email: Email, Nome: Nome, ID_Responsavel: ID_Responsavel, ID: ID }, this.LogDatabase.EstadoLog.SUCESSO).then().catch();
                resolv();
            }).catch(reject)
        })
    }

    /**
     * Realiza a Exclusao dom usuário da base
     * @param {Integer} ID_Responsavel 
     * @param {Integer} ID 
     * @param {String} Email 
     * @param {String} Nome 
     * @returns 
     */
    DeleteUser(ID_Responsavel, ID, Estado = 1) {
        if (this.LogDatabase == null) { this.LogDatabase = new LogAudit(this._db, this._events); }
        return new Promise((resolv, reject) => {
            this._db.Query(Users_SQLs.sql_delete_user, [ID_Responsavel, ID_Responsavel, 1, ID], true).then((results, err) => {
                if (err) {
                    this.LogDatabase.LogDatabase(ID_Responsavel, "Delete.User", { ID_Responsavel: ID_Responsavel, ID: ID, err: err }, this.LogDatabase.EstadoLog.ERRO).then().catch();
                    this._events.emit("Log.erros", "Erros encontrados no DeleteUser: " + ID_Responsavel, err);
                    throw "Erros encontrados ao tentar executar Select do DeleteUser: " + ID_Responsavel;
                }
                this.LogDatabase.LogDatabase(ID_Responsavel, "Delete.User", { ID_Responsavel: ID_Responsavel, ID: ID }, this.LogDatabase.EstadoLog.SUCESSO).then().catch();
                resolv();
            }).catch(reject)
        })
    }

    /**
     * Altera os dados do usuario informado
     * @param {Integer} ID_Responsavel 
     * @param {Integer} ID 
     * @param {String} Email 
     * @param {String} Nome 
     * @returns 
     */
    EditUserPass(ID_Responsavel, ID, Password, Hash_Salt) {
        if (this.LogDatabase == null) { this.LogDatabase = new LogAudit(this._db, this._events); }
        return new Promise((resolv, reject) => {
            this._db.Query(Users_SQLs.sql_edit_user_pass, [Password, Hash_Salt, ID_Responsavel, ID], true).then((results, err) => {
                if (err) {
                    this.LogDatabase.LogDatabase(ID_Responsavel, "Edit.User.Pass", { pass: Password, hash_salt: Hash_Salt, ID_Responsavel: ID_Responsavel, ID: ID, err: err }, this.LogDatabase.EstadoLog.ERRO).then().catch();
                    this._events.emit("Log.erros", "Erros encontrados no EditUserPass: " + UUID, err);
                    throw "Erros encontrados ao tentar executar Select do EditUserPass: " + UUID;
                }
                this.LogDatabase.LogDatabase(ID_Responsavel, "Edit.User.Pass", { pass: Password, hash_salt: Hash_Salt, ID_Responsavel: ID_Responsavel, ID: ID }, this.LogDatabase.EstadoLog.SUCESSO).then().catch();
                resolv();
            }).catch(reject)
        })
    }

    /**
     * Adiciona um grupo ao usuário
     * @param {UUID} UUID ID do usuário
     * @param {GUID} GUID ID do Grupo
     * @returns {Promise} contendo o retorno da operação
     */
    AddGroup(ID_Responsavel, UUID, GUID) {
        if (this.LogDatabase == null) { this.LogDatabase = new LogAudit(this._db, this._events); }
        return new Promise((resolv, reject) => {


        })
    }

    /**
     * Adiciona um grupo ao usuário
     * @param {Integer} ID_Responsavel 
     * @param {UUID} UUID 
     * @param {GUID} GUID 
     * @returns {Promise} contendo o retorno da operação
     */
    RemoveGroup(ID_Responsavel, UUID, GUID) {
        if (this.LogDatabase == null) { this.LogDatabase = new LogAudit(this._db, this._events); }
        return new Promise((resolv, reject) => {


        })
    }

    /**
     * Retorna as permissioes do usuario em Base ao UUID
     * @param {Integer} ID_Responsavel 
     * @param {String} UUID 
     * @returns {Promise} contendo o array de permissoes
     */
    Permissions_Get(ID_Responsavel, UUID) {
        if (this.LogDatabase == null) { this.LogDatabase = new LogAudit(this._db, this._events); }
        return new Promise((resolv, reject) => {
            this._db.Query(Users_SQLs.sql_select_permissions_from_uuid, [UUID]).then((results, err) => {
                if (err) {
                    this._events.emit("Log.erros", "Erros encontrados no Permissions_Get: " + UUID, err);
                    throw "Erros encontrados ao tentar executar Select do Permissions_Get: " + UUID;
                }
                if (results[0] != undefined) {
                    this.LogDatabase.LogDatabase(ID_Responsavel, "Permissions.Get", { UUID: UUID }, this.LogDatabase.EstadoLog.SUCESSO).then().catch();
                    resolv(results[0]);
                } else {
                    this.LogDatabase.LogDatabase(ID_Responsavel, "Permissions.Get", { UUID: UUID, err: "UUID Invalido" }, this.LogDatabase.EstadoLog.ERRO).then().catch();
                    reject("UUID invalido")
                }
            }).catch(reject)
        })
    }

    /**
     * Retorna as permissioes do usuario em Base ao UUID
     * @param {String} UUID 
     * @returns {Promise} contendo o array de permissoes
     */
    Permissions_Get_Specific(UUID, permission) {
        if (this.LogDatabase == null) { this.LogDatabase = new LogAudit(this._db, this._events); }
        return new Promise((resolv, reject) => {
            this._db.Query(Users_SQLs.sql_select_permissions_from_uuid_specific, [UUID, permission]).then((results, err) => {
                if (err) {
                    this._events.emit("Log.erros", "Erros encontrados no Permissions_Get_Specific: " + UUID, err);
                    throw "Erros encontrados ao tentar executar Select do Permissions_Get_Specific: " + UUID;
                }
                if (results[0] != undefined) {
                    if (results[0][0].tipo == 1) {
                        resolv();
                    } else { reject("Usuario Sem permissão") }
                } else {
                    reject("UUID invalido")
                }
            }).catch(reject)
        })
    }

    /**
     * Lista todos os usuários do sistema, para gerencia apenas
     * @param {Integer} ID_Responsavel 
     * @param {String} UUID 
     * @returns 
     */
    ListUsers(ID_Responsavel, UUID) {
        if (this.LogDatabase == null) { this.LogDatabase = new LogAudit(this._db, this._events); }
        return new Promise((resolv, reject) => {
            this._db.Query(Users_SQLs.sql_user_list).then((results, err) => {
                if (err) {
                    this._events.emit("Log.erros", "Erros encontrados no ListUsers: " + UUID, err);
                    throw "Erros encontrados ao tentar executar Select do ListUsers: " + UUID;
                }
                if (results[0] != undefined) {
                    this.LogDatabase.LogDatabase(ID_Responsavel, "Users.List", { UUID: UUID, ID_Responsavel: ID_Responsavel }, this.LogDatabase.EstadoLog.SUCESSO).then().catch();
                    resolv(results);
                } else {
                    this.LogDatabase.LogDatabase(ID_Responsavel, "Users.List", { UUID: UUID, ID_Responsavel: ID_Responsavel, err: "UUID Invalido" }, this.LogDatabase.EstadoLog.ERRO).then().catch();
                    reject("UUID invalido")
                }
            }).catch(reject)
        })
    }

    /**
     * Retorna os dados de um usuário especifico
     * @param {Integer} ID_Responsavel 
     * @param {String} UUID 
     * @returns 
     */
    GetUserByID(ID_Responsavel, ID_Filtro) {
        if (this.LogDatabase == null) { this.LogDatabase = new LogAudit(this._db, this._events); }
        return new Promise((resolv, reject) => {
            this._db.Query(Users_SQLs.sql_user_list_single_id, [ID_Filtro]).then((results, err) => {
                if (err) {
                    this._events.emit("Log.erros", "Erros encontrados no GetUserByID: " + UUID, err);
                    throw "Erros encontrados ao tentar executar Select do GetUserByID: " + UUID;
                }
                if (results[0] != undefined) {
                    this.LogDatabase.LogDatabase(ID_Responsavel, "Users.List.SingleID", { ID: ID_Filtro, ID_Responsavel: ID_Responsavel }, this.LogDatabase.EstadoLog.SUCESSO).then().catch();
                    resolv(results);
                } else {
                    this.LogDatabase.LogDatabase(ID_Responsavel, "Users.List.SingleID", { ID: ID_Filtro, ID_Responsavel: ID_Responsavel, err: "UUID Invalido" }, this.LogDatabase.EstadoLog.ERRO).then().catch();
                    reject("UUID invalido")
                }
            }).catch(reject)
        })
    }

    /**
     * 
     * @param {Integer} UserID 
     * @param {Integer} Estado Estado do usuário  1=Online, 0=Offline 
     */
    SetOnline(UserID, Estado = 0) {
        return new Promise((resolv, reject) => {
            this._db.Query((Estado == 1 ? Users_SQLs.sql_update_login : Users_SQLs.sql_update_logout), [UserID]).then((results, err) => {
                if (err) {
                    this._events.emit("Log.erros", "Erros encontrados no SetOnline: " + UserID, err);
                    throw "Erros encontrados ao tentar executar Select do SetOnline: " + UserID;
                }
                resolv();
            }).catch(reject)
        })
    }

}