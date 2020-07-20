const lstSites = require("./db/lst/Sites").lstSites;

class Startup {

    _db;
    _log;
    _config;
    _lstSites;

    constructor(WSMainServer) {
        this._log = WSMainServer.log;
        this._config = WSMainServer.config;
        this._db = WSMainServer.db;

        this._modules = WSMainServer.modules["WPMA"];
        this._lstSites = new lstSites(this._db, this._config, this._log);
    }

    //Inicializar estruturas de Dados (cache das paginas principais)
    Init() {
        this._log.task("wpma-sites-db-load", "Loading Sites From Database", 0)
        /**
         * {
         *      sites:[
         *          <DB list>
         *          {
                        id;
                        name;
                        description;
                        createdIn;
                        createdBy;
                        modifiedIn;
                        modifiedBy;
                        route;
                        subdomain;
                        folder;
                        log;
                        menus:[],
                        posts:[]
                    }
         *      ]
         * }
         */
        this._modules["cfg"] = { sites: [] };

        return this._lstSites.ListAll().then(st => {
            this._log.task("wpma-sites-db-load", "Loaded Sites From Database", 1)
            this._modules.cfg.sites = st;
            return Promise.resolve("Loaded Sites From Database");
        }).catch(err => {
            this._log.error(err);
            return Promise.reject(err);
        })
    }
}

module.exports = { Startup }