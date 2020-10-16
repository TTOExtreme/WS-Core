
ClientEvents.on("grp/edt", (data) => {
    console.log(data);
    ClientEvents.emit("grp/edt/close");
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
    div.setAttribute("class", "grp_edt_div");
    div.setAttribute("id", "grp_edt_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_grp_edt' style='width:120px' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'grp_edt_div')>&#9776;</td><td class='grp_edt_label'><p class='edt_grp_closeButton' onclick='ClientEvents.emit(\"grp/edt/close\")'>X</p></td></tr>" +
        "<tr><td class='grp_edt_label'>ID:</td><td><input id='grpedtid' type='text' disabled value='" + data.id + "'></td></tr>" +
        "<tr><td class='grp_edt_label'>Nome:</td><td><input id='grpedtname' type='text' value='" + data.name + "'></td></tr>" +
        "<tr><td class='grp_edt_label'>Criado Em:</td><td><input type='text' disabled value='" + formatTime(data.createdIn) + "'></td></tr>" +
        "<tr><td class='grp_edt_label'>Criado Por:</td><td><input type='text' disabled value='" + data.createdBy + "'></td></tr>" +
        "<tr><td class='grp_edt_label'>Desativado Em:</td><td><input type='text' disabled value='" + formatTime(data.deactivatedIn) + "'></td></tr>" +
        "<tr><td class='grp_edt_label'>Desativado Por:</td><td><input type='text' disabled value='" + ((data.deactivatedBy != null) ? data.deactivatedBy : "-") + "'></td></tr>" +
        "<tr><td class='grp_edt_label'>Modificado Em:</td><td><input type='text' disabled value='" + formatTime(data.modifiedIn) + "'></td></tr>" +
        "<tr><td class='grp_edt_label'>Modificado Por:</td><td><input type='text' disabled value='" + ((data.modifiedBy != null) ? data.modifiedBy : "-") + "'></td></tr>" +
        "<tr><td class='grp_edt_label'>Ativo:</td><td><input type='text' disabled value='" + ((data.active == 1) ? "Sim" : "Não") + "'></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Editar' type='button' onclick='ClientEvents.emit(\"grp/edt/save\")'></td></tr>" +
        "</table>";

    document.body.appendChild(div);
});

ClientEvents.on("grp/edt/close", () => {
    if (document.getElementById("grp_edt_div")) {
        document.body.removeChild(document.getElementById("grp_edt_div"));
    }
});

ClientEvents.on("grp/edt/save", () => {
    ClientEvents.emit("SendSocket", "adm/grp/edt/save", {
        id_group: document.getElementById("grpedtid").value,
        name: document.getElementById("grpedtname").value
    });
    /**
     * save data and closes the page if success
     * closing part from server command
     */
})