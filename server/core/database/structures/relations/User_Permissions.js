
const _DB = {
    id: "INT PRIMARY KEY AUTO_INCREMENT",
    id_User: "INT",
    id_Permission: "INT",
    createdIn: "BIGINT",
    createdBy: "INT",
    deactivatedIn: "BIGINT",
    deactivatedBy: "INT",
    active: "INT(1)",
}

module.exports = { _DB }