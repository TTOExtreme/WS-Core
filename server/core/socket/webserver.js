
const http = require('http');
const Express = require('express');
const SocketIO = require('socket.io');

const bodyParser = require('body-parser');

const SocketHandler = require('./socketApi/handler.js');


class WServer {

    _log;
    _config;

    constructor(WSMainServer) {
        this.log = WSMainServer.log;
        this.config = WSMainServer.config;
        this.User = new (require("../database/_user/class_user")).User(WSMainServer);
    }

    _app;
    _server;
    _io;

    /**
     * init
     */
    init() {
        this.app = Express();

        this.server = http.createServer(this.app);
        this.io = SocketIO(this.server);

        this.server.listen(this.config.webPort, () => {
            this.log.info('Running server on port: ' + this.config.webPort);
        });

        this._webhost();
        this._socketHandler();
    }


    /**
     * handler for the webfiles 
     */
    _webhost() {
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.get("/login", (req, res) => {
            res.sendFile('./login.html', { root: this.config.webpageFolder });
        })
        this.app.post("/login/request", (req, res) => {

            //authenticate and redirect
            this.log.info(JSON.stringify(req.body))

            if (req.body.username && req.body.password) {
                this.User.findme(req.body.username, req.body.password).then((user) => {
                    res.cookie('wscore', user.uuid, { expire: Date.now() + (24 * 60 * 60 * 1000) }) //create 24H Cookie
                    res.redirect(302, "../")
                }).catch(() => {
                    this.log.warning("Usuário ou Senha Invalido")
                    res.status(401).send("Erro Usuario ou Senha Invalido")
                })
            } else if (req.body.uuid) {
                this.User.findmeuuid(req.body.uuid).then((user) => {
                    res.cookie('wscore', user.uuid, { expire: Date.now() + (24 * 60 * 60 * 1000) }) //create 24H Cookie
                    res.redirect(302, "../")
                }).catch(() => {
                    this.log.warning("Usuário uuid Invalido")
                    res.status(401).send("Erro Usuario uuid Invalido")
                })
            }

        })
        this.app.get("/", (req, res) => {
            let cookies = this._parseCookies(req);
            if ((cookies["wscore"])) {//check if cookie is present and redirect if is not
                res.sendFile('./home.html', { root: this.config.webpageFolder });
            } else {
                res.redirect(302, "./login")
            }
        })
        this.app.use(Express.static(this.config.webpageFolder))
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
        //SocketHandler.socketHandler(this.io)
    }

}

module.exports = { WServer }