import DatabaseStructure from "../../../_Server-Core/Database/Manipulators/DatabaseStructure.mjs";
import LogAudit from "../../../_Server-Core/Database/Manipulators/LogAudit/LogAudit.mjs";
import Permissoes from "./Permissoes.js";

export default class BackupperTipos extends DatabaseStructure {
    LogDatabase = null;

    /**
     * Chamada para alteração de predefiniçoes da classe mae
     */
    PreinitClass() {
        this._tablename = "Modulo_Backupper_Tipos"
        this._tablestruct.nome = {
            create: " VARCHAR(512)",
            descricao: "Nome visual do Backup",
            viewInLog: true
        }
        this._tablestruct.descricao = {
            create: " TEXT",
            descricao: "Descrição do Backup a ser usado",
            viewInLog: false
        }
        this._tablestruct.callscript = {
            create: " TEXT",
            descricao: "Call do script para Execução",
            viewInLog: false
        }
        this._tablestruct.preferences = {
            create: " MEDIUMTEXT",
            descricao: "JSON contendo todas as preferencias do Backup/Configs",
            viewInLog: true
        }


        this._table_permisao = Permissoes.PermissionsList;
        this.LogDatabase = new LogAudit(this._db, this._events);
    }

    /**
     * Calls de inicialização de modulos
     * realizar o cadastro de eventos do modulo nesse estagio
     * @param {Socket} socket_connection 
     * @param {JSOn} client_instance 
     * @param {SocketServe} SocketServe 
     */
    InitModuleEvents(socket_connection, client_instance, SocketServe) {
        this._events.emit("Log.info", "Inicializando Socket Modulo_Backupper_Tipos");
    }
}
