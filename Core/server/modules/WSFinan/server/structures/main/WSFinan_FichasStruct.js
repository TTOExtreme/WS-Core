const _DB = {
    id: "INT PRIMARY KEY AUTO_INCREMENT",
    name: "VARCHAR(600)",
    description: "MEDIUMTEXT",
    valueAttached: "VARCHAR(60)",
    valueReserved: "VARCHAR(60)",
    valuePending: "VARCHAR(60)",
    active: "INT(1)",
    createdIn: "BIGINT",
    createdBy: "INT",
    deactivatedIn: "BIGINT",
    deactivatedBy: "INT",
    modifiedIn: "BIGINT",
    modifiedBy: "INT",
}


module.exports = { _DB }