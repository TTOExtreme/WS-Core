
import DatabaseStructure from "../DatabaseStructure.mjs";


/**
 * Modulo de gerencia do usuario
 */
export default class Group_User extends DatabaseStructure {


    /**
     * Chamada para alteração de predefiniçoes da classe mae
     */
    PreinitClass() {
        this._tablename = "Group_User"
        this._tablestruct.user_id = {
            create: " BIGINT, FOREIGN KEY (user_id) REFERENCES _Users(id)",
            descricao: "",
            viewInLog: true
        }
        this._tablestruct.group_id = {
            create: " BIGINT, FOREIGN KEY (group_id) REFERENCES _Groups(id)",
            descricao: "",
            viewInLog: true
        }
        this._tablestruct.tipo = {
            create: " INT",
            descricao: "Tipo da permissao, 1 Allow, 2 Deny ",
            viewInLog: true
        }
    }
}