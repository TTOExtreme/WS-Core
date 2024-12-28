
ClientEvents.on("WSFinan/requisicao/edtstatus", (data) => {
    ClientEvents.emit("close_menu", 'wsfinan_edtstatus_div')
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsfinan_add_div menu_dragger");
    div.setAttribute("id", "wsfinan_edtstatus_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr class='menu_header'><td id='move_menu_wsfinan_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsfinan_edtstatus_div')>&#9776;</td><td class='wsfinan_edt_label'><p class='wsfinan_add_closeButton' onclick=ClientEvents.emit(\"close_menu\",'wsfinan_edtstatus_div')>X</p></td></tr>" +
        "<tr><td colspan=2><div class='div_wsfinan_add_table'><table><tr><td class='wsfinan_edt_label'>ID:</td><td><input id='wsfinan_edt_id' type='text' disabled value='" + data.id + "'></td></tr>" +
        "<tr><td class='wsfinan_edt_label'>Cliente:</td><td><input id='wsfinan_edt_cliente' type='text'  value='" + data.cliente + "'></td></tr>" +
        "<tr><td class='wsfinan_edt_label'>Observação:</td><td><textarea style='width:250px;height:150px;' id='wsfinan_edt_statusobs' type='text'></textarea></td></tr>" +
        "<tr style='display:none'><td>Anterior: </td><td id='wsfinan_edt_oldStatus'>" + data.status + "</td></tr>" +
        "<tr style='display:none'><td>Log: </td><td id='wsfinan_edt_statusChange'>" + (data.statusChange == undefined ? "[]" : JSON.stringify(data.statusChange)) + "</td></tr>" +
        "<tr><td class='wsfinan_edt_label'>Status:</td><td><Select id='wsfinan_edt_status'>" + new window.Modules.WSFinan.StatusID().StatusIdToOptList(data.status) + "</select></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Salvar' type='button' onclick='ClientEvents.emit(\"wsfinan/requisicao/edtstatus\")'></td></tr>" +
        "</table></div></td></tr></table>";
    document.body.appendChild(div);

    ClientEvents.clear("wsfinan/requisicao/edtstatus");
    ClientEvents.on("wsfinan/requisicao/edtstatus", () => {
        let data = {
            id: document.getElementById("wsfinan_edt_id").value,
            status: document.getElementById("wsfinan_edt_status").value,
            oldStatus: document.getElementById("wsfinan_edt_oldStatus").innerText,
            statusChange: document.getElementById("wsfinan_edt_statusChange").innerText,
            statusobs: clearDesc(document.getElementById("wsfinan_edt_statusobs").value),
            cliente: document.getElementById("wsfinan_edt_cliente").value
        };
        ClientEvents.emit("SendSocket", "WSFinan/requisicao/edtstatus", data);
    })
});

ClientEvents.on("system/edited/requisicaostatus", (data) => {
    ClientEvents.emit("system_mess", { status: "OK", mess: "Status da Requisicao Editado com Exito", time: 1000 });
    ClientEvents.emit("SendSocket", "wsfinan/requisicao/lst");
    ClientEvents.emit("WSFinan/requisicao/edtstatus", data);
});

