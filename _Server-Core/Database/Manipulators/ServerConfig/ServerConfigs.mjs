import DatabaseStructure from "../DatabaseStructure.mjs";


/**
 * Tabela responsavel por diversas configuracoes do servidor
 */
export default class ServerConfigs extends DatabaseStructure {

    /**
     * Chamada para alteração de predefiniçoes da classe mae
     */
    PreinitClass() {
        this._tablename = "_Server_Configs"
        this._tablestruct.config_name = {
            create: " VARCHAR(512)",
            descricao: "Couna Referente ao nome/caminho da configuração",
            viewInLog: true
        }
        this._tablestruct.config_value = {
            create: " TEXT",
            descricao: "Couna Referente ao valor da configuração",
            viewInLog: true
        }
    }
} 