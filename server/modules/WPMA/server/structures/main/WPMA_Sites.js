class WPMA_Sites {
    id;
    name;
    description;
    createdIn;
    createdBy;
    modifiedIn;
    modifiedBy;
    route;
    subdomain;
    folder;
    log;
    active;
    deleted;
}

const _DB = {
    id: "INT PRIMARY KEY AUTO_INCREMENT",
    name: "VARCHAR(400)",
    description: "MEDIUMTEXT",
    createdBy: "INT(10)",
    createdIn: "VARCHAR(30)",
    modifiedBy: "INT(10)",
    modifiedIn: "VARCHAR(30)",
    route: "VARCHAR(600)",
    subdomain: "VARCHAR(600)",
    folder: "VARCHAR(600)",
    log: "INT(1)",
    active: "INT(1)",
    deleted: "INT(1) DEFAULT 0"
}

module.exports = {
    WPMA_Sites,
    _DB
}