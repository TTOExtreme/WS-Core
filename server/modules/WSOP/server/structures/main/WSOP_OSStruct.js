
/**
 * @typedef {OSStruct} OSStruct
 * @property {number} id
 * @property {string} name
 * @property {timestamp} createdIn
 * @property {number} createdBy
 * @property {timestamp} deactivatedIn
 * @property {number} deactivatedBy
 * @property {boolean} active
 * @property {string} tags
 * @property {string} obs
 */


class OSStruct {
    id;
    id_cliente;
    name;
    createdIn;
    createdBy;
    deactivatedIn;
    deactivatedBy;
    modifiedIn;
    modifiedBy;
    tags;
    obs;

    /**
     * converte um JSON para o objeto GROUP
     * @param {JSON} user JSON contendo os items do Grupo 
     */
    constructor(os) {
        if (os) {
            if (os.id) { this.id = os.id }
            if (os.id_cliente) { this.id_cliente = os.id_cliente }
            if (os.name) { this.name = os.name }
            if (os.createdIn) { this.createdIn = os.createdIn }
            if (os.createdBy) { this.createdBy = os.createdBy }
            if (os.deactivatedIn) { this.deactivatedIn = os.deactivatedIn }
            if (os.deactivatedBy) { this.deactivatedBy = os.deactivatedBy }
            if (os.modifiedIn) { this.modifiedIn = os.modifiedIn }
            if (os.modifiedBy) { this.modifiedBy = os.modifiedBy }
            if (os.tags) { this.tags = os.tags }
            if (os.obs) { this.obs = os.obs }
        }
    }
}

const _DB = {
    id: "INT PRIMARY KEY AUTO_INCREMENT",
    id_cliente: "INT",
    name: "VARCHAR(200)",
    createdIn: "BIGINT",
    createdBy: "INT",
    deactivatedIn: "BIGINT",
    deactivatedBy: "INT",
    modifiedIn: "BIGINT",
    modifiedBy: "INT",
    tags: "MEDIUMTEXT",
    obs: "MEDIUMTEXT"
}


module.exports = { OSStruct, _DB }