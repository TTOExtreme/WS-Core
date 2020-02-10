
const SocketIO = require('socket.io');
const CookieIO = require('cookie');
const UserClass = require('../../../database/_user/class_user').User;
const fs = require('fs');

class v1 {

    _log;
    _config;
    _WSMainServer;

    /**
     * Constructor for User Class
     * @param {WSMainServer} WSMain
     */
    constructor(WSMainServer) {
        this._log = WSMainServer.log;
        this._config = WSMainServer.config;
        this._WSMainServer = WSMainServer;
    }

    /**
     * Create Listeners for Socket
     * @param {SocketIO} io 
     */
    socket(io) {
        io.on("connect", (socket) => {
            let Myself = new UserClass(this._WSMainServer);
            let _socket;
            socket.on("auth", () => {
                //try to authenticate user else redirect to login page
                try {
                    //this._log.info(socket.request.headers)
                    var cookies = CookieIO.parse(socket.handshake.headers.cookie);
                    this._log.info(JSON.stringify(cookies));
                    if (cookies.wscore) {
                        //check in database for userID
                        Myself.findmeuuid(cookies.wscore).then(() => {
                            return Myself.checkPermission("def/usr/login").then(() => {
                                socket.emit("auth-ok", Myself.getUserClientData());
                                _socket = socket;
                                this._loadModules(_socket, Myself);
                            })
                        }).catch(() => {
                            socket.emit("auth-err", "UUID Invalido");
                        })
                    } else {
                        socket.request.headers.origin += "./login"
                    }
                } catch (err) {

                    this._log.info(socket.handshake)
                    socket.handshake.headers["Set-Cookie"] = CookieIO.serialize("wscore", "String")
                    this._log.info("Set-Cookie");
                    this._log.info(socket.handshake)
                }
            })

            socket.on('disconnect', () => {
                this._log.info('Client disconnected');
            });
        })
    }

    /**
     * Load all Modules from ./core and from ../../../../modules/server/socket
     * @param {SocketIO} socket 
     * @param {UserClass} Myself 
     */
    _loadModules(socket, Myself) {
        //load core modules
        fs.readdirSync(__dirname + './core/').forEach((mod) => {
            let modSocket = new (require(__dirname + './core/' + mod)).Socket(this._WSMainServer);
            modSocket.socket(socket, Myself);
        })
        //load addons modules
        fs.readdirSync(__dirname + '../../../../modules/').forEach((mod) => {
            if (fs.existsSync(__dirname + '../../../../modules/' + mod + '/server/socket/socket_v1.js')) {
                let modSocket = new (require(__dirname + '../../../../modules/' + mod + '/server/socket/socket_v1.js')).Socket(this._WSMainServer);
                modSocket.socket(socket, Myself);
            }
        })
    }
}

module.exports = { v1 }
