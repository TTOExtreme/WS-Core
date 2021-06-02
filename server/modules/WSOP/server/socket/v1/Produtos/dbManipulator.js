

class ProdutosManipulator {

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
        return this.db.query("SELECT C.*, U.name as createdBy FROM " + this.db.DatabaseName + "._WSOP_Produtos AS C " +
            " LEFT JOIN " + this.db.DatabaseName + "._User as U on U.id = C.createdBy " +
            " WHERE C.active=1;");
    }

    ListAllOs() {
        return this.db.query("SELECT C.id, C.name, C.barcode, C.inventory, C.img FROM " + this.db.DatabaseName + "._WSOP_Produtos AS C " +
            " WHERE C.active=1;");
    }

    ListByBarcode(barcode) {
        return this.db.query("SELECT C.id, C.name, C.barcode, C.inventory, C.img FROM " + this.db.DatabaseName + "._WSOP_Produtos AS C " +
            " WHERE C.active=1 AND C.barcode like '%" + (barcode || "") + "%';");
    }

    /**
     * Criar Cliente
     * @param {String} name 
     * @param {String} description 
     * @param {String} barcode 
     * @param {String} price 
     * @param {String} cost 
     * @param {String} inventory 
     * @param {Number} UserID ID do usuario cadastrando
     */
    createProduto(name, description, barcode, price, cost, img, inventory, active, UserID) {

        return this.db.query("INSERT INTO " + this.db.DatabaseName + "._WSOP_Produtos" +
            " (name, description, barcode, price, cost, img, inventory, active, createdBy, createdIn)" +
            " VALUES " +
            " ('" + name + "','" + description + "','" + barcode + "','" + price + "','" + cost + "','" + img + "'," + inventory + "," + (active ? 1 : 0) + "," + UserID + "," + Date.now() + ");");
    }

    /**
     * Editar cadastro do cliente
     * @param {Number} ID
     * @param {String} name 
     * @param {String} description 
     * @param {String} barcode 
     * @param {Boolean} price 
     * @param {String} cost 
     * @param {String} inventory 
     * @param {String} numero 
     * @param {String} municipio 
     * @param {String} uf 
     * @param {String} telefone 
     * @param {String} email 
     * @param {Number} UserID 
     */
    editProduto(ID, name = "", description = "", barcode = "", price, cost, img, inventory = 0, active, UserID) {

        return this.db.query("UPDATE " + this.db.DatabaseName + "._WSOP_Produtos SET" +
            ((name != "") ? " name='" + name + "'," : " ") +
            ((description != "") ? " description='" + description + "'," : " ") +
            ((barcode != "") ? " barcode='" + barcode + "'," : " ") +
            ((price != "") ? " price='" + price + "'," : " ") +
            ((cost != "") ? " cost='" + cost + "'," : " ") +
            ((img != "") ? " img='" + img + "'," : " ") +
            ((inventory != "") ? " inventory='" + inventory + "'," : " ") +
            " active=" + (active ? 1 : 0) + "," +
            " modifiedBy='" + UserID + "', modifiedIn='" + Date.now() + "' " +
            " WHERE id='" + ID + "';");
    }

    /**
     * Desativar cadastro do cliente
     * @param {Number} ID
     * @param {Boolean} active
     * @param {Number} UserID 
     */
    disableProduto(ID, active, UserID) {

        return this.db.query("UPDATE " + this.db.DatabaseName + "._WSOP_Produtos SET" +
            " active=" + (active ? 1 : 0) + "," +
            " modifiedBy=" + UserID + ", modifiedIn='" + Date.now() + "' " +
            ((active) ?
                " ,deactivatedBy=null, deactivatedIn=null " :
                " ,deactivatedBy='" + UserID + "', deactivatedIn=" + Date.now() + " ") +
            " ,modifiedBy='" + UserID + "', modifiedIn=" + Date.now() + " " +
            " WHERE id=" + ID + ";");
    }

}

module.exports = { ProdutosManipulator }