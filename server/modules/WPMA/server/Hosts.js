
const Express = require('express');

class Hosts {

    _db;
    _log;
    _config;
    _wserver;

    constructor(WSMainServer) {
        this._log = WSMainServer.log;
        this._config = WSMainServer.config;
        this._db = WSMainServer.db;
        this._wserver = WSMainServer.wserver;

        this.Init();
    }

    //Inicializar estruturas de Dados (cache das paginas principais)

    Init() {
        //this._wserver._app.get("/WPMA/");
        this._log.task("loading-host_WPMA", "Initialized WPMA Host Manager", 1);
    }
}
module.exports = { Hosts }