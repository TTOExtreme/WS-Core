
ClientEvents.on("wsop/produtos/edt", (data) => {
    ClientEvents.emit("WSOP/produtos/edt/close");
    console.log(data)
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsop_add_div");
    div.setAttribute("id", "wsop_edt_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wsop_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsop_edt_div')>&#9776;</td><td class='wsop_edt_label'><p class='wsop_add_closeButton' onclick='ClientEvents.emit(\"WSOP/produtos/edt/close\")'>X</p></td></tr>" +
        "<tr><td class='wsop_edt_label'>ID:</td><td><input id='wsop_add_id' type='text' disabled value='" + data.id + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Nome:</td><td><input id='wsop_add_name' type='text' value='" + data.name + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Descrição:</td><td><input id='wsop_add_description' type='text' value='" + data.description + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Código:</td><td><input id='wsop_add_barcode' type='text'value='" + data.barcode + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Preço:</td><td><input id='wsop_add_price' type='text' value='" + data.price + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Custo:</td><td><input id='wsop_add_cost' type='text' value='" + data.cost + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Inventario:</td><td><input id='wsop_add_inventory' type='text' value='" + data.inventory + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Imagem:</td><td><img id='wsop_add_img_thumb' class='wsop_add_img_thumb' alt='' src='./module/WSOP/img/" + data.img.replace(".", "_thumb.") + "' loc='" + data.img + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'></td><td><input id='wsop_add_img' type='file' onchange='ClientEvents.emit(\"uploadIMG\")'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Ativo:</td><td><input id='wsop_add_active' type='checkbox' " + ((data.active == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td colspan=2 class='wsop_edt_label_info' id='wsop_add_info'></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Editar' type='button' onclick='ClientEvents.emit(\"WSOP/produtos/edt\")'></td></tr>" +
        "</table>";

    document.body.appendChild(div);
});

ClientEvents.on("WSOP/produtos/edt", () => {
    ClientEvents.emit("SendSocket", "wsop/produtos/edt", {
        id: document.getElementById("wsop_add_id").value,
        name: document.getElementById("wsop_add_name").value,
        description: document.getElementById("wsop_add_description").value,
        barcode: document.getElementById("wsop_add_barcode").value,
        price: document.getElementById("wsop_add_price").value,
        cost: document.getElementById("wsop_add_cost").value,
        inventory: document.getElementById("wsop_add_inventory").value,
        img: document.getElementById("wsop_add_img_thumb").getAttribute("loc"),
        active: document.getElementById("wsop_add_active").checked,
    });
})

ClientEvents.on("WSOP/produtos/edt/close", () => {
    if (document.getElementById("wsop_edt_div")) {
        document.body.removeChild(document.getElementById("wsop_edt_div"));
    }
});

