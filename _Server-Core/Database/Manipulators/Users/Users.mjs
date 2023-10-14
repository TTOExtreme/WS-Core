import BCypher from "../../../Utils/BCypher_2.0.mjs";
import ErrorMessages from "../../../Utils/ErrorMessages.mjs";

/**
 * Modulo de gerencia do usuario
 */
export default class User {

    // instancia do conector do banco de dados
    db = null;

    //instancia da collection users
    users = null;

    //instancia de Log
    log = null;

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

    /**
     * Inicializa a instancia do Usuario
     * @param {Class} WSCore instancia do WSCore
     * @description Usado para cada conexão com o banco pelo usuario
     */
    constructor(WSCore) {
        if (WSCore._db == null) {
            throw "Banco de dados não conectado";
        }
        this.db = WSCore._db;
        this.log = WSCore._log;

        //inicializa a collection
        this.users = this.db.collection('_Users');
    }

    /**
     * Realiza o login usando usuario e senha
     * @param {String} username 
     * @param {HASH} password 
     * @returns {JSON} Dados do Usuário
     */
    LogIn(username, password) {
        return new Promise((res, rej) => {
            //realiza a pesquisa usando o nome, retornando o salt e UUID para hash da senha
            this.users.findOne({ username: username }, { salt: 1, UUID: 1 })
                .then(resultsalt => {
                    if (resultsalt.UUID != undefined) {
                        const npass = new BCypher().SHA2(resultsalt.UUID + password + resultsalt.salt);
                        // realiza a segunda pesquisa com o hash da senha
                        this.users.findOne({ username: username, password: npass }, { projection: { password: 0, salt: 0 } })
                            .then(result => {
                                if (result.UUID != undefined) {
                                    this.myself = result;
                                    this._clearUserInstance();
                                    res(this.myself);
                                } else {
                                    rej(ErrorMessages.user_not_found);
                                }
                            })
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
}