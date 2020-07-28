class WPMA_Posts_Groups {
    id;
    name;
    description;
    createdIn;
    createdBy;
    modifiedIn;
    modifiedBy;
    deactivatedBy;
    deactivatedIn;
    father; //id of group is father of this one
    log; //bool to generate statistcs for on click
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
    deactivatedBy: "INT(10)",
    deactivatedIn: "VARCHAR(30)",
    redirect: "VARCHAR(600)",
    img: "VARCHAR(600)",
    father: "INT(10)",
    isDropMenu: "INT(1)",
    log: "INT(1)",
    active: "INT(1)",
    deleted: "INT(1) DEFAULT 0"
}

module.exports = {
    WPMA_Posts_Groups,
    _DB
}