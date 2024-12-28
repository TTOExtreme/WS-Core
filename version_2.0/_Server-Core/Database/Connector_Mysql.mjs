import mysqlPromise from "mysql2/promise.js";

export default class DatabaseConnector {

    _config = null;
    _db = null;
    _log = null;
    /**
     * Inicializa o connector com o banco de dados
     * @param {JSON} config Configurações do banco de dados
     * @description Usado somente para a instancia principal do sistema, não deve ser reinstanciado por outras classes
     */
    constructor(config, events) {
        this._config = config;
        this._events = events;
    }

    /**
     * Realiza a conexão com a base de dados
     * 
     */
    Connect() {
        return new Promise((resolv, reject) => {
            if (this._config == null) { reject("Config do banco de dados nao carregado"); return; }
            if (this._db == null) {
                this._events.emit("Log.system", "Connectando ao banco");
                mysqlPromise.createConnection(this._config).then(client => {
                    this._db = client;
                    this._db.connect().finally(() => {
                        this._events.emit("Log.system", "Connectado ao banco");
                        resolv();
                    }).catch(err => {
                        reject(err);
                    })
                });
            } else {
                resolv();
            }
        })
    }

    /**
     * Realiza a Query e retorna em formato ou de stream ou array
     * @param {String} sql 
     * @param {Array} [escapeArray=[]]
     * @param {boolean} [disable_autoescape=false] 
     * @returns 
     */
    Query(sql = "", escapeArray = [], disable_autoescape = false) {
        if (!disable_autoescape && escapeArray.length > 0) {
            escapeArray.forEach(eitem => {
                eitem = this.Escape(eitem);
            });
        }
        return new Promise((resolv, reject) => {
            if (sql == "") { resolv(); return; }
            this.Connect().then(() => {
                resolv(this._db.query(sql, escapeArray))
            }).catch(err => {
                console.error(err);
                reject(err);
            })
        })
    }


    /**
     * Realiza a Limpeza para evitar SQL Injection
     * @param {any} value 
     * @returns {String}
     */
    Escape(value) {
        return mysqlPromise.escape(value);
    }
}
