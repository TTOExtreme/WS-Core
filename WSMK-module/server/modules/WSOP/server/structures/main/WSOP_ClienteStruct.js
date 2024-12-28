
/**
 * @typedef {ClienteStruct} ClienteStruct
 * @property {number} id
 * @property {string} name
 * @property {string} cpf_cnpj
 * @property {string} iscnpj
 * @property {string} cep
 * @property {string} endereco
 * @property {string} telefone
 * @property {string} email
 * @property {timestamp} createdIn
 * @property {number} createdBy
 * @property {timestamp} deactivatedIn
 * @property {number} deactivatedBy
 * @property {boolean} active
 */


class ClienteStruct {
    id;
    name;
    responsavel;
    cpf_cnpj;
    iscnpj;
    cep;
    logradouro;
    numero;
    bairro;
    municipio;
    uf;
    telefone;
    email;
    active;
    createdIn;
    createdBy;
    deactivatedIn;
    deactivatedBy;
    modifiedIn;
    modifiedBy;

    /**
     * converte um JSON para o objeto GROUP
     * @param {JSON} user JSON contendo os items do Grupo 
     */
    constructor(os) {
        if (os) {
            if (os.id) { this.id = os.id }
            if (os.name) { this.name = os.name }
            if (os.responsavel) { this.responsavel = os.responsavel }
            if (os.cpf_cnpj) { this.cpf_cnpj = os.cpf_cnpj }
            if (os.iscnpj) { this.iscnpj = os.iscnpj }
            if (os.cep) { this.cep = os.cep }
            if (os.logradouro) { this.logradouro = os.logradouro }
            if (os.numero) { this.numero = os.numero }
            if (os.bairro) { this.bairro = os.bairro }
            if (os.uf) { this.uf = os.uf }
            if (os.telefone) { this.telefone = os.telefone }
            if (os.email) { this.email = os.email }
            if (os.active) { this.active = os.active }
            if (os.createdIn) { this.createdIn = os.createdIn }
            if (os.createdBy) { this.createdBy = os.createdBy }
            if (os.deactivatedIn) { this.deactivatedIn = os.deactivatedIn }
            if (os.deactivatedBy) { this.deactivatedBy = os.deactivatedBy }
            if (os.modifiedIn) { this.modifiedIn = os.modifiedIn }
            if (os.modifiedBy) { this.modifiedBy = os.modifiedBy }
        }
    }
}

const _DB = {
    id: "INT PRIMARY KEY AUTO_INCREMENT",
    name: "VARCHAR(600)",
    responsavel: "VARCHAR(600)",
    cpf_cnpj: "VARCHAR(200)",
    iscnpj: "INT(1)",
    cep: "VARCHAR(200)",
    logradouro: "VARCHAR(200)",
    numero: "VARCHAR(100)",
    bairro: "VARCHAR(100)",
    municipio: "VARCHAR(200)",
    uf: "VARCHAR(200)",
    country: "VARCHAR(200)",
    telefone: "VARCHAR(200)",
    email: "VARCHAR(200)",
    active: "INT(1)",
    createdIn: "BIGINT",
    createdBy: "INT",
    deactivatedIn: "BIGINT",
    deactivatedBy: "INT",
    modifiedIn: "BIGINT",
    modifiedBy: "INT",
}


module.exports = { ClienteStruct, _DB }