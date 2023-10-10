import { MongoClient } from 'mongodb';

export default class DatabaseConnector {

    _config = null;
    _db = null;
    _log = null;
    /**
     * Inicializa o connector com o banco de dados
     * @param {Class} WSCore instancia do WSCore
     * @description Usado somente para a instancia principal do sistema, não deve ser reinstanciado por outras classes
     */
    constructor(WSCore) {
        if (WSCore._config == null) {
            WSCore.LoadConfig();
        }
        this._config = WSCore._config.DB;
        this._log = WSCore._log;
    }

    connect() {
        return new Promise((res, rej) => {
            const connection_string = "mongodb://" +
                this._config.username + ":" +
                this._config.password + "@" +
                this._config.host + ":" +
                this._config.port + "/" +
                this._config.dbname;

            this._log.system("Connectando ao banco");
            const client = new MongoClient(connection_string);

            client.connect().finally(() => {
                this._log.system("Connectado ao banco");

                //seta a instancia do banco para o database a ser usado
                this._db = client.db(this._config.dbname);
                res();
            }).catch(err => {
                rej(err);
            })
        })
    }
}