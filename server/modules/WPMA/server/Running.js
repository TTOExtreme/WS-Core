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
    Init(){
        
    }
}