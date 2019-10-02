
const path = require("path");

function RoutesInit(RouteAdd) {
    //adm
    //menus
    RouteAdd("radios/get/top/menu", "radios/get/top/menu", (UUID, user_id, data, returnData) => {
        require(path.join(__dirname + '/rotine/sql/select/menu/radios-top.js'))(UUID, (ret) => {
            if (ret.status == "ERROR") { returnData({ route: "system/error", data: ret }); return; }
            returnData({ route: "radios/list/top/menus", data: ret });
        });
    });
    RouteAdd("radios/top/menu/dashboard", "radios/top/menu/dashboard", (UUID, user_id, data, returnData) => {
        require(path.join(__dirname + '/rotine/sql/select/menu/subnet-top.js'))(UUID, (ret) => {
            if (ret.status == "ERROR") { returnData({ route: "system/error", data: ret }); return; }
            returnData({ route: "radios/list/subnet/menu", data: ret });
        });
    });
    RouteAdd("radios/top/menu/radios", "radios/top/menu/radios", (UUID, user_id, data, returnData) => {
        require(path.join(__dirname + '/rotine/sql/select/menu/radiosList-top.js'))(UUID, (ret) => {
            if (ret.status == "ERROR") { returnData({ route: "system/error", data: ret }); return; }
            returnData({ route: "radios/list/radios/menu", data: ret });
        });
    });

    //load Radios list
    RouteAdd("radios/get/radios", "radios/get/radios", (UUID, user_id, data, returnData) => {
        require(path.join(__dirname + '/rotine/sql/select/Radios.js'))((ret) => {
            if (ret.status == "ERROR") { returnData({ route: "system/error", data: ret }); return; }
            returnData({ route: "radios/list/radios", data: ret });
        });
    });
    //add new Radio
    RouteAdd("radios/add/radios", "radios/add/radios", (UUID, user_id, data, returnData) => {
        require(path.join(__dirname + '/rotine/sql/insert/Radio.js'))(data.data, (ret) => {
            if (ret.status == "ERROR") { returnData({ route: "system/error", data: ret }); return; }
            returnData({ route: "radios/added/radios", data: ret });
        });
    });

    //remove subnet
    RouteAdd("radios/del/radios", "radios/del/radios", (UUID, user_id, data, returnData) => {
        require(path.join(__dirname + '/rotine/sql/delete/Radios.js'))(data.data, (ret) => {
            if (ret.status == "ERROR") { returnData({ route: "system/error", data: ret }); return; }
            returnData({ route: "radios/removed/radios", data: ret });
        });
    });

    //Scan Radios 
    RouteAdd("radios/scan/radios", "radios/get/radios", (UUID, user_id, data, returnData) => {
        require(path.join(__dirname + '/rotine/background/radios/get_scan_radio.js'))(data.data, (ret) => {
            if (ret.status == "ERROR") {
                console.log("error");
                returnData({ route: "system/error", data: ret });
            } else {
                returnData({ route: "radios/scanned/radios", data: ret });
            }
        });
    });

    //if (data.route == "/get_all_radios") { console.log("GetAllHosts".green); require('../rotine/sql/select/AllHosts.js')(data.data, (ret) => { callback({ route: "/radios_radios_list", data: ret }); }) }

    //if (data.route == "/add_dashboard") { console.log("adddashboard".green); require('../rotine/sql/insert/newSubnet.js')(data.data, (ret) => { callback({ route: "/subnet_added", data: ret }); }) }
    //if (data.route == "/remove_dashboard") { console.log("removedashboard".green); require('../rotine/sql/drop/Subnet.js')(data.data, (ret) => { callback({ route: "/subnet_removed", data: ret }); }) }

    //if (data.route == "/scandashboard") { console.log("Scan".green); require('../rotine/background/scanSubnet.js').scanNet(data.data, (ret) => { callback({ route: "/subnet_scanned", data: ret }) }); }
    //if (data.route == "/fullScandashboard") { console.log("Scan".green); require('../rotine/background/scanSubnet.js').fullScanNet(data.data, (ret) => { callback({ route: "/subnet_scanned", data: ret }) }); }


    //if (data.route == "/add_host") { console.log("addHost".green); require('../rotine/sql/insert/newHost.js').client(data.data, (ret) => { callback({ route: "/host_added", data: ret }); }) }
    //if (data.route == "/remove_host") { console.log("removeHost".green); require('../rotine/sql/drop/singleHost.js')(data.data, (ret) => { callback({ route: "/host_removed", data: ret }); }) }


    //if (data.route == "/get_radios") { console.log("GetRadios".green); require('../rotine/sql/select/Radios.js')((ret) => { callback({ route: "/radio_list", data: ret }); }) }
    //if (data.route == "/add_radio") { console.log("addRadio".green); require('../rotine/sql/insert/newRadio')(data.data, (ret) => { callback({ route: "/radio_added", data: ret }); }) }
    //if (data.route == "/remove_radio") { console.log("removeRadio".green); require('../rotine/sql/drop/Radio')(data.data, (ret) => { callback({ route: "/radio_removed", data: ret }); }) }
    //if (data.route == "/scan_radio") { console.log("ScanRadio".green); require('../rotine/background/radios/get_scan_radio')(data.data, (ret) => { callback({ route: "/radio_scanning", data: ret }); }) }



    //*/
}

module.exports = { RoutesInit };