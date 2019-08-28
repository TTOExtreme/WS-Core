
const path = require("path");

function routesInit(RouteAdd) {
    //adm
    //menus
    RouteAdd("system/get/top/menu", "system/get/top/menu", (UUID, user_id, data, returnData) => {
        require(path.join(__dirname + '/rotine/sql/select/menu/system-top.js'))(UUID, (ret) => {
            if (ret.status == "ERROR") { returnData({ route: "system/error", data: ret }); return; }
            returnData({ route: "system/list/top/menus", data: ret });
        });
    });
    RouteAdd("system/get/users/menu", "system/top/menu/users", (UUID, user_id, data, returnData) => {
        require(path.join(__dirname + '/rotine/sql/select/menu/system-sub-users.js'))(UUID, (ret) => {
            if (ret.status == "ERROR") { returnData({ route: "system/error", data: ret }); return; }
            returnData({ route: "system/list/users/menu", data: ret });
        });
    });




    //users
    //  Get
    RouteAdd("system/get/users", "system/get/users", (UUID, user_id, data, returnData) => {
        if (data.data.start != undefined && data.data.end != undefined) {
            require(path.join(__dirname + '/rotine/sql/select/users/users-full.js')).multiple(data.data.start, data.data.end, (ret) => {
                if (ret.status == "ERROR") { returnData({ route: "system/error", data: ret }); return; }
                returnData({ route: "system/append/users", data: ret });
            });
        } else {
            require(path.join(__dirname + '/rotine/sql/select/users/users-full.js')).single((ret) => {
                if (ret.status == "ERROR") { returnData({ route: "system/error", data: ret }); return; }
                returnData({ route: "system/list/users", data: ret });
            });
        }
    });
    //  add
    RouteAdd("system/add/user", "system/add/users", (UUID, user_id, data, returnData) => {
        require(path.join(__dirname + '/rotine/sql/insert/users/add.js'))(data.data.user, data.data.username, data.data.pass, bcypher.sha512(data.data.user + data.data.pass + bcypher.ger_crypt()), user_id, 1, (ret) => {
            if (ret.status == "ERROR") { returnData({ route: "system/error", data: ret }); return; }
            returnData({ route: "system/added/users", data: ret });
        });
    });
    //  enable
    RouteAdd("system/enable/users", "system/edt/users", (UUID, user_id, data, returnData) => {
        require(path.join(__dirname + '/rotine/sql/update/users/active.js'))(user_id, data.data.id_user, ((data.data.active == 0) ? 1 : 0), (ret) => {
            if (ret.status == "ERROR") { returnData({ route: "system/error", data: ret }); return; }
            if (data.data.active == 0) {
                returnData({ route: "system/enabled/users", data: ret });
            } else {
                returnData({ route: "system/disabled/users", data: ret });
            }
        });
    });
    //  edit
    RouteAdd("system/edt/users", "system/edt/users", (UUID, user_id, data, returnData) => {
        require(path.join(__dirname + '/rotine/sql/update/users/edt.js'))(data.data.id_user, data.data.user, data.data.username, data.data.pass, (ret) => {
            if (ret.status == "ERROR") { returnData({ route: "system/error", data: ret }); return; }
            returnData({ route: "system/edited/users", data: ret });
        });
    });
    //  del
    RouteAdd("system/del/users", "system/del/users", (UUID, user_id, data, returnData) => {
        require(path.join(__dirname + '/rotine/sql/delete/users/del.js'))(data.data.id_user, (ret) => {
            if (ret.status == "ERROR") { returnData({ route: "system/error", data: ret }); return; }
            returnData({ route: "system/removed/users", data: ret });
        });
    });

    //  load perm
    RouteAdd("system/get/users/perm", "system/get/users/perm", (UUID, user_id, data, returnData) => {
        require(path.join(__dirname + '/rotine/sql/select/users/perm.js'))(data.data.id_user, (ret) => {
            if (ret.status == "ERROR") { returnData({ route: "system/error", data: ret }); return; }
            returnData({ route: "system/atr/users/perm", data: ret });
        });
    });

    //  load groups
    RouteAdd("system/get/users/groups", "system/get/users/groups", (UUID, user_id, data, returnData) => {
        console.log(data);
        require(path.join(__dirname + '/rotine/sql/select/users/groups.js'))(data.data.id_user, (ret) => {
            if (ret.status == "ERROR") { returnData({ route: "system/error", data: ret }); return; }
            data.data.groups = ret;
            console.log(data.data);
            returnData({ route: "system/list/users/groups", data: data.data });
        });
    });
    //  attrib perm
    RouteAdd("system/atr/users/perm", "system/atr/users/perm", (UUID, user_id, data, returnData) => {
        require(path.join(__dirname + '/rotine/sql/insert/users/perm.js'))(data.data.id_user, (ret) => {
            if (ret.status == "ERROR") { returnData({ route: "system/error", data: ret }); return; }
            returnData({ route: "system/atr/users/perm", data: ret });
        });
    });
}

module.exports = routesInit;