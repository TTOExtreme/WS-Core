class IPAM_HostsStruct {
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
    subnet: "INT(10)",
    ip: "VARCHAR(20)",
    ports: "MEDIUMTEXT",
    hostname: "VARCHAR(200)",
    mac: "VARCHAR(200)",
    vendor: "VARCHAR(200)",
    hostnameErr: "VARCHAR(200)",
    macErr: "VARCHAR(200)",
    vendorErr: "VARCHAR(200)",
    addedIn: "BIGINT",
    alive: "INT(1)",
    seted: "INT(1)"
}

module.exports = { IPAM_HostsStruct, _DB }
