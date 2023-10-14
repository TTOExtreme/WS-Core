import EventEmitter from 'events';


export default class DatabaseStructure {

    /**
     * Nome da Tabela
     */
    _tablename = "zzz_default_table";

    /**
     * Estrutura da tabela de exemplo
     */
    _tablestruct = {
        id: {
            create: " BIGINT PRIMARY KEY AUTO_INCREMENT",
            descricao: "Couna Referente ao ID de registro",
            viewInLog: true
        },
        criado_em: {
            create: " TIMESTAMP DEFAULT CURRENT_TIMESTAMP()",
            descricao: "Couna Referente a data/hora da criação do registro",
            viewInLog: true
        },
        criado_por: {
            create: " BIGINT",
            descricao: "Couna Referente ao responsavel pela criação do registro",
            viewInLog: true
        },
        atualizado_em: {
            create: " TIMESTAMP DEFAULT CURRENT_TIMESTAMP()",
            descricao: "Couna Referente a data/hora da edição do registro",
            viewInLog: true
        },
        atualizado_por: {
            create: " BIGINT",
            descricao: "Couna Referente ao responsavel pela edição do registro",
            viewInLog: true
        },
        excluido_em: {
            create: " TIMESTAMP DEFAULT NULL",
            descricao: "Couna Referente a data/hora da exclusao do registro",
            viewInLog: true
        },
        excluido_por: {
            create: " BIGINT",
            descricao: "Couna Referente ao responsavel pela exclusao do registro",
            viewInLog: true
        },
        excluido: {
            create: " INT(1)",
            descricao: "Couna Referente ao estado do registro, se esta excluido ou nao, quando excluido o mesmo nao estara mais visivel pelo sistema",
            viewInLog: true
        },
        ativo: {
            create: " INT(1)",
            descricao: "Couna Referente ao estado do registro, se esta ativo ou nao",
            viewInLog: true
        },
    }

    /**
     * Valores iniciais da tabela estruturado em formato JSON {<nomecoluna>:<valor>}
     */
    _initialValues = [];

    /**
     * Inicialização da base da estrutura do banco de dados
     * @param {mysqlPromise.Connection} db 
     * @param {EventEmitter} events 
     */
    constructor(db, events) {
        this._db = db;
        this._events = events;
        this.PreinitClass();
    }

    /**
     * Execução de codigos para edição de dados padroes da superclasse
     */
    PreinitClass() {
    }

    /**
     * Checa a existencia da tabela referente e retorna um promisse contendo a resposta
     * essa função somente sera chamada a nivel server, nao estara dentro da lista de eventos globais
     */
    _tableExists() {
        return new Promise((resolv, reject) => {
            this._db.Query("SHOW TABLES LIKE '" + this._tablename + "';").then((results, err) => {
                if (err) {
                    this._events.emit("Log.erros", "Erros encontrados na Verificação de existencia da tabela: " + this._tablename, err);
                    throw "Erros encontrados na Verificação de existencia da tabela: " + this._tablename;
                }
                //console.log(results)
                if (results[0] != undefined)

                    resolv(results[0].length > 0);
            }).catch(reject)
        })
    }

    /**
     * Realiza a construção da tabela no banco
     * A MESMA REALIZA UM DROP ANTES DE CONSTRUIR
     */
    _createTable() {
        return new Promise((resolv, reject) => {
            this._tableExists().then(itexistis => {
                this._db.Query(itexistis ? ("DROP TABLE " + this._tablename + ";") : "").then((results, err) => {
                    //console.log(err)
                    if (err) {
                        if (err.indexOf("Unknown table") == -1) {
                            this._events.emit("Log.erros", "Erros encontrados no drop da tabela: " + this._tablename, err);
                            //throw "Erros encontrados no drop da tabela: " + this._tablename;
                        }
                    }
                    let Colums = "";
                    Object.keys(this._tablestruct).forEach(colname => {
                        Colums += (Colums.length > 0 ? "," : "") + " " + colname + " " + this._tablestruct[colname].create + " COMMENT \"" + this._tablestruct[colname].descricao + "\"";
                    })

                    this._db.Query("CREATE TABLE " + this._tablename + " (" + Colums + ");").then((results, err2) => {
                        if (err2) {
                            this._events.emit("Log.erros", "Erros encontrados na criação da tabela: " + this._tablename, err2);
                            throw "Erros encontrados no drop da tabela: " + this._tablename;
                        }
                        if (results != undefined)
                            resolv(results.length > 0);
                    })
                })
            });
        })
    }

}