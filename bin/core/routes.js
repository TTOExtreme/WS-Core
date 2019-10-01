const colors = require("colors")
const bcypher = require('../lib/bcypher');
const fs = require("fs");
const path = require("path");

let RouteMap = new Map();

function routes(data, UUID, user_id, callback) {
    if (data != undefined) {
        if (data.route != undefined && data.data != undefined) {
            try {


                let ca = RouteMap.get(data.route);
                if (typeof ca == "function") {
                    ca(UUID, user_id, data, callback);
                } else {
                    console.log("Route Not Found: ".red + ("" + JSON.stringify(data)).gray)
                }
            } catch (err) {
                console.log(colors.yellow(data));
                if (err.status != undefined) {
                    callback(err);
                } else {
                    console.log(err);
                }
            }
        }
    }
}

function RouteAdd(route, permission, callback) {
    RouteMap.set(route, (UUID, user_id, data, returnData) => {
        checkRoute(UUID, data, permission, (state) => {
            if (state) {
                callback(UUID, user_id, data, returnData);
            }
        })
    });
}

function RouteInit() {

    RouteAdd("tab/side/get", "tab/side/get", (UUID, user_id, data, returnData) => {
        require('../rotine/sql/select/menu/tabs-side.js')(UUID, (ret) => {
            if (ret.status == "ERROR") { returnData({ route: "system/error", data: ret }); return; }
            returnData({ route: "tab/side/list", data: ret });
        });
    })

    fs.readdirSync(path.join(__dirname + '/../modules')).forEach(e => {
        if (fs.existsSync(path.join(__dirname + '/../modules/' + e + "/server/routes.js"))) {
            let v = require(path.join(__dirname + '/../modules/' + e + "/server/routes.js"))
            v.RoutesInit(RouteAdd);
        }
    })

}

function check(UUID, data, route, permission, callback) {
    if (data.route == route) {
        require('../rotine/check/checkPermission.js')(UUID, permission, (state) => {
            console.log(("" + data.route).green + ((!state) ? (" Denied").red : (" Granted").green) + (" For UUID:{" + UUID + "}").gray);
            callback(state);
        });
    }
}

function checkRoute(UUID, data, permission, callback) {
    require('../rotine/check/checkPermission.js')(UUID, permission, (state) => {
        console.log(("" + data.route).green + ((!state) ? (" Denied").red : (" Granted").green) + (" For UUID:{" + UUID + "}").gray);
        callback(state)
    });
}
RouteInit();

module.exports = routes;