var colors = require('colors');

const lista = [
    {
        perm: "radios/top/menu/dashboard",
        data: {
            id: "radios-dashboard",
            name: "Dashboard",
            img: "",
            onClick: "loadScript(\"module/radios/menus/dashboard.js\")"
        }
    },
    {
        perm: "radios/top/menu/radios",
        data: {
            id: "radios-radios",
            name: "Radios",
            img: "",
            onClick: "loadScript(\"module/radios/menus/radios.js\")"
        }
    },
    {
        perm: "radios/top/menu/radios",
        data: {
            id: "radios-connection",
            name: "Radios Enlaces",
            img: "",
            onClick: "loadScript(\"module/radios/menus/radiosConnection.js\")"
        }
    },
    {
        perm: "radios/top/menu/config",
        data: {
            id: "radios-config",
            name: "Config",
            img: "",
            onClick: "loadScript(\"module/radios/menus/config.js\")"
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