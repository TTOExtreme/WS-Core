
/**
 * @typedef {OSStruct} OSStruct
 * @property {number} id
 * @property {number} id_os
 * @property {timestamp} createdIn
 * @property {number} createdBy
 * @property {string} content
 * @property {string} data
 */


class OSStruct {
    id;
    id_os;
    createdIn;
    createdBy;
    content;
    data;

    /**
     * converte um JSON para o objeto GROUP
     * @param {JSON} user JSON contendo os items do Grupo 
     */
    constructor(os) {
        if (os) {
            if (os.id) { this.id = os.id }
            if (os.id_os) { this.id_os = os.id_os }
            if (os.createdIn) { this.createdIn = os.createdIn }
            if (os.createdBy) { this.createdBy = os.createdBy }
            if (os.content) { this.content = os.content }
            if (os.data) { this.data = os.data }
        }
    }
}

const _DB = {
    id: "INT PRIMARY KEY AUTO_INCREMENT",
    id_os: "INT",
    createdIn: "BIGINT",
    createdBy: "INT",
    content: "VARCHAR(300)",
    data: "MEDIUMTEXT"
}


module.exports = { OSStruct, _DB }