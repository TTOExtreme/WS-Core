let leftMenuItemsList = []

function exitLeftMenu() {
    window.location.replace(rootLocation + "login")
}

function openLeftMenu() {
    document.getElementById("leftMenu").style.left = "0px";
    document.getElementById("leftMenu_oc").innerHTML = "&#x2716;";
    document.getElementById("leftMenu_oc").setAttribute("onclick", "closeLeftMenu()");
    document.getElementById("leftMenu_oc").style.paddingLeft = "16px";
    document.getElementById("leftMenu_Items").style.opacity = "1";
}

function closeLeftMenu() {
    document.getElementById("leftMenu").style.left = "-202px";
    document.getElementById("leftMenu_oc").innerHTML = "&#9776;";
    document.getElementById("leftMenu_oc").setAttribute("onclick", "openLeftMenu()");
    document.getElementById("leftMenu_oc").style.paddingLeft = "45px";
    document.getElementById("leftMenu_Items").style.opacity = "0";
}

function side_menu_init() {
    appendRoute("tab/side/list", side_menu_load)
    loadCSSCall("comum/css/side_menu.css", () => {
        send("tab/side/get", {})
    });
}

function side_menu_load(data) {
    if (data != undefined) {
        let menu = document.getElementById("leftMenu_Items");
        if (menu != undefined) {
            leftMenuItemsList = data;
            menu.innerHTML = "";
            leftMenuItemsList.forEach(e => {
                menu.innerHTML += "<tr class='leftMenu_Item' id='" + e.id + "' onclick='" + e.onClick + "'><td><img class='leftMenuItemImg' src='comum/img/" + e.img + "' ></img></td><td><p>" + e.name + "</p></td></tr>";
            })
            closeLeftMenu();
            //openLeftMenu();
            stopLoader();
        } else {
            document.getElementById("aside_nav").innerHTML = '<div id="leftMenu" class="leftMenu">' +
                '<center><table id="leftMenu_HomeControls" class="leftMenu_HomeControls">' +
                '<tr><td id="Home" class="closebtn" onclick="homeLeftMenu()">&#8962;</td>' +
                '<td id="Setings" class="closebtn" onclick="setingsLeftMenu()">&#9881;</td>' +
                '<td id="Exit" class="closebtn" onclick="exitLeftMenu()">&#10162;</td>' +
                '<td id="leftMenu_oc" class="closebtn" onclick="closeLeftMenu()"></td>' +
                '</tr></table>\</center><table id="leftMenu_Items" class="leftMenu_Items"></table></div>';
            setTimeout(() => { side_menu_load(data); }, 50);
        }
    }
}

wait_Load(() => {
    side_menu_init();
})