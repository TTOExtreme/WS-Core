const { resolve } = require("path");
const https = require("https");
const WSOP_Product = require('../../../../../WSOP/server/socket/v1/Produtos/dbManipulator').ProdutosManipulator;
const fs = require('fs');
const request = require('request');
const path = require('path').join;
const { exception } = require("console");

let WSOP_ProductClass;
let apiOPLIManipulator;
let trelloManipulator;

class apiManipulator {

    /**
     * Constructor for Class
     * @param {WSMainServer} WSMain
     */
    constructor(WSMain) {
        this.db = WSMain.db;
        this.log = WSMain.log;
        this.cfg = WSMain.cfg;

        WSOP_ProductClass = new WSOP_Product(WSMain);
        apiOPLIManipulator = this;
    }

    /**
     * Lista todos os Clientes cadastrados sem filtro
     */
    ListAll() {
        return this.db.query("SELECT C.*, U.name as createdBy FROM " + this.db.DatabaseName + "._OPLI_Api AS C " +
            " LEFT JOIN " + this.db.DatabaseName + "._User as U on U.id = C.createdBy order by C.id desc;");
    }

    /**
     * Lista todos as Vendas de Site
     */
    ListAllSite(ID = 0, Limit = 100) {
        return this.db.query("SELECT C.id,C.id_li,C.nome_cliente,C.status,C.endingIn,C.createdIn,C.deactivatedIn,C.deactivatedBy,C.modifiedIn,C.modifiedBy,C.tags,C.active,C.name, U.name as createdBy FROM " + this.db.DatabaseName + "._WSOP_Site AS C " +
            " LEFT JOIN " + this.db.DatabaseName + "._User as U on U.id = C.createdBy order by C.id desc LIMIT " + ID + "," + Limit + ";");
    }

    /**
     * Lista todos as Vendas de Site 50 por vez
     */
    ListSite(ID = 0) {
        return this.db.query("SELECT C.id,C.id_li,C.nome_cliente,C.products,C.status,C.endingIn,C.createdIn,C.deactivatedIn,C.deactivatedBy,C.modifiedIn,C.modifiedBy,C.tags,C.description,C.active,C.name, U.name as createdBy FROM " + this.db.DatabaseName + "._WSOP_Site AS C " +
            " LEFT JOIN " + this.db.DatabaseName + "._User as U on U.id = C.createdBy WHERE C.id >= " + ID + " Order By C.id Desc LIMIT 100;");
    }

    /**
     * Lista todos as Vendas de Site 50 por vez
     */
    ListSingleSite(ID = 0) {
        return this.db.query("SELECT C.id,C.id_li,C.nome_cliente,C.products,C.status,C.endingIn,C.createdIn,C.deactivatedIn,C.deactivatedBy,C.modifiedIn,C.modifiedBy,C.tags,C.description,C.active,C.name, U.name as createdBy FROM " + this.db.DatabaseName + "._WSOP_Site AS C " +
            " LEFT JOIN " + this.db.DatabaseName + "._User as U on U.id = C.createdBy WHERE C.id >= " + ID + " LIMIT 1;");
    }


    /**
     * Edita o status da venda do site
     * @param {Number} idSite 
     * @param {Number} status 
     * @param {Number} UserID 
     */
    editStatusOS(idSite, status, UserID) {

        return new Promise((resolve, reject) => {
            this.ListAll().then((APIS) => {
                if (APIS[0]) {
                    if (new apiUtils()._getStatus(status) != "") {
                        return new apiUtils()._setStatus(null, APIS[0].api, APIS[0].aplication, idSite, new apiUtils()._getStatus(status)).then(() => {
                            return this.db.query("UPDATE " + this.db.DatabaseName + "._WSOP_Site SET" +
                                " status='" + status + "'," +
                                " modifiedBy='" + UserID + "', modifiedIn='" + Date.now() + "' " +
                                " WHERE id='" + idSite + "';")
                                .then(() => {
                                    resolve();
                                })
                        })
                    } else {
                        reject("Status Invalido");
                    }
                } else {
                    reject("Nenhuma API Cadastrada");
                }
            })
        })


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

    saveApi(API, aplication, pullproducts, pullsells, pullclients, trelloKey, trelloToken, trelloBoard, trelloList, trelloLabels, active, UserID) {
        return this.db.query("INSERT INTO " + this.db.DatabaseName + "._OPLI_Api" +
            " (api, aplication, pullproducts, pullsells, pullclients,trelloKey,trelloToken,trelloBoard,trelloList,trelloLabels, active, createdBy, createdIn)" +
            " VALUES " +
            " ('" + API + "','" + aplication + "'," + (pullproducts ? 1 : 0) + "," + (pullsells ? 1 : 0) + "," + (pullclients ? 1 : 0) + ",'" + trelloKey + "','" + trelloToken + "','" + trelloBoard + "','" + trelloList + "','" + trelloLabels + "'," + (active ? 1 : 0) + ", " + UserID + ", " + Date.now() + "); ");
    }

    /**
     * Salva venda na base de dados
     * @param {String} API 
     * @param {Boolean} pullproducts 
     * @param {Boolean} pullsells 
     * @param {Boolean} pullclients
     * @param {Boolean} active
     * @param {Number} UserID 
     */

    saveSell(id_li, nome_cliente, dados_cliente, dados_li, products, status, name, endingIn, description, active) {
        return this.db.query("INSERT INTO " + this.db.DatabaseName + "._WSOP_Site" +
            " (id,id_li,description,nome_cliente,dados_cliente,dados_li,products,status,name,endingIn, active, createdBy, createdIn)" +
            " VALUES " +
            " (" + id_li + ",'" + id_li + "','" + description + "','" + nome_cliente + "','" + dados_cliente + "','" + dados_li + "','" + products + "'," + status + ",'" + name + "','" + endingIn + "'," + (active ? 1 : 0) + ",1," + Date.now() + ") ON DUPLICATE KEY UPDATE " +
            " description='" + description + "' , dados_li='" + dados_li + "', products='" + products + "', status='" + status + "', endingIn='" + endingIn + "', active='" + (active ? 1 : 0) + "'" +
            ";");
    }


    /**
     * Atualiza os dados do card do Trello
     * @param {String} id_li ID da Loja Integrada
     * @param {String} trello_ID ID do card Do Trello
     * @param {String} Trello_Data 
     * @param {Number} UserID 
     * @returns 
     */
    editTrelloOS(id_li, trello_ID, Trello_Data) {
        return this.db.query("UPDATE " + this.db.DatabaseName + "._WSOP_Site SET" +
            " id_trello='" + trello_ID + "'," +
            " dados_trello='" + Trello_Data + "'" +
            " WHERE id_li='" + id_li + "';");
    }

    /**
     * Salva venda na base de dados
     * @param {String} API 
     * @param {Boolean} pullproducts 
     * @param {Boolean} pullsells 
     * @param {Boolean} pullclients
     * @param {Boolean} active
     * @param {Number} UserID 
     */

    appendProduct(id_li, product_id, active, UserID) {
        return this.db.query("INSERT INTO " + this.db.DatabaseName + "._OPLI_Api" +
            " (id_li,nome_cliente,dados_cliente,dados_li,status,name,endingIn, active, createdBy, createdIn)" +
            " VALUES " +
            " ('" + id_li + "','" + nome_cliente + "','" + dados_cliente + "','" + dados_li + "','" + status + "','" + name + "','" + endingIn + "'," + (active ? 1 : 0) + "," + UserID + "," + Date.now() + ");");
    }

    /**
     * Load All Products from Loja Integrada
     * @param {Socket} socket 
     * 
     */
    updateProducts(socket, offset = 0) {
        return new Promise((resolve, reject) => {
            this.ListAll().then((APIS) => {
                if (APIS[0]) {
                    socket.emit("ClientEvents", { event: "opli/appendlog", data: "Loading API" })
                    socket.emit("ClientEvents", { event: "opli/appendlog", data: "API: " + APIS[0].api })
                    socket.emit("ClientEvents", { event: "opli/appendlog", data: "Aplication: " + APIS[0].aplication })
                    socket.emit("ClientEvents", { event: "opli/appendlog", data: "Iniciando Cadastro de Produtos" })
                    trelloManipulator = new trelloIntegration(
                        APIS[0].trelloToken,
                        APIS[0].trelloKey,
                        APIS[0].trelloBoard,
                        APIS[0].trelloList,
                        APIS[0].trelloLabels
                    );
                    return new apiUtils()._LoadListProducts(socket, APIS[0].api, APIS[0].aplication, parseInt(offset), true).then(() => {
                        resolve();
                    })
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
    updateSells(socket, offset = 0) {
        return new Promise((resolve, reject) => {
            this.ListAll().then((APIS) => {
                if (APIS[0]) {
                    socket.emit("ClientEvents", { event: "opli/appendlog", data: "Loading API" })
                    socket.emit("ClientEvents", { event: "opli/appendlog", data: "API: " + APIS[0].api })
                    socket.emit("ClientEvents", { event: "opli/appendlog", data: "Aplication: " + APIS[0].aplication })
                    socket.emit("ClientEvents", { event: "opli/appendlog", data: "Iniciando Cadastro de Vendas" })
                    trelloManipulator = new trelloIntegration(
                        APIS[0].trelloToken,
                        APIS[0].trelloKey,
                        APIS[0].trelloBoard,
                        APIS[0].trelloList,
                        APIS[0].trelloLabels
                    );
                    return new apiUtils()._LoadListSells(socket, APIS[0].api, APIS[0].aplication, parseInt(offset)).then(() => { // NUMERO DE ENTRADA DA BASE DE DADOS *********************************************************************************************************************
                        resolve();
                        //Loop de Caregamento
                    })
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
    updateSellsTrello(socket, offset = 0) {
        return new Promise((resolve, reject) => {
            this.ListAll().then((APIS) => {
                if (APIS[0]) {
                    socket.emit("ClientEvents", { event: "opli/appendlog", data: "Loading API" })
                    socket.emit("ClientEvents", { event: "opli/appendlog", data: "API: " + APIS[0].api })
                    socket.emit("ClientEvents", { event: "opli/appendlog", data: "Aplication: " + APIS[0].aplication })
                    socket.emit("ClientEvents", { event: "opli/appendlog", data: "Iniciando Cadastro de Produtos" })
                    trelloManipulator = new trelloIntegration(
                        APIS[0].trelloToken,
                        APIS[0].trelloKey,
                        APIS[0].trelloBoard,
                        APIS[0].trelloList,
                        APIS[0].trelloLabels
                    );
                    return new apiUtils()._LoadListSellsTrello(socket, APIS[0].api, APIS[0].aplication, parseInt(offset), (APIS[0].pullsells == 1 ? true : false)).then(() => { // NUMERO DE ENTRADA DA BASE DE DADOS *********************************************************************************************************************
                        resolve();
                        //Loop de Caregamento
                    })
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
     * Load All Sells from Loja Integrada thats in status 4 Pedido Pago
     * @param {Socket} socket 
     * 
     */
    updatePaidSells(socket) {
        return new Promise((resolve, reject) => {
            this.ListAll().then((APIS) => {
                if (APIS[0]) {
                    if (socket != null) {
                        socket.emit("ClientEvents", { event: "opli/appendlog", data: "Loading API" })
                        socket.emit("ClientEvents", { event: "opli/appendlog", data: "API: " + APIS[0].api })
                        socket.emit("ClientEvents", { event: "opli/appendlog", data: "Aplication: " + APIS[0].aplication })
                        socket.emit("ClientEvents", { event: "opli/appendlog", data: "Iniciando Cadastro de Vendas Pagas" })
                    }
                    trelloManipulator = new trelloIntegration(
                        APIS[0].trelloToken,
                        APIS[0].trelloKey,
                        APIS[0].trelloBoard,
                        APIS[0].trelloList,
                        APIS[0].trelloLabels
                    );
                    return new apiUtils()._LoadListPaidSells(socket, APIS[0].api, APIS[0].aplication, 0).then(() => { // NUMERO DE ENTRADA DA BASE DE DADOS *********************************************************************************************************************
                        resolve();
                        //Loop de Caregamento
                        setTimeout(() => {
                            apiOPLIManipulator.updatePaidSells(socket);

                        }, 60 * 1000);
                    })
                } else {

                    if (socket != null) {
                        socket.emit("ClientEvents", {
                            event: "system_mess",
                            data: {
                                status: "ERROR",
                                mess: "Nenhuma API Cadastrada",
                                time: 1000
                            }
                        })
                    }
                    resolve();
                }
            })
        })
    }

}

class trelloIntegration {

    token = "";
    key = ""
    idList = "";

    Labels = [];

    constructor(trelloToken, trelloKey, trelloBoard, trelloList, trelloLabels) {
        this.token = trelloToken;
        this.key = trelloKey;
        this.idList = trelloList;
        this.Labels = [];
        try {
            this.Labels = JSON.parse(trelloLabels);
        } catch (err) {

        }
    }

    /**
     *  Cria um Card no trello
     * @param {Socket} socket Socket de conexão com o cliente
     * @param {String} name Nome Do Card
     * @param {String} description Descrição do Card
     * @param {Date} dueDate Data de Expiração
     * @param {Boolean} dueStatus Status do Card (DUE Date)
     * @param {Boolean} dueEnable Habilita ou não o DUE
     */
    _CreateCard(socket, name, description, dueDate, dueStatus, dueEnable = true) {
        return new Promise((resolve, rej) => {
            if (this.key != '0') {
                let pa = '/1/cards?key=' + this.key + '&token=' + this.token + '&idList=' + this.idList + '&name=' + name + '&desc=' + description + '&pos=0' + (dueEnable ? '&due=' + dueDate + '&dueComplete=' + (dueStatus ? "true" : "false") : "")

                //replace linejumps and spaces
                pa = pa.replace(new RegExp(" ", "g"), "%20").replace(new RegExp("#", "g"), "%23").replace(new RegExp("\r\n", "g"), "%0A").replace(new RegExp("\n", "g"), "%0A");

                var optionstrello = {
                    host: 'api.trello.com',
                    port: 443,
                    path: pa,
                    method: 'POST',
                    headers: { 'Content-Type': "application/json" }
                };
                let trellojson = "";
                var reqtrello = https.request(optionstrello, function (res) {
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        trellojson += chunk;
                    });
                    res.on('end', function () {
                        if (trellojson != "") {
                            resolve(trellojson);
                        } else {
                            console.log("Retorno de Criação do Card Nulo: ", pa);
                            rej(pa);
                        }
                    });
                });

                reqtrello.on('error', function (e) {
                    console.log('problem with request: ' + e.message);
                });

                reqtrello.end();
            } else {
                resolve();
            }
        });
    }

    /**
     * Adicionar Anexo ao Card
     * @param {Socket} socket Socket de conexão com o cliente
     * @param {String} CardId Id do Card Do trello
     * @param {String} attachment Localização do Arquivo para Adicionar (JPG no momento apenas)
     * @param {Boolean} Cover Attribuir anexo como Capa
     */
    _AddAttachment(socket, CardId, attachment, Cover = true) {
        return new Promise((resolve, rej) => {
            //__dirname + "/../../../../../WSOP/web/img/produtos/" + productCover + "_thumb.jpg"
            if (fs.existsSync(attachment)) {
                //console.log("sending cover");

                let trellocover_pa = "/1/cards/" + CardId + "/attachments?key=" + this.key + "&token=" + this.token + "&setcover=" + (Cover ? "true" : "false");
                trellocover_pa = trellocover_pa.replace(new RegExp(" ", "g"), "%20").replace(new RegExp("#", "g"), "%23").replace(new RegExp("\r\n", "g"), "%0A").replace(new RegExp("\n", "g"), "%0A");

                var req = request.post("https://api.trello.com" + trellocover_pa, function (err, resp, body) {
                    if (err) {
                        console.log('Error on sending Cover!');
                        rej();
                    } else {
                        resolve();
                    }
                });
                var form = req.form();
                form.append('file', fs.createReadStream(attachment), {
                    contentType: 'image/jpeg',
                    filename: 'capa.jpg'
                });
            }
        });
    }

    /**
     * Adiciona um Label para o Card
     * @param {Socket} socket Socket de conexão com o cliente
     * @param {String} CardId Id do Card do Trello
     * @param {Number} LabelId Id do status da venda da Loja integrada
     */
    _addLabel(CardId, LabelId) {
        return new Promise((resolve, rej) => {
            let palabel = "/1/cards/" + CardId + "/idLabels?key=" + this.key + "&token=" + this.token + "&value=";

            palabel += this.Labels[LabelId];

            /**
             * 
             * Retirar esses ids e repassa-los para o banco de dados
             * 
    
            [{"
            */
            //0  Checar Status L.I.
            //1  Checar Status L.I.
            //2 Aguardando Pagamento
            //3 Pagamento em Analise
            //4 Pago
            //5  Checar Status L.I.
            //6  Pagamento em disputa
            //7  Pagamento devolvido
            //8 Cancelado
            //9 Efetuado
            //10  Checar Status L.I.
            //11 Enviado                   
            //12  Checar Status L.I.
            //13 Pronto para Retirada       
            //14 Entregue
            //15  Pedido em Separação       
            //16  Pagamento em chargeback
            //17 Em Produção                

            var optionslabel = {
                host: 'api.trello.com',
                port: 443,
                path: palabel,
                method: 'POST',
                headers: { 'Content-Type': "application/json" }
            };
            let trellolabel = "";
            var reqlabel = https.request(optionslabel, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    trellolabel += chunk;
                });
                res.on('end', function () {
                    console.log(trellolabel);
                    if (trellolabel == "invalid id") {
                        console.log("Erro on seting label:" + json.situacao.id);
                        console.log(trellolabel);
                        rej();
                    } else {
                        resolve();
                    }
                });
            });

            reqlabel.on('error', function (e) {
                console.log('problem with request: ' + e.message);
            });

            reqlabel.end();

        })
    }
}


class apiUtils {


    /**
     * VARIAVEIS PARA ALTERAÇÃO NÃO COMPARTILHAR
     * PRECISA MONTAR UMA ABA DE CADASTRO DESSES DADOS
    */
    block = false; // variavel de blockeio de operação (permite uma comutação apenas)


    /**
     * 
     * @param {Id} StatusID 
     * @returns Status id String
     */
    _getStatus(StatusID) {

        /*
        0  Checar Status L.I.
        1  Checar Status L.I.
        2  Aguardando Pagamento
        3  Pagamento em Analise
        4  Pago
        5  Checar Status L.I.
        6  Pagamento em disputa
        7  Pagamento devolvido
        8  Cancelado
        9  Efetuado
        10 Checar Status L.I.
        11 Enviado
        12 Checar Status L.I.
        13 Pronto para Retirada
        14 Entregue
        15 Pedido em Separação
        16 Pagamento em chargeback
        17 Em Produção
"em_producao","pedido_enviado","pedido_pago","pronto_para_retirada","pedido_cancelado","pedido_efetuado","pedido_em_separacao","pedido_entregue","pagamento_devolvido","pagamento_em_analise","pedido_chargeback","pagamento_em_disputa"]
        //*/
        switch (StatusID) {
            case "2":
                return "aguardando_pagamento";
                break;
            case "3":
                return "pagamento_em_analise";
                break;
            case "4":
                return "pedido_pago";
                break;
            case "6":
                return "pagamento_em_disputa";
                break;
            case "7":
                return "pagamento_devolvido";
                break;
            case "8":
                return "pedido_cancelado";
                break;
            case "9":
                return "pedido_efetuado";
                break;
            case "11":
                return "pedido_enviado";
                break;
            case "13":
                return "pronto_para_retirada";
                break;
            case "14":
                return "pedido_entregue";
                break;
            case "15":
                return "pedido_em_separacao";
                break;
            case "16":
                return "pedido_chargeback";
                break;
            case "17":
                return "em_producao";
                break;
            default:
                return "";
                break;
        }

    }



    _jsonParseble(json) {
        try {
            JSON.parse(json);
            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * Realiza o download de itens 
     * @param {String} uri URL do item para Download
     * @param {String} filename Nome com o local do arquivo
     * @returns {Promise}
     */
    _downloadItem(uri, filename) {
        return new Promise((resolve, rej) => {
            request.head(uri, function (err, res, body) {
                console.log('content-type:', res.headers['content-type']);
                console.log('content-length:', res.headers['content-length']);

                request(uri).pipe(fs.createWriteStream(filename)).on('close', resolve);
            });
        })
    };

    cleanSize(data) {

        data = data.replace("-rn", "")
        data = data.replace("-2", "")
        data = data.replace("-4", "")
        data = data.replace("-6", "")
        data = data.replace("-8", "")
        data = data.replace("-10", "")
        data = data.replace("-12", "")
        data = data.replace("-14", "")
        data = data.replace("-16", "")
        data = data.replace("-pp", "")
        data = data.replace("-p", "")
        data = data.replace("-m", "")
        data = data.replace("-gg", "")
        data = data.replace("-exg", "")
        data = data.replace("-exgg", "")
        data = data.replace("-g3", "")
        data = data.replace("-g4", "")
        data = data.replace("-g", "")

        return data;
    }

    updatePhoto = true; /**VARIAVEL PARA LIBERAR O UPDATE DE IMAGENS */

    //curl -H "Content-Type: application/json" -H "Authorization: chave_api xxxxxxxxx aplicacao xxxxxxxxx" -X GET https://api.awsli.com.br/v1/categoria/
    /**
     * Coleta o Produto da Loja Integrada
     * @param {Socket} socket Conexao socket com o cliente Web (para log)
     * @param {Api_key} api Chave API da Loja integrada
     * @param {Application_key} application Chave de Aplicação da Loja Integrada
     * @param {Int} ID ID do produto da Loja Integrada
     * @returns {Promise}
     */
    _LoadProduct(socket, api, aplication, ID) {
        return new Promise((resolve, rej) => {
            var options = {
                host: 'api.awsli.com.br',
                port: 443,
                path: '/v1/produto/' + ID + '/?descricao_completa=1',
                method: 'GET',
                headers: { 'Content-Type': "application/json", 'Authorization': "chave_api " + api + " aplicacao " + aplication + "" }
            };

            let json = "";
            var req = https.request(options, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    json += chunk;
                });
                res.on('end', function () {




                    var optionsprice = {
                        host: 'api.awsli.com.br',
                        port: 443,
                        path: '/v1/produto_preco/' + ID,
                        method: 'GET',
                        headers: { 'Content-Type': "application/json", 'Authorization': "chave_api " + api + " aplicacao " + aplication + "" }
                    };
                    json = JSON.parse(json);

                    let jsonprice = "";

                    var reqprice = https.request(optionsprice, function (resprice) {
                        resprice.setEncoding('utf8');
                        resprice.on('data', function (chunk) {
                            jsonprice += chunk;
                        });
                        resprice.on('end', function () {
                            //*/

                            try {
                                jsonprice = JSON.parse(jsonprice);
                            } catch (err) {
                                jsonprice = { cheio: "0.0" };
                            }
                            if (jsonprice.cheio == null || jsonprice.cheio == undefined) {
                                jsonprice = { cheio: "0.0" };
                            }


                            //Process json of products

                            //carrega o preco do produto
                            //https://api.awsli.com.br/v1/produto_preco/

                            let img = ""
                            if (json.descricao_completa) {
                                json.descricao_completa = json.descricao_completa.replace(new RegExp("\r\n", "g"), " ").replace(new RegExp("\n", "g"), " ").replace(new RegExp("<br />", "g"), "").replace(new RegExp("<br/", "g"), "").replace(new RegExp("/p", "g"), "").replace(new RegExp("<p>", "g"), "").replace(new RegExp("<", "g"), "").replace(new RegExp("/b", "g"), "").replace(new RegExp(">", "g"), "")
                            } else {
                                json.descricao_completa = "";
                            }
                            let description = '{\"description\":\"' + json.descricao_completa + '\",\"gola\":\"-\",\"vies\":\"Preto\",\"genero\":\"' + ((json.nome || "" + json.descricao_completa || "").toLowerCase().indexOf("fem") > -1 ? "Feminino" : "Masculino") + '\",\"modelo\":\"-\"}';
                            if (json.imagem_principal) {
                                if (json.imagem_principal.grande) {
                                    img = json.imagem_principal.grande;
                                }
                            }
                            let barcode = json.sku || "";
                            barcode = new apiUtils().cleanSize(barcode)

                            if (json.ativo == true || json.ativo == 1 || (json.ativo + "").toLowerCase() == "sim") {
                                json.ativo = 1;
                            } else {
                                json.ativo = 0;
                            }

                            if (!json.nome) {
                                //socket.emit("ClientEvents", { event: "opli/appendlog", data: "Carregado: " + ID })

                                WSOP_ProductClass.ListByBarcode(barcode).then((products) => {
                                    if (!products[0]) {
                                        //createProduto(name, description, barcode, price, priceRevenda, cost, img, inventory, active, revenda = 1, privatelabel = 1, UserID = 1)
                                        WSOP_ProductClass.createProduto("-", description || "", json.sku, parseFloat(jsonprice.cheio), parseFloat(jsonprice.cheio), parseFloat(jsonprice.cheio), img, json.url, 0, json.ativo, 1, 1, 1, ID).then(() => {
                                            resolve();
                                        }).catch(err => {
                                            socket.emit("ClientEvents", { event: "opli/appendlog", data: "ERRO: " + err })
                                            this.log.error("On creating product from Loja Integrada")
                                            this.log.error(json)
                                            this.log.error(err)
                                        })
                                    } else {
                                        if (products[0].name != "-") { json.nome = products[0].name }
                                        //createProduto(name, description, barcode, price, priceRevenda, cost, img, inventory, active, revenda = 1, privatelabel = 1, UserID = 1)
                                        WSOP_ProductClass.editProduto(products[0].id, products[0].name, (products[0].description || description), json.sku, parseFloat(jsonprice.cheio), parseFloat(jsonprice.cheio), parseFloat(jsonprice.cheio), products[0].img, json.url, 0, json.ativo, 1, ID).then(() => {
                                            resolve();
                                        }).catch(err => {
                                            socket.emit("ClientEvents", { event: "opli/appendlog", data: "ERRO: " + err })
                                            this.log.error("On creating product from Loja Integrada")
                                            this.log.error(json)
                                            this.log.error(err)
                                        })
                                    }
                                })
                            } else {
                                if (json.imagem_principal && this.updatePhoto) {

                                    new apiUtils()._downloadItem(json.imagem_principal.grande, path(__dirname + "/../../../../../WSOP/web/img/produtos/" + barcode + ".jpg")).then(() => {

                                        new apiUtils()._downloadItem(json.imagem_principal.pequena, path(__dirname + "/../../../../../WSOP/web/img/produtos/" + barcode + "_thumb.jpg")).then(() => {

                                            //createProduto(name, description, barcode, price, priceRevenda, cost, img, inventory, active, revenda = 1, privatelabel = 1, UserID = 1)
                                            WSOP_ProductClass.updateProduto(ID, json.nome, description || "", json.sku, parseFloat(jsonprice.cheio), parseFloat(jsonprice.cheio), parseFloat(jsonprice.cheio), "produtos/" + barcode + ".jpg", json.url, 0, json.ativo, 1, 1, 1).then(() => {
                                                resolve();
                                            }).catch(err => {
                                                socket.emit("ClientEvents", { event: "opli/appendlog", data: "ERRO: " + err })
                                                this.log.error("On creating product from Loja Integrada")
                                                this.log.error(json)
                                                this.log.error(err)
                                            })
                                        })
                                    })
                                } else {
                                    WSOP_ProductClass.updateProduto(ID, json.nome, description || "", json.sku, parseFloat(jsonprice.cheio), parseFloat(jsonprice.cheio), parseFloat(jsonprice.cheio), img, json.url, 0, json.ativo, 1, 1, 1).then(() => {
                                        resolve();
                                    }).catch(err => {
                                        socket.emit("ClientEvents", { event: "opli/appendlog", data: "ERRO: " + err })
                                        this.log.error("On creating product from Loja Integrada")
                                        this.log.error(json)
                                        this.log.error(err)
                                    })
                                }
                            }

                        });

                    });

                    reqprice.on('error', function (e) {
                        console.log('problem with reqpriceuest: ' + e.message);
                    });

                    reqprice.end();
                    //*/
                })
            });

            req.on('error', function (e) {
                console.log('problem with request: ' + e.message);
                resolve()
            });

            req.end();
        })
    }


    /** 
     * Muda o Status da Loja Integrada
     * @param {Socket} socket 
     * @param {String} api 
     * @param {String} aplication 
     * @param {String} ID Id da Venda
     * @param {String} Status Id do Status ["em_producao","pedido_enviado","pedido_pago","pronto_para_retirada","pedido_cancelado","pedido_efetuado","pedido_em_separacao","pedido_entregue","pagamento_devolvido","    pagamento_em_analise","pedido_chargeback","pagamento_em_disputa"]
     * @returns {Promise}
     */
    //https://api.awsli.com.br/v1/situacao/pedido/<id> --data-binary '{"info": {"status": 4}}'
    _setStatus(socket, api, aplication, ID, Status) {
        return new Promise((resolve, rej) => {
            var options = {
                host: 'api.awsli.com.br',
                port: 443,
                path: '/v1/situacao/pedido/' + ID,
                method: 'PUT',
                headers: { 'Content-Type': "application/json", 'Authorization': "chave_api " + api + " aplicacao " + aplication + "" }
            };

            let json = "";
            var req = https.request(options, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    json += chunk;
                });
                res.on('end', function () {
                    resolve(json);
                });
            });

            req.on('error', function (e) {
                console.log('problem with Setting Status of Sell on Loja Integrada: ' + e.message);
                rej(e);
            });
            req.write('{"codigo": "' + Status + '"}');
            req.end();
        });
    }


    //curl -H "Content-Type: application/json" -H "Authorization: chave_api xxxxxxxxx aplicacao xxxxxxxxx" -X GET https://api.awsli.com.br/v1/categoria/
    //https://api.awsli.com.br/v1/pedido/pedido_id
    /**
         * 
         * @param {Socket} socket 
         * @param {Api_key} api 
         * @param {Application_key} application 
         * @param {Int} ID 
         * @returns 
         */

    _LoadSell(socket, api, aplication, ID, pipeTrello = true) {
        return new Promise((resolve, rej) => {
            var options = {
                host: 'api.awsli.com.br',
                port: 443,
                path: '/v1/pedido/' + ID,
                method: 'GET',
                headers: { 'Content-Type': "application/json", 'Authorization': "chave_api " + api + " aplicacao " + aplication + "" }
            };

            let json = "";
            var req = https.request(options, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    json += chunk;
                });
                res.on('end', function () {
                    //Process json of products
                    json = JSON.parse(json);
                    let description = "";
                    description += "Obs do cliente:\n " + json.cliente_obs;
                    let descriptiontrello = "Obs do cliente:%0A=====%0A " + json.cliente_obs + "%0aItems%0A%2D%2D%2D%2D%2D%2D%0A%0A";
                    let products = [];
                    let productCover = "";
                    if (json.itens != undefined) {
                        json.itens.forEach(item => {
                            products.push(item);

                            if (fs.existsSync(path(__dirname + "/../../../../../WSOP/web/img/produtos/" + item.sku.substring(0, (item.sku.lastIndexOf("-") > -1) ? item.sku.lastIndexOf("-") : item.sku.length) + "_thumb.jpg"))) {
                                productCover = item.sku.substring(0, (item.sku.lastIndexOf("-") > -1) ? item.sku.lastIndexOf("-") : item.sku.length);
                            }
                            descriptiontrello += "%0A%2D " + item.nome + "%0AQNT: %2A%2A" + item.quantidade + "%2A%2A %2D Tam: %2A%2A" + item.sku.substring((item.sku.lastIndexOf("-") > -1) ? item.sku.lastIndexOf("-") : 0) + "%2A%2A%0A![" + item.sku + "](https://rc.sandwalk.com.br:83/Administrativo/module/WSOP/img/produtos/" + item.sku.substring(0, (item.sku.lastIndexOf("-") > -1) ? item.sku.lastIndexOf("-") : item.sku.length) + "_thumb.jpg)";
                        });
                    } else {
                        console.log("Pedido sem item: ");
                        console.log(json);
                    }

                    descriptiontrello = descriptiontrello.replace(new RegExp("/", "g"), "%2F").replace(/[^a-zA-Z0-9"\[\]\r\n}{#@$%&! - +()?_=,.<>:;~^ ]/g, "").replace("'", "").replace(new RegExp(" ", "g"), "%20");
                    if (json.cliente != undefined) {
                        apiOPLIManipulator.saveSell(
                            ID,
                            json.cliente.nome.replace(/[^a-zA-Z0-9úÚóÓéÉàÀêÊõÕãÃáÁ"\[\]\r\n}{#@$%& - +()?_=,.<>:;~^ ]/g, ""),
                            JSON.stringify(json.cliente).replace(/[^a-zA-Z0-9úÚóÓéÉàÀêÊõÕãÃáÁ"\[\]\r\n}{#@$%& - +()?_=,.<>:;~^ ]/g, "").replace("'", ""),
                            JSON.stringify(json).replace(/[^a-zA-Z0-9úÚóÓéÉàÀêÊõÕãÃáÁ"\[\]\r\n}{#@$%& - +()?_=,.<>:;~^ ]/g, "").replace("'", ""),
                            JSON.stringify(products),
                            ((json.situacao.id != 4) ? json.situacao.id : 17),
                            ("#" + json.numero.toString() + " - " + json.cliente.nome).replace(/[^a-zA-Z0-9úÚóÓéÉàÀêÊõÕãÃáÁ"\[\]\r\n}{#@$%& - +()?_=,.<>:;~^ ]/g, ""),
                            (new Date(json.data_expiracao).getTime() || new Date().getTime()),
                            description.replace(/[^a-zA-Z0-9úÚóÓéÉàÀêÊõÕãÃáÁ"\[\]\r\n}{#@$%& - +()?_=,.<>:;~^ ]/g, ""),
                            !json.situacao.cancelado)

                        let name = ("#" + json.numero.toString() + " - " + json.cliente.nome).replace(/[^a-zA-Z0-9"\[\]\r\n}{#@$ - +()_=,.<>:; ]/g, "");




                        let dueComplete = false;
                        if (json.situacao.id == 11 || json.situacao.id == 14) { dueComplete = true; }

                        /*
                            0  Checar Status L.I.
                            1  Checar Status L.I.
                            2  Aguardando Pagamento
                            3  Pagamento em Analise
                            4  Pago
                            5  Checar Status L.I.
                            6  Pagamento em disputa
                            7  Pagamento devolvido
                            8  Cancelado
                            9  Efetuado
                            10 Checar Status L.I.
                            11 Enviado
                            12 Checar Status L.I.
                            13 Pronto para Retirada
                            14 Entregue
                            15 Pedido em Separação
                            16 Pagamento em chargeback
                            17 Em Produção
                        */

                        //Carrega para o Trello Caso A venda esteja no status PAGO e Liberado a criação
                        if (pipeTrello) {
                            if (json.situacao.id == 4 || json.situacao.id == 17) {
                                trelloManipulator._CreateCard(socket, name, descriptiontrello, json.data_expiracao, dueComplete, true).then(trelloCardret => {
                                    if (trelloCardret != undefined) {
                                        let trelloCard = {};
                                        try {
                                            if (new apiUtils()._jsonParseble(trelloCardret)) {
                                                trelloCard = JSON.parse(trelloCardret);
                                            } else {
                                                trelloCard = trelloCardret;
                                            }

                                            if (trelloCard.id != undefined) {
                                                apiOPLIManipulator.editTrelloOS(ID, trelloCard.id, JSON.stringify(trelloCard)).then(() => {
                                                    //verifica a existencia do arquivo para adicionar como capa
                                                    if (fs.existsSync(path(__dirname + "/../../../../../WSOP/web/img/produtos/" + productCover + "_thumb.jpg"))) {
                                                        trelloManipulator._AddAttachment(socket, trelloCard.id, path(__dirname + "/../../../../../WSOP/web/img/produtos/" + productCover + "_thumb.jpg")).then(() => {

                                                        }).catch(err => {
                                                            console.log(err)
                                                        })
                                                    }
                                                    trelloManipulator._addLabel(trelloCard.id, 17).then(() => {
                                                        console.log("Mudar status ID: " + ID + " .. " + trelloCard.id);
                                                        resolve();
                                                        new apiUtils()._setStatus(socket, api, aplication, ID, "em_producao").then((result) => {
                                                            resolve();
                                                        }).catch(err => {
                                                            console.log(err)
                                                        })//*/
                                                    }).catch(err => {
                                                        console.log(err)
                                                        rej(err);
                                                    })
                                                }).catch(err => {
                                                    console.log(err);
                                                    rej(err);
                                                })

                                            } else {
                                                console.log("Erro de criação do card do trello");
                                                console.log(trelloCardret);
                                                rej("Erro Criação card");
                                            }

                                        } catch (err) {
                                            console.log('problem with converting json: ');
                                            console.log(trelloCardret);
                                            console.log(err);
                                            rej(err);
                                        }
                                    } else {
                                        resolve();
                                    }
                                }).catch(err => {
                                    console.log("[ERRO] Card: \nName:" + name + "\nDesc: " + descriptiontrello);
                                    console.log(err)
                                    rej(err);
                                })
                            } else {
                                //DEIXAR COMENTADO ESSE CODIGO DO ELSE PARA NÂO CAUSAR DUPLICATA
                                //Carrega para o Trello caso a venda não tenha os seguintes status
                                if (json.situacao.id != 4 & json.situacao.id != 2 & json.situacao.id != 3 & json.situacao.id != 6 & json.situacao.id != 7 & json.situacao.id != 8 & json.situacao.id != 9 & json.situacao.id != 14 & json.situacao.id != 16) {
                                    trelloManipulator._CreateCard(socket, name, descriptiontrello, json.data_expiracao, dueComplete, true).then(trelloCard => {
                                        try {
                                            trelloCard = JSON.parse(trelloCard);
                                            if (trelloCard.id != undefined) {
                                                apiOPLIManipulator.editTrelloOS(ID, trelloCard.id, JSON.stringify(trelloCard)).then(() => {
                                                    //verifica a existencia do arquivo para adicionar como capa
                                                    if (fs.existsSync(path(__dirname + "/../../../../../WSOP/web/img/produtos/" + productCover + "_thumb.jpg"))) {
                                                        trelloManipulator._AddAttachment(socket, trelloCard.id, path(__dirname + "/../../../../../WSOP/web/img/produtos/" + productCover + "_thumb.jpg")).then(() => {

                                                        }).catch(err => {
                                                            console.log(err)
                                                        })
                                                    }
                                                    trelloManipulator._addLabel(trelloCard.id, json.situacao.id).then(() => {

                                                    }).catch(err => {
                                                        console.log(err)
                                                    })
                                                }).catch(err => {
                                                    console.log(err)
                                                })

                                                //console.log(json);
                                                //console.log(trelloCard);
                                                this.block = true;
                                            } else {
                                                console.log("Erro de criação do card do trello");
                                                rej(e);
                                            }
                                        } catch (err) {
                                            console.log('problem with converting json: ' + trelloCard);
                                            console.log(err);
                                            rej(e);
                                        }
                                    }).catch(err => {
                                        console.log("[ERRO] Card: \nName:" + name + "\nDesc: " + descriptiontrello);
                                        console.log(err)
                                    })
                                }
                            }
                            //*/
                        }
                    }

                    if (this.block) { throw new Error("Block by Server, Pause All Executions") }
                });
            });

            req.on('error', function (e) {
                console.log('problem with request: ' + e.message);

            });

            req.end();
        })
    }


    //curl -H "Content-Type: application/json" -H "Authorization: chave_api xxxxxxxxx aplicacao xxxxxxxxx" -X GET https://api.awsli.com.br/v1/categoria/
    /**
     * 
     * @param {Socket} socket 
     * @param {Api_key} api 
     * @param {Application_key} application 
     * @param {Int} offset 
     * @returns 
     */
    _LoadListProducts(socket, api, aplication, offset, first = false) {
        return new Promise((resolve, rej) => {
            var options = {
                host: 'api.awsli.com.br',
                port: 443,
                path: '/v1/produto/?data_modificacao__gte=2014-04-04&limit=20&offset=' + offset,
                method: 'GET',
                headers: { 'Content-Type': "application/json", 'Authorization': "chave_api " + api + " aplicacao " + aplication + "" }
            };

            let json = "";

            var req = https.request(options, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    json += chunk;
                });
                res.on('end', function () {
                    //Process json of products
                    json = JSON.parse(json);
                    if (json.meta != undefined) {
                        if (first) socket.emit("ClientEvents", { event: "opli/appendlog", data: "Total de Produtos: " + json.meta.total_count })
                        socket.emit("ClientEvents", { event: "opli/appendlog", data: "Percent: " + (((offset) / json.meta.total_count) * 100).toFixed(2) + " | Offset: " + (offset) })

                    } else {
                        socket.emit("ClientEvents", { event: "opli/appendlog", data: "Erro JSON: " + JSON.stringify(json) })
                    }

                    let arr = [];

                    if (json.objects) {
                        if (json.objects.length > 0) {
                            for (let i = 0; i < json.objects.length; i++) {
                                if (json.objects[i])
                                    if (json.objects[i].id) {
                                        //console.log("Percent: " + (((i + offset) / json.meta.total_count) * 100).toFixed(2));

                                        new apiUtils()._LoadProduct(socket, api, aplication, json.objects[i].id)
                                    }
                            }
                            return Promise.all(arr).then(() => {

                                setTimeout(() => {
                                    new apiUtils()._LoadListProducts(socket, api, aplication, offset + 20).then(() => { resolve(); });
                                }, (60 * 1000) / (500 / 20)) //recall de 150 requests por minuto
                            })
                        } else {
                            socket.emit("ClientEvents", { event: "opli/appendlog", data: "Todos os produtos Cadastrados" })
                            resolve();
                        }
                    } else {
                        socket.emit("ClientEvents", { event: "opli/appendlog", data: "Todos os produtos Cadastrados" })
                        resolve();
                    }
                });
            });

            req.on('error', function (e) {
                console.log('problem with request: ' + e.message);
                resolve();
            });

            req.end();
        })
    }

    //curl -H "Content-Type: application/json" -H "Authorization: chave_api xxxxxxxxx aplicacao xxxxxxxxx" -X GET https://api.awsli.com.br/v1/categoria/
    /**
     * https://api.awsli.com.br/v1/pedido/search/?since_numero=pedido_id&situacao_id=situacao_id&pagamento_id=pagamento_id&limit=limit
     * Carrega todos os pedidos da listagem em uma base unica
     * _WSOP_Site_pedidos
     * @param {Socket} socket 
     * @param {Api_key} api 
     * @param {Application_key} application 
     * @param {Int} offset 
     * @returns 
     */
    _LoadListSells(socket, api, aplication, offset) {
        return new Promise((resolve, rej) => {
            var options = {
                host: 'api.awsli.com.br',
                port: 443,
                path: '/v1/pedido/search/?limit=20&since_numero=' + offset,
                method: 'GET',
                headers: { 'Content-Type': "application/json", 'Authorization': "chave_api " + api + " aplicacao " + aplication + "" }
            };

            let json = "";

            var req = https.request(options, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    json += chunk;
                });
                res.on('end', function () {
                    //Process json of products
                    json = JSON.parse(json);
                    if (socket != null) {
                        socket.emit("ClientEvents", { event: "opli/appendlog", data: "Total de Vendas: " + json.meta.total_count })
                    }
                    let arr = [];


                    if (json.objects) {
                        if (json.objects.length > 0) {
                            for (let i = 0; i < json.objects.length; i++) {
                                if (json.objects[i])
                                    if (json.objects[i].numero) {
                                        /*
                                        if (json.objects[i].situacao.id != 2 &&
                                            json.objects[i].situacao.id != 3 &&
                                            json.objects[i].situacao.id != 4 &&
                                            json.objects[i].situacao.id != 8 &&
                                            json.objects[i].situacao.id != 9 &&
                                            json.objects[i].situacao.id != 14) {
                                            /*
                                                0  Checar Status L.I.
                                                1  Checar Status L.I.
                                                2  Aguardando Pagamento
                                                3  Pagamento em Analise
                                                4  Pago
                                                5  Checar Status L.I.
                                                6  Pagamento em disputa
                                                7  Pagamento devolvido
                                                8  Cancelado
                                                9  Efetuado
                                                10 Checar Status L.I.
                                                11 Enviado
                                                12 Checar Status L.I.
                                                13 Pronto para Retirada
                                                14 Entregue
                                                15 Pedido em Separação
                                                16 Pagamento em chargeback
                                                17 Em Produção
                                            */
                                        //console.log("Percent: " + (((i + offset) / json.meta.total_count) * 100).toFixed(2));
                                        //socket.emit("ClientEvents", { event: "opli/appendlog", data: "Percent: " + (((i + offset) / json.meta.total_count) * 100).toFixed(2) })
                                        new apiUtils()._LoadSell(socket, api, aplication, json.objects[i].numero, false).then(result => {
                                            //resolve();
                                        }).catch(err => {

                                        })
                                        //}
                                    }
                            }
                            return Promise.all(arr).then(() => {
                                setTimeout(() => {
                                    new apiUtils()._LoadListSells(socket, api, aplication, offset + 20).then(() => { resolve(); }).catch(err => { });
                                }, (30 * 1000))
                                // sao 300 por minuto mas estamos fazendo 40 para não exceder ou seja 20 a cada 30 segundos
                            })
                        } else {
                            if (socket != null) {
                                socket.emit("ClientEvents", { event: "opli/appendlog", data: "Todos as Vendas Cadastrados" })
                            }
                            resolve();
                        }
                    } else {
                        if (socket != null) {
                            socket.emit("ClientEvents", { event: "opli/appendlog", data: "Todos as Vendas Cadastrados" })
                        }
                        resolve();
                    }
                });
            });

            req.on('error', function (e) {
                console.log('problem with request: ' + e.message);
            });

            req.end();
        })
    }

    //curl -H "Content-Type: application/json" -H "Authorization: chave_api xxxxxxxxx aplicacao xxxxxxxxx" -X GET https://api.awsli.com.br/v1/categoria/
    /**
     * https://api.awsli.com.br/v1/pedido/search/?since_numero=pedido_id&situacao_id=situacao_id&pagamento_id=pagamento_id&limit=limit
     * Carrega todos os pedidos da listagem em uma base unica para o trello (pedidos em aber)
     * _WSOP_Site_pedidos
     * @param {Socket} socket 
     * @param {Api_key} api 
     * @param {Application_key} application 
     * @param {Int} offset 
     * @returns 
     */
    _LoadListSellsTrello(socket, api, aplication, offset, uploadTrello = true) {
        return new Promise((resolve, rej) => {
            var options = {
                host: 'api.awsli.com.br',
                port: 443,
                path: '/v1/pedido/search/?limit=20&since_numero=' + offset + '&situacao_id=17',
                method: 'GET',
                headers: { 'Content-Type': "application/json", 'Authorization': "chave_api " + api + " aplicacao " + aplication + "" }
            };

            let json = "";

            var req = https.request(options, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    json += chunk;
                });
                res.on('end', function () {
                    //Process json of products
                    json = JSON.parse(json);
                    if (socket != null) {
                        socket.emit("ClientEvents", { event: "opli/appendlog", data: "Total de Vendas: " + json.meta.total_count })
                    }
                    let arr = [];

                    if (json.objects) {
                        if (json.objects.length > 0) {
                            let lastid = 0;
                            for (let i = 0; i < json.objects.length; i++) {
                                if (json.objects[i])
                                    if (json.objects[i].numero) {
                                        if (lastid < json.objects[i].numero) {
                                            lastid = json.objects[i].numero;
                                        }
                                        /*
                                            0  Checar Status L.I.
                                            1  Checar Status L.I.
                                            2  Aguardando Pagamento
                                            3  Pagamento em Analise
                                            4  Pago
                                            5  Checar Status L.I.
                                            6  Pagamento em disputa
                                            7  Pagamento devolvido
                                            8  Cancelado
                                            9  Efetuado
                                            10 Checar Status L.I.
                                            11 Enviado
                                            12 Checar Status L.I.
                                            13 Pronto para Retirada
                                            14 Entregue
                                            15 Pedido em Separação
                                            16 Pagamento em chargeback
                                            17 Em Produção
                                        */
                                        new apiUtils()._LoadSell(socket, api, aplication, json.objects[i].numero, uploadTrello).then(result => {
                                            //resolve();
                                        }).catch(err => {

                                        })

                                    }
                            }
                            return Promise.all(arr).then(() => {
                                setTimeout(() => {
                                    new apiUtils()._LoadListSellsTrello(socket, api, aplication, lastid + 1, uploadTrello).then(() => { resolve(); }).catch(err => { });
                                }, (30 * 1000))
                                // sao 300 por minuto mas estamos fazendo 40 para não exceder ou seja 20 a cada 30 segundos
                            })
                        } else {
                            if (socket != null) {
                                socket.emit("ClientEvents", { event: "opli/appendlog", data: "Todos as Vendas Cadastradas e enviadas ao Trello" })
                            }
                            resolve();
                        }
                    } else {
                        if (socket != null) {
                            socket.emit("ClientEvents", { event: "opli/appendlog", data: "Todos as Vendas Cadastradas e enviadas ao Trello" })
                        }
                        resolve();
                    }
                });
            });

            req.on('error', function (e) {
                console.log('problem with request: ' + e.message);
            });

            req.end();
        })
    }


    //curl -H "Content-Type: application/json" -H "Authorization: chave_api xxxxxxxxx aplicacao xxxxxxxxx" -X GET https://api.awsli.com.br/v1/categoria/
    /**
     * https://api.awsli.com.br/v1/pedido/search/?since_numero=pedido_id&situacao_id=situacao_id&pagamento_id=pagamento_id&limit=limit
     * Carrega todos os pedidos da listagem em uma base unica
     * _WSOP_Site_pedidos
     * @param {Socket} socket 
     * @param {Api_key} api 
     * @param {Application_key} application 
     * @param {Int} offset 
     * @returns 
     */
    _LoadListPaidSells(socket, api, aplication, offset) {
        return new Promise((resolve, rej) => {
            var options = {
                host: 'api.awsli.com.br',
                port: 443,
                path: '/v1/pedido/search/?limit=20&since_numero=' + offset + '&situacao_id=4',
                method: 'GET',
                headers: { 'Content-Type': "application/json", 'Authorization': "chave_api " + api + " aplicacao " + aplication + "" }
            };

            let json = "";

            var req = https.request(options, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    json += chunk;
                });
                res.on('end', function () {
                    //Process json of products
                    try {
                        json = JSON.parse(json);
                        if (socket != null) {
                            socket.emit("ClientEvents", { event: "opli/appendlog", data: "Total de Vendas: " + json.meta.total_count })
                        } else {
                            if (json.meta.total_count > 0) {
                                console.log("Cadastrando Vendas Pagas: " + json.meta.total_count)
                            }
                        }
                        let arr = [];


                        if (json.objects) {
                            if (json.objects.length > 0) {
                                let lastid = 0;
                                for (let i = 0; i < json.objects.length; i++) {
                                    if (json.objects[i])
                                        if (json.objects[i].numero) {
                                            if (lastid < json.objects[i].numero) {
                                                lastid = json.objects[i].numero;
                                            }
                                            //console.log("Percent: " + (((i + offset) / json.meta.total_count) * 100).toFixed(2));
                                            //socket.emit("ClientEvents", { event: "opli/appendlog", data: "Percent: " + (((i + offset) / json.meta.total_count) * 100).toFixed(2) })
                                            new apiUtils()._LoadSell(socket, api, aplication, json.objects[i].numero).then().catch();

                                        }
                                }
                                return Promise.all(arr).then(() => {
                                    setTimeout(() => {
                                        new apiUtils()._LoadListPaidSells(socket, api, aplication, lastid + 1)
                                            .then(() => { resolve(); })
                                            .catch(err => {
                                                console.log("[Erro] on processing multiple sells: ", err)
                                            });
                                    }, (30 * 1000))
                                    // sao 300 por minuto mas estamos fazendo 40 para não exceder ou seja 20 a cada 30 segundos
                                })
                            } else {
                                if (socket != null) {
                                    socket.emit("ClientEvents", { event: "opli/appendlog", data: "Todos as Vendas Pagas Cadastradas" })
                                }
                                resolve();
                            }
                        } else {
                            if (socket != null) {
                                socket.emit("ClientEvents", { event: "opli/appendlog", data: "Todos as Vendas Pagas Cadastradas" })
                            }
                            resolve();
                        }

                    } catch (err) {
                        console.log("Erro ao processar JSON OPLI > _LoadListPaidSells:", err)
                        rej("Erro ao processar JSON OPLI > _LoadListPaidSells:");
                    }
                });
            });

            req.on('error', function (e) {
                console.log('problem with request: ' + e.message);
                rej("Request Error");
            });

            req.end();
        })
    }
}

module.exports = { apiManipulator }