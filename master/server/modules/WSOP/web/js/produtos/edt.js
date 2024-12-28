
ClientEvents.on("wsop/produtos/edt", (data) => {
    ClientEvents.emit("close_menu", 'wsop_edt_div')
    data.description = JSON.parse(JSON.parse(JSON.stringify(data.description)))
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsop_add_div");
    div.setAttribute("id", "wsop_edt_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wsop_edt' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsop_edt_div')>&#9776;</td><td class='wsop_edt_label'><p class='wsop_add_closeButton' onclick=ClientEvents.emit(\"close_menu\",'wsop_edt_div')>X</p></td></tr>" +
        "<tr><td colspan=2><div class='div_wsop_add_table'><table><td class='wsop_edt_label'>ID:</td><td><input id='wsop_edt_id' type='text' disabled value='" + data.id + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Nome:</td><td><input id='wsop_edt_name' type='text' value='" + data.name + "'></td></tr>" +

        "<tr><td class='wsop_edt_label'>Modelo:</td><td><select onchange='ClientEvents.emit(\"wsop/produtos/setVies/edt\", \"\")' id='wsop_edt_produto_modelo'>" +
        window.Modules.WSOP.Produtos.getModelos(data.description.modelo) + "</select></td></tr>" +
        "<tr><td class='wsop_edt_label'>Vies:</td><td><select id='wsop_edt_produto_vies'>" +
        window.Modules.WSOP.Produtos.getVies(data.description.modelo, data.description.vies) + "</select></td></tr>" +
        "<tr><td class='wsop_edt_label'>Gola:</td><td><select id='wsop_edt_produto_gola'>" +
        window.Modules.WSOP.Produtos.getGola(data.description.modelo, data.description.gola) + "</select></td></tr>" +
        "<tr><td class='wsop_edt_label'>Genero:</td><td><select id='wsop_edt_produto_genero'>" +
        window.Modules.WSOP.Produtos.getGenero(data.description.modelo, data.description.genero) + "</select></td></tr>" +
        "<tr style='display:none'><td class='wsop_edt_label'>Tamanho:</td><td><select id='wsop_edt_produto_tamanho'>" +
        window.Modules.WSOP.Produtos.getTamanhos(data.description.modelo, data.description.tamanho) + "</select></td></tr>" +

        "<tr><td class='wsop_edt_label'>Descrição:</td><td><input id='wsop_edt_description' type='text' value='" + unclearDesc(data.description.description) + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Código:</td><td><input id='wsop_edt_barcode' type='text'value='" + data.barcode + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Preço:</td><td><input id='wsop_edt_price' type='text' value='" + data.price + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Preço Revenda:</td><td><input id='wsop_edt_priceRevenda' type='text' value='" + data.priceRevenda + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Custo:</td><td><input id='wsop_edt_cost' type='text' value='" + data.cost + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Inventario:</td><td><input id='wsop_edt_inventory' type='nuber' value='" + data.inventory + "'></td></tr>" +


        "<tr><td class='wsop_edt_label'>Imagem 1:</td><td><img id='wsop_add_produto_img_thumb_1' class='wsop_add_img_thumb' alt=''></td></tr>" +
        "<tr><td class='wsop_edt_label'></td><td><input id='wsop_add_produto_img_1' type='file' onchange='ClientEvents.emit(\"edtuploadIMG_1\")' value='" + data.img.split(",")[0] + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Imagem 2:</td><td><img id='wsop_add_produto_img_thumb_2' class='wsop_add_img_thumb' alt=''></td></tr>" +
        "<tr><td class='wsop_edt_label'></td><td><input id='wsop_add_produto_img_2' type='file' onchange='ClientEvents.emit(\"edtuploadIMG_2\")' value='" + data.img.split(",")[1] + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Imagem 3:</td><td><img id='wsop_add_produto_img_thumb_3' class='wsop_add_img_thumb' alt=''></td></tr>" +
        "<tr><td class='wsop_edt_label'></td><td><input id='wsop_add_produto_img_3' type='file' onchange='ClientEvents.emit(\"edtuploadIMG_3\")' value='" + data.img.split(",")[2] + "'></td></tr>" +

        "<tr><td class='wsop_edt_label'>Ativo:</td><td><input id='wsop_edt_active' type='checkbox' " + ((data.active == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td colspan=2 class='wsop_edt_label_info' id='wsop_edt_info'></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Editar' type='button' onclick='ClientEvents.emit(\"WSOP/produtos/edt\")'></td></tr>" +
        "</table>";

    document.body.appendChild(div);

    ClientEvents.on("wsop/produtos/setVies/edt", () => {
        document.getElementById("wsop_edt_produto_vies").innerHTML = window.Modules.WSOP.Produtos.getVies(document.getElementById("wsop_edt_produto_modelo").value);
        document.getElementById("wsop_edt_produto_gola").innerHTML = window.Modules.WSOP.Produtos.getGola(document.getElementById("wsop_edt_produto_modelo").value);
        document.getElementById("wsop_edt_produto_genero").innerHTML = window.Modules.WSOP.Produtos.getGenero(document.getElementById("wsop_edt_produto_modelo").value);
        //document.getElementById("wsop_add_produto_tamanho").innerHTML = window.Modules.WSOP.Produtos.getTamanhos(document.getElementById("wsop_add_produto_modelo").value);
        document.getElementById("wsop_add_produto_price").value = window.Modules.WSOP.Produtos.getPreco(document.getElementById("wsop_add_produto_modelo").value).toFixed(2);
        document.getElementById("wsop_add_produto_priceRevenda").value = window.Modules.WSOP.Produtos.getPrecoRevenda(document.getElementById("wsop_add_produto_modelo").value).toFixed(2);
        document.getElementById("wsop_add_produto_cost").value = window.Modules.WSOP.Produtos.getCusto(document.getElementById("wsop_add_produto_modelo").value).toFixed(2);
    })
});

ClientEvents.on("WSOP/produtos/edt", () => {
    let img = document.getElementById("wsop_add_produto_img_thumb_1").getAttribute("loc") + "," +
        document.getElementById("wsop_add_produto_img_thumb_2").getAttribute("loc") + "," +
        document.getElementById("wsop_add_produto_img_thumb_3").getAttribute("loc");
    ClientEvents.emit("SendSocket", "wsop/produtos/edt", {
        id: document.getElementById("wsop_edt_id").value,
        name: document.getElementById("wsop_edt_name").value,
        description: JSON.stringify({
            description: clearDesc(document.getElementById("wsop_edt_description").value),
            modelo: document.getElementById("wsop_edt_produto_modelo").value,
            gola: document.getElementById("wsop_edt_produto_gola").value,
            vies: document.getElementById("wsop_edt_produto_vies").value,
            genero: document.getElementById("wsop_edt_produto_genero").value,
            tecido: document.getElementById("wsop_edt_produto_tecido").value,
            //tamanho: document.getElementById("wsop_add_produto_tamanho").value
        }),
        barcode: document.getElementById("wsop_edt_barcode").value,
        price: document.getElementById("wsop_edt_price").value,
        priceRevenda: document.getElementById("wsop_edt_priceRevenda").value,
        cost: document.getElementById("wsop_edt_cost").value,
        inventory: document.getElementById("wsop_edt_inventory").value,
        img: img,
        active: document.getElementById("wsop_edt_active").checked,
    });
})


ClientEvents.on("edtuploadIMG_1", () => {
    edtlastfile = 1;
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

ClientEvents.on("edtuploadIMG_2", () => {
    edtlastfile = 2;
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

ClientEvents.on("edtuploadIMG_3", () => {
    edtlastfile = 3;
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
try {
    let edtlastfile = 1;
} catch (err) {

}
ClientEvents.on("wsop/produtos/fileuploaded", (data) => {
    if (document.getElementById("wsop_add_produto_img")) {
        let img = document.getElementById("wsop_add_produto_img_thumb_" + edtlastfile)
        img.setAttribute('src', "./module/WSOP/img/" + data.file)
        img.setAttribute('loc', data.file)
        img.setAttribute('onclick', "ClientEvents.emit(\"WSOP/os/anexo/view\"," + JSON.stringify({ name: "", thumb: data.file }) + ")")
    }
})