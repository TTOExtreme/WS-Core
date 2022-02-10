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
    constructor(WSCore) {
        if (WSCore._db == null) {
            console.error("Banco de dados não connectado ao WSCore Class\n err on constructor of class Installer")
            throw "Banco de dados não conectado";
        }
        this.db = WSCore._db;
        this.log = WSCore._log;
        this.config = WSCore._config;
        this.userInstance = new User(WSCore);
    }

    /**
     * Inicia o servidor Web
     * @returns {Promise}
     */
    Start() {
        return new Promise((res, rej) => {
            //inicia a instancia do express para rotear
            let expressAPP = express();


            if (this.config.WEB.http) {

                this.log.system("Criando servidor HTTP");
                //inicializa o HTTP


                //verifica se é para redirecionar tudo para HTTPS
                if (this.config.WEB.redirectHTTPS) {
                    let expressRedirect = express()
                    this._serverHTTP = http.createServer(expressRedirect);


                    const setPortHTTPS = (text) => {
                        return (req, res, next) => {
                            req.PortHTTPS = text;
                            next();
                        };
                    };

                    expressRedirect.get("*", setPortHTTPS(this.config.WEB.portHTTPS), function(req, res) {
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
            if (this.config.WEB.https) {
                this.CheckSSL().then(() => {

                    this.log.system("Criando servidor HTTPS");
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
            this._serverHTTPS.listen(this.config.WEB.portHTTPS, () => {
                this.log.system("Inicializado servidor HTTPS na porta: " + this.config.WEB.portHTTPS);
            });

        }
        if (this._serverHTTP != null) {
            this._serverHTTP.listen(this.config.WEB.port, () => {
                this.log.system("Inicializado servidor HTTP na porta: " + this.config.WEB.port);
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
                this.log.system("Criando certificado HTTPS");

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
                }, function(err, buffer) {
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

}