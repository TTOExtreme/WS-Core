ClientEvents.on("wsfinan/fichas/edt", (data) => {
    ClientEvents.emit("close_menu", 'wsfinan_ficha_edt_div')

    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsfinan_add_div menu_dragger");
    div.setAttribute("id", "wsfinan_ficha_edt_div");
    try {
        data.description = JSON.parse(data.description);
    } catch (err) {
        data.description = { description: "" }
    }

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wsfinan_ficha' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsfinan_ficha_edt_div')>&#9776;</td><td class='wsfinan_edt_label'><p class='wsfinan_ficha_closeButton' onclick=ClientEvents.emit(\"close_menu\",'wsfinan_ficha_edt_div')>X</p></td></tr>" +
        "<tr><td class='wsfinan_edt_label'>ID:</td><td><input id='wsfinan_ficha_produto_id' type='text' value='" + data.id + "' disabled></td></tr>" +
        "<tr><td class='wsfinan_edt_label'>Nome:</td><td><input id='wsfinan_ficha_produto_name' type='text' value='" + data.name + "'></td></tr>" +
        "<tr><td class='wsfinan_edt_label'>Descrição:</td><td><input id='wsfinan_ficha_produto_description' type='text' value='" + unclearDesc(data.description.description) + "'></td></tr>" +
        "<tr title='Valor em Ficha: refere-se ao valor que está agregado a ficha não adicionando as pendencias e não retirando as reservas.'>" +
        "<td class='wsfinan_edt_label'>Valor em Ficha:</td><td><input id='wsfinan_ficha_produto_valueAttached' type='number'value='" + data.valueAttached + "'></td></tr>" +
        "<tr title='Valor Reservado: refere-se ao valor que está em reserva para sair da ficha.'>" +
        "<td class='wsfinan_edt_label'>Valor Reservado:</td><td><input id='wsfinan_ficha_produto_valueReserved' type='number' value='" + data.valueReserved + "'></td></tr>" +
        "<tr title='Valor Pendente: refere-se ao valor que está em pendencia para entrar na ficha.'>" +
        "<td class='wsfinan_edt_label'>Valor Pendente:</td><td><input id='wsfinan_ficha_produto_valuePending' type='number' value='" + data.valuePending + "'></td></tr>" +
        "<tr><td class='wsfinan_edt_label'>Ativo:</td><td><input id='wsfinan_ficha_produto_active' type='checkbox' " + ((data.active == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td colspan=2 class='wsfinan_edt_label_info' id='wsfinan_ficha_produto_info'></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Editar' type='button' onclick='ClientEvents.emit(\"WSFinan/ficha/saveedt\")' ></td></tr>" +
        "</table>";

    document.body.appendChild(div);
});


ClientEvents.on("WSFinan/ficha/saveedt", () => {
    ClientEvents.emit("SendSocket", "WSFinan/ficha/edt", {
        id: document.getElementById("wsfinan_ficha_produto_id").value,
        name: document.getElementById("wsfinan_ficha_produto_name").value,
        description: JSON.stringify({
            description: clearDesc(document.getElementById("wsfinan_ficha_produto_description").value),
        }),
        valueAttached: document.getElementById("wsfinan_ficha_produto_valueAttached").value,
        valueReserved: document.getElementById("wsfinan_ficha_produto_valueReserved").value,
        valuePending: document.getElementById("wsfinan_ficha_produto_valuePending").value,
        active: document.getElementById("wsfinan_ficha_produto_active").checked,
    });
    /**
     * save data and closes the page if success
     * closing part from server command
     */
})
