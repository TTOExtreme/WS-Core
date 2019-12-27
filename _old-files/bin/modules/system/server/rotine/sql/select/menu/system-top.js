var colors = require('colors');

const lista = [
    {
        perm: "system/top/menu/users",
        data: {
            id: "system-users",
            name: "Usuários",
            img: "Users.png",
            onClick: "loadScript(\"module/system/menus/users.js\")"
        }
    },
    {
        perm: "system/top/menu/groups",
        data: {
            id: "system-groups",
            name: "Grupos",
            img: "Groups.png",
            onClick: "loadScript(\"module/system/menus/groups.js\")"
        }
    },
    {
        perm: "system/top/menu/config",
        data: {
            id: "system-config",
            name: "Configuração",
            img: "Config.png",
            onClick: "loadScript(\"module/system/menus/configs.js\")"
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