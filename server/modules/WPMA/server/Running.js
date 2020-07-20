class Running {

    _db;
    _log;
    _config;

    constructor(WSMainServer) {
        this._log = WSMainServer.log;
        this._config = WSMainServer.config;
        this._db = WSMainServer.db;
    }


    /**
     * Inicializador de Handler de SubDominios e paginas
     */
    Init() {
        return new Promise((res, rej) => {

            //this._wserver._app.get("/WPMA/");
            this._log.task("loading-running_WPMA", "Initialized WPMA Running Scripts", 1);
            res();
        })
    }
}

module.exports = { Running }