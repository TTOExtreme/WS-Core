const _DB = {
    id: "INT PRIMARY KEY AUTO_INCREMENT",
    id_item: "INT",
    createdIn: "BIGINT",
    createdBy: "INT",
    content: "VARCHAR(300)",
    data: "MEDIUMTEXT"
}


module.exports = { _DB }