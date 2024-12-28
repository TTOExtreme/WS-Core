
ClientEvents.on("wsfinan/produtos/edt", (data) => {
    ClientEvents.emit("close_menu", 'wsfinan_edt_produtos_div');
    console.log(data)

    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsfinan_add_div menu_dragger");
    div.setAttribute("id", "wsfinan_edt_produtos_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wsfinan_add' class='move_menu' onmousedown='ClientEvents.emit(\"move_menu_down\",\"wsfinan_edt_produtos_div\")'>&#9776;</td><td class='wsfinan_add_label'><p class='closeButton' onclick=ClientEvents.emit('close_menu','wsfinan_edt_produtos_div')>X</p></td></tr>" +
        "<tr style='display:none'><td><input id='wsfinan_edt_id' type='text' value='" + data.id + "'></td></tr>" +
        "<tr><td class='wsfinan_add_label'>Nome:</td><td><input id='wsfinan_edt_name' type='text' value='" + data.name + "'></td></tr>" +
        "<tr><td class='wsfinan_add_label'>Código:</td><td><input id='wsfinan_edt_barcode' type='text' value='" + data.barcode + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Descrição:</td><td><textarea style='width: 252px;height: 214px;' id='wsfinan_edt_description' type='text'>" + unclearDesc(data.description) + "</textarea></td></tr>" +
        "<tr><td class='wsfinan_add_label'>Ativo:</td><td><input id='wsfinan_edt_active' type='checkbox' " + ((data.active == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Editar' type='button' onclick='ClientEvents.emit(\"WSFinan/produtos/edtsave\")'></td></tr>" +
        "</table>";

    document.body.appendChild(div);
});

ClientEvents.on("WSFinan/produtos/edtsave", () => {
    ClientEvents.emit("SendSocket", "WSFinan/produtos/edt", {
        id: document.getElementById("wsfinan_edt_id").value,
        name: document.getElementById("wsfinan_edt_name").value,
        description: document.getElementById("wsfinan_edt_description").value,
        barcode: document.getElementById("wsfinan_edt_barcode").value,
        active: document.getElementById("wsfinan_edt_active").checked
    });
    /**
     * save data and closes the page if success
     * closing part from server command
     */
})