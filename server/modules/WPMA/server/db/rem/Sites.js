
class remSites {

    _db;
    _log;
    _cfg;

    constructor(DB, CFG, LOG) {
        this._db = DB;
        this._cfg = CFG;
        this._log = LOG;
    }

    /**
     * rem new Site to the server
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
    rem(id, modifiedBy, deleted) {
        return new Promise((res, rej) => {
            var sql = "UPDATE " + this._cfg.dbstruct.database + "._WPMA_Sites SET " +
                ((deleted = 1) ?
                    " deactivatedby='" + modifiedBy + "'," +
                    " deactivatedIn=" + Date.now() + ","
                    : "") +
                " modifiedBy=" + modifiedBy + "," +
                " modifiedIn=" + Date.now() + "," +
                " deleted=" + deleted + "" +
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
module.exports = { remSites }