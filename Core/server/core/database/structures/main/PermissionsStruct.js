class PermissionsStruct {
    name;
    description;
    code;
    type;
}

const _DB = {
    name: "VARCHAR(200)",
    description: "VARCHAR(200)",
    code: "VARCHAR(200) PRIMARY KEY",
    type: "VARCHAR(200)",
    defaltAdd: "INT(1)"
}

module.exports = { PermissionsStruct, _DB }