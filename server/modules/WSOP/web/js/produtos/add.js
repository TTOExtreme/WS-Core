ClientEvents.on("WSOP/produtos/add", () => {
    ClientEvents.emit("close_menu", 'wsop_add_produtos_div')
    let data = {
        name: "",
        description: "",
        iscnpj: true,
        barcode: "",
        cost: "",
        price: "",
        priceRevenda: "",
        inventory: "",
        active: 1
    }

    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsop_add_div");
    div.setAttribute("id", "wsop_add_produtos_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wsop_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsop_add_produtos_div')>&#9776;</td><td class='wsop_edt_label'><p class='wsop_add_closeButton' onclick=ClientEvents.emit(\"close_menu\",'wsop_add_produtos_div')>X</p></td></tr>" +
        "<tr><td class='wsop_edt_label'>Nome:</td><td><input id='wsop_add_produto_name' type='text' value='" + data.name + "'></td></tr>" +

        "<tr><td class='wsop_edt_label'>Modelo:</td><td><select onchange='ClientEvents.emit(\"wsop/produtos/setVies\", \"\")' id='wsop_add_produto_modelo'>" + window.Modules.WSOP.Produtos.getModelos() + "</select></td></tr>" +
        "<tr><td class='wsop_edt_label'>Vies:</td><td><select id='wsop_add_produto_vies'><option disabled selected>Selecione:</option></select></td></tr>" +
        "<tr><td class='wsop_edt_label'>Gola:</td><td><select id='wsop_add_produto_gola'><option disabled selected>Selecione:</option></select></td></tr>" +
        "<tr><td class='wsop_edt_label'>Genero:</td><td><select id='wsop_add_produto_genero'><option disabled selected>Selecione:</option></select></td></tr>" +
        "<tr><td class='wsop_edt_label'>Tamanho:</td><td><select id='wsop_add_produto_tamanho'><option disabled selected>Selecione:</option></select></td></tr>" +

        "<tr><td class='wsop_edt_label'>Descrição:</td><td><input id='wsop_add_produto_description' type='text' value='" + unclearDesc(data.description) + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Código:</td><td><input id='wsop_add_produto_barcode' type='text'value='" + data.barcode + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Preço:</td><td><input id='wsop_add_produto_price' type='text' value='" + data.price + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Preço Revenda:</td><td><input id='wsop_add_produto_priceRevenda' type='text' value='" + data.priceRevenda + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Custo:</td><td><input id='wsop_add_produto_cost' type='text' value='" + data.cost + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Inventario:</td><td><input id='wsop_add_produto_inventory' type='number' value='" + data.inventory + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Imagem:</td><td><img id='wsop_add_produto_img_thumb' class='wsop_add_img_thumb' alt=''></td></tr>" +
        "<tr><td class='wsop_edt_label'></td><td><input id='wsop_add_produto_img' type='file' onchange='ClientEvents.emit(\"uploadIMG\")' value='" + data.img + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Ativo:</td><td><input id='wsop_add_produto_active' type='checkbox' " + ((data.active == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td colspan=2 class='wsop_edt_label_info' id='wsop_add_produto_info'></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Adicionar' type='button' onclick='ClientEvents.emit(\"WSOP/produtos/save\")' ></td></tr>" +
        "</table>";

    document.body.appendChild(div);
});
//ClientEvents.emit("WSOP/produtos/add")

ClientEvents.on("WSOP/produtos/add/close", () => {
    if (document.getElementById("wsop_add_produtos_div")) {
        document.body.removeChild(document.getElementById("wsop_add_produtos_div"));
    }
});

ClientEvents.on("wsop/produtos/setVies", () => {
    document.getElementById("wsop_add_produto_vies").innerHTML = window.Modules.WSOP.Produtos.getVies(document.getElementById("wsop_add_produto_modelo").selected);
    document.getElementById("wsop_add_produto_gola").innerHTML = window.Modules.WSOP.Produtos.getGola(document.getElementById("wsop_add_produto_modelo").value);
    document.getElementById("wsop_add_produto_genero").innerHTML = window.Modules.WSOP.Produtos.getGenero(document.getElementById("wsop_add_produto_modelo").value);
    document.getElementById("wsop_add_produto_tamanho").innerHTML = window.Modules.WSOP.Produtos.getTamanhos(document.getElementById("wsop_add_produto_modelo").value);
    document.getElementById("wsop_add_produto_price").value = window.Modules.WSOP.Produtos.getPreco(document.getElementById("wsop_add_produto_modelo").value).toFixed(2);
    document.getElementById("wsop_add_produto_priceRevenda").value = window.Modules.WSOP.Produtos.getPrecoRevenda(document.getElementById("wsop_add_produto_modelo").value).toFixed(2);
    document.getElementById("wsop_add_produto_cost").value = window.Modules.WSOP.Produtos.getCusto(document.getElementById("wsop_add_produto_modelo").value).toFixed(2);
})


ClientEvents.on("WSOP/produtos/save", () => {
    ClientEvents.emit("SendSocket", "wsop/produtos/add", {
        name: document.getElementById("wsop_add_produto_name").value,
        description: JSON.stringify({
            description: clearDesc(document.getElementById("wsop_add_produto_description").value),
            modelo: document.getElementById("wsop_add_produto_modelo").value,
            gola: document.getElementById("wsop_add_produto_gola").value,
            vies: document.getElementById("wsop_add_produto_vies").value,
            genero: document.getElementById("wsop_add_produto_genero").value,
            tamanho: document.getElementById("wsop_add_produto_tamanho").value
        }),
        barcode: document.getElementById("wsop_add_produto_barcode").value,
        price: document.getElementById("wsop_add_produto_price").value,
        priceRevenda: document.getElementById("wsop_add_produto_priceRevenda").value,
        cost: document.getElementById("wsop_add_produto_cost").value,
        inventory: document.getElementById("wsop_add_produto_inventory").value,
        img: document.getElementById("wsop_add_produto_img_thumb").getAttribute("loc"),
        active: document.getElementById("wsop_add_produto_active").checked,
        revenda: true,
        privatelabel: false
    });
    /**
     * save data and closes the page if success
     * closing part from server command
     */
})

ClientEvents.on("uploadIMG", () => {
    if (document.getElementById("wsop_add_produto_img")) {
        let input = document.getElementById("wsop_add_produto_img");
        if (input.files && input.files[0]) {
            var sender = new FileReader();
            let ext = input.files[0].name.substring(input.files[0].name.lastIndexOf("."));
            let name = input.files[0].name.substring(0, input.files[0].name.lastIndexOf("."));

            let img = document.getElementById("wsop_add_produto_img_thumb")
            img.setAttribute('src', "./module/WSOP/img/loading.gif")
            sender.onload = function (e) {
                ClientEvents.emit("SendSocket", "wsop/produtos/file", { name: name, ext: ext, stream: e.target.result })
            };

            sender.readAsArrayBuffer(input.files[0]);
        }
    }
})
ClientEvents.on("wsop/produtos/fileuploaded", (data) => {
    let img = document.getElementById("wsop_add_produto_img_thumb")
    img.setAttribute('src', "./module/WSOP/img/" + data.file)
    img.setAttribute('loc', data.file)
    img.setAttribute('onclick', "ClientEvents.emit(\"WSOP/os/anexo/view\"," + JSON.stringify({ name: "", thumb: data.file }) + ")")
})