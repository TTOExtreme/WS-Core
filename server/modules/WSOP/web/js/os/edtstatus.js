
ClientEvents.on("wsop/os/edtstatus", (data) => {
    ClientEvents.emit("close_menu", 'wsop_edtstatus_div')

    function unclearDesc(desc) {
        return desc.replace(new RegExp("&qt;", "g"), "\"").replace(new RegExp("&quot;", "g"), "=")
            .replace(new RegExp("&eq;", "g"), "=").replace(new RegExp("&eql;", "g"), "=")
            .replace(new RegExp("&gt;", "g"), ">").replace(new RegExp("&get;", "g"), ">")
            .replace(new RegExp("&lt;", "g"), ">").replace(new RegExp("&let;", "g"), "<")
            .replace(new RegExp("&space;", "g"), " ");
    }

    function clearDesc(desc) {
        return desc.replace(new RegExp("\"", "g"), "&qt;").replace(new RegExp("&quot;", "g"), "&qt;")
            .replace(new RegExp("=", "g"), "&eql;").replace(new RegExp("&eq;", "g"), "&eql;")
            .replace(new RegExp(">", "g"), "&get;").replace(new RegExp("&gt;", "g"), "&get;")
            .replace(new RegExp("<", "g"), "&let;").replace(new RegExp("&lt;", "g"), "&let;")
            .replace(new RegExp(" ", "g"), "&space;")
    }
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
        "<tr><td class='wsop_edt_label'>Cliente:</td><td><input id='wsop_edt_cliente' type='text'  value='" + data.cliente + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Observação:</td><td><textarea id='wsop_edt_statusobs' type='text'></textarea></td></tr>" +
        "<tr style='display:none'><td>Anterior: </td><td id='wsop_edt_oldStatus'>" + data.status + "</td></tr>" +
        "<tr style='display:none'><td>Log: </td><td id='wsop_edt_statusChange'>" + (data.statusChange == undefined ? "[]" : JSON.stringify(data.statusChange)) + "</td></tr>" +
        "<tr><td class='wsop_edt_label'>Status:</td><td><Select id='wsop_edt_status'>" + new window.Modules.WSOP.StatusID().StatusIdToOptList(data.status) + "</select></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Salvar' type='button' onclick='ClientEvents.emit(\"WSOP/os/edtstatus\")'></td></tr>" +
        "</table>";
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

