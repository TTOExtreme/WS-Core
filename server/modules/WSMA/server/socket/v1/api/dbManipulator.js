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
     * Lista todos os materiais dentro dos filtros especificados, Limite de 50
     * @param {IDMaterial} ID 
     * @param {String} Name 
     * @param {String} description 
     * @returns {Array}
     */
    ListMateriais(ID = 0, Name = "", description = "") {
        return this.db.query("SELECT C.*, U.name as createdBy FROM " + this.db.DatabaseName + "._WSMA_Materiais AS C " +
            " LEFT JOIN " + this.db.DatabaseName + "._User as U on U.id = C.createdBy order by C.id desc " +
            " WHERE id >=" + ID +
            (Name != "" ? " AND name LIKE '%" + Name + "%'" : "") +
            (description != "" ? " AND description LIKE '%" + description + "%'" : "") +
            " LIMIT 50;");
    }

    /**
     * Lista todos os serviços dentro dos filtros especificados, Limite de 50
     * @param {IDMaterial} ID 
     * @param {String} Name 
     * @param {String} description 
     * @returns {Array}
     */
    ListServicos(ID = 0, Name = "", description = "") {
        return this.db.query("SELECT C.*, U.name as createdBy FROM " + this.db.DatabaseName + "._WSMA_Servicos AS C " +
            " LEFT JOIN " + this.db.DatabaseName + "._User as U on U.id = C.createdBy order by C.id desc " +
            " WHERE id >=" + ID +
            (Name != "" ? " AND name LIKE '%" + Name + "%'" : "") +
            (description != "" ? " AND description LIKE '%" + description + "%'" : "") +
            " LIMIT 50;");
    }

    /**
     * Adiciona material
     * @param {String} name Nome do Material
     * @param {String} description Conjunto de informações sobre o material 
     * @param {Int} inventory Quantidade de itens em inventario
     * @param {Int} inventoryMin Quantidade minima do estoque para pedido de compra
     * @param {Int} inventoryMax Quantidade maxima para pedido de compra
     * @param {Boolean} active 
     * @param {UserID} UserID Id do usuario da ação
     * @returns ID
     */
    AddMaterial(name, description, inventory = 0, inventoryMin = 0, inventoryMax = 0, active, UserID) {
        return this.db.query("INSERT INTO " + this.db.DatabaseName + "._WSMA_Materiais " +
            "(name,description,inventory,inventoryMin,inventoryMax,active, createdIn, createdBy) VALUES " +
            "('" + name + "','" + description + "'," + inventory + "," + inventoryMin + "," + inventoryMax + "," + (active ? 1 : 0) + "," + new Date().getTime() + "," + UserID + ")" +

            ";");
    }

    /**
     * Adiciona serviço
     * @param {String} name Nome do Serviço
     * @param {String} description Conjunto de infomações sobre o serviço
     * @param {Int} datainterval Intervalo de tempo para proxima execuçao do serviço
     * @param {Boolean} active 
     * @param {UserID} UserID Id do usuário da ação
     * @returns ID
     */
    AddServico(name, description, datainterval, active, UserID) {
        return this.db.query("INSERT INTO " + this.db.DatabaseName + "._WSMA_Servicos " +
            "(name,description,inventory,inventoryMin,inventoryMax,active, createdIn, createdBy) VALUES " +
            "('" + name + "','" + description + "'," + datainterval + "," + (active ? 1 : 0) + "," + new Date().getTime() + "," + UserID + ")" +
            ";");
    }

    /**
     * Edita material
     * @param {String} name Nome do Material
     * @param {String} description Conjunto de informações sobre o material 
     * @param {Int} inventory Quantidade de itens em inventario
     * @param {Int} inventoryMin Quantidade minima do estoque para pedido de compra
     * @param {Int} inventoryMax Quantidade maxima para pedido de compra
     * @param {Boolean} active 
     * @param {UserID} UserID Id do usuario da ação
     * @returns null
     */
    EdtMaterial(id, name, description, inventory = 0, inventoryMin = 0, inventoryMax = 0, active, UserID) {
        return this.db.query("UPDATE " + this.db.DatabaseName + "._WSMA_Materiais SET " +
            "active ="(active ? 1 : 0) + " AND" +
            "modifiedIn =" + new Date().getTime() + " AND" +
            "modifiedBy =" + UserID + " " +
            (name != "" ? " AND name = '" + name + "' " : " ") +
            (description != "" ? " AND description = '" + description + "' " : " ") +
            (inventory != "" ? " AND inventory = '" + inventory + "' " : " ") +
            (inventoryMin != "" ? " AND inventoryMin = '" + inventoryMin + "' " : " ") +
            (inventoryMax != "" ? " AND inventoryMax = '" + inventoryMax + "' " : " ") +
            " WHERE id=" + id + " ;");
    }

    /**
     * Edita serviço
     * @param {String} name Nome do Serviço
     * @param {String} description Conjunto de infomações sobre o serviço
     * @param {Int} datainterval Intervalo de tempo para proxima execuçao do serviço
     * @param {Boolean} active 
     * @param {UserID} UserID Id do usuário da ação
     * @returns ID
     */
    EdtServico(id, name, description, datainterval, active, UserID) {
        return this.db.query("UPDATE " + this.db.DatabaseName + "._WSMA_Servicos SET" +
            "active ="(active ? 1 : 0) + " AND" +
            "modifiedIn =" + new Date().getTime() + " AND" +
            "modifiedBy =" + UserID + " " +
            (name != "" ? " AND name = '" + name + "' " : " ") +
            (description != "" ? " AND description = '" + description + "' " : " ") +
            (datainterval != "" ? " AND datainterval = '" + datainterval + "' " : " ") +
            " WHERE id=" + id + " ;");
    }
}

module.exports = { apiManipulator }