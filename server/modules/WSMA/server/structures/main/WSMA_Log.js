const _DB = {
    id: "INT PRIMARY KEY AUTO_INCREMENT",
    title: "VARCHAR(600)",
    description: "MEDIUMTEXT",
    createdIn: "BIGINT",
    createdBy: "INT",
    deactivatedIn: "BIGINT",
    deactivatedBy: "INT",
    modifiedIn: "BIGINT",
    modifiedBy: "INT",
}


module.exports = { _DB }