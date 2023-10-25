
import DatabaseStructure from "../DatabaseStructure.mjs";
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
    Group_Add(groupname = "", code = "", descricao = "", responsavel = "", ativo = true) {
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
     * @param {String} groupcode Nome do Grupo 
     * @param {string} [username=""] Nome do Usuário que esta criando o Grupo
     * @param {string} [responsavel=""] Nome do Usuário responsavel pela solicitação
     * @param {Boolean} [ativo=true] Estado do grupo 
     * @returns {Promise}
     */
    Group_Add_User(groupcode = "", username = "", responsavel = "", ativo = true) {
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
                                    this._db.Query(Groups_SQLs.sql_group_add_user, [group_results[0][0].id, user_results[0][0].id, responsavel_results[0][0].id, (ativo ? 1 : 0)]).then((addreturn, err) => {
                                        if (err) {
                                            this._events.emit("Log.erros", "Erros encontrados no Group_Add: " + groupcode, err);
                                            throw "Erros encontrados ao tentar executar Insert do Group_Add: " + groupcode;
                                        }
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
     * Realiza a adição das permissões ao grupo e ao usuário
     * @returns {Promise}
     */
    _Pos_CreateData() {
        return new Promise((resolv, reject) => {
            this.Group_Add("Adiministradores", "1.0.0.0", "Grupo de Administradores do Sistema, esse grupo sempre tera todas as permissões associadas", "Admin", true).then(() => {
                this._events.emit("Log.system", "Adicionado Grupo Administradores ");
                this.Group_Add_User("1.0.0.0", "Admin", "Admin", true).then(() => {
                    this._events.emit("Log.system", "Adicionado Admin ao Grupo Administradores ");
                    resolv();
                });
            });
        });
    }
}