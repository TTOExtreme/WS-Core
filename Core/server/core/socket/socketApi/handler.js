const v1 = require('./v1/v1').v1;
const SocketIO = require('socket.io');

class SocketHandler {

    socketApi = [];

    _log;
    _config;
    _io;

    constructor(WSMainServer) {
        this._log = WSMainServer.log;
        this._config = WSMainServer.config;
        this._init(WSMainServer);
    }

    _init(WSMainServer) {
        this.socketApi.push({ version: "/websocket/v1", handler: new v1(WSMainServer) });
    }

    socket(io) {
        this._io = io;
        this.socketApi.forEach(e => {
            e.handler.socket(this._io.of(e.version))
        });
    }

}

module.exports = { SocketHandler }