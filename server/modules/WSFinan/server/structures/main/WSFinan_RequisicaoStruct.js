const _DB = {
    id: "INT PRIMARY KEY AUTO_INCREMENT",
    name: "VARCHAR(600)",
    description: "MEDIUMTEXT",
    id_fornecedor: "INT(10)",
    active: "INT(1)",
    createdIn: "BIGINT",
    createdBy: "INT",
    deactivatedIn: "BIGINT",
    deactivatedBy: "INT",
    modifiedIn: "BIGINT",
    modifiedBy: "INT",
    status: "VARCHAR(60)",
    statusChange: "MEDIUMTEXT",
}


module.exports = { _DB }