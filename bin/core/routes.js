const colors = require("colors")
const bcypher = require('../lib/bcypher');
const fs = require("fs");
const path = require("path");

var RouteMap = new Map();

function routes(data, UUID, user_id, callback) {
    if (data != undefined) {
        if (data.route != undefined && data.data != undefined) {
            try {


                var ca = RouteMap.get(data.route);
                if (typeof ca == "function") {
                    ca(UUID, user_id, data, callback);
                } else {
                    console.log("Route Not Found: ".red + ("" + data.route).gray)
                }



                //if (data.route == "/get_all_hosts") { console.log("GetAllHosts".green); require('../rotine/sql/select/AllHosts.js')(data.data, (ret) => { callback({ route: "/hosts_hosts_list", data: ret }); }) }

                //if (data.route == "/add_subnet") { console.log("addSubnet".green); require('../rotine/sql/insert/newSubnet.js')(data.data, (ret) => { callback({ route: "/subnet_added", data: ret }); }) }
                //if (data.route == "/remove_subnet") { console.log("removeSubnet".green); require('../rotine/sql/drop/Subnet.js')(data.data, (ret) => { callback({ route: "/subnet_removed", data: ret }); }) }

                //if (data.route == "/scanSubnet") { console.log("Scan".green); require('../rotine/background/scanSubnet.js').scanNet(data.data, (ret) => { callback({ route: "/subnet_scanned", data: ret }) }); }
                //if (data.route == "/fullScanSubnet") { console.log("Scan".green); require('../rotine/background/scanSubnet.js').fullScanNet(data.data, (ret) => { callback({ route: "/subnet_scanned", data: ret }) }); }


                //if (data.route == "/add_host") { console.log("addHost".green); require('../rotine/sql/insert/newHost.js').client(data.data, (ret) => { callback({ route: "/host_added", data: ret }); }) }
                //if (data.route == "/remove_host") { console.log("removeHost".green); require('../rotine/sql/drop/singleHost.js')(data.data, (ret) => { callback({ route: "/host_removed", data: ret }); }) }


                //if (data.route == "/get_radios") { console.log("GetRadios".green); require('../rotine/sql/select/Radios.js')((ret) => { callback({ route: "/radio_list", data: ret }); }) }
                //if (data.route == "/add_radio") { console.log("addRadio".green); require('../rotine/sql/insert/newRadio')(data.data, (ret) => { callback({ route: "/radio_added", data: ret }); }) }
                //if (data.route == "/remove_radio") { console.log("removeRadio".green); require('../rotine/sql/drop/Radio')(data.data, (ret) => { callback({ route: "/radio_removed", data: ret }); }) }
                //if (data.route == "/scan_radio") { console.log("ScanRadio".green); require('../rotine/background/radios/get_scan_radio')(data.data, (ret) => { callback({ route: "/radio_scanning", data: ret }); }) }


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
            var v = require(path.join(__dirname + '/../modules/' + e + "/server/routes.js"))
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