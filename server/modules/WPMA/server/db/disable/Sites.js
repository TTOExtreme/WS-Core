
class disableSites {

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
     * @param {INT} ID 
     * @param {UserID} modifiedBy 
     * @param {Boolean/INT(1)} disabled 
     */
    disable(id, modifiedBy, disabled) {
        return new Promise((res, rej) => {
            var sql = "UPDATE " + this._cfg.dbstruct.database + "._WPMA_Sites SET " +
                " modifiedBy=" + modifiedBy + "," +
                " modifiedIn=" + Date.now() + "," +
                " active=" + disabled + "" +
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
module.exports = { disableSites }