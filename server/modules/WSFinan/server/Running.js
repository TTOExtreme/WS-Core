

class Running {

    _log;
    _config;
    _io;
    _apiManipulator;

    constructor(WSMainServer) {
        this._log = WSMainServer.log;
        this._config = WSMainServer.config;
    }

    Init() {
    }
}

module.exports = { Running };