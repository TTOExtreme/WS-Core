
class lstSites {

    _db;
    _log;
    _cfg;

    constructor(DB, CFG, LOG) {
        this._db = DB;
        this._cfg = CFG;
        this._log = LOG;
    }

    ListAll() {
        return new Promise((res, rej) => {
            var sql = "SELECT * FROM " + this._cfg.dbstruct.database + "._WPMA_Sites WHERE active=1 AND deleted=0;";
            this._db.query(sql)
                .then(data => {
                    res(data);
                })
                .catch(err => {
                    this._log.error("on SQL:" + sql);
                    this._log.error(err);
                    rej("on SQL:" + sql);
                })
        })
    }
}

module.exports = { lstSites };