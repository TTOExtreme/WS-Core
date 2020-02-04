class IPAM_SubnetStruct {
    id;
    name;
    description;
    ip;
    gtw;
    netmask;
    autoscan;
}

const _DB = {
    id: "INT PRIMARY KEY AUTO_INCREMENT",
    name: "VARCHAR(200)",
    description: "VARCHAR(200)",
    ip: "VARCHAR(20)",
    gtw: "VARCHAR(20)",
    netmask: "VARCHAR(20)",
    autoscan: "INT(1) DEFAULT 0"
}

module.exports = { IPAM_SubnetStruct, _DB }
