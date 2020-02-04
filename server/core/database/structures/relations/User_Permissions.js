class UserPermissionsStruct {
    id;
    id_User;
    code_Permission;
    createdIn;
    createdBy;
    deactivatedIn;
    deactivatedBy;
    active;
}

const _DB = {
    id: "INT PRIMARY KEY AUTO_INCREMENT",
    id_User: "INT",
    code_Permission: "VARCHAR(200)",
    createdIn: "BIGINT",
    createdBy: "INT",
    deactivatedIn: "BIGINT",
    deactivatedBy: "INT",
    active: "INT(1)",
}

module.exports = { UserPermissionsStruct, _DB }