ClientEvents.on("WSOP/produtos/add", () => {
    ClientEvents.emit("WSOP/produtos/close");
    let data = {
        name: "",
        description: "",
        iscnpj: true,
        barcode: "",
        cost: "",
        price: "",
        inventory: "",
        active: 1
    }

    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsop_add_div");
    div.setAttribute("id", "wsop_add_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wsop_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsop_add_div')>&#9776;</td><td class='wsop_edt_label'><p class='wsop_add_closeButton' onclick='ClientEvents.emit(\"WSOP/produtos/close\")'>X</p></td></tr>" +
        "<tr><td class='wsop_edt_label'>Nome:</td><td><input id='wsop_add_name' type='text' value='" + data.name + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Descrição:</td><td><input id='wsop_add_description' type='text' value='" + data.description + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Código:</td><td><input id='wsop_add_barcode' type='text'value='" + data.barcode + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Preço:</td><td><input id='wsop_add_price' type='text' value='" + data.price + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Custo:</td><td><input id='wsop_add_cost' type='text' value='" + data.cost + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Inventario:</td><td><input id='wsop_add_inventory' type='text' value='" + data.inventory + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Imagem:</td><td><img id='wsop_add_img_thumb' class='wsop_add_img_thumb' alt=''></td></tr>" +
        "<tr><td class='wsop_edt_label'></td><td><input id='wsop_add_img' type='file' onchange='ClientEvents.emit(\"uploadIMG\")' value='" + data.img + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Ativo:</td><td><input id='wsop_add_active' type='checkbox' " + ((data.active == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td colspan=2 class='wsop_edt_label_info' id='wsop_add_info'></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Adicionar' type='button' onclick='ClientEvents.emit(\"WSOP/produtos/save\")' accept='image/gif, image/jpeg, image/png'></td></tr>" +
        "</table>";

    document.body.appendChild(div);
});
//ClientEvents.emit("WSOP/produtos/add")

ClientEvents.on("WSOP/produtos/close", () => {
    if (document.getElementById("wsop_add_div")) {
        document.body.removeChild(document.getElementById("wsop_add_div"));
    }
});


ClientEvents.on("WSOP/produtos/save", () => {
    ClientEvents.emit("SendSocket", "wsop/produtos/add", {
        name: document.getElementById("wsop_add_name").value,
        description: document.getElementById("wsop_add_description").value,
        barcode: document.getElementById("wsop_add_barcode").value,
        price: document.getElementById("wsop_add_price").value,
        cost: document.getElementById("wsop_add_cost").value,
        inventory: document.getElementById("wsop_add_inventory").value,
        img: document.getElementById("wsop_add_img_thumb").src,
        active: document.getElementById("wsop_add_active").checked,
    });
    /**
     * save data and closes the page if success
     * closing part from server command
     */
})

ClientEvents.on("uploadIMG", () => {
    if (document.getElementById("wsop_add_img")) {
        let input = document.getElementById("wsop_add_img");
        if (input.files && input.files[0]) {
            var sender = new FileReader();
            let ext = input.files[0].name.substring(input.files[0].name.lastIndexOf("."));

            let img = document.getElementById("wsop_add_img_thumb")
            img.setAttribute('src', "./module/WSOP/img/loading.gif")
            sender.onload = function (e) {
                ClientEvents.emit("SendSocket", "wsop/produtos/file", { ext: ext, stream: e.target.result })
            };

            sender.readAsArrayBuffer(input.files[0]);
        }
    }
})
ClientEvents.on("wsop/produtos/fileuploaded", (data) => {
    let img = document.getElementById("wsop_add_img_thumb")
    img.setAttribute('src', data.file)
})