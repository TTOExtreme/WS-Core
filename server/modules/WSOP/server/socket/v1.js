const core = require('./v1/Core').Core;

class Socket {

    _log;
    _config;
    _socket;
    _myself
    _coreModule;

    constructor(WSMainServer) {
        this._log = WSMainServer.log;
        this._config = WSMainServer.config;
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
    }
}
module.exports = { Socket }