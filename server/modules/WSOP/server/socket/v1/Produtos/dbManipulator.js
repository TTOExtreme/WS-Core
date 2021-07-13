

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
    ListAll(name = "", barcode = "") {
        return this.db.query("SELECT C.*, U.name as createdBy FROM " + this.db.DatabaseName + "._WSOP_Produtos AS C " +
            " LEFT JOIN " + this.db.DatabaseName + "._User as U on U.id = C.createdBy " +
            " WHERE C.name<>'null' " +
            (name != "" ? " AND C.name LIKE'%" + name + "%'" : "") +
            (barcode != "" ? " AND C.barcode LIKE'%" + barcode + "%'" : "") +
            " ORDER BY C.id DESC LIMIT 100;");
    }

    ListAllOs(search = "") {
        return this.db.query("SELECT C.id, C.name, C.barcode, C.inventory FROM " + this.db.DatabaseName + "._WSOP_Produtos AS C " +
            " WHERE C.active=1 AND C.name<>'null' AND (barcode LIKE'%" + search + "%' OR name LIKE '%" + search + "%') ORDER BY C.id DESC LIMIT 10;");
    }

    ListByBarcode(barcode) {
        return this.db.query("SELECT C.id, C.name, C.barcode, C.inventory, C.img FROM " + this.db.DatabaseName + "._WSOP_Produtos AS C " +
            " WHERE  C.name<>'null' AND C.barcode like '%" + (barcode || "") + "%' ORDER BY C.id DESC LIMIT 100;");
    }

    /**
     * Criar Produto
     * @param {String} name 
     * @param {String} description 
     * @param {String} barcode 
     * @param {String} price 
     * @param {String} cost 
     * @param {String} inventory 
     * @param {Number} UserID ID do usuario cadastrando
     */
    createProduto(name, description, barcode, price, priceRevenda, cost, img, url, inventory, active, revenda, privatelabel, UserID, id_li = 0) {

        return this.db.query("INSERT INTO " + this.db.DatabaseName + "._WSOP_Produtos" +
            " (id_li ,name, description, barcode, price, priceRevenda, cost, img, url, inventory, active,revenda,privatelabel, createdBy, createdIn)" +
            " VALUES " +
            " ('" + id_li + "','" + name + "','" + description + "','" + barcode + "','" + price + "','" + priceRevenda + "','" + cost + "','" + img + "','" + url + "'," + inventory + "," + (active ? 1 : 0) + "," + (revenda ? 1 : 0) + "," + (privatelabel ? 1 : 0) + "," + UserID + "," + Date.now() + ");");
    }

    /**
     * Atualizar caso exista ou criar caso não Produto
     * @param {String} name 
     * @param {String} description 
     * @param {String} barcode 
     * @param {String} price 
     * @param {String} cost 
     * @param {String} inventory 
     * @param {Number} UserID ID do usuario cadastrando
     */
    updateProduto(id_li, name, description, barcode, price, priceRevenda, cost, img, url, inventory, active, revenda = 1, privatelabel = 1, UserID = 1) {
        return this.db.query("SELECT * FROM " + this.db.DatabaseName + "._WSOP_Produtos AS C " +
            " WHERE C.id_li='" + id_li + "';").then(result => {
                if (result[0] == undefined) {
                    return this.createProduto(name, description, barcode, price, priceRevenda, cost, img, url, inventory, active, revenda, privatelabel, UserID, id_li);
                } else {
                    return this.editProduto(result[0].id, name, description, barcode, price, priceRevenda, cost, img, url, inventory, active, UserID, id_li);
                }
            });

        return this.db.query("INSERT INTO " + this.db.DatabaseName + "._WSOP_Produtos" +
            " (name, description, barcode, price, priceRevenda, cost, img, inventory, active,revenda,privatelabel, createdBy, createdIn)" +
            " VALUES " +
            " ('" + name + "','" + description + "','" + barcode + "','" + price + "','" + priceRevenda + "','" + cost + "','" + img + "'," + inventory + "," + (active ? 1 : 0) + "," + (revenda ? 1 : 0) + "," + (privatelabel ? 1 : 0) + "," + UserID + "," + Date.now() + ");");
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
    editProduto(ID, name = "", description = "", barcode = "", price, priceRevenda, cost, img, url, inventory = 0, active, UserID, id_li = 0) {

        return this.db.query("UPDATE " + this.db.DatabaseName + "._WSOP_Produtos SET" +
            ((id_li != 0) ? " id_li='" + id_li + "'," : " ") +
            ((name != "") ? " name='" + name + "'," : " ") +
            ((description != "") ? " description='" + description + "'," : " ") +
            ((barcode != "") ? " barcode='" + barcode + "'," : " ") +
            ((price != "") ? " price='" + price + "'," : " ") +
            ((priceRevenda != "") ? " priceRevenda='" + priceRevenda + "'," : " ") +
            ((cost != "") ? " cost='" + cost + "'," : " ") +
            ((img != "") ? " img='" + img + "'," : " ") +
            ((url != "") ? " url='" + url + "'," : " ") +
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