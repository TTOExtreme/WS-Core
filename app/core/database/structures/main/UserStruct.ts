class UserStruct {
    id: number;
    name: string;
    username: string;
    password: string;
    uuid: string;
    createdIn: number;
    createdBy: number;
    deactivatedIn: number;
    deactivatedBy: number;
    active: boolean;
    connected: boolean;
    lastConnection: number;
    lastTry: number;
    lastIp: string;
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


export { UserStruct, _DB }