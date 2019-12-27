var colors = require('colors');

const lista = [
    {
        perm: "ipam/edt/hosts",
        data: {
            id: "ipam-edt-hosts",
            name: "Editar",
            img: "",
            onClick: "loadScript(\"module/ipam/menus/hosts/edt.js\")"
        }
    },
    {
        perm: "ipam/del/hosts",
        data: {
            id: "ipam-del-hosts",
            name: "Excluir",
            img: "",
            onClick: "loadScript(\"module/ipam/menus/hosts/del.js\")"
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