
ClientEvents.on("wsop/os/edtstatus", (data) => {
    ClientEvents.emit("close_menu", 'wsop_edtstatus_div')
    console.log(data);
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsop_add_div menu_dragger");
    div.setAttribute("id", "wsop_edtstatus_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr class='menu_header'><td id='move_menu_wsop_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsop_edtstatus_div')>&#9776;</td><td class='wsop_edt_label'><p class='wsop_add_closeButton' onclick=ClientEvents.emit(\"close_menu\",'wsop_edtstatus_div')>X</p></td></tr>" +
        "<tr><td class='wsop_edt_label'>ID:</td><td><input id='wsop_edt_id' type='text' disabled value='" + data.id + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Cliente:</td><td><input id='wsop_edt_cliente' type='text' disabled value='" + data.cliente + "'></td></tr>" +
        "<tr><td>Anterior: </td><td id='wsop_edt_oldStatus'>" + data.status + "</td></tr>" +
        "<tr style='display:none'><td>Log: </td><td id='wsop_edt_statusChange'>" + (data.statusChange == undefined ? "[]" : JSON.stringify(data.statusChange)) + "</td></tr>" +
        "<tr><td class='wsop_edt_label'>Status:</td><td><Select id='wsop_edt_status'>" + new window.Modules.WSOP.StatusID().StatusIdToOptList(data.status) + "</select></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Salvar' type='button' onclick='ClientEvents.emit(\"WSOP/os/edtstatus\")'></td></tr>" +
        "</table>";
    document.body.appendChild(div);
    ClientEvents.emit("SendSocket", "wsop/os/produtos/lst");
});

ClientEvents.on("WSOP/os/edtstatus", () => {
    let data = {
        id: document.getElementById("wsop_edt_id").value,
        status: document.getElementById("wsop_edt_status").value,
        oldStatus: document.getElementById("wsop_edt_oldStatus").value,
        statusChange: document.getElementById("wsop_edt_statusChange").value,
        cliente: document.getElementById("wsop_edt_cliente").value
    }
    console.log(data);
    ClientEvents.emit("SendSocket", "wsop/os/edtstatus", {
        id: document.getElementById("wsop_edt_id").value,
        status: document.getElementById("wsop_edt_status").value,
        oldStatus: document.getElementById("wsop_edt_oldStatus").innerText,
        statusChange: document.getElementById("wsop_edt_statusChange").innerText,
        cliente: document.getElementById("wsop_edt_cliente").value
    });
    //ClientEvents.emit("wsop/os/edtstatus", data);
})
