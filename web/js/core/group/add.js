
ClientEvents.on("grp/add/add", () => {
    ClientEvents.emit("grp/add/close");
    let data = {
        name: "",
        username: "",
        pass: "",
        active: 1,
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
    div.setAttribute("class", "grp_add_div");
    div.setAttribute("id", "grp_add_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_grp_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'grp_add_div')>&#9776;</td><td class='grp_edt_label'><p class='add_grp_closeButton' onclick='ClientEvents.emit(\"grp/add/close\")'>X</p></td></tr>" +
        "<tr><td class='grp_edt_label'>Nome:</td><td><input id='grp_add_name' type='text' value='" + data.name + "'></td></tr>" +
        "<tr><td class='grp_edt_label'>Ativo:</td><td><input id='grp_add_active' type='checkbox' " + ((data.active == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Adicionar' type='button' onclick='ClientEvents.emit(\"grp/add/save\")'></td></tr>" +
        "</table>";

    document.body.appendChild(div);
});
ClientEvents.emit("grp/add/add")

ClientEvents.on("grp/add/close", () => {
    console.log('Called')
    if (document.getElementById("grp_add_div")) {
        document.body.removeChild(document.getElementById("grp_add_div"));
    }
});

ClientEvents.on("grp/add/save", () => {
    ClientEvents.emit("SendSocket", "adm/grp/add/save", {
        name: document.getElementById("grp_add_name").value,
        active: document.getElementById("grp_add_active").checked,
    });
    /**
     * save data and closes the page if success
     * closing part from server command
     */
})
