class GroupPermissionsStruct {
    id;
    id_Group;
    code_Permission;
    createdIn;
    createdBy;
    deactivatedIn;
    deactivatedBy;
    active;
    modifiedIn;
    modifiedBy;
}

const _DB = {
    id: "INT PRIMARY KEY AUTO_INCREMENT",
    id_Group: "INT",
    code_Permission: "VARCHAR(200)",
    createdIn: "BIGINT",
    createdBy: "INT",
    deactivatedIn: "BIGINT",
    deactivatedBy: "INT",
    modifiedIn: "BIGINT",
    modifiedBy: "INT",
    active: "INT(1)",
}

module.exports = { GroupPermissionsStruct, _DB }