
const path = require("path");

function RoutesInit(RouteAdd) {
    //adm
    //menus
    RouteAdd("ipam/get/top/menu", "ipam/get/top/menu", (UUID, user_id, data, returnData) => {
        require(path.join(__dirname + '/rotine/sql/select/menu/ipam-top.js'))(UUID, (ret) => {
            if (ret.status == "ERROR") { returnData({ route: "system/error", data: ret }); return; }
            returnData({ route: "ipam/list/top/menus", data: ret });
        });
    });
    RouteAdd("ipam/top/menu/subnet", "ipam/top/menu/subnet", (UUID, user_id, data, returnData) => {
        require(path.join(__dirname + '/rotine/sql/select/menu/subnet-top.js'))(UUID, (ret) => {
            if (ret.status == "ERROR") { returnData({ route: "system/error", data: ret }); return; }
            returnData({ route: "ipam/list/subnet/menu", data: ret });
        });
    });
    RouteAdd("ipam/top/menu/hosts", "ipam/top/menu/hosts", (UUID, user_id, data, returnData) => {
        require(path.join(__dirname + '/rotine/sql/select/menu/hosts-top.js'))(UUID, (ret) => {
            if (ret.status == "ERROR") { returnData({ route: "system/error", data: ret }); return; }
            returnData({ route: "ipam/list/hosts/menu", data: ret });
        });
    });


    //load subnets list
    RouteAdd("ipam/get/subnets", "ipam/get/subnets", (UUID, user_id, data, returnData) => {
        require(path.join(__dirname + '/rotine/sql/select/Subnet.js'))((ret) => {
            if (ret.status == "ERROR") { returnData({ route: "system/error", data: ret }); return; }
            returnData({ route: "ipam/list/subnets", data: ret });
        });
    });

    //add new subnet
    RouteAdd("ipam/add/subnets", "ipam/add/subnets", (UUID, user_id, data, returnData) => {
        require(path.join(__dirname + '/rotine/sql/insert/Subnet.js'))(data, (ret) => {
            if (ret.status == "ERROR") { returnData({ route: "system/error", data: ret }); return; }
            returnData({ route: "ipam/added/subnet", data: ret });
        });
    });
    //add new Host
    RouteAdd("ipam/add/hosts", "ipam/add/hosts", (UUID, user_id, data, returnData) => {
        require(path.join(__dirname + '/rotine/sql/insert/newHost.js')).client(data, (ret) => {
            if (ret.status == "ERROR") { returnData({ route: "system/error", data: ret }); return; }
            returnData({ route: "ipam/edited/hosts", data: ret });
        });
    });

    //remove subnet
    RouteAdd("ipam/del/subnets", "ipam/del/subnets", (UUID, user_id, data, returnData) => {
        require(path.join(__dirname + '/rotine/sql/delete/Subnet.js'))(data, (ret) => {
            if (ret.status == "ERROR") { returnData({ route: "system/error", data: ret }); return; }
            returnData({ route: "ipam/removed/subnet", data: ret });
        });
    });


    //get Hosts in
    RouteAdd("ipam/get/hosts", "ipam/get/hosts", (UUID, user_id, data, returnData) => {
        require(path.join(__dirname + '/rotine/sql/select/Hosts.js'))(data, (ret) => {
            if (ret.status == "ERROR") { returnData({ route: "system/error", data: ret }); return; }
            returnData({ route: "ipam/list/hosts", data: ret });
        });
    });


    //get Scan Subnet 
    RouteAdd("ipam/scan/subnets", "ipam/get/subnets", (UUID, user_id, data, returnData) => {
        require(path.join(__dirname + '/rotine/background/scanSubnet.js')).scanNet(data, (ret) => {
            if (ret.status == "ERROR") { returnData({ route: "system/error", data: ret }); return; }
            returnData({ route: "ipam/scanned/subnet", data: ret });
        },
            (data) => {
                //returnData({ route: "system/info", data: { status: "INFO", time: 200, mess: "Escaneado: " + data.ip } });
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