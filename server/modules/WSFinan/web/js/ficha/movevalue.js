ClientEvents.on("wsfinan/fichas/move", (data1) => {
    ClientEvents.emit("close_menu", 'wsfinan_ficha_move_div')
    let data = {
        name: "",
        description: "",
        valueAttached: 0,
        valueReserved: 0,
        valuePending: 0,
        active: 1
    }

    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsfinan_add_div menu_dragger");
    div.setAttribute("id", "wsfinan_ficha_move_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wsfinan_ficha' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsfinan_ficha_move_div')>&#9776;</td><td class='wsfinan_edt_label'><p class='wsfinan_ficha_closeButton' onclick=ClientEvents.emit(\"close_menu\",'wsfinan_ficha_move_div')>X</p></td></tr>" +

        "<tr><td class='wsfinan_edt_label'>Valor:</td><td><input id='wsfinan_ficha_produto_value' type='number'></td></tr>" +
        "<tr><td class='wsfinan_edt_label'>Ficha Origem:</td><td><select id='wsfinan_ficha_produto_out'></td></tr>" +
        "<tr><td class='wsfinan_edt_label'>Ficha Destino (ID):</td><td><input id='wsfinan_ficha_produto_in' type='text' value='" + data1.id + "' disabled></td></tr>" +
        "<tr><td class='wsfinan_edt_label'>Ficha Destino:</td><td><input type='text' value='" + data1.name + "' disabled></td></tr>" +
        "<tr><td class='wsfinan_edt_label'>Motivo:</td><td><input id='wsfinan_ficha_produto_motivo' type='text'></td></tr>" +
        "<tr><td colspan=2 class='wsfinan_edt_label_info' id='wsfinan_ficha_produto_info'></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Mover' type='button' onclick='ClientEvents.emit(\"WSFinan/ficha/movevalue\")' ></td></tr>" +
        "</table>";

    document.body.appendChild(div);


    ClientEvents.emit("SendSocket", "WSFinan/fichas/lstauto");
});


ClientEvents.on("WSFinan/ficha/movevalue", () => {
    ClientEvents.emit("SendSocket", "WSFinan/ficha/move", {
        value: document.getElementById("wsfinan_ficha_produto_value").value,
        id_in: document.getElementById("wsfinan_ficha_produto_in").value,
        id_out: document.getElementById("wsfinan_ficha_produto_out").value,
        motivo: document.getElementById("wsfinan_ficha_produto_motivo").value
    });
    /**
     * save data and closes the page if success
     * closing part from server command
     */
})



ClientEvents.on("wsfinan/fichas/lstauto", (arr) => {
    let list = document.getElementById("wsfinan_ficha_produto_out");

    let htm = ""
    window.Modules.WSFinan.listFichas.forEach(ficha => {
        htm += "<option value='" + ficha.id + "'>" + ficha.name + " | " + JSON.parse(ficha.description).description + "</option>"
    });

    list.innerHTML = htm;
});
