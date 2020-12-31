
const _DB = {
    id: "INT PRIMARY KEY AUTO_INCREMENT",
    id_os: "INT",
    id_produtos: "INT",
    obs: "MEDIUMTEXT",
    qnt: "INT",
    createdIn: "BIGINT",
    createdBy: "INT",
    deactivatedIn: "BIGINT",
    deactivatedBy: "INT",
    modifiedIn: "BIGINT",
    modifiedBy: "INT",
    active: "INT(1)",
}

module.exports = { _DB }