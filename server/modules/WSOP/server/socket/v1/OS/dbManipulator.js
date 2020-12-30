

class osManipulator {

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
     * Lista todos os Clientes cadastrados sem filtro
     */
    ListAll() {
        return this.db.query("SELECT OS.*, U.name as createdBy, C.name as cliente FROM " + this.db.DatabaseName + "._WSOP_OS AS OS " +
            " LEFT JOIN " + this.db.DatabaseName + "._User as U on U.id = OS.createdBy " +
            " LEFT JOIN " + this.db.DatabaseName + "._WSOP_Cliente as C on C.id = OS.id_cliente " +
            " WHERE OS.active=1;");
    }

    /**
     * Criar Cliente
     * @param {String} id_Cliente 
     * @param {String} description 
     * @param {String} barcode 
     * @param {String} price 
     * @param {String} cost 
     * @param {String} inventory 
     * @param {Number} UserID ID do usuario cadastrando
     */
    createOS(id_Cliente, description, status, active, UserID) {

        return this.db.query("INSERT INTO " + this.db.DatabaseName + "._WSOP_OS" +
            " (id_Cliente, description, status, active, createdBy, createdIn)" +
            " VALUES " +
            " ('" + id_Cliente + "','" + description + "','" + status + "'," + (active ? 1 : 0) + "," + UserID + "," + Date.now() + ");");
    }

    /**
     * 
     * @param {*} ID 
     * @param {*} id_Cliente 
     * @param {*} description 
     * @param {*} tags 
     * @param {*} active 
     * @param {*} UserID 
     */
    editOS(ID, description, status, active, UserID) {

        return this.db.query("UPDATE " + this.db.DatabaseName + "._WSOP_OS SET" +
            ((description != "") ? " description='" + description + "'," : " ") +
            ((status != "") ? " status='" + status + "'," : " ") +
            " active=" + (active ? 1 : 0) + "," +
            " modifiedBy='" + UserID + "', modifiedIn='" + Date.now() + "' " +
            " WHERE id='" + ID + "';");
    }

    /**
     * Desativar Desativar OS
     * @param {Number} ID
     * @param {Boolean} active
     * @param {Number} UserID 
     */
    disableOS(ID, active, UserID) {

        return this.db.query("UPDATE " + this.db.DatabaseName + "._WSOP_OS SET" +
            " active=" + (active ? 1 : 0) + "," +
            " modifiedBy=" + UserID + ", modifiedIn='" + Date.now() + "' " +
            ((active) ?
                " ,deactivatedBy=null, deactivatedIn=null " :
                " ,deactivatedBy='" + UserID + "', deactivatedIn=" + Date.now() + " ") +
            " ,modifiedBy='" + UserID + "', modifiedIn=" + Date.now() + " " +
            " WHERE id=" + ID + ";");
    }

    /**
     * inserir anexo OS
     * @param {Number} ID
     * @param {Boolean} active
     * @param {Number} UserID 
     */
    appendAnexo(ID, filename, UserID) {

        return this.db.query("INSERT INTO " + this.db.DatabaseName + "._WSOP_OSAnexos " +
            " (id_os, filename, active, createdBy, createdIn)" +
            " VALUES " +
            " ('" + ID + "','" + filename + "',1," + UserID + "," + Date.now() + ");");
    }

    /**
     * Desativar anexo OS
     * @param {Number} ID
     * @param {Boolean} active
     * @param {Number} UserID 
     */
    delAnexo(ID, UserID) {

        return this.db.query("UPDATE " + this.db.DatabaseName + "._WSOP_OS SET" +
            " active=0," +
            " modifiedBy=" + UserID + ", modifiedIn='" + Date.now() + "' " +
            ((active) ?
                " ,deactivatedBy=null, deactivatedIn=null " :
                " ,deactivatedBy='" + UserID + "', deactivatedIn=" + Date.now() + " ") +
            " ,modifiedBy='" + UserID + "', modifiedIn=" + Date.now() + " " +
            " WHERE id=" + ID + ";");
    }

}

module.exports = { osManipulator }