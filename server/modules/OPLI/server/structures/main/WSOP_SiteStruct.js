
/**
 * @typedef {OSStruct} OSStruct
 * @property {number} id
 * @property {string} nome_cliente
 * @property {number} id_li
 * @property {number} status
 * @property {timestamp} endingIn data limite da os
 * @property {timestamp} createdIn
 * @property {number} createdBy
 * @property {timestamp} deactivatedIn
 * @property {number} deactivatedBy
 * @property {boolean} active
 * @property {string} tags
 * @property {string} description
 */


class OSStruct {
    id;
    nome_cliente;
    dados_cliente;
    dados_li;
    id_li;
    dados_trello;
    id_trello;
    status;
    endingIn;
    createdIn;
    createdBy;
    deactivatedIn;
    deactivatedBy;
    modifiedIn;
    modifiedBy;
    tags;
    description;

    /**
     * converte um JSON para o objeto GROUP
     * @param {JSON} user JSON contendo os items do Grupo 
     */
    constructor(os) {
        if (os) {
            if (os.id) { this.id = os.id }
            if (os.nome_cliente) { this.nome_cliente = os.nome_cliente }
            if (os.dados_cliente) { this.dados_cliente = os.dados_cliente }
            if (os.dados_li) { this.dados_li = os.dados_li }
            if (os.id_li) { this.id_li = os.id_li }
            if (os.dados_trello) { this.dados_trello = os.dados_trello }
            if (os.id_trello) { this.id_trello = os.id_trello }
            if (os.status) { this.status = os.status }
            if (os.endingIn) { this.endingIn = os.endingIn }
            if (os.createdIn) { this.createdIn = os.createdIn }
            if (os.createdBy) { this.createdBy = os.createdBy }
            if (os.deactivatedIn) { this.deactivatedIn = os.deactivatedIn }
            if (os.deactivatedBy) { this.deactivatedBy = os.deactivatedBy }
            if (os.modifiedIn) { this.modifiedIn = os.modifiedIn }
            if (os.modifiedBy) { this.modifiedBy = os.modifiedBy }
            if (os.tags) { this.tags = os.tags }
            if (os.description) { this.description = os.description }
            if (os.active) { this.active = os.active }
        }
    }
}

const _DB = {
    id: "INT PRIMARY KEY AUTO_INCREMENT",
    nome_cliente: "VARCHAR(200)",
    dados_cliente: "MEDIUMTEXT",
    dados_li: "MEDIUMTEXT",
    id_li: "VARCHAR(60)", //Id da loja integrada
    dados_trello: "MEDIUMTEXT",
    id_trello: "VARCHAR(60)", //Id da loja integrada
    products: "MEDIUMTEXT", //Id da loja integrada
    status: "INT",
    name: "VARCHAR(200)",
    endingIn: "BIGINT",
    createdIn: "BIGINT",
    createdBy: "INT",
    deactivatedIn: "BIGINT",
    deactivatedBy: "INT",
    modifiedIn: "BIGINT",
    modifiedBy: "INT",
    tags: "MEDIUMTEXT",
    description: "MEDIUMTEXT",
    active: "INT",
}


module.exports = { OSStruct, _DB }