function inithbmd() {
    hbmdAppendRoutes();
    initTopMenuItems();
    startLoader();
    closeLeftMenu();
    loadCSS("module/hbmd/hbmd.css");
    loadScript("module/hbmd/utils/ipCalculator.js");

    let htm = "";
    htm += "<table id='hbmd_main_table' class='hbmd_main_table_holder'>";
    htm += "<tr><td><div class='hbmd_top_table_holder'><table id='hbmd_top_table' class='hbmd_top_table'></table></div></td></tr>";
    htm += "<tr><td><div class='hbmd_bottom_table_holder'><div id='hbmd_bottom_table' class='hbmd_bottom_table'></div></div></td></tr></table>";
    htm += "<tr><td><center><table id='overlay_input_table' class='overlay_input_table'></table></td></tr>";

    document.getElementById("mainPage").innerHTML = htm;
    reloadhbmd();
}

function hbmdAppendRoutes() {
    appendRoute("hbmd/list/top/menus", hbmd_top_list);
}

function reloadhbmd() {
    send("hbmd/get/top/menu", {});
}

function hbmd_top_list(data) {
    changeTopMenuItems(data);
    stopLoader()
}

function inithbmdMenuItems() {
    resethbmdMenuItems();
}

function changehbmdMenuItems(list = [{ name: "teste", onclick: "resetTopMenuItems()" }]) {
    let tm = document.getElementById("hbmd_top_table");
    let htm = "<tr class='topMenu_Items_tr'>";
    list.forEach(e => {
        htm += "<td class='topMenu_Items_td'><center><p onclick='" + e.onClick + "'>" + e.name + "</p></center></td>";
    })
    htm += "</tr>";
    tm.innerHTML = htm;

}

function resethbmdMenuItems() {
    document.getElementById("hbmd_top_table").innerHTML = "";
}

inithbmd();