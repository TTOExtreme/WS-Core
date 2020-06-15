class WPMA_Sites {
    id;
    name;
    description;
    route;
    subdomain;
    folder;
    log;
}

const _DB = {
    id: "INT PRIMARY KEY AUTO_INCREMENT",
    name: "VARCHAR(400)",
    description: "MEDIUMTEXT",
    route: "VARCHAR(200)",
    subdomain: "VARCHAR(200)",
    folder: "VARCHAR(200)",
    log: "INT(1)"
}

module.exports = {
    WPMA_Sites,
    _DB
}