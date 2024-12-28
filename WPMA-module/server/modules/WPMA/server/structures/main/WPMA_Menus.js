class WPMA_Menus {
    id;
    name;
    description;
    createdIn;
    createdBy;
    modifiedIn;
    modifiedBy;
    deactivatedBy;
    deactivatedIn;
    redirect; //page to redirect on click
    img; //location of image if exists
    father; //id of menu is father of this one 
    idOrder; //idOrder number to sequence menus
    isDropMenu; //bool to check if is a dropdown menu
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
    idOrder: "INT(10)",
    isDropMenu: "INT(1)",
    log: "INT(1)",
    active: "INT(1)",
    deleted: "INT(1) DEFAULT 0"
}

module.exports = {
    WPMA_Menus,
    _DB
}