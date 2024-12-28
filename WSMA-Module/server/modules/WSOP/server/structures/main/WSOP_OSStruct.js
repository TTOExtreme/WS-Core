
/**
 * @typedef {OSStruct} OSStruct
 * @property {number} id
 * @property {number} id_cliente
 * @property {number} status
 * @property {timestamp} endingIn data limite da os
 * @property {string} prazo codigo do tipo de prazo
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
    id_cliente;
    status;
    endingIn;
    prazo;
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
            if (os.id_cliente) { this.id_cliente = os.id_cliente }
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
    id_cliente: "INT",
    status: "VARCHAR(60)",
    name: "VARCHAR(200)",
    endingIn: "BIGINT",
    prazo: "VARCHAR(60)",
    formaEnvio: "VARCHAR(60)",
    desconto: "VARCHAR(60)",
    precoEnvio: "VARCHAR(60)",
    price: "VARCHAR(60)",
    dataEnvio: "MEDIUMTEXT",
    uf: "VARCHAR(45) NULL DEFAULT 'SP'",
    country: "VARCHAR(45) NULL DEFAULT 'Brasil'",
    caixa: "VARCHAR(45) NULL DEFAULT 'Caixa 2'",
    createdIn: "BIGINT",
    createdBy: "INT",
    responsavel: "INT",
    deactivatedIn: "BIGINT",
    deactivatedBy: "INT",
    modifiedIn: "BIGINT",
    modifiedBy: "INT",
    tags: "MEDIUMTEXT",
    description: "MEDIUMTEXT",
    active: "INT",
    statusChange: "MEDIUMTEXT",
    rastreio: "MEDIUMTEXT",

}


module.exports = { OSStruct, _DB }