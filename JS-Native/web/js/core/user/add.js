
ClientEvents.on("usr/add/add", () => {
    ClientEvents.emit("usr/add/close");
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
    div.setAttribute("class", "usr_add_div");
    div.setAttribute("id", "usr_add_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_usr_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'usr_add_div')>&#9776;</td><td class='usr_edt_label'><p class='add_usr_closeButton' onclick='ClientEvents.emit(\"usr/add/close\")'>X</p></td></tr>" +
        "<tr><td class='usr_edt_label'>Nome:</td><td><input id='usr_add_name' type='text' value='" + data.name + "'></td></tr>" +
        "<tr><td class='usr_edt_label'>Usuário:</td><td><input id='usr_add_username' type='text' value='" + data.username + "'></td></tr>" +
        "<tr><td class='usr_edt_label'>Senha:</td><td><input id='usr_add_pass' type='text' value='" + data.pass + "'></td></tr>" +
        "<tr><td class='usr_edt_label'>Ativo:</td><td><input id='usr_add_active' type='checkbox' " + ((data.active == 1) ? "Checked" : "") + "></td></tr>" +
        "</table>";

    document.body.appendChild(div);
});
ClientEvents.emit("usr/add/add")

ClientEvents.on("usr/add/close", () => {
    console.log('Called')
    if (document.getElementById("usr_add_div")) {
        document.body.removeChild(document.getElementById("usr_add_div"));
    }
});

ClientEvents.on("usr/add/save", () => {
    ClientEvents.emit("SendSocket", "adm/ust/lst/ctx", {
        id: document.getElementById("usraddid").value,
        name: document.getElementById("usraddname").value,
    });
    /**
     * save data and closes the page if success
     * closing part from server command
     */
})
