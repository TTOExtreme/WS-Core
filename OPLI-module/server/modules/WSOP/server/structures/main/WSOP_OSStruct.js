
const _DB = {
    id: "INT PRIMARY KEY AUTO_INCREMENT",
    id_cliente: "INT",
    status: "VARCHAR(60)",
    name: "VARCHAR(200)",
    endingIn: "BIGINT",
    prazo: "VARCHAR(60)",
    formaEnvio: "VARCHAR(60)",
    formaPagamento: "VARCHAR(60)",
    desconto: "VARCHAR(60)",
    precoEnvio: "VARCHAR(60)",
    price: "VARCHAR(60)",
    dataEnvio: "MEDIUMTEXT",
    uf: "VARCHAR(45) NULL DEFAULT 'SP'",
    country: "VARCHAR(45) NULL DEFAULT 'Brasil'",
    caixa: "VARCHAR(45) NULL DEFAULT 'Caixa 2'",
    createdIn: "BIGINT",
    createdBy: "INT",
    responsavel: "INT",
    deactivatedIn: "BIGINT",
    deactivatedBy: "INT",
    modifiedIn: "BIGINT",
    modifiedBy: "INT",
    tags: "MEDIUMTEXT",
    description: "MEDIUMTEXT",
    active: "INT",
    statusChange: "MEDIUMTEXT",
    payment: "MEDIUMTEXT",
    rastreio: "MEDIUMTEXT",
}


module.exports = { _DB }