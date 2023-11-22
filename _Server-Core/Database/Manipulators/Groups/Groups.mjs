
import DatabaseStructure from "../DatabaseStructure.mjs";
import LogAudit from "../LogAudit/LogAudit.mjs";
import Users_SQLs from "../Users/Users_SQLs.mjs";
import Groups_SQLs from "./Groups_SQLs.mjs";

/**
 * Modulo de gerencia de grupos
 */
export default class Groups extends DatabaseStructure {


    /**
     * Chamada para alteração de predefiniçoes da classe mae
     */
    PreinitClass() {
        this._tablename = "_Groups"

        this._tablestruct.nome = {
            create: " VARCHAR(512)",
            descricao: "Nome do Grupo",
            viewInLog: true
        }
        this._tablestruct.code = {
            create: " VARCHAR(512)",
            descricao: "Codigo do Grupo, usado para referencia visual",
            viewInLog: true
        }
        this._tablestruct.descricao = {
            create: " VARCHAR(512)",
            descricao: "Descricao do Grupo",
            viewInLog: true
        }
    }

    /**
     * Cria um usuario para acesso ao sistema
     * @param {String} groupname Nome do Grupo 
     * @param {string} [responsavel=""] Nome do Usuário que esta criando o Grupo
     * @param {string} [code=""] Codigo do grupo
     * @param {string} [descricao=""] Descrição do Grupo
     * @param {Boolean} [ativo=true] Estado do grupo 
     * @returns {Promise}
     */
    Groups_Add_Username(groupname = "", code = "", descricao = "", responsavel = "", ativo = true) {
        if (this.LogDatabase == null) { this.LogDatabase = new LogAudit(this._db, this._events); }
        return new Promise((resolv, reject) => {
            this._db.Query(Groups_SQLs.sql_get_userid, [responsavel]).then((responsavel_results, err) => {
                if (err) {
                    this._events.emit("Log.erros", "Erros encontrados no Group_Add: " + groupname, err);
                    throw "Erros encontrados ao tentar executar Insert do Group_Add: " + groupname;
                }
                if (responsavel_results[0] != undefined) {
                    this._db.Query(Groups_SQLs.sql_group_add, [groupname, code, descricao, responsavel_results[0][0].id, (ativo ? 1 : 0)]).then((addreturn, err) => {
                        if (err) {
                            this._events.emit("Log.erros", "Erros encontrados no Group_Add: " + Permissao, err);
                            throw "Erros encontrados ao tentar executar Insert do Group_Add: " + Permissao;
                        }
                        resolv();
                    }).catch(reject)
                } else {
                    reject("UUID invalido")
                }
            }).catch(reject)
        })
    }

    /**
     * Cria um usuario para acesso ao sistema
     * @param {Integer} ID_Responsavel 
     * @param {String} groupname Nome do Grupo 
     * @param {string} [code=""] Codigo do grupo
     * @param {string} [descricao=""] Descrição do Grupo
     * @param {Integer} [ativo=1] Estado do grupo 
     * @returns {Promise}
     */
    Groups_Add(ID_Responsavel, groupname = "", code = "", descricao = "", ativo = 1) {
        if (this.LogDatabase == null) { this.LogDatabase = new LogAudit(this._db, this._events); }
        return new Promise((resolv, reject) => {
            this._db.Query(Groups_SQLs.sql_group_add, [groupname, code, descricao, ID_Responsavel, ativo]).then((addreturn, err) => {
                if (err) {
                    this.LogDatabase.LogDatabase(ID_Responsavel, "Group.Add", { ID_Responsavel: ID_Responsavel, groupname: groupname, code: code, descricao: descricao, ativo: ativo, err: err }, this.LogDatabase.EstadoLog.ERRO).then().catch();
                    this._events.emit("Log.erros", "Erros encontrados no Group_Add: ", err);
                    throw "Erros encontrados ao tentar executar Insert do Group_Add: ";
                }
                this.LogDatabase.LogDatabase(ID_Responsavel, "Group.Add", { ID_Responsavel: ID_Responsavel, groupname: groupname, code: code, descricao: descricao, ativo: ativo }, this.LogDatabase.EstadoLog.SUCESSO).then().catch();
                resolv();
            }).catch(reject)
        })
    }

    /**
     * Altera os dados do grupo
     * @param {Integer} ID_Responsavel 
     * @param {Integer} ID_Grupo 
     * @param {String} groupname 
     * @param {String} code 
     * @param {String} descricao 
     * @param {Integer} ativo 
     * @returns 
     */
    Groups_Edit(ID_Responsavel, ID_Grupo, groupname = "", code = "", descricao = "", ativo = 1) {
        if (this.LogDatabase == null) { this.LogDatabase = new LogAudit(this._db, this._events); }
        return new Promise((resolv, reject) => {
            this._db.Query(Groups_SQLs.sql_group_edit, [ID_Responsavel, groupname, code, descricao, ativo, ID_Grupo]).then((addreturn, err) => {
                if (err) {
                    this.LogDatabase.LogDatabase(ID_Responsavel, "Group.Edit", { ID_Responsavel: ID_Responsavel, group_id: ID_Grupo, groupname: groupname, code: code, descricao: descricao, ativo: ativo, err: err }, this.LogDatabase.EstadoLog.ERRO).then().catch();
                    this._events.emit("Log.erros", "Erros encontrados no Groups_Edit: ", err);
                    throw "Erros encontrados ao tentar executar Insert do Groups_Edit: ";
                }
                this.LogDatabase.LogDatabase(ID_Responsavel, "Group.Edit", { ID_Responsavel: ID_Responsavel, group_id: ID_Grupo, groupname: groupname, code: code, descricao: descricao, ativo: ativo }, this.LogDatabase.EstadoLog.SUCESSO).then().catch();
                resolv();
            }).catch(reject)
        })
    }

    /**
     * Altera os dados do grupo
     * @param {Integer} ID_Responsavel 
     * @param {Integer} ID_Grupo 
     * @param {String} groupname 
     * @param {String} code 
     * @param {String} descricao 
     * @param {Integer} ativo 
     * @returns 
     */
    Groups_Disable(ID_Responsavel, ID_Grupo, ativo = 1) {
        if (this.LogDatabase == null) { this.LogDatabase = new LogAudit(this._db, this._events); }
        return new Promise((resolv, reject) => {
            this._db.Query(Groups_SQLs.sql_group_disable, [ID_Responsavel, ativo, ID_Grupo]).then((addreturn, err) => {
                if (err) {
                    this.LogDatabase.LogDatabase(ID_Responsavel, "Group.Disable", { ID_Responsavel: ID_Responsavel, group_id: ID_Grupo, ativo: ativo, err: err }, this.LogDatabase.EstadoLog.ERRO).then().catch();
                    this._events.emit("Log.erros", "Erros encontrados no Groups_Disable: ", err);
                    throw "Erros encontrados ao tentar executar Insert do Groups_Disable: ";
                }
                this.LogDatabase.LogDatabase(ID_Responsavel, "Group.Disable", { ID_Responsavel: ID_Responsavel, group_id: ID_Grupo, ativo: ativo }, this.LogDatabase.EstadoLog.SUCESSO).then().catch();
                resolv();
            }).catch(reject)
        })
    }

    /**
     * Altera os dados do grupo
     * @param {Integer} ID_Responsavel 
     * @param {Integer} ID_Grupo 
     * @returns 
     */
    Groups_Delete(ID_Responsavel, ID_Grupo) {
        if (this.LogDatabase == null) { this.LogDatabase = new LogAudit(this._db, this._events); }
        return new Promise((resolv, reject) => {
            this._db.Query(Groups_SQLs.sql_group_delete, [ID_Responsavel, 1, ID_Grupo]).then((addreturn, err) => {
                if (err) {
                    this.LogDatabase.LogDatabase(ID_Responsavel, "Group.Delete", { ID_Responsavel: ID_Responsavel, group_id: ID_Grupo, err: err }, this.LogDatabase.EstadoLog.ERRO).then().catch();
                    this._events.emit("Log.erros", "Erros encontrados no Groups_Delete: ", err);
                    throw "Erros encontrados ao tentar executar Insert do Groups_Delete: ";
                }
                this.LogDatabase.LogDatabase(ID_Responsavel, "Group.Delete", { ID_Responsavel: ID_Responsavel, group_id: ID_Grupo }, this.LogDatabase.EstadoLog.SUCESSO).then().catch();
                resolv();
            }).catch(reject)
        })
    }

    /**
     * Cria um usuario para acesso ao sistema
     * @param {String} groupcode Nome do Grupo 
     * @param {string} [username=""] Nome do Usuário que esta criando o Grupo
     * @param {string} [responsavel=""] Nome do Usuário responsavel pela solicitação
     * @param {Boolean} [ativo=true] Estado do grupo 
     * @returns {Promise}
     */
    Group_Add_User_Username(groupcode = "", username = "", responsavel = "", ativo = true) {
        if (this.LogDatabase == null) { this.LogDatabase = new LogAudit(this._db, this._events); }
        return new Promise((resolv, reject) => {
            this._db.Query(Groups_SQLs.sql_get_userid, [username]).then((user_results, err) => {
                if (err) {
                    this._events.emit("Log.erros", "Erros encontrados no Group_Add: " + groupcode, err);
                    throw "Erros encontrados ao tentar executar Insert do Group_Add: " + groupcode;
                }
                if (user_results[0] != undefined) {
                    this._db.Query(Groups_SQLs.sql_get_userid, [responsavel]).then((responsavel_results, err) => {
                        if (err) {
                            this._events.emit("Log.erros", "Erros encontrados no Group_Add: " + groupcode, err);
                            throw "Erros encontrados ao tentar executar Insert do Group_Add: " + groupcode;
                        }
                        if (responsavel_results[0] != undefined) {
                            this._db.Query(Groups_SQLs.sql_get_groupid, [groupcode]).then((group_results, err) => {
                                if (err) {
                                    this._events.emit("Log.erros", "Erros encontrados no Group_Add: " + groupcode, err);
                                    throw "Erros encontrados ao tentar executar Insert do Group_Add: " + groupcode;
                                }
                                if (group_results[0] != undefined) {
                                    this._db.Query(Groups_SQLs.sql_group_add_user_Username, [group_results[0][0].id, user_results[0][0].id, responsavel_results[0][0].id, (ativo ? 1 : 0)]).then((addreturn, err) => {
                                        if (err) {
                                            this.LogDatabase.LogDatabase(0, "Group.User.Add", { ID_Responsavel: 0, group_id: group_results[0][0].id, user_id: user_results[0][0].id, err: err }, this.LogDatabase.EstadoLog.ERRO).then().catch();
                                            this._events.emit("Log.erros", "Erros encontrados no Group_Add: " + groupcode, err);
                                            throw "Erros encontrados ao tentar executar Insert do Group_Add: " + groupcode;
                                        }
                                        this.LogDatabase.LogDatabase(0, "Group.User.Add", { ID_Responsavel: 0, group_id: group_results[0][0].id, user_id: user_results[0][0].id }, this.LogDatabase.EstadoLog.SUCESSO).then().catch();
                                        resolv();
                                    }).catch(reject)
                                } else {
                                    reject("UUID invalido")
                                }
                            }).catch(reject)
                        } else {
                            reject("UUID invalido")
                        }
                    }).catch(reject)
                } else {
                    reject("UUID invalido")
                }
            }).catch(reject)
        })
    }

    /**
     * Lista todos os Grupos
     * @param {Integer} ID_Responsavel 
     * @param {Integer} IDUser 
     * @returns 
     */
    Groups_List(ID_Responsavel) {
        if (this.LogDatabase == null) { this.LogDatabase = new LogAudit(this._db, this._events); }
        return new Promise((resolv, reject) => {
            this._db.Query(Groups_SQLs.sql_list_group).then((results, err) => {
                if (err) {
                    this.LogDatabase.LogDatabase(ID_Responsavel, "Group.List", { ID_Responsavel: ID_Responsavel, err: err }, this.LogDatabase.EstadoLog.ERRO).then().catch();
                    this._events.emit("Log.erros", "Erros encontrados no Groups_List: " + IDUser, err);
                    throw "Erros encontrados ao tentar executar Select do Groups_List: " + IDUser;
                }
                if (results[0] != undefined) {
                    this.LogDatabase.LogDatabase(ID_Responsavel, "Group.List", { ID_Responsavel: ID_Responsavel }, this.LogDatabase.EstadoLog.SUCESSO).then().catch();
                    resolv(results);
                } else {
                    reject("Lista de Grupos Vazia")
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
     * Realiza a adição das permissões ao grupo e ao usuário
     * @returns {Promise}
     */
    _Pos_CreateData() {
        return new Promise((resolv, reject) => {
            this.Groups_Add_Username("Adiministradores", "1.0.0.0", "Grupo de Administradores do Sistema, esse grupo sempre tera todas as permissões associadas", "Admin", true).then(() => {
                this._events.emit("Log.system", "Adicionado Grupo Administradores ");
                this.Group_Add_User_Username("1.0.0.0", "Admin", "Admin", true).then(() => {
                    this._events.emit("Log.system", "Adicionado Admin ao Grupo Administradores ");
                    resolv();
                });
            });
        });
    }
}