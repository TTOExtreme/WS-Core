function initIpam() {
    ipamAppendRoutes();
    initTopMenuItems();
    startLoader();
    closeLeftMenu();
    loadCSS("module/ipam/Ipam.css");
    loadScript("module/ipam/utils/ipCalculator.js");

    var htm = "";
    htm += "<table id='ipam_main_table' class='ipam_main_table_holder'>";
    htm += "<tr><td><div class='ipam_top_table_holder'><table id='ipam_top_table' class='ipam_top_table'></table></div></td></tr>";
    htm += "<tr><td><div class='ipam_bottom_table_holder'><div id='ipam_bottom_table' class='ipam_bottom_table'></div></div></td></tr></table>";
    htm += "<tr><td><center><table id='overlay_input_table' class='overlay_input_table'></table></td></tr>";

    document.getElementById("mainPage").innerHTML = htm;
    reloadIpam();
}

function ipamAppendRoutes() {
    appendRoute("ipam/list/top/menus", ipam_top_list);
}

function reloadIpam() {
    send("ipam/get/top/menu", {});
}

function ipam_top_list(data) {
    changeTopMenuItems(data);
    stopLoader()
}

function initIpamMenuItems() {
    resetIpamMenuItems();
}

function changeIpamMenuItems(list = [{ name: "teste", onclick: "resetTopMenuItems()" }]) {
    var tm = document.getElementById("ipam_top_table");
    var htm = "<tr class='topMenu_Items_tr'>";
    list.forEach(e => {
        htm += "<td class='topMenu_Items_td'><center><p onclick='" + e.onClick + "'>" + e.name + "</p></center></td>";
    })
    htm += "</tr>";
    tm.innerHTML = htm;

}

function resetIpamMenuItems() {
    //document.getElementById("ipam_top_table").innerHTML = "";
}

initIpam();