const PermissionsStruct = require('../relations/Group_Permissions').GroupPermissionsStruct;

/**
 * @typedef {GroupStruct} GroupStruct
 * @property {number} id
 * @property {string} name
 * @property {string} username
 * @property {string} password
 * @property {string} uuid
 * @property {string} preferences
 * @property {timestamp} createdIn
 * @property {number} createdBy
 * @property {timestamp} deactivatedIn
 * @property {number} deactivatedBy
 * @property {boolean} active
 * @property {boolean} connected
 * @property {timestamp} lastConnection
 * @property {timestamp} lastTry
 * @property {string} lastIp
 * @property {string} permissions
 */


class GroupStruct {
    id;
    name;
    guid;
    createdIn;
    createdBy;
    deactivatedIn;
    deactivatedBy;
    modifiedIn;
    modifiedBy;
    active;
    permissions = [new PermissionsStruct()];
    groups = [];
    groupList = [];
    allgroups = [];

    /**
     * converte um JSON para o objeto GROUP
     * @param {JSON} user JSON contendo os items do Grupo 
     */
    constructor(group) {
        if (group) {
            if (group.id) { this.id = group.id }
            if (group.name) { this.name = group.name }
            if (group.createdIn) { this.createdIn = group.createdIn }
            if (group.createdBy) { this.createdBy = group.createdBy }
            if (group.deactivatedIn) { this.deactivatedIn = group.deactivatedIn }
            if (group.deactivatedBy) { this.deactivatedBy = group.deactivatedBy }
            if (group.modifiedIn) { this.modifiedIn = group.modifiedIn }
            if (group.modifiedBy) { this.modifiedBy = group.modifiedBy }
            if (group.active) { this.active = group.active }
        }
    }

    /**
     * Converte Em String o Objeto GROUP
     */
    toString() {
        return JSON.stringify({
            id: this.id,
            name: this.name,
            createdIn: this.createdIn,
            createdBy: this.createdBy,
            deactivatedIn: this.deactivatedIn,
            deactivatedBy: this.deactivatedBy,
            modifiedIn: this.modifiedIn,
            modifiedBy: this.modifiedBy,
            active: this.active
        })
    }
}

const _DB = {
    id: "INT PRIMARY KEY AUTO_INCREMENT",
    name: "VARCHAR(200)",
    createdIn: "BIGINT",
    createdBy: "INT",
    deactivatedIn: "BIGINT",
    deactivatedBy: "INT",
    modifiedIn: "BIGINT",
    modifiedBy: "INT",
    active: "INT(1)"
}


module.exports = { GroupStruct, _DB }