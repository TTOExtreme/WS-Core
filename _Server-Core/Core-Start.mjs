import http from 'http';
import https from 'https';
import express from 'express';
import User from './database/Manipulators/Users/Users.mjs';
import fs from 'fs';
import { exec as openssl } from 'openssl-wrapper';
import BCypher from './utils/BCypher_2.0.mjs';

//dirname definition
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(join(__filename + "/../"));



export default class CoreServer {

    list_tablesModules = [
        './database/Manipulators/ServerConfig/ServerConfigs.mjs'
    ]


    /**
     * Event Handler class
     */
    ServerEvents = null;

    /**
     * Instancia da classe Log 
     */
    log = null;

    /**
     * JSON contendo as configurações do server
     */
    config = null;

    /**
     * Instancia da classe User 
     * Usado somente para operações de sistema
     */
    userInstance = null;

    /**
     * Instancia do HTTPS
     */
    _serverHTTPS = null;

    /**
     * Instancia do HTTP
     */
    _serverHTTP = null;

    /**
     * Instancia do IO/Socket
     */
    _serverIO = null;


    /**
     * 
     * @param {WSCore} WSCore classe principal contendo todos os handlers
     */
    constructor(db, config, events) {

        this._db = db;
        this._events = events;
        this._config = config;
        //this.userInstance = new User(WSCore);
    }

    /**
     * Inicia o servidor Web
     * @returns {Promise}
     */
    Start() {
        return new Promise((res, rej) => {
            //inicia a instancia do express para rotear
            let expressAPP = express();


            if (this._config.WEB.http) {

                this._events.emit("Log.system", "Criando servidor HTTP");
                //inicializa o HTTP


                //verifica se é para redirecionar tudo para HTTPS
                if (this._config.WEB.redirectHTTPS) {
                    let expressRedirect = express()
                    this._serverHTTP = http.createServer(expressRedirect);


                    const setPortHTTPS = (text) => {
                        return (req, res, next) => {
                            req.PortHTTPS = text;
                            next();
                        };
                    };

                    expressRedirect.get("*", setPortHTTPS(this._config.WEB.portHTTPS), function (req, res) {
                        res.redirect('https://' + req.headers.host.split(":")[0] + ":" + req.PortHTTPS + req.url);

                        // Or, if you don't want to automatically detect the domain name from the request header, you can hard code it:
                        // res.redirect('https://example.com' + req.url);
                    })
                } else {

                    this._serverHTTP = http.createServer(expressAPP);
                    //inicia o socket em http
                    //this._io = SocketIO(this._serverHTTP);
                }
            }

            //checa para ver se esta configurado o certificado para usar https
            if (this._config.WEB.https) {
                this.CheckSSL().then(() => {

                    this._events.emit("Log.system", "Criando servidor HTTPS");
                    //let passphrase = fs.readFileSync("./_SSL_Cert/passphrase.pass", 'utf8');
                    let privateKey = fs.readFileSync("./_SSL_Cert/server.key", 'utf8');
                    let certificate = fs.readFileSync('./_SSL_Cert/server.crt', 'utf8');
                    let credentials = {
                        key: privateKey,
                        cert: certificate,
                        //passphrase: passphrase
                    };


                    this._serverHTTPS = https.createServer(credentials, expressAPP);
                    //inicia o socket em https
                    //this._io = SocketIO(this._serverHTTPS);

                    this.postInit();
                }).catch(err => {
                    rej(err);
                })
            } else {
                this.postInit(); //para server http only
            }

            //inicialização de handler Home
            expressAPP.get("/", (req, res) => {
                res.sendFile('_Client-Web/home.html', {
                    root: __dirname
                });
            })

            //handler de toda a pasta _Client-Web
            expressAPP.get("/*", express.static(join(__dirname + "/_Client-Web/")))

            //inicialização de handler 404
            expressAPP.get("*", (req, res) => {
                res.sendFile('_Client-Web/404.html', {
                    root: __dirname
                });
            })

        })
    }

    /**
     * Inicio final do servidor HTTP HTTPS
     */
    postInit() {
        if (this._serverHTTPS != null) {
            this._serverHTTPS.listen(this._config.WEB.portHTTPS, () => {
                this._events.emit("Log.system", "Inicializado servidor HTTPS na porta: " + this._config.WEB.portHTTPS);
            });

        }
        if (this._serverHTTP != null) {
            this._serverHTTP.listen(this._config.WEB.port, () => {
                this._events.emit("Log.system", "Inicializado servidor HTTP na porta: " + this._config.WEB.port);
            });
        }
    }

    /**
     * Verifica a existência do certificado ssl e cria caso não
     * @returns {Promise}
     */
    CheckSSL() {
        return new Promise((res, rej) => {

            if (!fs.existsSync("./_SSL_Cert/")) {
                fs.mkdirSync("./_SSL_Cert/")
            }
            if (!fs.existsSync("./_SSL_Cert/server.crt")) {
                this._events.emit("Log.system", "Criando certificado HTTPS");

                fs.writeFileSync("./_SSL_Cert/passphrase.pass", new BCypher().generateString());

                //openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 365
                openssl('req', {
                    x509: true,
                    nodes: true,
                    newkey: "rsa:4096",
                    //passout: "file:_SSL_Cert/passphrase.pass",
                    subj: "/C=BR/O=TTODev/OU=WSCore Certificado de teste/CN=WSCore",
                    keyout: "./_SSL_Cert/server.key",
                    out: "./_SSL_Cert/server.crt",
                    //sha256: true,
                    days: 30
                }, function (err, buffer) {
                    if (err) {
                        console.error(err)
                        rej("Criando o certificado");
                    }
                    res();
                });

            } else {
                res();
            }
        })
    }


    /**
     * Realiza a validação do Banco de dados
     */
    PreStart() {
        return new Promise((resolv, reject) => {
            if (this.list_tablesModules.length > 0) {
                this.runNextTablePreStart().then(resolv).catch(reject)
            }
        });
    }

    runNextTablePreStart(index = 0) {
        return new Promise((resolv, reject) => {
            if (index < this.list_tablesModules.length) {
                import(this.list_tablesModules[index]).then(servercore => {
                    const servercoreinstance = new servercore.default(this._db, this._events);
                    servercoreinstance._tableExists()
                        .then((result) => {
                            console.log(result)
                            if (!result) {
                                this._events.emit("Log.system", "Tabela <" + servercoreinstance._tablename + "> inexistente no Banco de Dados, Necessario realizar a criação e inicialização da mesma");
                            }
                            this.runNextTablePreStart(index + 1).then(resolv).catch(reject)
                        })
                        .catch(reject); // desnecessario, o instalador inicia apos a instancia ser criada

                }).catch(err => {
                    this._events.emit("Log.error", "Erro no import do instalador", err);
                    throw err;
                });
            } else { resolv(); }
        });
    }



}