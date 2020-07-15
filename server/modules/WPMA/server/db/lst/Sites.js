
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
            var sql = "";
            sql = "SELECT * FROM" + this.cfg.dbstruct.database + "._WPMA WHERE active=0 AND deleted=0;";
            this.db.query(sql, function (err, results, fields) {
                if (err) {
                    this._log.error("on SQL:" + sql);
                    this._log.error(err);
                    rej("on SQL:" + sql);
                } else {
                    let data = [];

                    results.forEach(element => {
                        let e = JSON.parse(JSON.stringify(element));
                        data.push(e);
                    });
                    res(data);
                }
            });
        })
    }
}

module.exports = { lstSites };