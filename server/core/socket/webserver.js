const http = require('http');
const https = require('https');
const Express = require('express');
const SocketIO = require('socket.io');
const colors = require('colors');

const bodyParser = require('body-parser');

const SocketHandler = require('./socketApi/handler.js').SocketHandler;

const fs = require("fs");
const path = require("path").join;

class WServer {

    _log;
    _config;
    _User;
    _SocketHandler;
    _Modules;

    constructor(WSMainServer) {
        this._log = WSMainServer.log;
        this._config = WSMainServer.config;
        this._User = new (require("../database/_user/class_user")).User(WSMainServer);

        this._User.addAdmMenus();//Add menus to the instance 

        this._SocketHandler = new SocketHandler(WSMainServer);
        this._Modules = WSMainServer.Modules;
    }

    _app;
    _server;
    _serverHTTPS;
    _io;

    /**
     * init
     */
    init() {
        this._log.task("webserver", "Inicializing Webserver", 0);
        this._app = Express();


        if (fs.existsSync("sslcert/server.key")) {
            let privateKey = fs.readFileSync("sslcert/server.key", 'utf8');
            let certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
            let credentials = { key: privateKey, cert: certificate };

            this._serverHTTPS = https.createServer(credentials, this._app);
            this._io = SocketIO(this._serverHTTPS);
        } else {
            this._server = http.createServer(this._app);
            this._io = SocketIO(this._server);
        }


        this._webhost();
        this._socketHandler();
    }

    postInit() {
        /*
        this._app.get("*", (req, res) => {
            res.sendFile('./404.html', {
                root: this._config.webpageFolder
            });
        })
        //*/
        if (fs.existsSync("sslcert/server.key")) { //enter https or http
            this._serverHTTPS.listen(this._config.webPort, () => {
                this._log.task("webserver", "Webserver HTTPS on Port: " + colors.green(this._config.webPort), 1);
            });

        } else {
            this._server.listen(this._config.webPort, () => {
                this._log.task("webserver", "Webserver on Port: " + colors.green(this._config.webPort), 1);
            });
        }
    }


    /**
     * handler for the webfiles 
     */
    _webhost() {

        this._app.use(bodyParser.urlencoded({
            extended: false
        }));
        this._app.use(bodyParser.json());

        this._app.get(path(this._config.adminPage + "/login"), (req, res) => {
            if (req.headers.host != this._config.webHost) {
                res.redirect('https://' + this._config.webHost + req.url);
            } else {
                res.sendFile('./login.html', {
                    root: this._config.webpageFolder
                });
            }
        })
        this._app.post(path(this._config.adminPage + "/login/request"), (req, res) => {

            //authenticate and redirect
            this._log.info(JSON.stringify(req.body))

            let expiretime = Date.now() + (24 * 60 * 60 * 1000); //create 24H Cookie

            if (req.body.username && req.body.password) {
                this._User.findme(req.body.username, req.body.password).then((user) => {
                    return this._User.checkPermission("def/usr/login").then(() => {
                        res.cookie('wscore', user.uuid, {
                            expire: expiretime
                        }) //create 24H Cookie
                        res.redirect(302, "../")
                    }).catch((err) => {
                        if (err) {
                            this._log.info(err);
                            res.redirect(302, path(this._config.adminPage + "/login"));
                            return Promise.reject(err);
                        } else {
                            this._log.info("Usuário sem permissão");
                            return Promise.reject("Usuário sem permissão");
                        }
                    })
                }).catch((err) => {
                    if (err) {
                        this._log.info(err);
                        res.status(401).send(err);
                    } else {
                        this._log.info("Usuário ou Senha Incorreto");
                        res.status(401).send("Erro Usuario ou Senha Incorreto");
                    }
                })
            }
        })

        this._app.get(path(this._config.adminPage + "/"), (req, res) => {
            if (req.headers.host != this._config.webHost) {
                res.redirect('https://' + this._config.webHost + req.url);
            } else {
                if (req.url == this._config.adminPage) {
                    res.redirect(302, ".." + this._config.adminPage + "/")
                } else {
                    let cookies = this._parseCookies(req);
                    if ((cookies["wscore"])) { //check if cookie is present and redirect if is not
                        res.sendFile('./home.html', {
                            root: this._config.webpageFolder
                        });
                    } else {
                        res.redirect(302, "./login")
                    }
                }
            }
        })

        this._app.use(path(this._config.adminPage + "/"), Express.static(this._config.webpageFolder))
        this._hostModules();
    }

    /**
     * @description Host all web folders from modules folder
     */
    _hostModules() {
        let modulesList = fs.readdirSync(path(__dirname + "../../../modules/"));
        modulesList.forEach(mod => {
            this._log.task("loading-" + mod, "Loading Web Module: " + mod, 0);
            //check if exist Web folder in module
            if (fs.existsSync(path(__dirname + "../../../modules/" + mod + "/web"))) {
                this._log.task("loading-" + mod, "Loaded Web Module: " + mod + " in: " + path(this._config.adminPage + "/module/" + mod + "/"), 1);
                this._app.use(path(this._config.adminPage + "/module/" + mod + "/"), Express.static(path(__dirname + "../../../modules/" + mod + "/web")));
            }
        })
    }

    /**
     * @param request Request from client
     * @description Return client cookies from request
     */
    _parseCookies(request) {
        let list = {},
            rc = request.headers.cookie;
        rc && rc.split(';').forEach(function (cookie) {
            let parts = cookie.split('=');
            list[parts.shift().trim()] = decodeURI(parts.join('='));
        });
        return list;
    }



    /**
     * handler for auth and parser to events
     */
    _socketHandler() {
        this._SocketHandler.socket(this._io);
    }

}

module.exports = {
    WServer
}