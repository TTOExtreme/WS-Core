
import DatabaseStructure from "../DatabaseStructure.mjs";
import LogAudit from "../LogAudit/LogAudit.mjs";
import Permissoes_List from "./Permissoes_List.mjs";
import Permissoes_SQLs from "./Permissoes_SQLs.mjs";

/**
 * Modulo de gerencia do usuario
 */
export default class Permissao_User extends DatabaseStructure {


    /**
     * Chamada para alteração de predefiniçoes da classe mae
     */
    PreinitClass() {
        this._tablename = "Permissao_User"
        this._tablestruct.permissao_id = {
            create: " BIGINT , FOREIGN KEY (permissao_id) REFERENCES _Permissions(id)",
            descricao: "",
            viewInLog: true
        }
        this._tablestruct.user_id = {
            create: " BIGINT , FOREIGN KEY (user_id) REFERENCES _Users(id)",
            descricao: "",
            viewInLog: true
        }
        this._tablestruct.tipo = {
            create: " INT",
            descricao: "Tipo da permissao, 1 Allow, 2 Deny ",
            viewInLog: true
        }
    }

    /**
     * Realiza a adição da permissão ao Usuário
     * @param {String} Permissao Permissao a ser adicionada
     * @param {String} username Usuário a ser adicionado a permissão
     * @param {Boolean} [ativo=true] Se essa permisao do usuario esta ativa no registro 
     * @param {Boolean} [tipo=true] Se esse tipo de permissao é 1,Allow  ou 2,Deny
     */
    Add_Perm_Username(Permissao, username, ativo = true, tipo = true) {
        if (this.LogDatabase == null) { this.LogDatabase = new LogAudit(this._db, this._events); }
        return new Promise((resolv, reject) => {
            this._db.Query(Permissoes_SQLs.sql_get_userid, [username]).then((user_results, err) => {
                if (err) {
                    this._events.emit("Log.erros", "Erros encontrados no Add_Perm_Username: " + Permissao, err);
                    throw "Erros encontrados ao tentar executar Select do Add_Perm_Username: " + Permissao;
                }
                if (user_results[0] != undefined) {
                    if (user_results[0][0] != undefined) {
                        this._db.Query(Permissoes_SQLs.sql_get_permissionid, [Permissao]).then((perm_results, err) => {
                            if (err) {
                                this._events.emit("Log.erros", "Erros encontrados no Add_Perm_Username: " + Permissao, err);
                                throw "Erros encontrados ao tentar executar Select do Add_Perm_Username: " + Permissao;
                            }
                            if (perm_results[0] != undefined) {
                                if (perm_results[0] != undefined) {
                                    this.LogDatabase.LogDatabase(0, "Perm.Username.Add", { ID_Responsavel: 0, user_id: user_results[0][0].id, permissao_id: perm_results[0][0].id, ativo: (ativo ? 1 : 0), tipo: (tipo ? 1 : 0) }, this.LogDatabase.EstadoLog.SUCESSO).then().catch();
                                    this._db.Query(Permissoes_SQLs.sql_permissions_add_user, [1, user_results[0][0].id, perm_results[0][0].id, (ativo ? 1 : 0), (tipo ? 1 : 0)]).then((add_results, err) => {
                                        if (err) {
                                            this._events.emit("Log.erros", "Erros encontrados no Add_Perm_Username: " + Permissao, err);
                                            throw "Erros encontrados ao tentar executar Select do Add_Perm_Username: " + Permissao;
                                        } else
                                            resolv();
                                    }).catch(reject)
                                } else {
                                    reject("Permissao invalida")
                                }
                            } else {
                                reject("Permissao invalida")
                            }
                        }).catch(reject)
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
     * Realiza a adição da permissão ao Usuário
     * @param {Integer} ID_Responsavel 
     * @param {Integer} PermissaoID Permissao a ser adicionada
     * @param {Integer} UserID Usuário a ser adicionado a permissão
     * @param {Integer} ativoSe essa permisao do usuario esta ativa no registro 
     * @param {Integer} tipo Se esse tipo de permissao é 1,Allow  ou 2,Deny
     */
    Add_Perm_User(ID_Responsavel, PermissaoID, UserID, ativo = 1, tipo = 1) {
        if (this.LogDatabase == null) { this.LogDatabase = new LogAudit(this._db, this._events); }
        return new Promise((resolv, reject) => {
            this._db.Query(Permissoes_SQLs.sql_permissions_add_user, [ID_Responsavel, UserID, PermissaoID, ativo, tipo]).then((add_results, err) => {
                if (err) {
                    this.LogDatabase.LogDatabase(ID_Responsavel, "Perm.User.Add", { ID_Responsavel: ID_Responsavel, user_id: UserID, permissao_id: PermissaoID, ativo: ativo, tipo: tipo, err: err }, this.LogDatabase.EstadoLog.ERRO).then().catch();
                    this._events.emit("Log.erros", "Erros encontrados no Add_Perm_User: " + PermissaoID, err);
                    throw "Erros encontrados ao tentar executar Select do Add_Perm_User: " + PermissaoID;
                } else {
                    this.LogDatabase.LogDatabase(ID_Responsavel, "Perm.User.Add", { ID_Responsavel: ID_Responsavel, user_id: UserID, permissao_id: PermissaoID, ativo: ativo, tipo: tipo }, this.LogDatabase.EstadoLog.SUCESSO).then().catch();
                    resolv();
                }
            }).catch(reject)
        })
    }

    /**
     * Realiza a adição da permissão ao Usuário
     * @param {Integer} ID_Responsavel 
     * @param {Integer} PermissaoID Permissao a ser adicionada
     * @param {Integer} UserID Usuário a ser adicionado a permissão
     * @param {Integer} ativoSe essa permisao do usuario esta ativa no registro 
     * @param {Integer} tipo Se esse tipo de permissao é 1,Allow  ou 2,Deny
     */
    Edit_Perm_User(ID_Responsavel, PermissaoID, UserID, ativo = 1, tipo = 1) {
        if (this.LogDatabase == null) { this.LogDatabase = new LogAudit(this._db, this._events); }
        return new Promise((resolv, reject) => {
            this._db.Query(Permissoes_SQLs.sql_permissions_edit_user, [ID_Responsavel, ativo, tipo, UserID, PermissaoID]).then((add_results, err) => {
                if (err) {
                    this.LogDatabase.LogDatabase(ID_Responsavel, "Perm.User.Edit", { ID_Responsavel: ID_Responsavel, user_id: UserID, permissao_id: PermissaoID, ativo: ativo, tipo: tipo, err: err }, this.LogDatabase.EstadoLog.ERRO).then().catch();
                    this._events.emit("Log.erros", "Erros encontrados no Edit_Perm_User: " + PermissaoID, err);
                    throw "Erros encontrados ao tentar executar Select do Edit_Perm_User: " + PermissaoID;
                } else {
                    this.LogDatabase.LogDatabase(ID_Responsavel, "Perm.User.Edit", { ID_Responsavel: ID_Responsavel, user_id: UserID, permissao_id: PermissaoID, ativo: ativo, tipo: tipo }, this.LogDatabase.EstadoLog.SUCESSO).then().catch();
                    resolv();
                }
            }).catch(reject)
        })
    }

    /**
     * Realiza a adição da permissão ao Usuário
     * @param {Integer} ID_Responsavel 
     * @param {Integer} PermissaoID Permissao a ser adicionada
     * @param {Integer} UserID Usuário a ser adicionado a permissão
     * @param {Integer} ativoSe essa permisao do usuario esta ativa no registro 
     * @param {Integer} tipo Se esse tipo de permissao é 1,Allow  ou 2,Deny
     */
    Delete_Perm_User(ID_Responsavel, PermissaoID, UserID, excluido = 1) {
        if (this.LogDatabase == null) { this.LogDatabase = new LogAudit(this._db, this._events); }
        return new Promise((resolv, reject) => {
            this._db.Query(Permissoes_SQLs.sql_permissions_delete_user, [ID_Responsavel, 1, UserID, PermissaoID]).then((add_results, err) => {
                if (err) {
                    this.LogDatabase.LogDatabase(ID_Responsavel, "Perm.User.Delete", { ID_Responsavel: ID_Responsavel, user_id: UserID, permissao_id: PermissaoID, excluido: excluido, err: err }, this.LogDatabase.EstadoLog.ERRO).then().catch();
                    this._events.emit("Log.erros", "Erros encontrados no Delete_Perm_User: " + PermissaoID, err);
                    throw "Erros encontrados ao tentar executar Select do Delete_Perm_User: " + PermissaoID;
                } else {
                    this.LogDatabase.LogDatabase(ID_Responsavel, "Perm.User.Edit", { ID_Responsavel: ID_Responsavel, user_id: UserID, permissao_id: PermissaoID, excluido: excluido }, this.LogDatabase.EstadoLog.SUCESSO).then().catch();
                    resolv();
                }
            }).catch(reject)
        })
    }

    /**
     * Realiza a Inativação/Ativação da permissão ao Usuário
     * @param {Integer} ID_Responsavel 
     * @param {Integer} PermissaoID Permissao a ser adicionada
     * @param {Integer} UserID Usuário a ser adicionado a permissão
     * @param {Integer} ativoSe essa permisao do usuario esta ativa no registro 
     * @param {Integer} tipo Se esse tipo de permissao é 1,Allow  ou 2,Deny
     */
    Active_Perm_User(ID_Responsavel, PermissaoID, UserID, ativo = 1) {
        if (this.LogDatabase == null) { this.LogDatabase = new LogAudit(this._db, this._events); }
        return new Promise((resolv, reject) => {
            this._db.Query(Permissoes_SQLs.sql_permissions_active_user, [ID_Responsavel, ativo, UserID, PermissaoID]).then((add_results, err) => {
                if (err) {
                    this.LogDatabase.LogDatabase(ID_Responsavel, "Perm.User.Active", { ID_Responsavel: ID_Responsavel, user_id: UserID, permissao_id: PermissaoID, ativo: ativo, err: err }, this.LogDatabase.EstadoLog.ERRO).then().catch();
                    this._events.emit("Log.erros", "Erros encontrados no Active_Perm_User: " + PermissaoID, err);
                    throw "Erros encontrados ao tentar executar Select do Active_Perm_User: " + PermissaoID;
                } else {
                    this.LogDatabase.LogDatabase(ID_Responsavel, "Perm.User.Edit", { ID_Responsavel: ID_Responsavel, user_id: UserID, permissao_id: PermissaoID, ativo: ativo }, this.LogDatabase.EstadoLog.SUCESSO).then().catch();
                    resolv();
                }
            }).catch(reject)
        })
    }

    /**
     * Realiza a adição da permissão ao Usuário
     * @param {Integer} ID_Responsavel 
     * @param {Integer} UserID Usuário a ser adicionado a permissão
     */
    List_Perm_User(ID_Responsavel, UserID) {
        if (this.LogDatabase == null) { this.LogDatabase = new LogAudit(this._db, this._events); }
        return new Promise((resolv, reject) => {
            this._db.Query(Permissoes_SQLs.sql_permissions_list_user, [UserID]).then((add_results, err) => {
                if (err) {
                    this.LogDatabase.LogDatabase(ID_Responsavel, "Perm.User.Add", { ID_Responsavel: ID_Responsavel, user_id: UserID, permissao_id: PermissaoID, ativo: ativo, tipo: tipo, err: err }, this.LogDatabase.EstadoLog.ERRO).then().catch();
                    this._events.emit("Log.erros", "Erros encontrados no Add_Perm_User: " + PermissaoID, err);
                    throw "Erros encontrados ao tentar executar Select do Add_Perm_User: " + PermissaoID;
                } else {
                    this.LogDatabase.LogDatabase(ID_Responsavel, "Perm.User.Add", { ID_Responsavel: ID_Responsavel, user_id: UserID, permissao_id: PermissaoID, ativo: ativo, tipo: tipo }, this.LogDatabase.EstadoLog.SUCESSO).then().catch();
                    resolv();
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
            let listprom = []
            Permissoes_List.PermissionsList.forEach((perm) => {
                this._events.emit("Log.system", "Adicionando Permissao ao Admin: ", perm.permissao);
                listprom.push(this.Add_Perm_Username(perm.permissao, "Admin", true, true));
            })
            Promise.all(listprom).finally(() => {
                resolv();
            })
        });
    }
}
