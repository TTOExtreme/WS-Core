function initTopMenuItems() {
    loadCSSCall("comum/css/top_menu.css", () => {
        //resetTopMenuItems();
        //changeTopMenuItems();
    });
}

function changeTopMenuItems(list = [{ name: "teste", onclick: "resetTopMenuItems()" }]) {

    let tm = document.getElementById("topMenu_Items_table");
    let htm = "<tr class='topMenu_Items_tr'>";
    list.forEach(e => {
        htm += "<td class='topMenu_Items_td'><center><p onclick='" + e.onClick + "'>" + e.name + "</p></center></td>";
    })
    htm += "</tr>";
    tm.innerHTML = htm;

}

function resetTopMenuItems() {
    document.getElementById("topMenu_Items_table").innerHTML = "";
}

//initTopMenuItems();