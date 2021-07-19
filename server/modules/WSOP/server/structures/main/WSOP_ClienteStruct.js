const _DB = {
    id: "INT PRIMARY KEY AUTO_INCREMENT",
    name: "VARCHAR(600)",
    responsavel: "VARCHAR(600)",
    cpf_cnpj: "VARCHAR(200)",
    iscnpj: "INT(1)",
    cep: "VARCHAR(200)",
    logradouro: "VARCHAR(200)",
    complemento: "VARCHAR(200)",
    numero: "VARCHAR(100)",
    bairro: "VARCHAR(100)",
    municipio: "VARCHAR(200)",
    uf: "VARCHAR(200)",
    country: "VARCHAR(200)",
    telefone: "VARCHAR(200)",
    email: "VARCHAR(200)",
    active: "INT(1)",
    createdIn: "BIGINT",
    createdBy: "INT",
    deactivatedIn: "BIGINT",
    deactivatedBy: "INT",
    modifiedIn: "BIGINT",
    modifiedBy: "INT",
}


module.exports = { _DB }