import EventEmitter from 'events';
import Logger from './_Server-Core/Utils/Logger.mjs';
import fs from 'fs';
import DatabaseConnector from './_Server-Core/Database/Connector_Mysql.mjs';



const SERVER_CONFIG_FILE = './server.cfg';

class WSCore {

    /**
     * Mantem carregado as configurações na memoria
     */
    _config = null;

    /**
     * Inicializa o logger
     * @param {EventEmitter}
     */
    _log = null

    /**
     * Inicializa o banco
     */
    _db = null;

    /**
     * Inicializa o EventEmitter
     */
    _events = new EventEmitter();

    /**
     * Funcão de inicio e router de operação
     */
    main() {
        try {
            /**
             * setando limite de listeners para infinito
             */
            this._events.setMaxListeners(0);

            /**
             * Verificação de config Pre carregada
             */
            console.log("[Startup] Inicio Config")
            if (this._config == null) {
                this.LoadConfig();
            }
            console.log("[Startup] Config Carregada")

            /**
             * Inicializa o sistema de Log
             */
            this._log = new Logger(this._config.LOG, this._events);
            this._log.info("Carregado Sistema de Log");
            this._events.emit("Log.info", "Carregado Sistema de Event Log");
            this._log.info("Numero de event listeners: " + this._events.eventNames().length)


            /**
             * Inicializa o sistema de acesso ao Banco de dados
             */
            this.DBConnect().then(() => {
                /**
                 * verificação de argumentos 
                 */
                if (process.argv.length > 2) {
                    //inicia a instalação
                    if (process.argv[2] == "install") {
                        this.Install().then(() => {
                            this._events.emit("system", "Sistema Instalado")
                            process.exit(0);
                        }).catch(err => {
                            this._log.error("Erro na instalação", err);
                            throw err;
                        });
                    } else {
                        this._log.info("Argumento não reconhecido: <" + process.argv[2] + ">")
                    }
                } else {
                    //inicia o servidor
                    this._events.emit("system", "Inicializando Servidor")
                    this.Start().then(() => {
                        this._events.emit("system", "Encerrando o servidor")
                    }).catch(err => {
                        this._log.error("Erro no servidor principal", err);
                        throw err;
                    });
                }
            }).catch(err => {
                this._log.error("Erro na conexão com o banco", err);
                throw err;
            });

        } catch (err) {
            if (this._log != undefined) {
                this._log.error("Erro na função principal", err);
            } else {
                console.error("Erro na função principal");
                console.error(err);
            }
            process.exit(1);
        }

    }

    /**
     * Executa o instalador do servidor
     * @returns {Promisse} 
     */
    Install() {
        return new Promise((resolv, reject) => {
            this._events.emit("system", "Inicializando Instalador")
            import('./_Server-Core/Core-Install.mjs').then(Installer => {
                const installerinstance = new Installer.default(this._db, this._events);
                installerinstance.Install()
                    .then(resolv)
                    .catch(reject);

            }).catch(err => {
                this._log.error("Erro no import do instalador", err);
                throw err;
            });//*/
        });
    }

    /**
     * Executa o server core
     * @returns {Promisse}
     */
    Start() {
        return new Promise((resolv, reject) => {
            import('./_Server-Core/Core-Start.mjs').then(servercore => {
                const servercoreinstance = new servercore.default(this._db, this._config, this._events);
                servercoreinstance.PreStart()
                    .then(() => {
                        servercoreinstance.Start()
                            .then(() => {

                            })
                            .catch(reject);
                    })
                    .catch(reject);

            }).catch(err => {
                this._log.error("Erro no import do instalador", err);
                throw err;
            });
            //*/
        });
    }

    /**
     * Inicializa a conxão com o banco
     * @returns {Promisse}
     */
    DBConnect() {
        return new Promise((resolv, reject) => {
            if (this._db == null) {
                this._db = new DatabaseConnector(this._config.DB, this._events);
                this._db.Connect().then(() => {
                    this._events.emit("Log.info", "Conectado ao Banco de dados")
                    resolv();
                }).catch(reject);
            } else {
                resolv();
            }
            //*/
        })
    }

    /**
     * Carrega as configurações o arquivo server.cfg
     */
    LoadConfig() {
        try {
            if (!fs.existsSync(SERVER_CONFIG_FILE)) {
                throw "Arquivo não encontrado";
            }
            this._config = JSON.parse(fs.readFileSync(SERVER_CONFIG_FILE).toString());
        } catch (err) {
            if (this._log != undefined) {
                this._log.error("Erro na inicialização das configurações\nVerifique se o arquivo <" + SERVER_CONFIG_FILE + ">  existe e se não contem erros.", err);
            } else {
                console.error("Erro na inicialização das configurações\nVerifique se o arquivo <" + SERVER_CONFIG_FILE + ">  existe e se não contem erros.");
                console.error(err);
            }
            process.exit(1);
        }
    }

    /*
        IMport new class in runtime
        import('./_Server-Core/database/connector_mysql.mjs').then(dbinstance => {
                this.dbinst = new dbinstance.default(this);
                this.dbinst.connect().then((db) => {
                    this._db = this.dbinst._db;
                    res();
                }).catch(err => {
                    this._log.error("Erro na conexão ao banco", err);
                    rej(err);
                });;
            }).catch(err => {
                this._log.error("Erro no import do connector do banco", err);
                rej(err);
            });

    //*/

}
new WSCore().main();