ClientEvents.clearAll();

ClientEvents.emit("LeftMenuClose");
ClientEvents.emit("LMI-CloseAll");
ClientEvents.emit("close_menu");

ClientEvents.emit("LoadExternal", [
    "./module/OPLI/css/index.css"
], () => { }, false)

if (window.UserList) { // usa a mesma interface global para todas as listas
    window.UserList = null;
    document.getElementById("MainScreen").innerHTML = "";
}

ClientEvents.on("OPLI/api/edt", (data) => {
    ClientEvents.emit("close_menu", 'opli_add_div');

    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "opli_add_div menu_dragger");
    div.setAttribute("id", "opli_add_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_opli_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'opli_add_div')>&#9776;</td><td class='opli_edt_closebtn'><p class='closeButton' onclick=ClientEvents.emit(\"close_menu\", 'opli_add_div')>X</p></td></tr>" +
        "<tr><td class='opli_edt_label'>Chave Api:</td><td><input id='opli_add_api' type='text' value='" + data.api + "'></td></tr>" +
        "<tr><td class='opli_edt_label'>Chave Aplicação:</td><td><input id='opli_add_aplication' type='text' value='" + data.aplication + "'></td></tr>" +
        "<tr><td class='opli_edt_label'>Chave Trello:</td><td><input id='opli_add_trelloKey' type='text' value='" + data.trelloKey + "'></td></tr>" +
        "<tr><td class='opli_edt_label'>Token Trello:</td><td><input id='opli_add_trelloToken' type='text' value='" + data.trelloToken + "'></td></tr>" +
        "<tr><td class='opli_edt_label'>Board Trello:</td><td><input id='opli_add_trelloBoard' type='text' value='" + data.trelloBoard + "'></td></tr>" +
        "<tr><td class='opli_edt_label'>Lista Trello:</td><td><input id='opli_add_trelloList' type='text' value='" + data.trelloList + "'></td></tr>" +
        "<tr><td class='opli_edt_label'>Labels Trello:</td><td><input id='opli_add_trelloLabels' type='text' value='" + data.trelloLabels + "'></td></tr>" +

        "<tr><td class='opli_edt_label'>Auto Cadastro Produtos:</td><td><input id='opli_add_pullproducts' type='checkbox' " + ((data.pullproducts == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td class='opli_edt_label'>Auto Cadastro Vendas:</td><td><input id='opli_add_pullsells' type='checkbox' " + ((data.pullsells == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td class='opli_edt_label'>Auto Cadastro Clientes:</td><td><input id='opli_add_pullclients' type='checkbox' " + ((data.pullclients == 1) ? "Checked" : "") + "></td></tr>" +

        "<tr><td class='opli_edt_label'>Ativo:</td><td><input id='opli_add_active' type='checkbox' " + ((data.active == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td colspan=2 class='opli_edt_label_info' id='opli_add_info'></td></tr>" +
        "<tr><td></td><td><input id='opli_submit' value='Editar' type='button' onclick='ClientEvents.emit(\"opli/clientes/edt\")'></td></tr>" +
        "<tr><td></td><td><input id='opli_upproducts' value='Carregar Produtos' type='button' onclick='ClientEvents.emit(\"opli/api/loadproducts\")'></td></tr>" +
        "<tr><td></td><td><input id='opli_upclientes' value='Carregar Clientes' type='button' onclick='ClientEvents.emit(\"SendSocket\", \"opli/api/loadclients\")'></td></tr>" +
        "<tr><td></td><td><input id='opli_upvendas' value='Carregar Vendas' type='button' onclick='ClientEvents.emit(\"opli/api/loadsells\")'></td></tr>" +
        "<tr><td></td><td><input id='opli_upvendas' value='Carregar Vendas em produção' type='button' onclick='ClientEvents.emit(\"opli/api/loadsellstrello\")'></td></tr>" +
        "<tr><td></td><td><input id='opli_upvendas' value='Carregar Vendas Pagas' type='button' onclick='ClientEvents.emit(\"SendSocket\", \"opli/api/loadpaidsells\")'></td></tr>" +
        "<tr><td colspan=2><textarea id='opli_log' disabled style='width: 100%;height: 400px;'></textarea></td></tr>" +
        "</table>";

    document.body.appendChild(div);
});
ClientEvents.on("opli/api/loadproducts", () => {
    var value = prompt("Offset de Carregamento: ", 0);
    if (value != undefined) {
        ClientEvents.emit("SendSocket", "opli/api/loadproducts", {
            offset: value
        });
    }
})
ClientEvents.on("opli/api/loadsells", () => {
    var value = prompt("Offset de Carregamento: ", 0);
    if (value != undefined) {
        ClientEvents.emit("SendSocket", "opli/api/loadsells", {
            offset: value
        });
    }
})
ClientEvents.on("opli/api/loadsellstrello", () => {
    var value = prompt("Offset de Carregamento: ", 0);
    if (value != undefined) {
        ClientEvents.emit("SendSocket", "opli/api/loadsellstrello", {
            offset: value
        });
    }
})

ClientEvents.on("opli/clientes/edt", () => {
    ClientEvents.emit("SendSocket", "opli/api/edt", {
        api: document.getElementById("opli_add_api").value,
        aplication: document.getElementById("opli_add_aplication").value,
        trelloToken: document.getElementById("opli_add_trelloToken").value,
        trelloKey: document.getElementById("opli_add_trelloKey").value,
        trelloBoard: document.getElementById("opli_add_trelloBoard").value,
        trelloList: document.getElementById("opli_add_trelloList").value,
        trelloLabels: document.getElementById("opli_add_trelloLabels").value,
        pullproducts: document.getElementById("opli_add_pullproducts").checked,
        pullsells: document.getElementById("opli_add_pullsells").checked,
        pullclients: document.getElementById("opli_add_pullclients").checked,
        active: document.getElementById("opli_add_active").checked,
    });
    /**
     * save data and closes the page if success
     * closing part from server command
     */
})

ClientEvents.on("opli/api/close", () => {
    if (document.getElementById("opli_add_div")) {
        document.body.removeChild(document.getElementById("opli_add_div"));
    }
});

ClientEvents.on("opli/appendlog", (data) => {
    document.getElementById("opli_log").value += data + "\r\n";

    document.getElementById("opli_log").scrollTop = document.getElementById("opli_log").scrollHeight;
})

ClientEvents.on("system/updated/products", () => { ClientEvents.emit("system_mess", { status: "OK", mess: "Produtos Recarregados", time: 1000 }); });
ClientEvents.on("system/updated/sells", () => { ClientEvents.emit("system_mess", { status: "OK", mess: "Vendas Recarregadas", time: 1000 }); });
ClientEvents.on("system/updated/clients", () => { ClientEvents.emit("system_mess", { status: "OK", mess: "Clientes Recadastrados", time: 1000 }); });
ClientEvents.on("system/edited/api", () => { ClientEvents.emit("system_mess", { status: "OK", mess: "API Cadastrada com Exito", time: 1000 }); });

ClientEvents.emit("SendSocket", "opli/api/lst")