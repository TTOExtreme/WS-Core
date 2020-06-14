
const http = require('http');
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

    constructor(WSMainServer) {
        this._log = WSMainServer.log;
        this._config = WSMainServer.config;
        this._User = new (require("../database/_user/class_user")).User(WSMainServer);
        this._SocketHandler = new SocketHandler(WSMainServer);
    }

    _app;
    _server;
    _io;

    /**
     * init
     */
    init() {
        this._log.task("webserver", "Inicializing Webserver", 0);
        this._app = Express();

        this._server = http.createServer(this._app);
        this._io = SocketIO(this._server);

        this._server.listen(this._config.webPort, () => {
            this._log.task("webserver", "Webserver on Port: " + colors.green(this._config.webPort), 1);
        });

        this._webhost();
        this._socketHandler();
    }


    /**
     * handler for the webfiles 
     */
    _webhost() {
        this._app.use(bodyParser.urlencoded({ extended: false }));
        this._app.use(bodyParser.json());
        this._app.get(path(this._config.adminPage + "/login"), (req, res) => {
            res.sendFile('./login.html', { root: this._config.webpageFolder });
        })
        this._app.post(path(this._config.adminPage + "/login/request"), (req, res) => {

            //authenticate and redirect
            this._log.info(JSON.stringify(req.body))

            let expiretime = Date.now() + (24 * 60 * 60 * 1000);//create 24H Cookie

            if (req.body.username && req.body.password) {
                this._User.findme(req.body.username, req.body.password).then((user) => {
                    return this._User.checkPermission("def/usr/login").then(() => {
                        res.cookie('wscore', user.uuid, { expire: expiretime }) //create 24H Cookie
                        res.redirect(302, "../")
                    }).catch((err) => {
                        if (err) {
                            this._log.info(err);
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
            if (req.url == this._config.adminPage) {
                res.redirect(302, "../Administrativo/")
            } else {
                let cookies = this._parseCookies(req);
                if ((cookies["wscore"])) {//check if cookie is present and redirect if is not
                    res.sendFile('./home.html', { root: this._config.webpageFolder });
                } else {
                    res.redirect(302, "./login")
                }
            }
        })

        this._app.use(path(this._config.adminPage + "/"), Express.static(this._config.webpageFolder))
        this._hostModules();

        this._app.get("*", (req, res) => {
            res.sendFile('./404.html', { root: this._config.webpageFolder });
        })

    }

    /**
     * @description Host all web folders from modules folder
     */
    _hostModules() {
        let modulesList = fs.readdirSync(path(__dirname + "../../../modules/"));
        modulesList.forEach(mod => {
            this._log.task("loading-" + mod, "Loading Module: " + mod, 0);
            if (fs.existsSync(path(__dirname + "../../../modules/" + mod + "/web"))) {
                this._log.task("loading-" + mod, "Loaded Module: " + mod, 1);
                this._app.use("/module/" + mod + "/", Express.static(path(__dirname + "../../../modules/" + mod + "/web")));
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

module.exports = { WServer }