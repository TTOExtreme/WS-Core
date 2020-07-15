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

        this._modules = WSMainServer.modules;
        this._lstSites = new lstSites(this._db, this._config, this._log);
        this.Init();
    }

    //Inicializar estruturas de Dados (cache das paginas principais)
    Init() {
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
        this._modules.WPMA = {
            sites: [],
        }
        this._lstSites.ListAll().then(st => {
            this._modules.WPMA.sites = st;
        })
    }
}

module.exports = { Startup }