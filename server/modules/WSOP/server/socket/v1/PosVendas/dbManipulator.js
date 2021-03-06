

class PosvendasManipulator {

    /**
     * Constructor for Class
     * @param {WSMainServer} WSMain
     */
    constructor(WSMain) {
        this.db = WSMain.db;
        this.log = WSMain.log;
        this.cfg = WSMain.cfg;
    }


    /**
     * Lista todos as Vendas de Site 50 por vez
     */
    ListAll() {
        return this.db.query("SELECT C.* FROM " + this.db.DatabaseName + "._WSOP_CalendarioPosVendas AS C " +
            " LEFT JOIN " + this.db.DatabaseName + "._User as U on U.id = C.createdBy WHERE  C.active = 1;");
    }

    /**
     * Lista todos as Vendas de Site 50 por vez
     */
    ListSingle(ID = 0) {
        return this.db.query("SELECT C.* FROM " + this.db.DatabaseName + "._WSOP_CalendarioPosVendas AS C " +
            " LEFT JOIN " + this.db.DatabaseName + "._User as U on U.id = C.createdBy WHERE C.id >= " + ID + " AND C.active = 1 LIMIT 1;");
    }

    /**
     * Lista todos as Vendas de Site 50 por vez
     */
    ListDate(start = 0) {
        let end = start + (12 * 3600 * 1000);
        return new Promise((res, rej) => {
            this.db.query("SELECT C.* FROM " + this.db.DatabaseName + "._WSOP_CalendarioPosVendas AS C " +
                " LEFT JOIN " + this.db.DatabaseName + "._User as U on U.id = C.createdBy WHERE C.active = 1;").then(results => {
                    let ret = results.filter((val) => {
                        try {
                            val.description = JSON.parse(val.description);
                            if (val.description.start >= start && val.description.start <= end) return val;
                        } catch (err) {

                        }
                    })
                    res(ret);
                })
        })
    }


    /**
     * Edita o status da venda do site
     * @param {Number} idSite 
     * @param {Number} status 
     * @param {Number} UserID 
     */
    edtCalendario(id, title, description, active, UserID) {
        return this.db.query("UPDATE " + this.db.DatabaseName + "._WSOP_CalendarioPosVendas SET" +
            " title='" + title + "'," +
            " description='" + description + "'," +
            " active='" + ((active == 1 || active == true) ? "1" : "0") + "'," +
            " modifiedBy='" + UserID + "', modifiedIn='" + Date.now() + "' " +
            " WHERE id='" + id + "';")
    }


    /**
     * Editar cadastro do cliente
     * @param {String} API 
     * @param {Boolean} pullproducts 
     * @param {Boolean} pullsells 
     * @param {Boolean} pullclients
     * @param {Boolean} active
     * @param {Number} UserID 
     */

    addCalendario(title, description, img, active, UserID) {
        return this.db.query("INSERT INTO " + this.db.DatabaseName + "._WSOP_CalendarioPosVendas" +
            " ( title, description,  active, createdBy, createdIn)" +
            " VALUES " +
            " ('" + title + "','" + description + "'," + ((active == 1 || active == true) ? "1" : "0") + "," + UserID + ", " + Date.now() + "); ");
    }

}

module.exports = { PosvendasManipulator }