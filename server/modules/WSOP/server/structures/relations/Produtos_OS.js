
const _DB = {
    id_os: "INT",
    id_produtos: "INT",
    obs: "MEDIUMTEXT",
    img: "TEXT",
    createdIn: "BIGINT",
    createdBy: "INT",
    deactivatedIn: "BIGINT",
    deactivatedBy: "INT",
    modifiedIn: "BIGINT",
    modifiedBy: "INT",
    active: "INT(1)",
}

module.exports = { _DB }