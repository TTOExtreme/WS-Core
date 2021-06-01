
ClientEvents.clear("wsop/os/produto/edt")
ClientEvents.on("wsop/os/produto/edt", (data) => {
    ClientEvents.emit("close_menu", 'wsop_edt_product_div')
    try {
        data.description = JSON.parse(JSON.parse(JSON.stringify(data.description)))
    } catch (err) {
        try {
            data.description = data.description
        } catch (err) {
            console.log(err);
            ClientEvents.emit("SendSocket", "wsop/os/lst/edt", { id: data.id_os });
        }
    }
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsop_add_div menu_dragger");
    div.setAttribute("id", "wsop_edt_product_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wsop_edt' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsop_edt_product_div')>&#9776;</td><td class='wsop_edt_label'><p class='wsop_add_closeButton' onclick=ClientEvents.emit(\"close_menu\",'wsop_edt_product_div')>X</p></td></tr>" +
        "<tr><td class='wsop_edt_label'>ID RLT:</td><td><input id='wsop_edt_products_id' type='text' disabled value='" + data.id + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>ID:</td><td><input id='wsop_edt_products_id_produtos' type='text' disabled value='" + data.id_produtos + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>OS:</td><td><input id='wsop_edt_products_id_os' type='text' disabled value='" + data.id_os + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Nome:</td><td><input id='wsop_edt_products_name' type='text' disabled value='" + data.name + "'></td></tr>" +

        "<tr><td class='wsop_edt_label'>Modelo:</td><td><input id='wsop_edt_products_produto_modelo' disabled value='" + data.description.modelo + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Vies:</td><td><input id='wsop_edt_products_produto_vies' disabled value='" + data.description.vies + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Gola:</td><td><input id='wsop_edt_products_produto_gola' disabled value='" + data.description.gola + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Genero:</td><td><input id='wsop_edt_products_produto_genero' disabled value='" + data.description.genero + "'></td></tr>" +

        "<tr><td class='wsop_edt_label'>Código:</td><td><input id='wsop_edt_products_barcode' type='text' disabled value='" + data.barcode + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Qnt:</td><td><input id='wsop_edt_products_qnt' type='text' value='" + data.qnt + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Preço:</td><td><input id='wsop_edt_products_price' type='text' value='" + data.price + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Custo:</td><td><input id='wsop_edt_products_cost' type='text' value='" + data.cost + "'></td></tr>" +
        "<tr style='display:none'><td class='wsop_edt_label'>Custo:</td><td><input id='wsop_edt_products_desc' type='text' value='" + data.description + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Descrição:</td><td><textarea id='wsop_edt_product_description'class='sun-editor-editable'>" + data.obs + "</textarea></td></tr>" +
        "<tr><td class='wsop_edt_label'>Imagem:</td><td><img id='wsop_add_produto_img_thumb' class='wsop_add_produto_img_thumb' alt='' src='./module/WSOP/img/" + data.img.replace(".", "_thumb.") + "' loc='" + data.img + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'></td><td><input id='wsop_add_produto_img' type='file' onchange='ClientEvents.emit(\"uploadIMG\")'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Ativo:</td><td><input id='wsop_edt_products_active' type='checkbox' " + ((data.active == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td colspan=2 class='wsop_edt_label_info' id='wsop_edt_products_info'></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Salvar' type='button' onclick='ClientEvents.emit(\"WSOP/os/produtos/edt\")'></td></tr>" +
        "</table>";

    document.body.appendChild(div);

    let editor = SUNEDITOR.create((document.getElementById('wsop_edt_product_description') || 'wsop_edt_product_description'), {
        width: "calc(100vw - 350px)",
        buttonList: [
            ['font', 'fontSize'],
            ['bold', 'underline', 'italic'],
            ['fontColor', 'hiliteColor'],
            ['outdent', 'indent'],
            ['align', 'horizontalRule', 'list', 'lineHeight'],
            ['table', 'link'],
            ['fullScreen', 'showBlocks', 'codeView']
        ],
        colorList: [
            '#ff0000', '#ff5e00', '#ffe400', '#abf200', '#00d8ff', '#0055ff', '#6600ff', '#ff00dd', '#000000',
            '#ffd8d8', '#fae0d4', '#faf4c0', '#e4f7ba', '#d4f4fa', '#d9e5ff', '#e8d9ff', '#ffd9fa', '#f1f1f1',
            '#ffa7a7', '#ffc19e', '#faed7d', '#cef279', '#b2ebf4', '#b2ccff', '#d1b2ff', '#ffb2f5', '#bdbdbd',
            '#f15f5f', '#f29661', '#e5d85c', '#bce55c', '#5cd1e5', '#6699ff', '#a366ff', '#f261df', '#8c8c8c',
            '#980000', '#993800', '#998a00', '#6b9900', '#008299', '#003399', '#3d0099', '#990085', '#353535',
            '#670000', '#662500', '#665c00', '#476600', '#005766', '#002266', '#290066', '#660058', '#222222'
        ],
        lineHeights: [
            { text: '1', value: 1 },
            { text: '1.15', value: 1.15 },
            { text: '1.5', value: 1.5 },
            { text: '2', value: 2 }
        ],
    });
    editor.onChange = function (contents, core) { document.getElementById("wsop_edt_product_description").innerHTML = contents; }

    ClientEvents.clear("WSOP/os/produto/edt/close")
    ClientEvents.on("WSOP/os/produto/edt/close", () => {
        if (document.getElementById("wsop_edt_product_div")) {
            document.body.removeChild(document.getElementById("wsop_edt_product_div"));
            editor.destroy();
            editor = null;
        }
    });
});
ClientEvents.clear("WSOP/os/produtos/edt")
ClientEvents.on("WSOP/os/produtos/edt", () => {
    ClientEvents.emit("SendSocket", "wsop/os/produto/edt", {
        id: document.getElementById("wsop_edt_products_id").value,
        id_os: document.getElementById("wsop_edt_products_id_os").value,
        obs: document.getElementById("wsop_edt_product_description").value,
        price: document.getElementById("wsop_edt_products_price").value,
        cost: document.getElementById("wsop_edt_products_cost").value,
        qnt: document.getElementById("wsop_edt_products_qnt").value,
        img: document.getElementById("wsop_add_produto_img_thumb").getAttribute("loc"),
    });
})

ClientEvents.clear("wsop/os/produto/edited")
ClientEvents.on("wsop/os/produto/edited", () => {
    ClientEvents.emit("SendSocket", "wsop/produtos/edt", {
        id: document.getElementById("wsop_edt_products_id_produtos").value,
        id_os: document.getElementById("wsop_edt_products_id_os").value,
        price: document.getElementById("wsop_edt_products_price").value,
        cost: document.getElementById("wsop_edt_products_cost").value,
        qnt: document.getElementById("wsop_edt_products_qnt").value,
        img: document.getElementById("wsop_add_produto_img_thumb").getAttribute("loc")
    });
})

ClientEvents.on("system/edited/produtos", (data) => { ClientEvents.emit("system_mess", { status: "OK", mess: "Produto Editado", time: 1000 }); ClientEvents.emit("WSOP/os/produto/edt/close"); ClientEvents.emit("SendSocket", "wsop/os/lst/edt", { id: data[0].id_os }) });


