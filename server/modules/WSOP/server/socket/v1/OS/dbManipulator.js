

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
     * Lista todos As OS cadastrados sem filtro
     */
    ListAll(id = "", createdBy = "", cliente = "", status = "") {
        let st = "";
        if (typeof (status) == typeof ([])) {
            st = " AND";
            status.forEach((sts, index) => {
                st += (index > 0 ? " OR" : " ") + " OS.status = '" + sts + "' ";
            })
            status = st;
        } else {
            if (status != "") {
                st = " AND OS.status LIKE '%" + status + "%'";
            }
        }
        return this.db.query("SELECT OS.id, OS.createdIn, OS.endingIn,OS.price, OS.statusChange, OS.status ,OS.status as status2, U.name as createdBy, OS.createdBy as creatorId, C.name as cliente FROM " + this.db.DatabaseName + "._WSOP_OS AS OS " +
            " LEFT JOIN " + this.db.DatabaseName + "._User as U on U.id = OS.createdBy " +
            " LEFT JOIN " + this.db.DatabaseName + "._WSOP_Cliente as C on C.id = OS.id_cliente " +
            " WHERE OS.active=1 " +

            (id != "" ? " AND OS.id =" + id + "" : "") +
            (createdBy != "" ? " AND U.name LIKE'%" + createdBy + "%'" : "") +
            (cliente != "" ? " AND C.name LIKE'%" + cliente + "%'" : "") +
            st +

            " ORDER BY OS.id DESC LIMIT 50;");
    }

    /**
     * Lista todos As OS cadastrados sem filtro
     */
    ListID(id = "") {
        return this.db.query("SELECT OS.*, U.name as createdBy, OS.createdBy as creatorId, U.email as U_email, U.telefone as U_telefone, C.name as cliente, C.cpf_cnpj as C_cpf_cnpj, C.logradouro C_logradouro,C.responsavel as C_responsavel, C.numero as C_numero, C.bairro as C_bairro, C.municipio as C_municipio, C.cep as C_cep, C.uf as C_uf, C.country as C_country, C.email as C_email, C.telefone as C_telefone FROM " + this.db.DatabaseName + "._WSOP_OS AS OS " +
            " LEFT JOIN " + this.db.DatabaseName + "._User as U on U.id = OS.createdBy " +
            " LEFT JOIN " + this.db.DatabaseName + "._WSOP_Cliente as C on C.id = OS.id_cliente " +
            " WHERE OS.active=1 " + ((id != "") ? " AND OS.id=" + id : ";") + " ;").then((list) => {
                let allProm = [];
                let result = [];
                list.forEach(item => {
                    allProm.push(new Promise((resolve, reject) => {
                        return this.db.query("SELECT * FROM " + this.db.DatabaseName + "._WSOP_OSAnexos  WHERE active=1 AND id_os=" + item.id + ";").then(anexos => {
                            return this.db.query("SELECT R.*, P.name, P.barcode,P.img,P.price,P.cost, P.description FROM " + this.db.DatabaseName + ".rlt_Produtos_OS AS R " +
                                " LEFT JOIN " + this.db.DatabaseName + "._WSOP_Produtos as P on P.id = R.id_produtos " +
                                " WHERE R.active=1 AND R.id_os=" + item.id + ";").then(produtos => {
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
     * Criar Cliente
     * @param {String} id_Cliente 
     * @param {String} description 
     * @param {String} barcode 
     * @param {String} price 
     * @param {String} cost 
     * @param {String} inventory 
     * @param {Number} UserID ID do usuario cadastrando
     */
    createOS(id_Cliente, description, status, statusChange, formaEnvio, caixa, country, uf, prazo, endingIn, active, UserID) {
        let sql = "INSERT INTO " + this.db.DatabaseName + "._WSOP_OS" +
            " (id_Cliente, description, status,statusChange, formaEnvio, prazo, endingIn, active, createdBy, createdIn)" +
            " VALUES " +
            " ('" + id_Cliente + "','" + description + "','" + status + "','" + (JSON.stringify(statusChange)) + "','" + formaEnvio + "','" + prazo + "'," + endingIn + "," + (active ? 1 : 0) + "," + UserID + "," + Date.now() + ");";
        return this.db.query(sql);
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
    editOS(ID, description, formaEnvio, caixa, country, uf, precoEnvio, desconto, prazo, price, endingIn, active, UserID) {
        return this.db.query("UPDATE " + this.db.DatabaseName + "._WSOP_OS SET" +
            " description='" + description + "'," +
            " formaEnvio='" + formaEnvio + "'," +
            " caixa='" + caixa + "'," +
            " country='" + country + "'," +
            " uf='" + uf + "'," +
            " prazo='" + prazo + "'," +
            " price='" + price + "'," +
            " precoEnvio='" + precoEnvio + "'," +
            " desconto='" + desconto + "'," +
            " endingIn=" + endingIn + "," +
            " active=" + (active ? 1 : 0) + "," +
            " modifiedBy='" + UserID + "', modifiedIn='" + Date.now() + "' " +
            " WHERE id='" + ID + "';");
    }

    /**
     * 
     * @param {*} ID 
     * @param {*} status 
     * @param {*} UserID 
     */
    editStatusOS(ID, status, statusChange, UserID) {

        return this.db.query("UPDATE " + this.db.DatabaseName + "._WSOP_OS SET" +
            " status='" + status + "'," +
            " statusChange='" + statusChange + "'," +
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
     * Anexar a OS
     * @param {*} ID 
     * @param {*} filename 
     * @param {*} thumb 
     * @param {*} UserID 
     */
    appendAnexo(ID, name, filename, thumb, UserID) {

        return this.db.query("INSERT INTO " + this.db.DatabaseName + "._WSOP_OSAnexos " +
            " (id_os, name, filename, thumb, active, createdBy, createdIn)" +
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

        return this.db.query("UPDATE " + this.db.DatabaseName + "._WSOP_OSAnexos SET" +
            " active=0," +
            " modifiedBy=" + UserID + ", modifiedIn='" + Date.now() + "', " +
            " deactivatedBy='" + UserID + "', deactivatedIn=" + Date.now() + " " +
            " WHERE id=" + ID + ";");
    }


    appendProduto(ID, id_produto, qnt, obs, UserID) {
        return this.db.query("INSERT INTO " + this.db.DatabaseName + ".rlt_Produtos_OS " +
            " (id_os, id_produtos, obs,qnt, active, createdBy, createdIn)" +
            " VALUES " +
            " ('" + ID + "','" + id_produto + "','" + obs + "'," + qnt + ",1," + UserID + "," + Date.now() + ");");
    }



    edtProduto(ID, qnt, obs, UserID) {
        return this.db.query("UPDATE  " + this.db.DatabaseName + ".rlt_Produtos_OS SET " +
            " qnt=" + qnt + ", obs='" + obs + "'," +
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

        return this.db.query("UPDATE " + this.db.DatabaseName + ".rlt_Produtos_OS SET" +
            " active=0," +
            " modifiedBy=" + UserID + ", modifiedIn='" + Date.now() + "', " +
            " deactivatedBy='" + UserID + "', deactivatedIn=" + Date.now() + " " +
            " WHERE id=" + ID + ";");
    }
}

module.exports = { osManipulator }