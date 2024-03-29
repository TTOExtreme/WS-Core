const core = require('./v1/Core').Core;
const api = require('./v1/api').Socket;
const fornecedor = require('./v1/Fornecedor').Socket;
const produtos = require('./v1/Produtos').Socket;
const requisicao = require('./v1/Requisicao').Socket;

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
        this._log.task("api-mod-WSOP", "Loaded API WSOP", 1);
        this._fornecedor = new fornecedor(WSMainServer);
        this._produtos = new produtos(WSMainServer);
        this._requisicao = new requisicao(WSMainServer);
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
        this._fornecedor.socket(this._socket, this._myself);
        this._produtos.socket(this._socket, this._myself);
        this._requisicao.socket(this._socket, this._myself);

    }
}
module.exports = { Socket }