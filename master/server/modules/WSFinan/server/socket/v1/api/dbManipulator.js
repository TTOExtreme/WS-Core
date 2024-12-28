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
     * Lista Todas as Fichas com filtro
     * @param {IDMaterial} ID 
     * @param {String} Name 
     * @param {String} description 
     * @returns {Array}
     */
    ListFichas(ID = "0", Name = "", description = "") {
        return this.db.query("SELECT C.*, U.name as createdBy FROM " + this.db.DatabaseName + "._WSFinan_Fichas AS C " +
            " LEFT JOIN " + this.db.DatabaseName + "._User as U on U.id = C.createdBy " +
            " WHERE C.id >=" + ID +
            (Name != "" ? " AND C.name LIKE '%" + Name + "%'" : "") +
            (description != "" ? " AND C.description LIKE '%" + description + "%'" : "") +
            " ORDER BY C.id DESC LIMIT 50;");
    }

    /**
     * Lista o historico de uma ficha especificada
     * @param {ID} ID 
     * @returns 
     */
    ListFichasHistory(ID = "-1") {
        return this.db.query("SELECT C.*, U.name as createdBy FROM " + this.db.DatabaseName + "._WSFinan_Log AS C " +
            " LEFT JOIN " + this.db.DatabaseName + "._User as U on U.id = C.createdBy " +
            " WHERE C.id_item =" + ID +
            " ORDER BY C.id DESC LIMIT 100;");
    }

    /**
     * Lista Todas as Fichas com filtro
     * @param {IDMaterial} ID 
     * @param {String} Name 
     * @param {String} description 
     * @returns {Array}
     */
    GetFicha(ID = 0) {
        return this.db.query("SELECT C.* FROM " + this.db.DatabaseName + "._WSFinan_Fichas AS C " +
            " WHERE C.id =" + ID + ";");
    }

    /**
     * Lista todas as fichas para o auto complete
     * @returns 
     */
    ListFichasAutocomplete() {
        return this.db.query("SELECT C.name,C.id FROM " + this.db.DatabaseName + "._WSFinan_Fichas AS C " +
            " ORDER BY C.id DESC LIMIT 100;");
    }

    /**
     * Adiciona Ficha
     * @param {String} name 
     * @param {String} description 
     * @param {String} valueAttached 
     * @param {String} valueRedserved 
     * @param {String} valuePending 
     * @param {Boolean} active 
     * @param {UserID} UserID 
     * @returns 
     */
    AddFichas(name = "", description = "", valueAttached = "0.00", valueRedserved = "0.00", valuePending = "0.00", active = 1, UserID) {
        return this.db.query("INSERT INTO " + this.db.DatabaseName + "._WSFinan_Fichas " +
            " (name, description,valueAttached,valueReserved,valuePending,active,createdBy,createdIn) VALUES " +
            " ('" + name + "','" + description + "','" + valueAttached + "','" + valueRedserved + "','" + valuePending + "'," + (active ? 1 : 0) + "," + UserID + "," + new Date().getTime() + ");");
    }

    /**
     * Adiciona Ficha
     * @param {String} name 
     * @param {String} description 
     * @param {String} valueAttached 
     * @param {String} valueRedserved 
     * @param {String} valuePending 
     * @param {Boolean} active 
     * @param {UserID} UserID 
     * @returns 
     */
    EdtFichas(id = 0, name = "", description = "", active = 1, UserID) {
        return this.db.query("UPDATE " + this.db.DatabaseName + "._WSFinan_Fichas SET " +
            " name='" + name + "', description='" + description + "', active=" + (active ? 1 : 0) + ",modifiedBy=" + UserID + ", modifiedIn=" + new Date().getTime() + " WHERE id=" + id + ";");
    }

    /**
     * 
     * @param {ID} id 
     * @param {Sting} value 
     * @returns 
     */
    SetAttachedValue(id = 0, value = "00.00") {
        return this.db.query("UPDATE " + this.db.DatabaseName + "._WSFinan_Fichas SET " +
            " valueAttached='" + value + "' WHERE id=" + id + ";");
    }

    /**
     * 
     * @param {ID} id 
     * @param {Sting} value 
     * @returns 
     */
    SetPendingValue(id = 0, value = "00.00") {
        return this.db.query("UPDATE " + this.db.DatabaseName + "._WSFinan_Fichas SET " +
            " valuePending='" + value + "' WHERE id=" + id + ";");
    }

    /**
     * 
     * @param {ID} id 
     * @param {Sting} value 
     * @returns 
     */
    SetReservedValue(id = 0, value = "00.00") {
        return this.db.query("UPDATE " + this.db.DatabaseName + "._WSFinan_Fichas SET " +
            " valueReserved='" + value + "' WHERE id=" + id + ";");
    }
}

module.exports = { apiManipulator }