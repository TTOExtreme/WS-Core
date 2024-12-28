const pagarme = require("pagarme");
const osManipulator = require('../OS/dbManipulator').osManipulator;

let apiWSOPManipulator;
let osWSOPManipulator;

class apiManipulator {

    /**
     * Constructor for Class
     * @param {WSMainServer} WSMain
     */
    constructor(WSMain) {
        this.db = WSMain.db;
        this.log = WSMain.log;
        this.cfg = WSMain.cfg;

        apiWSOPManipulator = this;
        osWSOPManipulator = new osManipulator(WSMain);
    }

    /**
     * Lista a ultima configuração da API
     */
    GetAPI() {
        return this.db.query("SELECT C.*, U.name as createdBy FROM " + this.db.DatabaseName + "._WSOP_Api AS C " +
            " LEFT JOIN " + this.db.DatabaseName + "._User as U on U.id = C.createdBy order by C.id desc LIMIT 1;");

    }

    /**
     * Salva os dados da API para uso do WSOP
     * @param {String} data 
     * @param {UserID} UserID 
     * @returns 
     */
    saveApi(data, UserID) {
        return this.db.query("INSERT INTO " + this.db.DatabaseName + "._WSOP_Api" +
            " (data, createdBy, createdIn)" +
            " VALUES " +
            " ('" + data + "', " + UserID + ", " + Date.now() + "); ");
    }

    gerarLinkPagarMe(data) {
        return this.GetAPI().then(APIdata => {
            try {
                if (APIdata[0] != undefined) {
                    APIdata[0].data = JSON.parse(APIdata[0].data);

                    data.price = parseFloat((data.price).replace(",", ".")) * 100;

                    return new PagarMeAPI()._GerarLinkPagamento(APIdata[0].data.pagarme.api, data);

                } else {
                    return Promise.reject("Nenhuma API Cadastrada")
                }
            } catch (err) {
                this.log.error("Na coleta de API WSOP");
                this.log.error(err);
                return Promise.reject("Erro na coleta de API WSOP")
            }
        })
    }

    loadPagarMePayments(data) {
        return this.GetAPI().then(APIdata => {
            try {
                if (APIdata[0] != undefined) {
                    APIdata[0].data = JSON.parse(APIdata[0].data);

                    if (data.payment.length > 0) {
                        if (data.payment[data.payment.length - 1].data.id != undefined) {
                            data.price = parseFloat((data.price).replace(",", ".")) * 100;

                            return new PagarMeAPI()._LoadPayments(APIdata[0].data.pagarme.api, data);

                        }
                    }

                } else {
                    return Promise.reject("Nenhuma API Cadastrada")
                }
            } catch (err) {
                this.log.error("Na coleta de API WSOP");
                this.log.error(err);
                return Promise.reject("Erro na coleta de API WSOP")
            }
        })
    }
}

class PagarMeAPI {

    _GerarLinkPagamento(apiKey, data) {
        return pagarme.client.connect({ api_key: apiKey })
            .then(client => {
                return client.paymentLinks.create(
                    {
                        name: data.cliente,
                        amount: data.price,
                        items: [
                            {
                                id: data.cliente,
                                title: data.cliente,
                                unit_price: data.price,
                                quantity: 1,
                                tangible: true
                            }
                        ],
                        payment_config: {
                            boleto: {
                                enabled: true,
                                expires_in: 30
                            },
                            credit_card: {
                                enabled: true,
                                free_installments: 1,
                                interest_rate: 25,
                                max_installments: 6
                            },
                            default_payment_method: "credit_card"
                        },
                        max_orders: 1
                    }
                ).then((pay) => {
                    if (data.id != undefined) {
                        return osWSOPManipulator.ListID(data.id).then((OS) => {
                            if (OS[0] != undefined) {
                                if (OS[0].payment != undefined) {
                                    OS[0].payment = JSON.parse(OS[0].payment)
                                    OS[0].payment.push(
                                        {
                                            type: "newLinkPayment",
                                            timestamp: new Date().getTime(),
                                            data: pay
                                        }
                                    )
                                } else {
                                    OS[0].payment = [
                                        {
                                            type: "newLinkPayment",
                                            timestamp: new Date().getTime(),
                                            data: pay
                                        }
                                    ];
                                }

                                return osWSOPManipulator.editPaymentOS(data.id, JSON.stringify(OS[0].payment)).then(() => {
                                    return Promise.resolve(pay);
                                })
                            } else {
                                return Promise.resolve(pay);
                            }
                        })
                    } else {
                        return Promise.resolve(pay);
                    }




                    /**
                     * Retorno de info
                     
    amount: 150,
    company_id: "0000000000",
    customer_config: null,
    date_created: "2021-06-30T17:37:05.347Z",
    date_updated: "2021-06-30T17:37:05.347Z",
    expires_at: null,
    id: "0000000000",
    items: [{
        category: null,
        created_at: "2021-06-30T17:37:05.373Z",
        date: null,
        external_id: "0",
        id: "0000000000",
        model: "payment_link",
        model_id: "0000000000",
        quantity: 1,
        tangible: true,
        title: "0",
        transaction_id: null,
        unit_price: 150,
        updated_at: "2021-06-30T17:37:05.373Z",
        venue: null,
    }
    ],
    max_orders: null,
    name: "0",
    object: "payment_link",
    orders_paid: 0,
    payment_config: {
        boleto: {
            enabled: true,
            expires_in: 20,
        },

        credit_card: {
            charge_transaction_fee: false,
            enabled: true,
            free_installments: 4,
            interest_rate: 25,
            max_installments: 12,
            min_installments: 1,
        }
    },
    default_payment_method: "credit_card",
    postback_config: null,
    review_informations: false,
    short_id: "0000000000",
    status: "active",
    url: "0000000000", 
                    
                     */


                })
            }).then((pay) => {
                return Promise.resolve(pay);
            }).catch((err) => {
                console.log(err);
            })
    }


    _LoadPayments(apiKey, data) {
        return pagarme.client.connect({ api_key: apiKey })
            .then(clientCon => {
                let ret = []
                return new Promise((res, rej) => {
                    function loadPayment(client, linkindex) {
                        if (linkindex < data.payment.length) {
                            return client.orders.all({
                                payment_link_id: data.payment[linkindex].data.id
                            })
                                .then((pay) => {//Retorno de order

                                    if (pay[0] != undefined) {
                                        return osWSOPManipulator.ListID(data.id).then((OS) => {//coleta info da OS
                                            if (OS[0] != undefined) {
                                                if (OS[0].payment != undefined) {
                                                    OS[0].payment = JSON.parse(OS[0].payment)

                                                    pay.forEach(paymentOrder => {
                                                        OS[0].payment.forEach((ele, index, arr) => {//pesquisa de Links para adicionar a order
                                                            if (ele.data.id == data.payment[linkindex].data.id) {
                                                                if (arr[index].payment == undefined) {
                                                                    arr[index].payment = [];
                                                                    arr[index].payment.push({
                                                                        type: "recivedPayment",
                                                                        timestamp: new Date().getTime(),
                                                                        data: paymentOrder
                                                                    });
                                                                } else {//caso da lista de order existir
                                                                    arr[index].payment.forEach((order, oindex, oarr) => {
                                                                        if (oarr[oindex].data.id == paymentOrder.id) {
                                                                            oarr[oindex].data = paymentOrder; //substutui a order com infomação mais recente
                                                                        }
                                                                    })
                                                                }
                                                            }
                                                        });
                                                    })
                                                }

                                                return osWSOPManipulator.editPaymentOS(data.id, JSON.stringify(OS[0].payment)).then(() => {
                                                    return Promise.resolve(pay);
                                                })
                                            } else {
                                                return Promise.resolve(pay);
                                            }
                                        })
                                    } else {
                                        return Promise.resolve(pay);
                                    }
                                    /**
                                     * Retorno de info
                                     [
                                        {
                                            "object":"order"
                                            "id":"0000"
                                            "company_id":"00000"
                                            "status":"paid"
                                            "amount":000
                                            "items":[...]
                                            "payment_link_id":"0000"
                                            "postback_url":NULL
                                            "date_created":"2021-06-30T19:57:38.644Z"
                                        }
                                    ]
                                     */
                                }).then(() => {
                                    return loadPayment(clientCon, linkindex + 1).then(() => {
                                        res();
                                    }).catch((err) => {
                                        rej(err);
                                    })
                                })
                        } else {
                            return Promise.resolve();
                        }
                    }

                    return loadPayment(clientCon, 0).then(() => {
                        res();
                    }).catch((err) => {
                        rej(err);
                    })
                })
            }).then(() => {
                return Promise.resolve();
            }).catch((err) => {
                console.log(err);
            })
    }
}

module.exports = { apiManipulator }