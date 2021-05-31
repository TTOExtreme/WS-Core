
/**
 * @typedef {ClienteStruct} ClienteStruct
 * @property {number} id
 * @property {string} api
 * @property {string} pullproducts
 * @property {string} pullsells
 * @property {string} pullclients
 * @property {timestamp} createdIn
 * @property {number} createdBy
 * @property {timestamp} deactivatedIn
 * @property {number} deactivatedBy
 * @property {boolean} active
 */


class ClienteStruct {
    id;
    api;
    aplication;
    pullproducts;
    pullsells;
    pullclients;
    active;
    createdIn;
    createdBy;
    deactivatedIn;
    deactivatedBy;
    modifiedIn;
    modifiedBy;

    /**
     * @param {JSON} opli
     */
    constructor(os) {
        if (os) {
            if (os.id) { this.id = os.id }
            if (os.api) { this.api = os.api }
            if (os.aplication) { this.aplication = os.aplication }
            if (os.pullproducts) { this.pullproducts = os.pullproducts }
            if (os.pullsells) { this.pullsells = os.pullsells }
            if (os.pullclients) { this.pullclients = os.pullclients }
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
    api: "VARCHAR(600)",
    aplication: "VARCHAR(600)",
    trelloToken: "VARCHAR(600)",
    trelloKey: "VARCHAR(600)",
    trelloBoard: "VARCHAR(600)",
    trelloList: "VARCHAR(600)",
    trelloLabels: "MEDIUMTEXT",
    pullproducts: "INT(1)",
    pullsells: "INT(1)",
    pullclients: "INT(1)",
    active: "INT(1)",
    createdIn: "BIGINT",
    createdBy: "INT",
    deactivatedIn: "BIGINT",
    deactivatedBy: "INT",
    modifiedIn: "BIGINT",
    modifiedBy: "INT",
}


module.exports = { ClienteStruct, _DB }