function initSystem() {
    systemAppendRoutes();
    initTopMenuItems();
    startLoader();
    closeLeftMenu();
    loadCSS("module/system/System.css");

    var htm = "";
    htm += "<table id='system_main_table' class='system_main_table_holder'>";
    htm += "<tr><td><div class='system_top_table_holder'><table id='system_top_table' class='system_top_table'></table></div></td></tr>";
    htm += "<tr><td><div class='system_bottom_table_holder'><div id='system_bottom_table' class='system_bottom_table'></div></div></td></tr></table>";

    document.getElementById("mainPage").innerHTML = htm;
    reloadSystem();
}

function systemAppendRoutes() {
    appendRoute("system/list/top/menus", system_top_list);
}

function reloadSystem() {
    send("system/get/top/menu", {});
}

function system_top_list(data) {
    changeTopMenuItems(data);
    stopLoader()
}

function initSystemMenuItems() {
    resetSystemMenuItems();
}

function changeSystemMenuItems(list = [{ name: "teste", onclick: "resetTopMenuItems()" }]) {
    var tm = document.getElementById("system_top_table");
    var htm = "<tr class='topMenu_Items_tr'>";
    list.forEach(e => {
        htm += "<td class='topMenu_Items_td'><center><p onclick='" + e.onClick + "'>" + e.name + "</p></center></td>";
    })
    htm += "</tr>";
    tm.innerHTML = htm;

}

function resetSystemMenuItems() {
    //document.getElementById("system_top_table").innerHTML = "";
}

initSystem();