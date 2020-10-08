
ClientEvents.on("usr/edt", (data) => {
    ClientEvents.emit("usr/edt/close");
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
        "<tr><td id='move_menu_usr_edt' style='width:120px' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'usr_edt_div')>&#9776;</td><td class='usr_edt_label'><p class='edt_usr_closeButton' onclick='ClientEvents.emit(\"usr/edt/close\")'>X</p></td></tr>" +
        "<tr><td class='usr_edt_label'>ID:</td><td><input id='usredtid' type='text' disabled value='" + data.id + "'></td></tr>" +
        "<tr><td class='usr_edt_label'>Nome:</td><td><input id='usredtname' type='text' value='" + data.name + "'></td></tr>" +
        "<tr><td class='usr_edt_label'>Usuário:</td><td><input type='text' disabled value='" + data.username + "'></td></tr>" +
        "<tr><td class='usr_edt_label'>Criado Em:</td><td><input type='text' disabled value='" + formatTime(data.createdIn) + "'></td></tr>" +
        "<tr><td class='usr_edt_label'>Criado Por:</td><td><input type='text' disabled value='" + data.createdBy + "'></td></tr>" +
        "<tr><td class='usr_edt_label'>Desativado Em:</td><td><input type='text' disabled value='" + formatTime(data.deactivatedIn) + "'></td></tr>" +
        "<tr><td class='usr_edt_label'>Desativado Por:</td><td><input type='text' disabled value='" + ((data.deactivatedBy == "null") ? data.deactivatedBy : "-") + "'></td></tr>" +
        "<tr><td class='usr_edt_label'>Ativo:</td><td><input type='text' disabled value='" + ((data.active == 1) ? "Sim" : "Não") + "'></td></tr>" +
        "<tr><td class='usr_edt_label'>Conectado:</td><td><input type='text' disabled value='" + ((data.connected == 1) ? "Sim" : "Não") + "'></td></tr>" +
        "<tr><td class='usr_edt_label'>Ultimo Login:</td><td><input type='text' disabled value='" + formatTime(data.lastConnection) + "'></td></tr>" +
        "<tr><td class='usr_edt_label'>Ultima Tentativa:</td><td><input type='text' disabled value='" + formatTime(data.lastTry) + "'></td></tr>" +
        "<tr><td class='usr_edt_label'>Ultimo IP:</td><td><input type='text' disabled value='" + data.lastIp + "'></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Editar' type='button' onclick='ClientEvents.emit(\"usr/edt/save\")'></td></tr>" +
        "</table>";

    document.body.appendChild(div);
});

ClientEvents.on("usr/edt/close", () => {
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