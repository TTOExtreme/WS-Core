
import DatabaseStructure from "../DatabaseStructure.mjs";
import LogAudit from "../LogAudit/LogAudit.mjs";
import Users_SQLs from "../Users/Users_SQLs.mjs";
import PermitionsList from "./Permissoes_List.mjs";
import Permissoes_SQLs from "./Permissoes_SQLs.mjs";


/**
 * Modulo de gerencia do usuario
 */
export default class Permissao extends DatabaseStructure {


    /**
     * Chamada para alteração de predefiniçoes da classe mae
     */
    PreinitClass() {
        this._tablename = "_Permissions"
        this._tablestruct.permissao = {
            create: " VARCHAR(128)",
            descricao: "Codigo da permissão",
            viewInLog: true
        }
        this._tablestruct.nome = {
            create: " VARCHAR(512)",
            descricao: "Nome visual da permissão",
            viewInLog: true
        }
        this._tablestruct.descricao = {
            create: " VARCHAR(512)",
            descricao: "Descricao da permissao",
            viewInLog: true
        }


        this._initialValues = PermitionsList.PermissionsList;
    }


    /**
     * Realiza o login usando o UUID
     * @param {UUID} UUID 
     * @returns {Promise} Dados do Usuário
     */
    GetPermissions(UUID) {
        return new Promise((resolv, reject) => {
            const sql_select_username = "SELECT username FROM " + this._tablename + " LEFT JOIN  WHERE UUID = ?;"
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
     * Lista todas as permisões e o estado delas
     * @param {Integer} ID_Responsavel 
     * @param {Integer} IDUser 
     * @returns 
     */
    Permissions_User_List(ID_Responsavel, IDUser) {
        if (this.LogDatabase == null) { this.LogDatabase = new LogAudit(this._db, this._events); }
        return new Promise((resolv, reject) => {
            this._db.Query(Permissoes_SQLs.sql_permissions_list_user, [IDUser, IDUser]).then((results, err) => {
                if (err) {
                    this._events.emit("Log.erros", "Erros encontrados no Permissions_Get_Specific: " + IDUser, err);
                    throw "Erros encontrados ao tentar executar Select do Permissions_Get_Specific: " + IDUser;
                }
                if (results[0] != undefined) {
                    resolv(results);
                } else {
                    reject("UUID invalido")
                }
            }).catch(reject)
        })
    }

}