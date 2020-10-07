
ClientEvents.on("WPMA/sites/edt", (data) => {
    console.log(data);
    ClientEvents.emit("WPMA/sites/close_edt");
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
    div.setAttribute("id", "wpma_sites_div_edt");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wpma_sites' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wpma_sites_div_edt')>&#9776;</td><td class='wpma_sites_label'><p class='edt_wpma_sites_closeButton' onclick='ClientEvents.emit(\"WPMA/sites/close_edt\")'>X</p></td></tr>" +
        "<tr><td class='wpma_sites_label'>ID:</td><td><input id='wpma_sites_id' type='text' value='" + data.id + "' disabled></td></tr>" +
        "<tr><td class='wpma_sites_label'>Nome:</td><td><input id='wpma_sites_name' type='text' value='" + data.name + "'></td></tr>" +
        "<tr><td class='wpma_sites_label'>Descrição:</td><td><input id='wpma_sites_description' type='text' value='" + data.description + "'></td></tr>" +
        "<tr><td class='wpma_sites_label'>Rota:</td><td><input id='wpma_sites_route' type='text' value='" + data.route + "'></td></tr>" +
        "<tr><td class='wpma_sites_label'>Subdomínio:</td><td><input id='wpma_sites_subdomain' type='text' value='" + data.subdomain + "'></td></tr>" +
        "<tr><td class='wpma_sites_label'>Pasta:</td><td><input id='wpma_sites_folder' type='text' value='" + data.folder + "'></td></tr>" +
        "<tr><td class='wpma_sites_label'>Ativo:</td><td><input id='wpma_sites_active' type='checkbox' " + ((data.active == 1) ? "Checked" : "") + " disabled></td></tr>" +
        "<tr><td class='wpma_sites_label'>Log:</td><td><input id='wpma_sites_log' type='checkbox' " + ((data.log == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Salvar' type='button' onclick='ClientEvents.emit(\"WPMA/sites/edt/save\")'></td></tr>" +
        "</table>";

    document.body.appendChild(div);
});

ClientEvents.on("WPMA/sites/close_edt", () => {
    if (document.getElementById("wpma_sites_div_edt")) {
        document.body.removeChild(document.getElementById("wpma_sites_div_edt"));
    }
});
ClientEvents.on("WPMA/sites/edt/success", () => {
    ClientEvents.emit("system_mess", { status: "OK", mess: "Site criado com sucesso", time: 1000 });
    ClientEvents.emit("SendSocket", "adm/WPMA/sites/lst");
});

ClientEvents.on("WPMA/sites/edt/save", () => {

    ClientEvents.emit("SendSocket", "adm/WPMA/sites/edt/save", {
        id: document.getElementById("wpma_sites_id").value,
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