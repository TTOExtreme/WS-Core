class PermissionsStruct {
    id;
    name;
    description;
    code;
    type;
}

const _DB = {
    id: "INT",
    name: "VARCHAR(200)",
    description: "VARCHAR(200)",
    code: "VARCHAR(200)",
    type: "VARCHAR(200)"
}

module.exports = { PermissionsStruct, _DB }