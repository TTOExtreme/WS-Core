
class lstSites {

    _db;
    _log;
    _cfg;

    constructor(DB, CFG, LOG) {
        this._db = DB;
        this._cfg = CFG;
        this._log = LOG;
    }

    /**
     * List all sites without username associated
     */
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


    /**
     * get ALL Sites not deleted and with username associated
     */
    getAllSites() {
        return new Promise((resolve, reject) => {
            const str = "WS.id," +
                "WS.name," +
                "WS.description," +
                "WS.route," +
                "WS.subdomain," +
                "WS.folder," +
                "WS.createdIn," +
                "WS.deactivatedIn," +
                "WS.modifiedIn," +
                "WS.active," +
                "WS.log,";

            let sql = "SELECT " + str +
                " WS.createdBy," +
                " WS.deactivatedBy," +
                " U3.username as modifiedBy" +

                " FROM (SELECT " + str +
                " WS.createdBy," +
                " WS.modifiedBy," +
                " U2.username as deactivatedBy" +
                " FROM (SELECT " + str +
                " WS.modifiedBy," +
                " WS.deactivatedBy," +
                " U1.username as createdBy" +
                " FROM " + this._cfg.dbstruct.database + "._WPMA_Sites as WS " +
                " LEFT JOIN " + this._cfg.dbstruct.database + "._User as U1" +
                " ON WS.createdBy = U1.id " +
                " WHERE WS.deleted=0" +
                " ) as WS" +
                " LEFT JOIN " + this._cfg.dbstruct.database + "._User as U2 " +
                " ON WS.deactivatedBy = U2.id " +
                " ) as WS" +
                " LEFT JOIN " + this._cfg.dbstruct.database + "._User as U3 " +
                " ON WS.modifiedBy = U3.id " +
                "  "
            // adicionar usuario (nome) no lugar do id de Criado por e Desativado por

            this._db.query(sql)
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    this._log.error("on SQL:" + sql);
                    this._log.error(err);
                    reject("on SQL:" + sql);
                })
        })
    }


    /**
     * Search Site by ID
     */
    getSiteId(id = 0) {
        return new Promise((resolve, reject) => {
            var sql = "SELECT * FROM " + this._cfg.dbstruct.database + "._WPMA_Sites WHERE id=" + id + " AND deleted=0;";
            this._db.query(sql)
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    this._log.error("on SQL:" + sql);
                    this._log.error(err);
                    reject("on SQL:" + sql);
                })
        })
    }
}

module.exports = { lstSites };