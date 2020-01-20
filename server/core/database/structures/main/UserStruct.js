/**
 * @class
 * @alias UserStruct
 * @property {number} id
 * @property {string} name
 * @property {string} username
 * @property {string} password
 * @property {string} uuid
 * @property {timestamp} createdIn
 * @property {number} createdBy
 * @property {timestamp} deactivatedIn
 * @property {number} deactivatedBy
 * @property {boolean} active
 * @property {boolean} connected
 * @property {timestamp} lastConnection
 * @property {timestamp} lastTry
 * @property {string} lastIp
 */

class UserStruct {
    id;
    name;
    username;
    password;
    salt;
    uuid;
    createdIn;
    createdBy;
    deactivatedIn;
    deactivatedBy;
    active;
    connected;
    lastConnection;
    lastTry;
    lastIp;
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