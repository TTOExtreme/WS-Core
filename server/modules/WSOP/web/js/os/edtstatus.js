
ClientEvents.on("wsop/os/edtstatus", (data) => {
    ClientEvents.emit("close_menu");
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsop_add_div menu_dragger");
    div.setAttribute("id", "wsop_edtstatus_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr class='menu_header'><td id='move_menu_wsop_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsop_edtstatus_div')>&#9776;</td><td class='wsop_edt_label'><p class='wsop_add_closeButton' onclick=ClientEvents.emit(\"close_menu\",'wsop_edtstatus_div')>X</p></td></tr>" +
        "<tr><td colspan=2><div class='div_wsop_add_table'><table><tr><td class='wsop_edt_label'>ID:</td><td><input id='wsop_edt_id' type='text' disabled value='" + data.id + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Cliente:</td><td><input id='wsop_edt_cliente' type='text'  value='" + data.cliente + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Observação:</td><td><textarea style='width:250px;height:150px;' id='wsop_edt_statusobs' type='text'></textarea></td></tr>" +
        "<tr style='display:none'><td>Anterior: </td><td id='wsop_edt_oldStatus'>" + data.status + "</td></tr>" +
        "<tr style='display:none'><td>Log: </td><td id='wsop_edt_statusChange'>" + (data.statusChange == undefined ? "[]" : JSON.stringify(data.statusChange)) + "</td></tr>" +
        "<tr><td class='wsop_edt_label'>Status:</td><td><Select id='wsop_edt_status'>" + new window.Modules.WSOP.StatusID().StatusIdToOptList(data.status) + "</select></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Salvar' type='button' onclick='ClientEvents.emit(\"WSOP/os/edtstatus\")'></td></tr>" +
        "</table></div></td></tr></table>";
    document.body.appendChild(div);
    ClientEvents.emit("SendSocket", "wsop/os/produtos/lst");

    ClientEvents.clear("WSOP/os/edtstatus");
    ClientEvents.on("WSOP/os/edtstatus", () => {
        let data = {
            id: document.getElementById("wsop_edt_id").value,
            status: document.getElementById("wsop_edt_status").value,
            oldStatus: document.getElementById("wsop_edt_oldStatus").innerText,
            statusChange: document.getElementById("wsop_edt_statusChange").innerText,
            statusobs: clearDesc(document.getElementById("wsop_edt_statusobs").value),
            cliente: document.getElementById("wsop_edt_cliente").value
        };
        ClientEvents.emit("SendSocket", "wsop/os/edtstatus", data);
    })
});

ClientEvents.on("system/edited/osstatus", (data) => {
    ClientEvents.emit("system_mess", { status: "OK", mess: "OS Status Editado com Exito", time: 1000 });
    ClientEvents.emit("SendSocket", "wsop/os/lst");
    ClientEvents.emit("wsop/os/edtstatus", data);
});

