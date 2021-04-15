const { resolve } = require("path");
const https = require("https");
const WSOP_Product = require('../../../../../WSOP/server/socket/v1/Produtos/dbManipulator').ProdutosManipulator;
const fs = require('fs');
const request = require('request');
const path = require('path').join;

let WSOP_ProductClass;
let apiOPLIManipulator;

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
    ListAllSite() {
        console.log("list site")
        return this.db.query("SELECT C.id,C.id_li,C.nome_cliente,C.dados_cliente,C.products,C.status,C.endingIn,C.createdIn,C.deactivatedIn,C.deactivatedBy,C.modifiedIn,C.modifiedBy,C.tags,C.description,C.active,C.name, U.name as createdBy FROM " + this.db.DatabaseName + "._WSOP_Site AS C " +
            " LEFT JOIN " + this.db.DatabaseName + "._User as U on U.id = C.createdBy order by C.id_li desc limit 50;");
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
            " ('" + API + "','" + aplication + "'," + (pullproducts ? 1 : 0) + "," + (pullsells ? 1 : 0) + "," + (pullclients ? 1 : 0) + "," + (active ? 1 : 0) + "," + UserID + "," + Date.now() + ");");
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
            " (id_li,description,nome_cliente,dados_cliente,dados_li,products,status,name,endingIn, active, createdBy, createdIn)" +
            " VALUES " +
            " ('" + id_li + "','" + description + "','" + nome_cliente + "','" + dados_cliente + "','" + dados_li + "','" + products + "'," + status + ",'" + name + "','" + endingIn + "'," + (active ? 1 : 0) + ",1," + Date.now() + ");");
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
    updateProducts(socket) {
        return new Promise((resolve, reject) => {
            this.ListAll().then((APIS) => {
                if (APIS[0]) {
                    socket.emit("ClientEvents", { event: "opli/appendlog", data: "Loading API" })
                    socket.emit("ClientEvents", { event: "opli/appendlog", data: "API: " + APIS[0].api })
                    socket.emit("ClientEvents", { event: "opli/appendlog", data: "Aplication: " + APIS[0].aplication })
                    socket.emit("ClientEvents", { event: "opli/appendlog", data: "Iniciando Cadastro de Produtos" })
                    return new apiUtils()._LoadListProducts(socket, APIS[0].api, APIS[0].aplication, 0).then(() => {
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
    updateSells(socket) {
        return new Promise((resolve, reject) => {
            this.ListAll().then((APIS) => {
                if (APIS[0]) {
                    socket.emit("ClientEvents", { event: "opli/appendlog", data: "Loading API" })
                    socket.emit("ClientEvents", { event: "opli/appendlog", data: "API: " + APIS[0].api })
                    socket.emit("ClientEvents", { event: "opli/appendlog", data: "Aplication: " + APIS[0].aplication })
                    socket.emit("ClientEvents", { event: "opli/appendlog", data: "Iniciando Cadastro de Vendas" })
                    return new apiUtils()._LoadListSells(socket, APIS[0].api, APIS[0].aplication, 4258).then(() => {
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

}


class apiUtils {


    _downloadItem(uri, filename, callback) {
        return new Promise((resolve, rej) => {
            request.head(uri, function (err, res, body) {
                console.log('content-type:', res.headers['content-type']);
                console.log('content-length:', res.headers['content-length']);

                request(uri).pipe(fs.createWriteStream(filename)).on('close', resolve);
            });

        })
    };

    //curl -H "Content-Type: application/json" -H "Authorization: chave_api xxxxxxxxx aplicacao xxxxxxxxx" -X GET https://api.awsli.com.br/v1/categoria/
    /**
     * 
     * @param {Socket} socket 
     * @param {Api_key} api 
     * @param {Application_key} application 
     * @param {Int} ID 
     * @returns 
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
                    //Process json of products
                    json = JSON.parse(json);
                    let img = ""
                    if (json.descricao_completa) {
                        json.descricao_completa = json.descricao_completa.replace(new RegExp("\r\n", "g"), " ").replace(new RegExp("\n", "g"), " ").replace(new RegExp("<br />", "g"), "").replace(new RegExp("<br/", "g"), "").replace(new RegExp("/p", "g"), "").replace(new RegExp("<p>", "g"), "").replace(new RegExp("<", "g"), "").replace(new RegExp("/b", "g"), "").replace(new RegExp(">", "g"), "")
                    } else {
                        json.descricao_completa = "";
                    }
                    let description = '{\"description\":\"' + json.descricao_completa + '\",\"gola\":\"-\",\"vies\":\"Preto\",\"genero\":\"' + ((json.nome || "" + json.descricao_completa || "").toLowerCase().indexOf("fem") > -1 ? "Feminino" : "Masculino") + '\",\"modelo\":\"0\"}';
                    if (json.imagem_principal) {
                        if (json.imagem_principal.grande) {
                            img = json.imagem_principal.grande;
                        }
                    }
                    let barcode = json.sku || "";

                    barcode = barcode.replace("-rn", "")
                    barcode = barcode.replace("-2", "")
                    barcode = barcode.replace("-4", "")
                    barcode = barcode.replace("-6", "")
                    barcode = barcode.replace("-8", "")
                    barcode = barcode.replace("-10", "")
                    barcode = barcode.replace("-12", "")
                    barcode = barcode.replace("-14", "")
                    barcode = barcode.replace("-16", "")
                    barcode = barcode.replace("-pp", "")
                    barcode = barcode.replace("-p", "")
                    barcode = barcode.replace("-m", "")
                    barcode = barcode.replace("-g", "")
                    barcode = barcode.replace("-gg", "")
                    barcode = barcode.replace("-exg", "")
                    barcode = barcode.replace("-exgg", "")
                    barcode = barcode.replace("-g3", "")
                    barcode = barcode.replace("-g4", "")

                    if (!json.nome) {
                        socket.emit("ClientEvents", { event: "opli/appendlog", data: "Carregado: " + ID })

                        WSOP_ProductClass.ListByBarcode(barcode).then((products) => {
                            if (!products[0]) {
                                resolve(); //necessario rodar 2 vezes o processo de cadastro pois os pais nem sempre vem antes dos filhos
                            } else {
                                WSOP_ProductClass.createProduto(products[0].name, products[0].description || description, json.sku, 0, 0, products[0].img, 0, json.ativo, 1).then(() => {
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
                        if (json.imagem_principal) {
                            new apiUtils()._downloadItem(json.imagem_principal.grande, path(__dirname + "/../../../../../WSOP/web/img/produtos/" + barcode + ".jpg")).then(() => {

                                new apiUtils()._downloadItem(json.imagem_principal.pequena, path(__dirname + "/../../../../../WSOP/web/img/produtos/" + barcode + "_thumb.jpg")).then(() => {

                                    WSOP_ProductClass.createProduto(json.nome, description || "", json.sku, 0, 0, "produtos/" + barcode + ".jpg", 0, json.ativo, 1).then(() => {
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
                            WSOP_ProductClass.createProduto(json.nome, description || "", json.sku, 0, 0, img, 0, json.ativo, 1).then(() => {
                                resolve();
                            })
                        }
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
    //https://api.awsli.com.br/v1/pedido/pedido_id
    /**
         * 
         * @param {Socket} socket 
         * @param {Api_key} api 
         * @param {Application_key} application 
         * @param {Int} ID 
         * @returns 
         */
    _LoadSell(socket, api, aplication, ID) {
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
                    description += "Obs do cliente: " + json.cliente_obs;
                    let products = [];
                    if (json.itens != undefined) {
                        json.itens.forEach(item => {
                            products.push(item);
                            //description += "<p>" + item.nome + " QNT: " + item.quantidade + " Tam: " + item.sku.substring((item.sku.lastIndexOf("-") > -1) ? item.sku.lastIndexOf("-") : 0) + " SKU: " + item.sku + "";
                        });
                    } else {
                        console.log("Pedido sem item: ");
                        console.log(json);
                    }

                    if (json.cliente != undefined) {
                        apiOPLIManipulator.saveSell(
                            json.numero,
                            json.cliente.nome.replace(/[^a-zA-Z0-9úÚóÓéÉàÀêÊõÕãÃáÁ"\[\]\r\n}{#@$%& - +()?_=,.<>:;~^ ]/g, ""),
                            JSON.stringify(json.cliente).replace(/[^a-zA-Z0-9úÚóÓéÉàÀêÊõÕãÃáÁ"\[\]\r\n}{#@$%& - +()?_=,.<>:;~^ ]/g, "").replace("'", ""),
                            JSON.stringify(json).replace(/[^a-zA-Z0-9úÚóÓéÉàÀêÊõÕãÃáÁ"\[\]\r\n}{#@$%& - +()?_=,.<>:;~^ ]/g, "").replace("'", ""),
                            JSON.stringify(products),
                            json.situacao.id,
                            ("#" + json.numero.toString() + " - " + json.cliente.nome).replace(/[^a-zA-Z0-9úÚóÓéÉàÀêÊõÕãÃáÁ"\[\]\r\n}{#@$%& - +()?_=,.<>:;~^ ]/g, ""),
                            new Date((json.data_expiracao + "")).getTime(),
                            description.replace(/[^a-zA-Z0-9úÚóÓéÉàÀêÊõÕãÃáÁ"\[\]\r\n}{#@$%& - +()?_=,.<>:;~^ ]/g, ""),
                            !json.situacao.cancelado)
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
     * 
     * @param {Socket} socket 
     * @param {Api_key} api 
     * @param {Application_key} application 
     * @param {Int} offset 
     * @returns 
     */
    _LoadListProducts(socket, api, aplication, offset) {
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
                    socket.emit("ClientEvents", { event: "opli/appendlog", data: "Total de Produtos: " + json.meta.total_count })

                    let arr = [];

                    if (json.objects) {
                        if (json.objects.length > 0) {
                            for (let i = 0; i < json.objects.length; i++) {
                                if (json.objects[i])
                                    if (json.objects[i].id) {
                                        //console.log("Percent: " + (((i + offset) / json.meta.total_count) * 100).toFixed(2));
                                        socket.emit("ClientEvents", { event: "opli/appendlog", data: "Percent: " + (((i + offset) / json.meta.total_count) * 100).toFixed(2) })

                                        new apiUtils()._LoadProduct(socket, api, aplication, json.objects[i].id)
                                    }
                            }
                            return Promise.all(arr).then(() => {
                                setTimeout(() => { new apiUtils()._LoadListProducts(socket, api, aplication, offset + 20).then(() => { resolve(); }); }, (60 * 1000) / (200 / 20))
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
                    socket.emit("ClientEvents", { event: "opli/appendlog", data: "Total de Vendas: " + json.meta.total_count })

                    let arr = [];


                    if (json.objects) {
                        if (json.objects.length > 0) {
                            for (let i = 0; i < json.objects.length; i++) {
                                if (json.objects[i])
                                    if (json.objects[i].numero) {
                                        //console.log("Percent: " + (((i + offset) / json.meta.total_count) * 100).toFixed(2));
                                        socket.emit("ClientEvents", { event: "opli/appendlog", data: "Percent: " + (((i + offset) / json.meta.total_count) * 100).toFixed(2) })

                                        new apiUtils()._LoadSell(socket, api, aplication, json.objects[i].numero)
                                    }
                            }
                            return Promise.all(arr).then(() => {
                                setTimeout(() => { new apiUtils()._LoadListSells(socket, api, aplication, offset + 20).then(() => { resolve(); }); }, (6 * 1000))
                                // sao 300 por minuto mas estamos fazendo 200 para não exceder ou seja 20 a cada 6 segundos sendo 10 requests de 20 itens por minuto
                            })
                        } else {
                            socket.emit("ClientEvents", { event: "opli/appendlog", data: "Todos os Vendas Cadastrados" })
                            resolve();
                        }
                    } else {
                        socket.emit("ClientEvents", { event: "opli/appendlog", data: "Todos os Vendas Cadastrados" })
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
}

module.exports = { apiManipulator }