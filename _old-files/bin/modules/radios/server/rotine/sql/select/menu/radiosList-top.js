var colors = require('colors');

const lista = [
    {
        perm: "radios/add/radios",
        data: {
            id: "radios-add-radios",
            name: "Adicionar",
            img: "",
            onClick: "loadScript(\"module/radios/menus/radios/add.js\")"
        }
    },
    {
        perm: "radios/edt/radios",
        data: {
            id: "radios-edt-radios",
            name: "Editar",
            img: "",
            onClick: "loadScript(\"module/radios/menus/radios/edt.js\")"
        }
    },
    {
        perm: "radios/del/radios",
        data: {
            id: "radios-del-radios",
            name: "Excluir",
            img: "",
            onClick: "loadScript(\"module/radios/menus/radios/del.js\")"
        }
    },
    {
        perm: "radios/scan/radios",
        data: {
            id: "radios-scan-radios",
            name: "Scan",
            img: "",
            onClick: "loadScript(\"module/radios/menus/radios/scan.js\")"
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