
ClientEvents.on("usr/perm", (data) => {
    ClientEvents.emit("usr/perm/close");
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
    div.setAttribute("class", "usr_edt_div");
    div.setAttribute("id", "usr_edt_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_usr_edt' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'usr_edt_div')>&#9776;</td><td class='usr_edt_label'><p class='edt_usr_closeButton' onclick='ClientEvents.emit(\"usr/lst/perm/close\")'>X</p></td></tr>" +
        "<tr><td class='usr_edt_label'>Usuário:</td><td><p>" + data.username + "</p></td></tr>" +
        "<tr><td colspan=2></td></tr>" +
        "</table>";

    document.body.appendChild(div);
});

ClientEvents.on("usr/lst/perm/close", () => {
    if (document.getElementById("usr_edt_div")) {
        document.body.removeChild(document.getElementById("usr_edt_div"));
    }
});

ClientEvents.on("usr/edt/save", () => {
    ClientEvents.emit("SendSocket", "adm/ust/lst/ctx", {
        id: document.getElementById("usredtid").value,
        name: document.getElementById("usredtname").value,
    });
    /**
     * save data and closes the page if success
     * closing part from server command
     */
})