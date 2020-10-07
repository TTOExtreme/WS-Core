
class edtSites {

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
     * @param {UserID} modifiedBy 
     * @param {String} route 
     * @param {String} subdomain 
     * @param {String} folder 
     * @param {Boolean/INT(1)} log 
     * @param {Boolean/INT(1)} active 
     * @param {Boolean/INT(1)} deleted 
     */
    add(id, name, description, modifiedBy, route, subdomain, folder, log, active, deleted) {
        return new Promise((res, rej) => {
            var sql = "UPDATE FROM " + this._cfg.dbstruct.database + "._WPMA_Sites SET " +
                " name='" + name + "'," +
                " description='" + description + "'," +
                " modifiedBy=" + modifiedBy + "," +
                " route='" + route + "'," +
                " subdomain='" + subdomain + "'," +
                " folder='" + folder + "'," +
                " log=" + log + "" +
                " WHERE id=" + id + ";";
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
module.exports = { edtSites }