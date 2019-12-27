class UserStruct {
    id;
    name;
    username;
    password;
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