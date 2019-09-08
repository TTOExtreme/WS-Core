
const path = require("path");

function RoutesInit(RouteAdd) {
    //adm
    //menus
    RouteAdd("ipam/get/top/menu", "ipam/get/top/menu", (UUID, user_id, data, returnData) => {
        require(path.join(__dirname + '/rotine/sql/select/menu/ipam-top.js'))(UUID, (ret) => {
            if (ret.status == "ERROR") { returnData({ route: "ipam/error", data: ret }); return; }
            returnData({ route: "ipam/list/top/menus", data: ret });
        });
    });
    RouteAdd("ipam/top/menu/subnet", "ipam/top/menu/subnet", (UUID, user_id, data, returnData) => {
        require(path.join(__dirname + '/rotine/sql/select/menu/subnet-top.js'))(UUID, (ret) => {
            if (ret.status == "ERROR") { returnData({ route: "ipam/error", data: ret }); return; }
            console.log(ret)
            returnData({ route: "ipam/list/subnet/menu", data: ret });
        });
    });


    //load subnets list
    RouteAdd("ipam/get/subnets", "ipam/get/subnets", (UUID, user_id, data, returnData) => {
        require(path.join(__dirname + '/rotine/sql/select/Subnet.js'))((ret) => {
            if (ret.status == "ERROR") { returnData({ route: "ipam/error", data: ret }); return; }
            returnData({ route: "ipam/list/subnets", data: ret });
        });
    });

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




}

module.exports = { RoutesInit };