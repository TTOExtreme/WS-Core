
ClientEvents.on("WSOP/site/changestatus", (data) => {
    ClientEvents.emit("close_menu", 'wsop_edtstatus_site_div');
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "opli_edt_div menu_dragger");
    div.setAttribute("id", "wsop_edtstatus_site_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr class='menu_header'><td id='move_menu_wsop_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsop_edtstatus_site_div')>&#9776;</td><td class='wsop_edt_label'><p class='closeButton' onclick='ClientEvents.emit(\"close_menu\", \"wsop_edtstatus_site_div\");'>X</p></td></tr>" +
        "<tr><td class='wsop_edt_label'>ID:</td><td><input id='wsop_edt_id' type='text' disabled value='" + data.id + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Cliente:</td><td><input id='wsop_edt_cliente' type='text' disabled value='" + data.name + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Status:</td><td><Select id='wsop_edt_status'>" + window.utils.OPLIStatusIdToOptList(data.status) + "</select></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Editar' type='button' onclick='ClientEvents.emit(\"WSOP/site/changestatus/save\")'></td></tr>" +
        "</table>";
    document.body.appendChild(div);
    //ClientEvents.emit("SendSocket", "wsop/os/produtos/lst");
});


ClientEvents.on("WSOP/site/changestatus/save", () => {
    ClientEvents.emit("SendSocket", "WSOP/site/edtstatus", {
        id: document.getElementById("wsop_edt_id").value,
        status: document.getElementById("wsop_edt_status").value,
    });
})
ClientEvents.on("system/edited/site", () => {
    ClientEvents.emit("system_mess", { status: "OK", mess: "Status Editado com Exito", time: 1000 });
    ClientEvents.emit("SendSocket", "WSOP/site/lst");
    ClientEvents.emit("close_menu", 'wsop_edtstatus_site_div');
});
