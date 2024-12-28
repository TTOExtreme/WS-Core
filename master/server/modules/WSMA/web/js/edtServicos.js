ClientEvents.on("WSMA/servicos/edt", (data) => {
    ClientEvents.emit("close_menu", 'wsma_servico_div')


    try {
        data.description = JSON.parse(data.description);
    } catch (err) { }

    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsma_edt_div menu_dragger");
    div.setAttribute("id", "wsma_servico_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wsma_ficha' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsma_servico_div')>&#9776;</td><td class='wsma_edt_label'><p class='wsma_ficha_closeButton' onclick=ClientEvents.emit(\"close_menu\",'wsma_servico_div')>X</p></td></tr>" +
        "<tr><td class='wsma_edt_label'>ID:</td><td><input id='wsma_servico_id' type='text' disabled value='" + data.id + "'></td></tr>" +
        "<tr><td class='wsma_edt_label'>Nome:</td><td><input id='wsma_servico_name' type='text' value='" + data.name + "'></td></tr>" +
        "<tr><td class='wsma_edt_label'>Descrição:</td><td><input id='wsma_servico_description' type='text' value='" + unclearDesc(data.description.description) + "'></td></tr>" +
        "<tr><td class='wsma_edt_label'>Tipo:</td><td><select id='wsma_servico_type' type='text'>" + new window.Modules.WSMA.Typo().SVToOptList(data.description.type) + "</td></tr>" +

        "<tr><td class='wsma_edt_label'>Ativo:</td><td><input id='wsma_servico_active' type='checkbox' " + ((data.active == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td colspan=2 class='wsma_edt_label_info' id='wsma_servico_info'></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Editar' type='button' onclick='ClientEvents.emit(\"WSMA/servicos/saveedt\")' ></td></tr>" +
        "</table>";

    document.body.appendChild(div);
});


ClientEvents.on("WSMA/servicos/saveedt", () => {
    ClientEvents.emit("SendSocket", "WSMA/servicos/edt", {
        id: document.getElementById("wsma_servico_id").value,
        name: document.getElementById("wsma_servico_name").value,
        description: JSON.stringify({
            description: clearDesc(document.getElementById("wsma_servico_description").value),
            type: document.getElementById("wsma_servico_type").value,
        }),
        active: document.getElementById("wsma_servico_active").checked,
    });
    /**
     * save data and closes the page if success
     * closing part from server command
     */
})
