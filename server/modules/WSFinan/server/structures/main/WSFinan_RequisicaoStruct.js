const _DB = {
    id: "INT PRIMARY KEY AUTO_INCREMENT",
    name: "VARCHAR(600)",
    description: "MEDIUMTEXT",
    reserved: "INT(1)",
    pending: "INT(1)",
    aproved: "INT(1)",
    reject: "INT(1)",
    active: "INT(1)",
    createdIn: "BIGINT",
    createdBy: "INT",
    reservedIn: "BIGINT",
    reservedBy: "INT",
    aprovedIn: "BIGINT",
    aprovedBy: "INT",
    rejectIn: "BIGINT",
    rejectBy: "INT",
    deactivatedIn: "BIGINT",
    deactivatedBy: "INT",
    modifiedIn: "BIGINT",
    modifiedBy: "INT",
}


module.exports = { _DB }