var colors = require('colors');

const lista = [
    {
        perm: "ipam/add/subnets",
        data: {
            id: "ipam-add-subnet",
            name: "Adicionar",
            img: "",
            onClick: "loadScript(\"module/ipam/menus/subnets/add.js\")"
        }
    },
    {
        perm: "ipam/edt/subnets",
        data: {
            id: "ipam-edt-subnet",
            name: "Editar",
            img: "",
            onClick: "loadScript(\"module/ipam/menus/subnets/edt.js\")"
        }
    },
    {
        perm: "ipam/del/subnets",
        data: {
            id: "ipam-del-subnet",
            name: "Excluir",
            img: "",
            onClick: "loadScript(\"module/ipam/menus/subnets/del.js\")"
        }
    },
    {
        perm: "ipam/scan/subnets",
        data: {
            id: "ipam-scan-subnets",
            name: "Scan",
            img: "",
            onClick: "loadScript(\"module/ipam/menus/subnets/scan.js\")"
        }
    },
    {
        perm: "ipam/scan/subnets",
        data: {
            id: "ipam-scan-subnets-full",
            name: "Scan ARP",
            img: "",
            onClick: "loadScript(\"module/ipam/menus/subnets/scanfull.js\")"
        }
    }
];

const exe = (UUID, callback, index = 0, ret = []) => {
    require(require("path").join(__dirname + '/../../../../../../../rotine/check/checkPermission'))(UUID, lista[index].perm, (state) => {
        try {
            if (state) {
                ret.push(lista[index].data);
            }
            if (lista.length > (index + 1)) {
                exe(UUID, callback, index + 1, ret)
            } else {
                callback(ret);
            }
        } catch (err) {
            if (err) { console.log(colors.red("[ERROR] on <" + __filename + ">:\n") + err); return; }
        }

    })
};

module.exports = exe;