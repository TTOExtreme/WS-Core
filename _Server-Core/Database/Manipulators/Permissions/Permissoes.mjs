
import DatabaseStructure from "../DatabaseStructure.mjs";
import PermitionsList from "./Permissoes_List.mjs";


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

}