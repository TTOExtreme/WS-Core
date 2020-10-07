
ClientEvents.on("WPMA/sites/add", () => {
    ClientEvents.emit("WPMA/sites/close_add");
    let data = {
        name: "",
        description: "",
        route: "",
        subdomain: "",
        folder: "",
        active: 1,
        log: 1,
    }
    /**
     * id
     * name
     * username
     * created In
     * created By
     * deactivateIn
     * deactivatedBy
     * active
     * connected
     * lastConnection
     * lastTry
     * lastIp
     */

    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wpma_sites_div");
    div.setAttribute("id", "wpma_sites_div_add");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wpma_sites' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wpma_sites_div_add')>&#9776;</td><td class='wpma_sites_label'><p class='add_wpma_sites_closeButton' onclick='ClientEvents.emit(\"WPMA/sites/close_add\")'>X</p></td></tr>" +
        "<tr><td class='wpma_sites_label'>Nome:</td><td><input id='wpma_sites_name' type='text' value='Teste'></td></tr>" +
        "<tr><td class='wpma_sites_label'>Descrição:</td><td><input id='wpma_sites_description' type='text' value='Site de Teste'></td></tr>" +
        "<tr><td class='wpma_sites_label'>Rota:</td><td><input id='wpma_sites_route' type='text' value='/'></td></tr>" +
        "<tr><td class='wpma_sites_label'>Subdomínio:</td><td><input id='wpma_sites_subdomain' type='text' value='teste.teste'></td></tr>" +
        "<tr><td class='wpma_sites_label'>Pasta:</td><td><input id='wpma_sites_folder' type='text' value='teste/'></td></tr>" +
        "<tr><td class='wpma_sites_label'>Ativo:</td><td><input id='wpma_sites_active' type='checkbox' " + ((data.active == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td class='wpma_sites_label'>Log:</td><td><input id='wpma_sites_log' type='checkbox' " + ((data.log == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Adicionar' type='button' onclick='ClientEvents.emit(\"WPMA/sites/add/save\")'></td></tr>" +
        "</table>";

    document.body.appendChild(div);
});

ClientEvents.on("WPMA/sites/close_add", () => {
    if (document.getElementById("wpma_sites_div_add")) {
        document.body.removeChild(document.getElementById("wpma_sites_div_add"));
    }
});
ClientEvents.on("WPMA/sites/add/success", () => {
    ClientEvents.emit("system_mess", { status: "OK", mess: "Site criado com sucesso", time: 1000 });
    ClientEvents.emit("SendSocket", "adm/WPMA/sites/lst");
});

ClientEvents.on("WPMA/sites/add/save", () => {

    ClientEvents.emit("SendSocket", "adm/WPMA/sites/add/save", {
        name: document.getElementById("wpma_sites_name").value,
        description: document.getElementById("wpma_sites_description").value,
        route: document.getElementById("wpma_sites_route").value,
        subdomain: document.getElementById("wpma_sites_subdomain").value,
        folder: document.getElementById("wpma_sites_folder").value,
        active: document.getElementById("wpma_sites_active").checked,
        log: document.getElementById("wpma_sites_log").checked
    });
    /**
     * save data and closes the page if success
     * closing part from server command
     */
})

ClientEvents.emit("WPMA/sites/add");