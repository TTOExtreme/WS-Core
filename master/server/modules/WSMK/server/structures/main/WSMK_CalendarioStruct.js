
/**
 * @typedef {CalendarioStruct} CalendarioStruct
 * @property {number} id
 * @property {string} nome
 * @property {string} dados
 * @property {timestamp} createdIn
 */


class CalendarioStruct {
    id;
    nome;
    dados;
    createdIn;

    /**
     * converte um JSON para o objeto GROUP
     * @param {JSON} user JSON contendo os items do Grupo 
     */
    constructor(os) {
        if (os) {
            if (os.id) { this.id = os.id }
            if (os.nome) { this.nome = os.nome }
            if (os.dados) { this.dados = os.dados }
            if (os.createdIn) { this.createdIn = os.createdIn }
        }
    }
}

const _DB = {
    id: "INT PRIMARY KEY AUTO_INCREMENT",
    title: "VARCHAR(200)",
    img: "VARCHAR(600)",
    createdIn: "BIGINT",
    createdBy: "INT",
    deactivatedIn: "BIGINT",
    deactivatedBy: "INT",
    modifiedIn: "BIGINT",
    modifiedBy: "INT",
    description: "MEDIUMTEXT",
    active: "INT",
}


module.exports = { CalendarioStruct, _DB }