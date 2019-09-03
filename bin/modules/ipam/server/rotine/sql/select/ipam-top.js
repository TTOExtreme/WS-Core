var colors = require('colors');

const lista = [
    {
        perm: "ipam/top/menu/users",
        data: {
            id: "ipam-users",
            name: "Usuários",
            img: "Users.png",
            onClick: "loadScript(\"module/ipam/menus/users.js\")"
        }
    },
    {
        perm: "ipam/top/menu/groups",
        data: {
            id: "ipam-groups",
            name: "Grupos",
            img: "Groups.png",
            onClick: "loadScript(\"module/ipam/menus/groups.js\")"
        }
    },
    {
        perm: "ipam/top/menu/config",
        data: {
            id: "ipam-config",
            name: "Configuração",
            img: "Config.png",
            onClick: "loadScript(\"module/ipam/menus/configs.js\")"
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