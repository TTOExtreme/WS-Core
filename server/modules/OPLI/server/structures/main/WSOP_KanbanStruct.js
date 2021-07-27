
/**
 * @typedef {OSStruct} OSStruct
 * @property {number} id
 * @property {string} nome
 * @property {string} dados
 * @property {timestamp} createdIn
 */


class OSStruct {
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
    nome: "VARCHAR(200)",
    dados: "MEDIUMTEXT",
    createdIn: "BIGINT",
}


module.exports = { OSStruct, _DB }