const listSites = require("../lst/Sites").lstSites;
const addSites = require("../add/Sites").addSites;

class Sites {

    constructor(WSMain) {
        this._db = WSMain.db;
        this._log = WSMain.log;
        this._cfg = WSMain.cfg.config;

        this._Select = new listSites(this._db, this._cfg, this._log);
        this._Insert = new addSites(this._db, this._cfg, this._log);
    }

    /**
     * Add new Site to the server
     * @param {String} name 
     * @param {String} description 
     * @param {UserID} createdBy 
     * @param {String} route 
     * @param {String} subdomain 
     * @param {String} folder 
     * @param {Boolean/INT(1)} log 
     * @param {Boolean/INT(1)} active 
     * @param {Boolean/INT(1)} deleted 
     */
    add(name, description, createdBy, route, subdomain, folder, log, active, deleted) {
        return this._Insert.add(name, description, createdBy, route, subdomain, folder, log, active, deleted);
    }

    /**
     * Get site from ID
     * @param {SiteID} id 
     */
    getSiteId(id = 0) {
        return this._Select.getSiteId(id);
    }

    /**
     * get ALL Sites not deleted
     */
    getAllSites() {
        return this._Select.getAllSites();
    }
}

module.exports = { Sites };