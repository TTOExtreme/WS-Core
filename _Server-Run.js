import Logger from './_Server-Core/utils/Logger.mjs';
import fs from 'fs';

class WSCore {

    /**
     * Mantem carregado as configurações na memoria
     */
    _config = null;

    /**
     * Inicializa o logger
     */
    _log = new Logger(this);

    /**
     * Inicializa o banco
     */
    _db = null;

    main() {
        try {
            if (this._config == null) {
                this.LoadConfig();
            }

            this.DBConnect().then(() => {

                /**
                 * verificação de argumentos 
                 */
                if (process.argv.length > 2) {
                    if (process.argv[2] == "install") {
                        this.Install().then(() => {
                            this._log.system("Sistema Instalado")
                            process.exit(0);
                        }).catch(err => {
                            this._log.error("Erro na instalação", err);
                            throw err;
                        });
                    } else {
                        this._log.info("Argumento não reconhecido: <" + process.argv[2] + ">")
                    }
                } else {
                    this._log.system("Inicializando Servidor")
                }
            }).catch(err => {
                this._log.error("Erro na conexão com o banco", err);
                throw err;
            });

        } catch (err) {
            this._log.error("Erro na função principal", err);
            process.exit(1);
        }

    }

    Install() {
        return new Promise((res, rej) => {
            this._log.system("Inicializando Instalador")
            import ('./_Server-Core/Core-Install.mjs').then(Installer => {
                const installerinstance = new Installer.default(this);
                installerinstance.Install()
                    .then(res)
                    .catch(rej); // desnecessario, o instalador inicia apos a instancia ser criada

            }).catch(err => {
                this._log.error("Erro no import do instalador", err);
                throw err;
            });
        });
    }

    DBConnect() {
        return new Promise((res, rej) => {
            import ('./_Server-Core/database/connector.mjs').then(dbinstance => {
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
        })
    }

    LoadConfig() {
        try {
            this._config = JSON.parse(fs.readFileSync("./server.cfg"));
        } catch (err) {
            if (this._log != undefined) {
                this._log.error("Erro na inicialização das configurações\nVerifique se o arquivo server.cfg existe e se não contem erros", err);
            } else {
                console.error("Erro na inicialização das configurações\nVerifique se o arquivo server.cfg existe e se não contem erros");
                console.error(err);
            }
            process.exit(1);
        }
    }
}
new WSCore().main();