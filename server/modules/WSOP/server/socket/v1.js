const core = require('./v1/Core').Core;
const cliente = require('./v1/Cliente').Socket;

class Socket {

    _log;
    _config;
    _socket;
    _myself
    _coreModule;
    _clienteModule

    constructor(WSMainServer) {
        this._WSMainServer = WSMainServer;
        this._log = WSMainServer.log;
        this._config = WSMainServer.config;

        this._clienteModule = new cliente(WSMainServer);
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
        this._clienteModule.socket(this._socket, this._myself);

        this._log.task("api-mod-WSOP", "Loaded API WSOP", 1);
    }
}
module.exports = { Socket }