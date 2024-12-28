const PermissionsStruct = require('../relations/User_Permissions').UserPermissionsStruct;

/**
 * @typedef {UserStruct} UserStruct
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


class UserStruct {
    id;
    name;
    username;
    password;
    salt;
    uuid;
    preferences;
    createdIn;
    createdBy;
    deactivatedIn;
    deactivatedBy;
    active;
    connected;
    lastConnection;
    lastTry;
    lastIp;
    permissions = [new PermissionsStruct()];

    /**
     * converte um JSON para o objeto USER
     * @param {JSON} user JSON contendo os items do usuário 
     */
    constructor(user) {
        if (user) {
            if (user.id) { this.id = user.id }
            if (user.name) { this.name = user.name }
            if (user.username) { this.username = user.username }
            if (user.password) { this.password = user.password }
            if (user.salt) { this.salt = user.salt }
            if (user.uuid) { this.uuid = user.uuid }
            if (user.preferences) { this.preferences = user.preferences }
            if (user.createdIn) { this.createdIn = user.createdIn }
            if (user.createdBy) { this.createdBy = user.createdBy }
            if (user.deactivatedIn) { this.deactivatedIn = user.deactivatedIn }
            if (user.deactivatedBy) { this.deactivatedBy = user.deactivatedBy }
            if (user.active) { this.active = user.active }
            if (user.connected) { this.connected = user.connected }
            if (user.lastConnection) { this.lastConnection = user.lastConnection }
            if (user.lastTry) { this.lastTry = user.lastTry }
            if (user.lastIp) { this.lastIp = user.lastIp }
        }
    }

    /**
     * Converte Em String o Objeto USER
     */
    toString() {
        return JSON.stringify({
            id: this.id,
            name: this.name,
            username: this.username,
            password: this.password,
            salt: this.salt,
            uuid: this.uuid,
            preferences: this.preferences,
            createdIn: this.createdIn,
            createdBy: this.createdBy,
            deactivatedIn: this.deactivatedIn,
            deactivatedBy: this.deactivatedBy,
            active: this.active,
            connected: this.connected,
            lastConnection: this.lastConnection,
            lastTry: this.lastTry,
            lastIp: this.lastIp
        })
    }
}

const _DB = {
    id: "INT PRIMARY KEY AUTO_INCREMENT",
    name: "VARCHAR(200)",
    username: "VARCHAR(200)",
    password: "VARCHAR(4096)",
    salt: "VARCHAR(4096)",
    uuid: "VARCHAR(4096)",
    preferences: "MEDIUMTEXT",
    createdIn: "BIGINT",
    createdBy: "INT",
    deactivatedIn: "BIGINT",
    deactivatedBy: "INT",
    active: "INT(1)",
    connected: "INT(1)",
    lastConnection: "BIGINT",
    lastTry: "BIGINT",
    lastIp: "VARCHAR(80)"
}


module.exports = { UserStruct, _DB }