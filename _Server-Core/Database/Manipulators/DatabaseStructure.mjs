import EventEmitter from 'events';


export default class DatabaseStructure {

    /**
     * instancia de acesso ao Banco de dados
     */
    _db = null;

    /**
     * Instancia de acesso ao EventEmitter
     */
    _events = null;

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
            create: " INT(1) DEFAULT 0",
            descricao: "Couna Referente ao estado do registro, se esta excluido ou nao, quando excluido o mesmo nao estara mais visivel pelo sistema",
            viewInLog: true
        },
        ativo: {
            create: " INT(1) DEFAULT 0",
            descricao: "Couna Referente ao estado do registro, se esta ativo ou nao",
            viewInLog: true
        },
    }


    _table_permisao = []

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

                this._db.Query(itexistis ? ("SET FOREIGN_KEY_CHECKS = 0;") : "").then((results, err) => {
                    this._db.Query(itexistis ? ("DROP TABLE " + this._tablename + ";") : "").then((results, err) => {
                        if (err) {
                            if (err.indexOf("Unknown table") == -1) {
                                this._events.emit("Log.erros", "Erros encontrados no drop da tabela: " + this._tablename, err);
                            }
                        }
                        let Colums = "";
                        Object.keys(this._tablestruct).forEach(colname => {
                            Colums += (Colums.length > 0 ? "," : "") + " " + colname + " " + this._tablestruct[colname].create + (this._tablestruct[colname].descricao != "" ? " COMMENT \"" + this._tablestruct[colname].descricao + "\"" : "");
                        })

                        this._db.Query("CREATE TABLE " + this._tablename + " (" + Colums + ");").then((results, err2) => {
                            if (err2) {
                                this._events.emit("Log.erros", "Erros encontrados na criação da tabela: " + this._tablename, err2);
                                throw "Erros encontrados no drop da tabela: " + this._tablename;
                            }
                            if (results != undefined)
                                this._createData().then(resolv);
                        })
                    })
                })
            });
        })
    }

    /**
     * Realiza a construção dos dados na Tabela
     * A MESMA REALIZA UM Truncate ANTES DE CONSTRUIR, sim é redundancia de segurança
     */
    _createData() {
        return new Promise((resolv, reject) => {
            this._tableExists().then(itexistis => {
                this._db.Query(itexistis ? ("TRUNCATE TABLE " + this._tablename + ";") : "").then((results, err) => {
                    if (err) {
                        if (err.indexOf("Unknown table") == -1) {
                            this._events.emit("Log.erros", "Erros encontrados no Truncate da tabela: " + this._tablename, err);
                        }
                    }
                    if (this._initialValues.length > 0) {
                        let Colums = "";
                        Object.keys(this._initialValues[0]).forEach(colname => {
                            Colums += (Colums.length > 0 ? "," : "") + " " + colname + " ";
                        })


                        let Values = "";
                        this._initialValues.forEach(valueItem => {
                            Values += (Values.length > 0 ? ",(" : "(");
                            let vline = ""
                            Object.keys(valueItem).forEach(colname => {
                                vline += (vline.length > 1 ? "," : "") +
                                    (typeof (valueItem[colname]) == "string" ? "'" : " ") + valueItem[colname] + (typeof (valueItem[colname]) == "string" ? "'" : " ");
                            })
                            Values += vline + ")";
                        });

                        this._db.Query("INSERT INTO " + this._tablename + " (" + Colums + ") VALUES " + Values + ";").then((results, err2) => {
                            if (err2) {
                                this._events.emit("Log.erros", "Erros encontrados no Insert: " + this._tablename, err2);
                                throw "Erros encontrados no Insert: " + this._tablename;
                            }
                            if (results != undefined) {
                                //this._Pos_CreateData().then(() => {
                                resolv();
                                // });
                            }
                        })
                    } else {
                        //this._Pos_CreateData().then(() => {
                        resolv();
                        // });
                    }
                })
            });
        })
    }

    /**
     * {
            nome: "Listar Scripts do sistema",
            permissao: "modulo/scripter/list",
            descricao: "",
            ativo: 1
        },
     */
    /**
     * Carrega as permissoes salvas do modulo no banco caso exista
     * @returns 
     */
    _createPermissions() {
        return new Promise((resolv, reject) => {
            if (this._table_permisao.length > 0) {
                let perm_delete = ""
                let perm_include = ""
                this._table_permisao.forEach(perm => {
                    perm_delete += (perm_delete.length > 0 ? "," : "") + "'" + perm.permissao + "'";
                    perm_include += (perm_include.length > 0 ? "," : "") + "('" + perm.nome + "','" + perm.permissao + "','" + perm.descricao + "'," + perm.ativo + ")"
                })
                this._db.Query("SELECT id FROM _Permissions WHERE permissao IN (" + perm_delete + ");").then((r2, err0) => {
                    if (err0) {
                        this._events.emit("Log.erros", "Erros encontrados na limpeza das permissões: " + this._tablename, err1);
                        reject("Erro na limpeza das permissoes: " + this._tablename);
                    }
                    let listIdPerms = "";
                    if (r2[0] != undefined) {

                        r2[0].forEach(perm => {
                            listIdPerms += (listIdPerms.length > 0 ? "," : "") + "" + perm.id + "";
                        })
                    }
                    this._db.Query((listIdPerms.length > 0 ? "DELETE FROM Permissao_User WHERE permissao_id IN (" + listIdPerms + ");" : "")).then((r1, err0) => {
                        if (err0) {
                            this._events.emit("Log.erros", "Erros encontrados na limpeza das permissões: " + this._tablename, err1);
                            reject("Erro na limpeza das permissoes: " + this._tablename);
                        }
                        this._db.Query((listIdPerms.length > 0 ? "DELETE FROM Permissao_Group WHERE permissao_id IN (" + listIdPerms + ");" : "")).then((r1, err0) => {
                            if (err0) {
                                this._events.emit("Log.erros", "Erros encontrados na limpeza das permissões: " + this._tablename, err1);
                                reject("Erro na limpeza das permissoes: " + this._tablename);
                            }
                            this._db.Query((listIdPerms.length > 0 ? "DELETE FROM _Permissions WHERE id IN (" + listIdPerms + ");" : "")).then((r1, err0) => {
                                if (err0) {
                                    this._events.emit("Log.erros", "Erros encontrados na limpeza das permissões: " + this._tablename, err1);
                                    reject("Erro na limpeza das permissoes: " + this._tablename);
                                }
                                this._db.Query("INSERT INTO _Permissions (nome,permissao,descricao,ativo) VALUES " + perm_include + ";").then((r3, err1) => {
                                    if (err1) {
                                        if (err1.indexOf("Unknown table") == -1) {
                                            this._events.emit("Log.erros", "Erros encontrados na criação das permissoes: " + this._tablename, err1);
                                        }
                                        reject("Erro na criação das permissoes: " + this._tablename);
                                    }
                                    resolv(this._table_permisao);
                                })
                            })
                        })
                    })
                })
            } else {
                resolv();
            }
        })
    }


    /**
     * Chamado após toda a criação de dados na tabela
     * @returns {Promise}
     */
    _Pos_CreateData() {
        return new Promise((resolv, reject) => {
            resolv();
        });
    }

}