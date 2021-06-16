//<input type="color" id="html5colorpicker" onchange="clickColor(0, -1, -1, 5)" value="#ff0000" style="width:85%;">

ClientEvents.on("WSOP/posvendas/edt", (data) => {
    ClientEvents.emit("close_menu", 'wsop_posvendas_edt_div')
    if (data == undefined) { return; }
    try {
        data[0].description = JSON.parse(JSON.parse(JSON.stringify(data[0].description)))
    } catch (err) {
        data[0].description = "";
    }
    data = data[0];
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "WSOP_posvendas_div menu_dragger");
    div.setAttribute("id", "wsop_posvendas_edt_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wsop_posvendas_edt' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsop_posvendas_edt_div')>&#9776;</td><td class='wsop_posvendas_edt_label'><p class='WSOP_posvendas_closeButton' onclick=ClientEvents.emit(\"close_menu\",'wsop_posvendas_edt_div')>X</p></td></tr>" +
        "<tr><td class='wsop_posvendas_edt_label'>ID:</td><td><input id='wsop_posvendas_edt_id' type='text' disabled value='" + data.id + "'></td></tr>" +
        "<tr><td class='wsop_posvendas_edt_label'>Cliente:</td><td><input id='wsop_posvendas_edt_name' type='text' value='" + data.title + "'></td></tr>" +
        "<tr><td class='wsop_posvendas_edt_label'>Descrição:</td><td><input id='wsop_posvendas_edt_description' type='text' value='" + data.description.description + "'></td></tr>" +
        "<tr><td class='wsop_posvendas_edt_label'>Data:</td><td><input id='wsop_posvendas_edt_start' type='date' value='" + formatTimeAMD(data.description.start) + "'></td></tr>" +
        "<tr><td class='wsop_posvendas_edt_label'>Vendedor:</td><td><input id='wsop_posvendas_edt_vendedor' type='text' value='" + data.description.vendedor + "'></td></tr>" +
        "<tr><td class='wsop_posvendas_edt_label'>Telefone:</td><td><input id='wsop_posvendas_edt_tel' type='text' value='" + data.description.tel + "'></td></tr>" +
        "<tr style='display:none'><td class='wsop_posvendas_edt_label'>Fim:</td><td><input id='wsop_posvendas_edt_end' type='date' value='" + formatTimeAMD(data.description.end) + "'></td></tr>" +
        "<tr style='display:none'><td class='wsop_posvendas_edt_label'>Cor Fundo:</td><td><input id='wsop_posvendas_edt_bgcolor' type='color' value='" + data.description.bgcolor + "'></td></tr>" +
        "<tr style='display:none'><td class='wsop_posvendas_edt_label'>Cor Contorno:</td><td><input id='wsop_posvendas_edt_color' type='color' value='" + data.description.color + "'></td></tr>" +
        "<tr><td class='wsop_posvendas_edt_label'>Pendente:</td><td><input id='wsop_posvendas_edt_pendente' type='checkbox' " + ((data.description.pendente == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td class='wsop_posvendas_edt_label'>Ativo:</td><td><input id='wsop_posvendas_edt_active' type='checkbox' " + ((data.active == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td colspan=2 class='wsop_posvendas_edt_label_info' id='wsop_posvendas_edt_info'></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Editar' type='button' onclick='ClientEvents.emit(\"WSOP/posvendas/edtsave\")'></td></tr>" +
        "</table>";
    document.body.appendChild(div);

    ClientEvents.clear('system/posvendas/edited');
    ClientEvents.on("system/posvendas/edited", () => {
        ClientEvents.emit("system_mess", { status: "OK", mess: "Evento salvo", time: 1000 });
        ClientEvents.emit("SendSocket", "WSOP/posvendas/lst")
        if (data.reloadMulti) {
            ClientEvents.emit("close_menu", 'wsop_posvendas_edt_div');
            ClientEvents.emit("SendSocket", "WSOP/posvendas/lstids", JSON.stringify({ start: data.description.start }));
        } else {
            ClientEvents.emit("SendSocket", "WSOP/posvendas/lstid", { id: data.id });
        }
        ClientEvents.emit("close_menu", 'wsop_posvendas_edt_div');
        ClientEvents.emit("SendSocket", "WSOP/posvendas/lst", { thisMonth: new Date(data.description.start).getMonth(), thisYear: new Date(data.description.start).getFullYear() })
    });

    ClientEvents.clear('system/posvendas/added');
    ClientEvents.on("system/posvendas/added", (newdata) => {
        ClientEvents.emit("system_mess", { status: "OK", mess: "Evento Criado", time: 1000 });
        ClientEvents.emit("SendSocket", "WSOP/posvendas/lstid")
        if (data.reloadMulti) {
            ClientEvents.emit("close_menu", 'wsop_posvendas_edt_div');
            ClientEvents.emit("SendSocket", "WSOP/posvendas/lstids", JSON.stringify({ start: data.description.start }));
        } else {
            ClientEvents.emit("SendSocket", "WSOP/posvendas/lstid", { id: newdata.id });
        }
        ClientEvents.emit("close_menu", 'wsop_posvendas_edt_div');
        ClientEvents.emit("SendSocket", "WSOP/posvendas/lst", { thisMonth: new Date(data.description.start).getMonth(), thisYear: new Date(data.description.start).getFullYear() })
    });
});

ClientEvents.on("WSOP/posvendas/edtsave", () => {
    if (document.getElementById("wsop_posvendas_edt_id").value != '0') {
        ClientEvents.emit("SendSocket", "WSOP/posvendas/edt", {
            id: document.getElementById("wsop_posvendas_edt_id").value,
            title: document.getElementById("wsop_posvendas_edt_name").value,
            description: JSON.stringify({
                description: document.getElementById("wsop_posvendas_edt_description").value,
                color: document.getElementById("wsop_posvendas_edt_color").value,
                bgcolor: document.getElementById("wsop_posvendas_edt_bgcolor").value,
                vendedor: document.getElementById("wsop_posvendas_edt_vendedor").value,
                tel: document.getElementById("wsop_posvendas_edt_tel").value,
                start: new Date(document.getElementById("wsop_posvendas_edt_start").value).getTime() + (12 * 3600 * 1000),
                end: new Date(document.getElementById("wsop_posvendas_edt_end").value).getTime() + (12 * 3600 * 1000),
                pendente: document.getElementById("wsop_posvendas_edt_pendente").checked,
            }),
            active: document.getElementById("wsop_posvendas_edt_active").checked,
        });
    } else {
        ClientEvents.emit("SendSocket", "WSOP/posvendas/add", {
            title: document.getElementById("wsop_posvendas_edt_name").value,
            description: JSON.stringify({
                description: document.getElementById("wsop_posvendas_edt_description").value,
                color: document.getElementById("wsop_posvendas_edt_color").value,
                bgcolor: document.getElementById("wsop_posvendas_edt_bgcolor").value,
                vendedor: document.getElementById("wsop_posvendas_edt_vendedor").value,
                tel: document.getElementById("wsop_posvendas_edt_tel").value,
                start: new Date(document.getElementById("wsop_posvendas_edt_start").value).getTime() + (12 * 3600 * 1000),
                end: new Date(document.getElementById("wsop_posvendas_edt_end").value).getTime() + (12 * 3600 * 1000),
                pendente: document.getElementById("wsop_posvendas_edt_pendente").checked,
            }),
            active: document.getElementById("wsop_posvendas_edt_active").checked,
        });
    }
})


ClientEvents.emit("SendSocket", "WSOP/posvendas/lst");