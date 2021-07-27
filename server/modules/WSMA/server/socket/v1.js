const core = require('./v1/Core').Core;
const api = require('./v1/api').Socket;

class Socket {

    _log;
    _config;
    _socket;
    _myself
    _coreModule;

    constructor(WSMainServer) {
        this._WSMainServer = WSMainServer;
        this._log = WSMainServer.log;
        this._config = WSMainServer.config;

        this._apiModule = new api(WSMainServer);
    }

    /**
     * Inicializa o socket para esse modulo
     * @param {Socket.io} socket 
     * @param {UserClass} Myself
     */
    socket(socket, Myself) {
        this._socket = socket;
        this._myself = Myself;

        this._coreModule = new core(this._socket, this._myself);
        this._apiModule.socket(this._socket, this._myself);

        this._log.task("api-mod-wsma", "Loading API WSMA", 0);
    }
}
module.exports = { Socket }