class Startup {

    _log;
    _config;
    _io;

    constructor(WSMainServer) {
        this._log = WSMainServer.log;
        this._config = WSMainServer.config;

    }

    Init() {

    }
}
module.exports = { Startup }