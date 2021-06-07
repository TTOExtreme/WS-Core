const apiManipulator = require('./socket/v1/api/dbManipulator').apiManipulator;

class Running {

    _log;
    _config;
    _io;
    _apiManipulator;

    constructor(WSMainServer) {
        this._log = WSMainServer.log;
        this._config = WSMainServer.config;

        this._apiManipulator = new apiManipulator(WSMainServer);
    }

    Init() {
        //this._apiManipulator.updatePaidSells(null);
    }
}

module.exports = { Running };