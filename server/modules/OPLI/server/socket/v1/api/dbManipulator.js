const { resolve } = require("path");
const https = require("https");

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
     * Lista todos os Clientes cadastrados sem filtro
     */
    ListAll() {
        return this.db.query("SELECT C.*, U.name as createdBy FROM " + this.db.DatabaseName + "._OPLI_Api AS C " +
            " LEFT JOIN " + this.db.DatabaseName + "._User as U on U.id = C.createdBy order by C.id desc;");
    }

    /**
     * Editar cadastro do cliente
     * @param {String} API 
     * @param {Boolean} pullproducts 
     * @param {Boolean} pullsells 
     * @param {Boolean} pullclients
     * @param {Boolean} active
     * @param {Number} UserID 
     */

    saveApi(API, aplication, pullproducts, pullsells, pullclients, active, UserID) {
        return this.db.query("INSERT INTO " + this.db.DatabaseName + "._OPLI_Api" +
            " (api, aplication, pullproducts, pullsells, pullclients, active, createdBy, createdIn)" +
            " VALUES " +
            " ('" + API + "'," + aplication + "'," + (pullproducts ? 1 : 0) + "," + (pullsells ? 1 : 0) + "," + (pullclients ? 1 : 0) + "," + (active ? 1 : 0) + "," + UserID + "," + Date.now() + ");");
    }

    /**
     * Load All Products from Loja Integrada
     * @param {Socket} socket 
     * 
     */
    updateProducts(socket) {
        return new Promise((resolve, reject) => {
            this.ListAll().then((APIS) => {
                if (APIS[0]) {
                    socket.emit("ClientEvents", { event: "opli/appendlog", data: "Loading API" })
                    socket.emit("ClientEvents", { event: "opli/appendlog", data: "API: " + APIS[0].api })
                    socket.emit("ClientEvents", { event: "opli/appendlog", data: "Iniciando Cadastro de Produtos" })

                    //curl -H "Content-Type: application/json" -H "Authorization: chave_api xxxxxxxxx aplicacao xxxxxxxxx" -X GET https://api.awsli.com.br/v1/categoria/


                    const fetch = require('node-fetch');

                    let url = "https://api.awsli.com.br/v1/categoria/";

                    let settings = { method: "Get", Headers: { 'Content-Type': "application/json", 'Authorization': " chave_api " + APIS[0].api + " aplicacao " + APIS[0].aplication + "" } };

                    fetch(url, settings)
                        .then(res => res.json())
                        .then((json) => {
                            socket.emit("ClientEvents", { event: "opli/appendlog", data: json })
                            // do something with JSON
                        });









                    resolve();
                } else {
                    socket.emit("ClientEvents", {
                        event: "system_mess",
                        data: {
                            status: "ERROR",
                            mess: "Nenhuma API Cadastrada",
                            time: 1000
                        }
                    })
                    resolve();
                }
            })
        })
    }

    /**
     * Load All Clients from Loja Integrada
     * @param {Socket} socket 
     * 
     */
    updateClients(socket) {
        return new Promise((resolve, reject) => {
            this.ListAll().then(APIS => {
                if (APIS[0]) {
                    socket.emit("ClientEvents", {
                        event: "opli/appendlog",
                        data: "info"
                    })
                    resolve();
                } else {
                    socket.emit("ClientEvents", {
                        event: "system_mess",
                        data: {
                            status: "ERROR",
                            mess: "Nenhuma API Cadastrada",
                            time: 1000
                        }
                    })
                    resolve();
                }
            })
        })
    }

    /**
     * Load All Sells from Loja Integrada
     * @param {Socket} socket 
     * 
     */
    updateSells(socket) {
        return new Promise((resolve, reject) => {
            this.ListAll().then(APIS => {
                if (APIS[0]) {
                    socket.emit("ClientEvents", {
                        event: "opli/appendlog",
                        data: "info"
                    })
                    resolve();
                } else {
                    socket.emit("ClientEvents", {
                        event: "system_mess",
                        data: {
                            status: "ERROR",
                            mess: "Nenhuma API Cadastrada",
                            time: 1000
                        }
                    })
                    resolve();
                }
            })
        })
    }

}

module.exports = { apiManipulator }