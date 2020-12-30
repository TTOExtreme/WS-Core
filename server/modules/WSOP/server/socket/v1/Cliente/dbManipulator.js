

class ClienteManipulator {

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
        return this.db.query("SELECT C.*, U.name as createdBy FROM " + this.db.DatabaseName + "._WSOP_Cliente AS C " +
            " LEFT JOIN " + this.db.DatabaseName + "._User as U on U.id = C.createdBy " +
            " WHERE C.active=1;");
    }

    /**
     * Lista todos os Clientes cadastrados sem filtro
     */
    ListAllOs() {
        return this.db.query("SELECT C.id, C.name FROM " + this.db.DatabaseName + "._WSOP_Cliente AS C " +
            " WHERE C.active=1;");
    }


    /**
     * Criar Cliente
     * @param {String} name 
     * @param {String} responsavel 
     * @param {String} cpf_cnpj 
     * @param {Boolean} iscnpj 
     * @param {String} cep 
     * @param {String} logradouro 
     * @param {String} numero 
     * @param {String} municipio 
     * @param {String} uf 
     * @param {String} telefone 
     * @param {String} email 
     * @param {Number} UserID ID do usuario cadastrando
     */
    createCliente(name, responsavel, cpf_cnpj, iscnpj, cep, logradouro, numero, bairro, municipio, uf, telefone, email, active, UserID) {

        return this.db.query("INSERT INTO " + this.db.DatabaseName + "._WSOP_Cliente" +
            " (name, responsavel, cpf_cnpj, iscnpj, cep, logradouro, numero, bairro, municipio, uf, telefone, email, active, createdBy, createdIn)" +
            " VALUES " +
            " ('" + name + "','" + responsavel + "','" + cpf_cnpj + "'," + (iscnpj ? 1 : 0) + ",'" + cep + "','" + logradouro + "','" + numero + "','" + bairro + "','" + municipio + "','" + uf + "','" + telefone + "','" + email + "'," + (active ? 1 : 0) + "," + UserID + "," + Date.now() + ");");
    }

    /**
     * Editar cadastro do cliente
     * @param {Number} ID
     * @param {String} name 
     * @param {String} responsavel 
     * @param {String} cpf_cnpj 
     * @param {Boolean} iscnpj 
     * @param {String} cep 
     * @param {String} logradouro 
     * @param {String} numero 
     * @param {String} municipio 
     * @param {String} uf 
     * @param {String} telefone 
     * @param {String} email 
     * @param {Number} UserID 
     */
    editCliente(ID, name, responsavel, cpf_cnpj, iscnpj, cep, logradouro, numero, bairro, municipio, uf, telefone, email, active, UserID) {

        return this.db.query("UPDATE " + this.db.DatabaseName + "._WSOP_Cliente SET" +
            ((name != "") ? " name='" + name + "'," : " ") +
            ((responsavel != "") ? " responsavel='" + responsavel + "'," : " ") +
            ((cpf_cnpj != "") ? " cpf_cnpj='" + cpf_cnpj + "'," : " ") +
            ((iscnpj != "") ? " iscnpj='" + (iscnpj ? 1 : 0) + "'," : " ") +
            ((cep != "") ? " cep='" + cep + "'," : " ") +
            ((logradouro != "") ? " logradouro='" + logradouro + "'," : " ") +
            ((numero != "") ? " numero='" + numero + "'," : " ") +
            ((bairro != "") ? " bairro='" + bairro + "'," : " ") +
            ((municipio != "") ? " municipio='" + municipio + "'," : " ") +
            ((uf != "") ? " uf='" + uf + "'," : " ") +
            ((telefone != "") ? " telefone='" + telefone + "'," : " ") +
            ((email != "") ? " email='" + email + "'," : " ") +
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
    disableCliente(ID, active, UserID) {

        return this.db.query("UPDATE " + this.db.DatabaseName + "._WSOP_Cliente SET" +
            " active=" + (active ? 1 : 0) + "," +
            " modifiedBy=" + UserID + ", modifiedIn='" + Date.now() + "' " +
            ((active) ?
                " ,deactivatedBy=null, deactivatedIn=null " :
                " ,deactivatedBy='" + UserID + "', deactivatedIn=" + Date.now() + " ") +
            " ,modifiedBy='" + UserID + "', modifiedIn=" + Date.now() + " " +
            " WHERE id=" + ID + ";");
    }

}

module.exports = { ClienteManipulator }