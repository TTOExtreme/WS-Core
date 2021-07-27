
ClientEvents.on("WSFinan/produtos/add", () => {
    ClientEvents.emit("close_menu", "wsfinan_add_produtos_div");
    let data = {
        name: "",
        barcode: "",
        description: "",
        active: 1,
    }

    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsfinan_add_div menu_dragger");
    div.setAttribute("id", "wsfinan_add_produtos_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wsfinan_add' class='move_menu' onmousedown='ClientEvents.emit(\"move_menu_down\",\"wsfinan_add_produtos_div\")'>&#9776;</td><td class='wsfinan_add_label'><p class='closeButton' onclick=ClientEvents.emit('close_menu','wsfinan_add_produtos_div')>X</p></td></tr>" +
        "<tr><td class='wsfinan_add_label'>Nome:</td><td><input id='wsfinan_add_name' type='text' value='" + data.name + "'></td></tr>" +
        "<tr><td class='wsfinan_add_label'>Código:</td><td><input id='wsfinan_add_barcode' type='text' value='" + data.barcode + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Descrição:</td><td><textarea style='width: 252px;height: 214px;' id='wsfinan_add_description' type='text'>" + unclearDesc(data.description) + "</textarea></td></tr>" +

        "<tr><td class='wsfinan_add_label'>Ativo:</td><td><input id='wsfinan_add_active' type='checkbox' " + ((data.active == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td colspan=2 class='wsfinan_add_label_info' id='wsfinan_add_info'></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Adicionar' type='button' onclick='ClientEvents.emit(\"WSFinan/produtos/save\")'></td></tr>" +
        "</table>";

    document.body.appendChild(div);
});


ClientEvents.on("WSFinan/produtos/save", () => {
    ClientEvents.emit("SendSocket", "WSFinan/produtos/add", {
        name: document.getElementById("wsfinan_add_name").value,
        barcode: document.getElementById("wsfinan_add_barcode").value,
        description: document.getElementById("wsfinan_add_description").value,
        active: document.getElementById("wsfinan_add_active").checked
    });
    /**
     * save data and closes the page if success
     * closing part from server command
     */
})