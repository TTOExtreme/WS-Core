
const _DB = {
    id: "INT PRIMARY KEY AUTO_INCREMENT",
    id_req: "INT",
    id_produtos: "INT",
    price: "VARCHAR(45)",
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