

class emitenteManipulator {

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
        return this.db.query("SELECT C.*, U.name as createdBy FROM " + this.db.DatabaseName + "._WSOP_Emitente AS C " +
            " LEFT JOIN " + this.db.DatabaseName + "._User as U on U.id = C.createdBy order by C.id desc;");
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

    saveEmitente(name, responsavel, cpf_cnpj, iscnpj, cep, logradouro, numero, bairro, municipio, uf, telefone, email, img, UserID) {
        return this.db.query("INSERT INTO " + this.db.DatabaseName + "._WSOP_Emitente" +
            " (name, responsavel, cpf_cnpj, iscnpj, cep, logradouro, numero, bairro, municipio, uf, telefone, email, img, createdBy, createdIn)" +
            " VALUES " +
            " ('" + name + "','" + responsavel + "','" + cpf_cnpj + "'," + (iscnpj ? 1 : 0) + ",'" + cep + "','" + logradouro + "','" + numero + "','" + bairro + "','" + municipio + "','" + uf + "','" + telefone + "','" + email + "','" + img + "'," + UserID + "," + Date.now() + ");");
    }

}

module.exports = { emitenteManipulator }