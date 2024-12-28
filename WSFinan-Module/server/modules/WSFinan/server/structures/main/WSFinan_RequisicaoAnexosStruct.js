
/**
 * @typedef {ProdutosStruct} ProdutosStruct
 * @property {number} id
 * @property {number} id_os
 * @property {string} name
 * @property {string} filename
 * @property {number} inventory
 * @property {timestamp} createdIn
 * @property {number} createdBy
 * @property {timestamp} deactivatedIn
 * @property {number} deactivatedBy
 * @property {boolean} active
 */


class ProdutosStruct {
    id;
    id_os;
    name;
    filename;
    thumb;
    createdIn;
    createdBy;
    deactivatedIn;
    deactivatedBy;
    modifiedIn;
    modifiedBy;
    active;

    /**
     * converte um JSON para o objeto GROUP
     * @param {JSON} user JSON contendo os items do Grupo 
     */
    constructor(os) {
        if (os) {
            if (os.id) { this.id = os.id }
            if (os.id_os) { this.id_os = os.id_os }
            if (os.name) { this.name = os.name }
            if (os.filename) { this.filename = os.filename }
            if (os.thumb) { this.thumb = os.thumb }
            if (os.createdIn) { this.createdIn = os.createdIn }
            if (os.createdBy) { this.createdBy = os.createdBy }
            if (os.deactivatedIn) { this.deactivatedIn = os.deactivatedIn }
            if (os.deactivatedBy) { this.deactivatedBy = os.deactivatedBy }
            if (os.modifiedIn) { this.modifiedIn = os.modifiedIn }
            if (os.modifiedBy) { this.modifiedBy = os.modifiedBy }
            if (os.active) { this.active = os.active }
        }
    }
}

const _DB = {
    id: "INT PRIMARY KEY AUTO_INCREMENT",
    id_os: "INT",
    name: "VARCHAR(200)",
    filename: "VARCHAR(600)",
    thumb: "VARCHAR(600)",
    createdIn: "BIGINT",
    createdBy: "INT",
    deactivatedIn: "BIGINT",
    deactivatedBy: "INT",
    modifiedIn: "BIGINT",
    modifiedBy: "INT",
    active: "INT(1)",
}


module.exports = { ProdutosStruct, _DB }