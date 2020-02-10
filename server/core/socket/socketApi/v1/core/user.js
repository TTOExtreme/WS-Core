const userManipulator = require('../../../../database/_user/serverManipulator').UserServer;
const class_user = require('../../../../database/_user/class_user').User;

class Socket {

    _log;
    _config;
    _WSMainServer;
    _myself;

    /**
     * Constructor for User Class
     * @param {WSMainServer} WSMain
     */
    constructor(WSMainServer) {
        this._log = WSMainServer.log;
        this._config = WSMainServer.config;
        this._WSMainServer = WSMainServer;
        this._userServer = new userManipulator(WSMainServer);
        this._myself = new class_user(WSMainServer);
    }

    /**
     * Create Listeners for Socket
     * @param {SocketIO} io 
     * @param {class_user} Myself
     */
    socket(socket, Myself) {
        this._myself = Myself;
        socket.on("userList", (data) => {
            this._myself.checkPermission("adm/usr/lst").then(() => {
                this._userServer.listUser().then((data) => {
                    socket.emit("ClientEvents", { event: "adm/usr/lst", data: data })
                }).catch((err) => {
                    socket.emit("ClientEvents", { event: "system_mess", data: { status: "ERROR", mess: err, time: 1000 } })
                })
            })
        })
    }
}

module.exports = { Socket };