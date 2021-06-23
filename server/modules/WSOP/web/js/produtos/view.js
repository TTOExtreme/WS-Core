
ClientEvents.on("wsop/produtos/view", (data) => {
    ClientEvents.emit("WSOP/produtos/view/close");
    ClientEvents.emit("close_menu", 'wsop_view_div')
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsop_add_div");
    div.setAttribute("id", "wsop_view_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wsop_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsop_view_div')>&#9776;</td><td class='wsop_edt_label'><p class='wsop_add_closeButton' onclick=ClientEvents.emit(\"close_menu\",'wsop_view_div')>X</p></td></tr>" +
        "<tr><td class='wsop_edt_label'>ID:</td><td><input id='wsop_add_id' type='text' disabled value='" + data.id + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Nome:</td><td><input id='wsop_add_name' type='text' disabled value='" + data.name + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Descrição:</td><td><input id='wsop_add_description disabled' type='text' value='" + data.description + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Código:</td><td><input id='wsop_add_barcode' type='text' disabled value='" + data.barcode + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Preço:</td><td><input id='wsop_add_price' type='text' disabled value='" + data.price + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Custo:</td><td><input id='wsop_add_cost' type='text' disabled value='" + data.cost + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Inventario:</td><td><input id='wsop_add_inventory' type='text' disabled value='" + data.inventory + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Imagem:</td><td><img id='wsop_add_img_thumb' class='wsop_add_img_thumb' alt='' src='./module/WSOP/img/" + data.img.replace(".", "_thumb.") + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Ativo:</td><td><input id='wsop_add_active' disabled type='checkbox' " + ((data.active == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td colspan=2 class='wsop_edt_label_info' id='wsop_add_info'></td></tr>" +
        "</table>";

    document.body.appendChild(div);
});

ClientEvents.on("WSOP/produtos/view/close", () => {
    if (document.getElementById("wsop_view_div")) {
        document.body.removeChild(document.getElementById("wsop_view_div"));
    }
});
