
class addSites {

    _db;
    _log;
    _cfg;

    constructor(DB, CFG, LOG) {
        this._db = DB;
        this._cfg = CFG;
        this._log = LOG;
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
        return new Promise((res, rej) => {
            var sql = "INSERT INTO " + this._cfg.dbstruct.database +
                "._WPMA_Sites (name,description,createdBy,createdIn,route,subdomain,folder,log,active,deleted) VALUES " +
                "('" + name + "','" + description + "'," + createdBy + ",'" + Date.now() + "','" + route + "','" + subdomain + "','" + folder + "'," + log + "," + active + "," + deleted + ");";
            this._db.query(sql)
                .then(() => {
                    res();
                })
                .catch(err => {
                    this._log.error("on SQL:" + sql);
                    this._log.error(err);
                    rej("on SQL:" + sql);
                })
        })
    }
}
module.exports = { addSites }