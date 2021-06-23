class apiManipulator {

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
     * Lista todos os serviços dentro dos filtros especificados, Limite de 50
     * @param {IDMaterial} ID 
     * @param {String} Name 
     * @param {String} description 
     * @returns {Array}
     */
    ListFichas(ID = 0, Name = "", description = "") {
        return this.db.query("SELECT C.*, U.name as createdBy FROM " + this.db.DatabaseName + "._WSFinan_Fichas AS C " +
            " LEFT JOIN " + this.db.DatabaseName + "._User as U on U.id = C.createdBy order by C.id desc " +
            " WHERE id >=" + ID +
            (Name != "" ? " AND name LIKE '%" + Name + "%'" : "") +
            (description != "" ? " AND description LIKE '%" + description + "%'" : "") +
            " LIMIT 50;");
    }

}

module.exports = { apiManipulator }