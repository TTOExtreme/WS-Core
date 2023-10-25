
import DatabaseStructure from "../DatabaseStructure.mjs";
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
    Permissao_Add_User(Permissao, username, ativo = true, tipo = true) {
        return new Promise((resolv, reject) => {
            this._db.Query(Permissoes_SQLs.sql_get_userid, [username]).then((user_results, err) => {
                if (err) {
                    this._events.emit("Log.erros", "Erros encontrados no Permissao_Add_User: " + Permissao, err);
                    throw "Erros encontrados ao tentar executar Select do Permissao_Add_User: " + Permissao;
                }
                if (user_results != undefined) {
                    if (user_results[0] != undefined) {
                        this._db.Query(Permissoes_SQLs.sql_get_permissionid, [Permissao]).then((perm_results, err) => {
                            if (err) {
                                this._events.emit("Log.erros", "Erros encontrados no Permissao_Add_User: " + Permissao, err);
                                throw "Erros encontrados ao tentar executar Select do Permissao_Add_User: " + Permissao;
                            }
                            if (perm_results != undefined) {
                                if (perm_results[0] != undefined) {
                                    this._db.Query(Permissoes_SQLs.sql_permissions_add_user, [user_results[0][0].id, perm_results[0][0].id, (ativo ? 1 : 0), (tipo ? 1 : 0)]).then((add_results, err) => {
                                        if (err) {
                                            this._events.emit("Log.erros", "Erros encontrados no Permissao_Add_User: " + Permissao, err);
                                            throw "Erros encontrados ao tentar executar Select do Permissao_Add_User: " + Permissao;
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
     * Realiza a adição das permissões ao grupo e ao usuário
     * @returns {Promise}
     */
    _Pos_CreateData() {
        return new Promise((resolv, reject) => {
            let listprom = []
            Permissoes_List.PermissionsList.forEach((perm) => {
                this._events.emit("Log.system", "Adicionando Permissao ao Admin: ", perm.permissao);
                listprom.push(this.Permissao_Add_User(perm.permissao, "Admin", true, true));
            })
            Promise.all(listprom).finally(() => {
                resolv();
            })
        });
    }
}
