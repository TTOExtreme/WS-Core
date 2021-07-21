const _DB = {
    id: "INT PRIMARY KEY AUTO_INCREMENT",
    name: "VARCHAR(600)",
    barcode: "VARCHAR(600)",
    description: "MEDIUMTEXT",
    active: "INT(1)",
    createdIn: "BIGINT",
    createdBy: "INT",
    modifiedIn: "BIGINT",
    modifiedBy: "INT",
}


module.exports = { _DB }