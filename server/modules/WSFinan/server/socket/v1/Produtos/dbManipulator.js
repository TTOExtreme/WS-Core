

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
        return this.db.query("SELECT C.*, U.name as createdBy FROM " + this.db.DatabaseName + "._WSFinan_Produtos AS C " +
            " LEFT JOIN " + this.db.DatabaseName + "._User as U on U.id = C.createdBy " +
            " WHERE C.active=1;");
    }

    /**
     * Lista todos os Clientes cadastrados sem filtro
     */
    ListAllProdutos() {
        return this.db.query("SELECT C.id, C.name, C.description FROM " + this.db.DatabaseName + "._WSFinan_Produtos AS C " +
            " WHERE C.active=1;");
    }

    /**
     * Lista todos os Clientes cadastrados com filtro
     */
    ListProdutosFiltered(name) {
        return this.db.query("SELECT C.id, C.name, C.description FROM " + this.db.DatabaseName + "._WSFinan_Produtos AS C " +
            " WHERE C.active=1 AND (C.name LIKE '%" + name + "%' OR C.description LIKE '%" + name + "%');");
    }


    /**
     * Criar Cliente
     * @param {String} name 
     * @param {String} description 
     * @param {String} barcode 
     * @param {Number} UserID ID do usuario cadastrando
     */
    createProdutos(name, description, barcode, active, UserID) {

        return this.db.query("INSERT INTO " + this.db.DatabaseName + "._WSFinan_Produtos" +
            " (name, description, barcode, active, createdBy, createdIn)" +
            " VALUES " +
            " ('" + name + "','" + description + "','" + barcode + "'," + (active ? 1 : 0) + "," + UserID + "," + Date.now() + ");");
    }

    /**
     * Editar cadastro do cliente
     * @param {Number} ID
     * @param {String} name 
     * @param {String} description 
     * @param {String} barcode 
     * @param {Number} UserID 
     */
    editProdutos(ID, name, description, barcode, active, UserID) {

        return this.db.query("UPDATE " + this.db.DatabaseName + "._WSFinan_Produtos SET" +
            ((name != "") ? " name='" + name + "'," : " ") +
            ((description != "") ? " description='" + description + "'," : " ") +
            ((barcode != "") ? " barcode='" + barcode + "'," : " ") +
            " active=" + (active ? 1 : 0) + "," +
            " modifiedBy='" + UserID + "', modifiedIn='" + Date.now() + "' " +
            " WHERE id='" + ID + "';");
    }
}

module.exports = { ProdutosManipulator }