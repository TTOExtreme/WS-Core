var colors = require('colors');

const lista = [
    {
        perm: "radios/add/radios",
        data: {
            id: "radios-add-connection",
            name: "Adicionar Con.",
            img: "",
            onClick: "loadScript(\"module/radios/menus/radiosConnection/add.js\")"
        }

    },
    {
        perm: "radios/del/radios",
        data: {
            id: "radios-del-connection",
            name: "Excluir Con.",
            img: "",
            onClick: "loadScript(\"module/radios/menus/radiosConnection/del.js\")"
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