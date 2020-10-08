const SocketIO = require('socket.io');
const CookieIO = require('cookie');
const UserClass = require('../../../database/_user/class_user').User;
const fs = require('fs');
const path = require('path').join;

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
                    //this._log.info(JSON.stringify(cookies));
                    if (cookies.wscore) {
                        //check in database for userID
                        Myself.findmeuuid(cookies.wscore).then(() => {
                            return Myself.checkPermission("def/usr/login").then(() => {
                                _socket = socket;
                                this._loadModules(_socket, Myself);

                                socket.emit("auth-ok", Myself.getUserClientData());

                                var address = socket.handshake.address;
                                Myself.LogIn({
                                    ip: clearIpv6(address)
                                });

                                return Promise.resolve();
                            })
                        }).catch(() => {
                            socket.emit("auth-err", "UUID Invalido");
                        })
                    } else {
                        socket.request.headers.origin += "./login"
                    }
                } catch (err) {

                    //this._log.info(socket.handshake)
                    socket.handshake.headers["Set-Cookie"] = CookieIO.serialize("wscore", "String")
                    //this._log.info("Set-Cookie");
                    //this._log.info(socket.handshake)
                }
            })

            socket.on('disconnect', () => {
                this._log.info('Client disconnected');
                Myself.LogOut();
            });
        })
    }

    /**
     * Load all Modules from ./core and from ../../../../modules/server/socket
     * @param {SocketIO} socket 
     * @param {UserClass} Myself 
     */
    async _loadModules(socket, Myself) {
        //load core modules
        fs.readdirSync(path(__dirname + '/core/')).forEach((mod) => {
            try {
                this._log.task("api-mod-" + mod.replace(".js", ""), "Loading API " + mod.replace(".js", ""), 0);
                let modSocket = require(__dirname + '/core/' + mod)
                let modClass = new modSocket.Socket(this._WSMainServer);
                modClass.socket(socket, Myself);
            } catch (err) {
                this._log.task("api-mod-" + mod.replace(".js", ""), "Api " + mod.replace(".js", "") + " Failed to Load", 3);
                this._log.error(err);
            }
        })

        //load addons modules
        fs.readdirSync(path(__dirname + '/../../../../modules/')).forEach((mod) => {
            //console.log("load: " + mod)
            if (fs.existsSync(path(__dirname + '/../../../../modules/' + mod + '/server/socket/v1.js'))) {
                let modSocket = new (require(path(__dirname + '/../../../../modules/' + mod + '/server/socket/v1.js'))).Socket(this._WSMainServer);
                modSocket.socket(socket, Myself);
            }
        })

    }
}


function clearIpv6(address) {
    return address.replace("::ffff:", "");
}

module.exports = {
    v1
}