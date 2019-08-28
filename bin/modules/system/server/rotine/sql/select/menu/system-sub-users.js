var colors = require('colors');

const lista = [
    {
        perm: "system/add/users",
        data: {
            id: "system-add-users",
            name: "Adicionar",
            img: "Users.png",
            onClick: "loadScript(\"module/system/menus/users/add.js\")"
        }
    },
    {
        perm: "system/edt/users",
        data: {
            id: "system-del-Users",
            name: "Editar",
            img: "Users.png",
            onClick: "loadScript(\"module/system/menus/users/edt.js\")"
        }
    },
    {
        perm: "system/del/users",
        data: {
            id: "system-del-Users",
            name: "Excluir",
            img: "Users.png",
            onClick: "loadScript(\"module/system/menus/users/del.js\")"
        }
    },
    {
        perm: "system/edt/users",
        data: {
            id: "system-disable-Users",
            name: "Ativar",
            img: "Users.png",
            onClick: "loadScript(\"module/system/menus/users/enable.js\")"
        }
    },
    {
        perm: "system/get/users/perm",
        data: {
            id: "systemUsers-perm",
            name: "Permissões",
            img: "Users.png",
            onClick: "loadScript(\"module/system/menus/users/perm.js\")"
        }
    },
    {
        perm: "system/get/users/groups",
        data: {
            id: "system-Users-groups",
            name: "Grupos",
            img: "Users.png",
            onClick: "loadScript(\"module/system/menus/users/groups.js\")"
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