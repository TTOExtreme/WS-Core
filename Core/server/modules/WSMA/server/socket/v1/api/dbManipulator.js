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
            " LEFT JOIN " + this.db.DatabaseName + "._User as U on U.id = C.createdBy" +
            " WHERE C.id >=" + ID +
            (Name != "" ? " AND C.name LIKE '%" + Name + "%'" : "") +
            (description != "" ? " AND C.description LIKE '%" + description + "%'" : "") +
            " order by C.id desc  LIMIT 50;");
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
            " LEFT JOIN " + this.db.DatabaseName + "._User as U on U.id = C.createdBy " +
            " WHERE C.id >=" + ID +
            (Name != "" ? " AND C.name LIKE '%" + Name + "%'" : "") +
            (description != "" ? " AND C.description LIKE '%" + description + "%'" : "") +
            " order by C.id desc LIMIT 50;");
    }

    /**
     * Lista todos os materiais dentro dos filtros especificados, Limite de 50
     * @param {IDMaterial} ID 
     * @param {String} Name 
     * @param {String} description 
     * @returns {Array}
     */
    ListMateriaisAuto(Name = "") {
        return this.db.query("SELECT C.id, C.name,C.description FROM " + this.db.DatabaseName + "._WSMA_Materiais AS C " +
            " WHERE " +
            " C.name LIKE '%" + Name + "%'" +
            " AND C.active=1 order by C.id desc LIMIT 10;");
    }


    /**
     * Lista todos os materiais dentro dos filtros especificados, Limite de 50
     * @param {IDMaterial} ID 
     * @param {String} Name 
     * @param {String} description 
     * @returns {Array}
     */
    ListServicosAuto(Name = "") {
        return this.db.query("SELECT C.id, C.name,C.description FROM " + this.db.DatabaseName + "._WSMA_Servicos AS C " +
            " WHERE " +
            " C.name LIKE '%" + Name + "%'" +
            " AND C.active=1 order by C.id desc LIMIT 10;");
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
    AddServico(name, description, active, UserID) {
        return this.db.query("INSERT INTO " + this.db.DatabaseName + "._WSMA_Servicos " +
            "(name,description,active, createdIn, createdBy) VALUES " +
            "('" + name + "','" + description + "'," + (active ? 1 : 0) + "," + new Date().getTime() + "," + UserID + ")" +
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
    EdtMaterial(id, name, description, inventory = 0, inventoryMin = 0, inventoryMax = 0, active = true, UserID) {
        return this.db.query("UPDATE " + this.db.DatabaseName + "._WSMA_Materiais SET " +
            " active =" + (active ? 1 : 0) + " " +
            ", modifiedIn =" + new Date().getTime() + " " +
            ", modifiedBy =" + UserID + " " +
            (name != "" ? " , name = '" + name + "' " : " ") +
            (description != "" ? " , description = '" + description + "' " : " ") +
            (inventory != "" ? " , inventory = '" + inventory + "' " : " ") +
            (inventoryMin != "" ? " , inventoryMin = '" + inventoryMin + "' " : " ") +
            (inventoryMax != "" ? " , inventoryMax = '" + inventoryMax + "' " : " ") +
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
    EdtServico(id, name, description, active, UserID) {
        return this.db.query("UPDATE " + this.db.DatabaseName + "._WSMA_Servicos SET" +
            " active =" + (active ? 1 : 0) + " " +
            " , modifiedIn =" + new Date().getTime() + " " +
            " , modifiedBy =" + UserID + " " +
            (name != "" ? " , name = '" + name + "' " : " ") +
            (description != "" ? " , description = '" + description + "' " : " ") +
            " WHERE id=" + id + " ;");
    }
}

module.exports = { apiManipulator }