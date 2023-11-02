
import DatabaseStructure from "../DatabaseStructure.mjs";

/**
 * Modulo de gerencia do usuario
 */
export default class LogAudit extends DatabaseStructure {


    /**
     * Chamada para alteração de predefiniçoes da classe mae
     */
    PreinitClass() {
        this._tablename = "_Log"


        delete this._tablestruct.ativo;
        delete this._tablestruct.atualizado_em;
        delete this._tablestruct.atualizado_por;
        delete this._tablestruct.excluido;
        delete this._tablestruct.excluido_em;
        delete this._tablestruct.excluido_por;

        this._tablestruct.operacao = {
            create: " VARCHAR(512)",
            descricao: "",
            viewInLog: true
        }
        /**
         * Estados do log
         * - Sucesso
         * - Erro
         * - Info
         */
        this._tablestruct.estado = {
            create: " VARCHAR(512)",
            descricao: "",
            viewInLog: true
        }
        this._tablestruct.data = {
            create: " MEDIUMTEXT",
            descricao: "",
            viewInLog: true
        }
    }

    /**
     * @enum {EstadoLog}
     */
    EstadoLog = {
        SUCESSO: "Sucesso",
        ERRO: "Erro",
        INFO: "Info",
        PREPARO: "Preparo",
        EXECUTADO: "Executado"
    }

    /**
     * 
     * @param {String} IDResponsavel 
     * @param {String} Operação Descrição da operação
     * @param {JSON} data Dados adicionais a operação
     * @param {EstadoLog} Estado_Log Seguindo os estados de log cadastrados
     * @returns 
     */
    LogDatabase(IDResponsavel, Operação, data, Estado_Log = this.EstadoLog.INFO) {
        return new Promise((resolv, reject) => {
            this._db.Query("INSERT INTO _Log (criado_por, operacao, data,estado) VALUES (?,?,?,?);", [IDResponsavel, Operação, JSON.stringify(data), Estado_Log]).then((results, err) => {
                if (err) {
                    this._events.emit("Log.erros", "Erros encontrados no login: " + UUID, err);
                    throw "Erros encontrados ao tentar executar Select do usuário: " + UUID;
                } else {
                    resolv();
                }
            }).catch(reject)
        })
    }
}