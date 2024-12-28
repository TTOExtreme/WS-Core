var colors = require('colors');

const lista = [
    {
        perm: "hbmd/top/menu/host",
        data: {
            id: "hbmd-top-hosts",
            name: "Hosts",
            img: "",
            onClick: "loadScript(\"module/hbmd/menus/hosts.js\")"
        }
    },
    {
        perm: "hbmd/top/menu/disk",
        data: {
            id: "hbmd-top-disk",
            name: "Discos",
            img: "",
            onClick: "loadScript(\"module/hbmd/menus/disk.js\")"
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