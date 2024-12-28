import DatabaseStructure from "../../../_Server-Core/Database/Manipulators/DatabaseStructure.mjs";
import LogAudit from "../../../_Server-Core/Database/Manipulators/LogAudit/LogAudit.mjs";
import Permissoes from "./Permissoes.js";

export default class ScripterDB extends DatabaseStructure {
    LogDatabase = null;

    /**
     * Chamada para alteração de predefiniçoes da classe mae
     */
    PreinitClass() {
        this._tablename = "Modulo_Scripter"
        this._tablestruct.email = {
            create: " VARCHAR(512)",
            descricao: "Email a ser usado para envio de relatório",
            viewInLog: true
        }
        this._tablestruct.nome = {
            create: " VARCHAR(512)",
            descricao: "Nome visual do Script",
            viewInLog: true
        }
        this._tablestruct.descricao = {
            create: " TEXT",
            descricao: "Descrição do script a ser usado",
            viewInLog: false
        }
        this._tablestruct.pasta = {
            create: " TEXT",
            descricao: "Caminho do diretório a ser utilizado",
            viewInLog: false
        }
        this._tablestruct.preferences = {
            create: " MEDIUMTEXT",
            descricao: "JSON contendo todas as preferencias do Script/Configs",
            viewInLog: true
        }
        this._tablestruct.salvar_log = {
            create: " INT(1) DEFAULT 0",
            descricao: "",
            viewInLog: true
        }
        this._tablestruct.ultima_execução = {
            create: " TIMESTAMP",
            descricao: "Data do ultimo login",
            viewInLog: true
        }
        this._tablestruct.qnt_execucoes = {
            create: " BIGINT",
            descricao: "Quantidade de execuções",
            viewInLog: true
        }
        this._tablestruct.proximo_restart = {
            create: " TIMESTAMP",
            descricao: "Data do proximo restart",
            viewInLog: true
        }
        this._tablestruct.tempo_restart = {
            create: " BIGINT",
            descricao: "Tempo entre restarts",
            viewInLog: true
        }
        this._tablestruct.crontab = {
            create: " TEXT",
            descricao: "Configuração do Cron",
            viewInLog: true
        }

        this._table_permisao = Permissoes.PermissionsList;
        this.LogDatabase = new LogAudit(this._db, this._events);
    }


}
