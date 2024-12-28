
/**
 * @typedef {LogStruct} LogStruct
 * @property {number} id
 * @property {string} name
 * @property {string} data
 * @property {timestamp} createdIn
 * @property {number} createdBy
 */


class LogStruct {
    id;
    name;
    data;
    createdIn;
    createdBy;

    /**
     * converte um JSON para o objeto log
     * @param {JSON} log JSON contendo os items do usuário 
     */
    constructor(log) {
        if (log) {
            if (log.id) { this.id = log.id }
            if (log.name) { this.name = log.name }
            if (log.data) { this.data = log.data }
            if (log.createdIn) { this.createdIn = log.createdIn }
            if (log.createdBy) { this.createdBy = log.createdBy }
        }
    }

    /**
     * Converte Em String o Objeto log
     */
    toString() {
        return JSON.stringify({
            id: this.id,
            name: this.name,
            data: this.data,
            createdIn: this.createdIn,
            createdBy: this.createdBy
        })
    }
}

const _DB = {
    id: "INT PRIMARY KEY AUTO_INCREMENT",
    name: "VARCHAR(200)",
    data: "MEDIUMTEXT",
    createdIn: "BIGINT",
    createdBy: "INT"
}


module.exports = { logStruct, _DB }