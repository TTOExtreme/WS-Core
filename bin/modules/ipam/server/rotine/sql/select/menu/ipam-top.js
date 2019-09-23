var colors = require('colors');

const lista = [
    {
        perm: "ipam/top/menu/subnet",
        data: {
            id: "ipam-subnet",
            name: "Redes",
            img: "",
            onClick: "loadScript(\"module/ipam/menus/subnets.js\")"
        }
    },
    {
        perm: "ipam/top/menu/hosts",
        data: {
            id: "ipam-hosts",
            name: "Hosts",
            img: "",
            onClick: "loadScript(\"module/ipam/menus/hosts.js\")"
        }
    },
    {
        perm: "ipam/top/menu/config",
        data: {
            id: "ipam-config",
            name: "Config",
            img: "",
            onClick: "loadScript(\"module/ipam/menus/config.js\")"
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