class requisicaiManipulator {

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
     * Lista Todas as Requisicao com filtro
     * @param {IDMaterial} ID 
     * @param {String} Name 
     * @param {String} description 
     * @returns {Array}
     */
    ListRequisicao(ID = "0", Name = "", description = "") {
        return this.db.query("SELECT C.*, U.name as createdBy, F.name as fornecedor FROM " + this.db.DatabaseName + "._WSFinan_Requisicao AS C " +
            " LEFT JOIN " + this.db.DatabaseName + "._User as U on U.id = C.createdBy " +
            " LEFT JOIN " + this.db.DatabaseName + "._WSFinan_Fornecedor as F on F.id = C.id_fornecedor " +
            " WHERE C.active=1 AND C.id >=" + ID +
            (Name != "" ? " AND C.name LIKE '%" + Name + "%'" : "") +
            (description != "" ? " AND C.description LIKE '%" + description + "%'" : "") +
            " ORDER BY C.id DESC LIMIT 50;");
    }

    /**
     * Lista o historico de uma ficha especificada
     * @param {ID} ID 
     * @returns 
     */
    ListRequisicaoHistory(ID = "-1") {
        return this.db.query("SELECT C.*, U.name as createdBy, F.name as fornecedor FROM " + this.db.DatabaseName + "._WSFinan_Requisicao_Log AS C " +
            " LEFT JOIN " + this.db.DatabaseName + "._User as U on U.id = C.createdBy " +
            " WHERE C.id_item =" + ID +
            " ORDER BY C.id DESC LIMIT 100;");
    }

    /**
     * Lista Todas as Requisicao com filtro
     * @param {IDMaterial} ID 
     * @param {String} Name 
     * @param {String} description 
     * @returns {Array}
     */
    GetRequisicao(id = 0) {
        return this.db.query("SELECT OS.*, U.name as createdBy, OS.createdBy as creatorId, U.email as U_email, U.telefone as U_telefone, C.name as fornecedor, C.cpf_cnpj as C_cpf_cnpj, C.logradouro C_logradouro,C.responsavel as C_responsavel, C.numero as C_numero, C.bairro as C_bairro, C.municipio as C_municipio, C.cep as C_cep, C.uf as C_uf, C.country as C_country, C.email as C_email, C.telefone as C_telefone FROM " + this.db.DatabaseName + "._WSFinan_Requisicao AS OS " +
            " LEFT JOIN " + this.db.DatabaseName + "._User as U on U.id = OS.createdBy " +
            " LEFT JOIN " + this.db.DatabaseName + "._WSFinan_Fornecedor as C on C.id = OS.id_fornecedor " +
            " WHERE " + ((id != "") ? " OS.id=" + id : ";") + " ;").then((list) => {
                let allProm = [];
                let result = [];
                list.forEach(item => {
                    allProm.push(new Promise((resolve, reject) => {
                        return this.db.query("SELECT * FROM " + this.db.DatabaseName + "._WSFinan_RequisicaoAnexos  WHERE active=1 AND id_requisicao=" + item.id + ";").then(anexos => {
                            return this.db.query("SELECT R.*, P.name, P.barcode, P.description FROM " + this.db.DatabaseName + ".rlt_Produtos_Requisicao AS R " +
                                " LEFT JOIN " + this.db.DatabaseName + "._WSFinan_Produtos as P on P.id = R.id_produtos " +
                                " WHERE R.active=1 AND R.id_req=" + item.id + ";").then(produtos => {
                                    let it = item;
                                    it.anexos = anexos;
                                    it.produtos = produtos;
                                    result.push(it);
                                    resolve(it);
                                })
                        })
                    }));
                });

                return Promise.all(allProm).finally(() => {
                    return Promise.resolve(result);
                })
            });
    }

    /**
     * Lista todas as Requisicao para o auto complete
     * @returns 
     */
    ListRequisicaoAutocomplete() {
        return this.db.query("SELECT C.name,C.id FROM " + this.db.DatabaseName + "._WSFinan_Requisicao AS C " +
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
    AddRequisicao(name = "", id_fornecedor, description = "", active = 1, UserID) {
        return this.db.query("INSERT INTO " + this.db.DatabaseName + "._WSFinan_Requisicao " +
            " (name,id_fornecedor, description,active,createdBy,createdIn) VALUES " +
            " ('" + name + "'," + id_fornecedor + ",'" + description + "'," + (active ? 1 : 0) + "," + UserID + "," + new Date().getTime() + ");");
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
    EdtRequisicao(id = 0, name = "", description = "", active = 1, UserID) {
        return this.db.query("UPDATE " + this.db.DatabaseName + "._WSFinan_Requisicao SET " +
            " name='" + name + "', description='" + description + "', active=" + (active ? 1 : 0) + ",modifiedBy=" + UserID + ", modifiedIn=" + new Date().getTime() + " WHERE id=" + id + ";");
    }

    /**
     * 
     * @param {ID} id 
     * @param {Sting} value 
     * @returns 
     */
    SetAttachedValue(id = 0, value = "00.00") {
        return this.db.query("UPDATE " + this.db.DatabaseName + "._WSFinan_Requisicao SET " +
            " valueAttached='" + value + "' WHERE id=" + id + ";");
    }

    /**
     * 
     * @param {ID} id 
     * @param {Sting} value 
     * @returns 
     */
    SetPendingValue(id = 0, value = "00.00") {
        return this.db.query("UPDATE " + this.db.DatabaseName + "._WSFinan_Requisicao SET " +
            " valuePending='" + value + "' WHERE id=" + id + ";");
    }

    /**
     * 
     * @param {ID} id 
     * @param {Sting} value 
     * @returns 
     */
    SetReservedValue(id = 0, value = "00.00") {
        return this.db.query("UPDATE " + this.db.DatabaseName + "._WSFinan_Requisicao SET " +
            " valueReserved='" + value + "' WHERE id=" + id + ";");
    }


    /**
     * 
     * @param {*} ID 
     * @param {*} status 
     * @param {*} UserID 
     */
    editStatusRequisicao(ID, status, statusChange, UserID) {

        return this.db.query("UPDATE " + this.db.DatabaseName + "._WSFinan_Requisicao SET" +
            " status='" + status + "'," +
            " statusChange='" + statusChange + "'," +
            " modifiedBy='" + UserID + "', modifiedIn='" + Date.now() + "' " +
            " WHERE id='" + ID + "';");
    }

    /**
     * Anexar a Requisicao
     * @param {*} ID 
     * @param {*} filename 
     * @param {*} thumb 
     * @param {*} UserID 
     */
    appendAnexo(ID, name, filename, thumb, UserID) {

        return this.db.query("INSERT INTO " + this.db.DatabaseName + "._WSFinan_RequisicaoAnexos " +
            " (id_requisicao, name, filename, thumb, active, createdBy, createdIn)" +
            " VALUES " +
            " ('" + ID + "','" + name + "','" + filename + "','" + thumb + "',1," + UserID + "," + Date.now() + ");");
    }


    /**
     * Desativar anexo OS
     * @param {Number} ID
     * @param {Boolean} active
     * @param {Number} UserID 
     */
    delAnexo(ID, UserID) {

        return this.db.query("UPDATE " + this.db.DatabaseName + "._WSFinan_RequisicaoAnexos SET" +
            " active=0," +
            " modifiedBy=" + UserID + ", modifiedIn='" + Date.now() + "', " +
            " deactivatedBy='" + UserID + "', deactivatedIn=" + Date.now() + " " +
            " WHERE id=" + ID + ";");
    }


    appendProduto(ID, id_produto, qnt, obs, price, UserID) {
        return this.db.query("INSERT INTO " + this.db.DatabaseName + ".rlt_Produtos_Requisicao " +
            " (id_req, id_produtos, obs , price,qnt, active, createdBy, createdIn)" +
            " VALUES " +
            " ('" + ID + "','" + id_produto + "','" + obs + "','" + price + "'," + qnt + ",1," + UserID + "," + Date.now() + ");");
    }



    edtProduto(ID, qnt, obs, price, UserID) {
        return this.db.query("UPDATE  " + this.db.DatabaseName + ".rlt_Produtos_Requisicao SET " +
            " qnt=" + qnt + ", obs='" + obs + "', price='" + price + "'," +
            " modifiedBy=" + UserID + ", modifiedIn='" + Date.now() + "' " +
            " WHERE id=" + ID + ";");
    }

    /**
     * Desativar anexo OS
     * @param {Number} ID
     * @param {Boolean} active
     * @param {Number} UserID 
     */
    delProduto(ID, UserID) {

        return this.db.query("UPDATE " + this.db.DatabaseName + ".rlt_Produtos_Requisicao SET" +
            " active=0," +
            " modifiedBy=" + UserID + ", modifiedIn='" + Date.now() + "', " +
            " deactivatedBy='" + UserID + "', deactivatedIn=" + Date.now() + " " +
            " WHERE id=" + ID + ";");
    }

}

module.exports = { requisicaiManipulator }