ClientEvents.clearAll();

ClientEvents.emit("LeftMenuClose");
ClientEvents.emit("LMI-CloseAll");
ClientEvents.emit("close_menu");

ClientEvents.emit("LoadExternal", [
    "./module/WSOP/js/api/linkShow.js",
    "./module/WSOP/css/index.css"
], () => {
    ClientEvents.emit("SendSocket", "WSOP/api/lst")
}, false)

if (window.UserList) { // usa a mesma interface global para todas as listas
    window.UserList = null;
    document.getElementById("MainScreen").innerHTML = "";
}

ClientEvents.on("wsop/api/edt", (data) => {
    ClientEvents.emit("close_menu");
    try {
        data.data = JSON.parse(data.data);
    } catch (err) {

    }

    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsop_add_div menu_dragger");
    div.setAttribute("id", "WSOP_add_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_WSOP_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'WSOP_add_div')>&#9776;</td><td class='wsop_edt_closebtn'><p class='wsop_add_closeButton' onclick=ClientEvents.emit(\"close_menu\", 'WSOP_add_div')>X</p></td></tr>" +
        //Gmail
        "<tr><td class='wsop_edt_label'>Chave Api Gmail:</td><td><input id='WSOP_add_gmail_api' type='text' value='" + data.data.gmail.api + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Chave Key Gmail:</td><td><input id='WSOP_add_gmail_key' type='text' value='" + data.data.gmail.key + "'></td></tr>" +
        //Pagar.ME
        "<tr><td class='wsop_edt_label'>Chave Api Pagar.ME:</td><td><input id='WSOP_add_pagarme_api' type='text' value='" + data.data.pagarme.api + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Chave Key Pagar.ME:</td><td><input id='WSOP_add_pagarme_key' type='text' value='" + data.data.pagarme.key + "'></td></tr>" +

        //info and save
        "<tr><td colspan=2 class='wsop_edt_label_info' id='WSOP_add_info'></td></tr>" +
        "<tr><td></td><td><input id='WSOP_submit' value='Salvar' type='button' onclick='ClientEvents.emit(\"WSOP/api/edt\")'></td></tr>" +

        //testes
        "<tr><td></td><td><input id='WSOP_submit' value='Teste Pagar.me' type='button' onclick='ClientEvents.emit(\"wsop/api/pagarmeteste\")'></td></tr>" +


        "<tr><td colspan=2><textarea id='WSOP_log' disabled style='width: 100%;height: 400px;'></textarea></td></tr>" +
        "</table>";

    document.body.appendChild(div);
});


ClientEvents.on("WSOP/api/edt", () => {
    ClientEvents.emit("SendSocket", "WSOP/api/edt", {
        data: JSON.stringify({
            gmail: {
                api: document.getElementById("WSOP_add_gmail_api").value,
                key: document.getElementById("WSOP_add_gmail_key").value,
            },
            pagarme: {
                api: document.getElementById("WSOP_add_pagarme_api").value,
                key: document.getElementById("WSOP_add_pagarme_key").value,
            }

        })
    });
})

//testes

ClientEvents.on("wsop/api/pagarmeteste", () => {
    var value = prompt("Valor Teste: ", 0);
    var name = prompt("Nome Cliente: ", 0);
    if (value != undefined) {
        ClientEvents.emit("SendSocket", "WSOP/api/pagarme/gerarlink", {
            price: value,
            cliente: name
        });
    }
})




//Log
ClientEvents.on("WSOP/appendlog", (data) => {
    document.getElementById("WSOP_log").value += data + "\r\n";

    document.getElementById("WSOP_log").scrollTop = document.getElementById("WSOP_log").scrollHeight;
})

ClientEvents.on("system/edited/api", () => { ClientEvents.emit("system_mess", { status: "OK", mess: "API Cadastrada com Exito", time: 1000 }); });
