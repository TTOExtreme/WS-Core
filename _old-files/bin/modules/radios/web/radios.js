function initRadios() {
    radiosAppendRoutes();
    initTopMenuItems();
    startLoader();
    closeLeftMenu();
    loadCSS("module/radios/radios.css");
    loadScript("module/radios/utils/ipCalculator.js");

    let htm = "";
    htm += "<table id='radios_main_table' class='radios_main_table_holder'>";
    htm += "<tr><td><div class='radios_top_table_holder'><table id='radios_top_table' class='radios_top_table'></table></div></td></tr>";
    htm += "<tr><td><div class='radios_bottom_table_holder'><div id='radios_bottom_table' class='radios_bottom_table'></div></div></td></tr></table>";
    htm += "<tr><td><center><table id='overlay_input_table' class='overlay_input_table'></table></td></tr>";

    document.getElementById("mainPage").innerHTML = htm;
    reloadRadios();
}

function radiosAppendRoutes() {
    appendRoute("radios/list/top/menus", radios_top_list);
}

function reloadRadios() {
    send("radios/get/top/menu", {});
}

function radios_top_list(data) {
    changeTopMenuItems(data);
    stopLoader()
}

function initRadiosMenuItems() {
    resetRadiosMenuItems();
}

function changeRadiosMenuItems(list = [{ name: "teste", onclick: "resetTopMenuItems()" }]) {
    let tm = document.getElementById("radios_top_table");
    let htm = "<tr class='topMenu_Items_tr'>";
    list.forEach(e => {
        htm += "<td class='topMenu_Items_td'><center><p onclick='" + e.onClick + "'>" + e.name + "</p></center></td>";
    })
    htm += "</tr>";
    tm.innerHTML = htm;

}

function resetRadiosMenuItems() {
    //document.getElementById("radios_top_table").innerHTML = "";
}

initRadios();