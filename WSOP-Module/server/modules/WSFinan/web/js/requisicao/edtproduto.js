ClientEvents.clear("WSFinan/requisicao/produto/edt")
ClientEvents.on("WSFinan/requisicao/produto/edt", (data) => {
    ClientEvents.emit("close_menu", 'wsfinan_edt_product_div')
    try {
        data.description = JSON.parse(JSON.parse(JSON.stringify(data.description)))
    } catch (err) {
        try {
            data.description = data.description
        } catch (err) {
            console.log(err);
            ClientEvents.emit("SendSocket", "WSFinan/requisicao/lst/edt", { id: data.id_req });
        }
    }
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsfinan_add_div menu_dragger");
    div.setAttribute("id", "wsfinan_edt_product_div");
    if (data.img.split(",").length < 3) {
        data.img = data.img + ",,";
    }

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wsfinan_edt' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsfinan_edt_product_div')>&#9776;</td><td class='wsfinan_edt_label'><p class='closeButton' onclick=ClientEvents.emit(\"close_menu\",'wsfinan_edt_product_div')>X</p></td></tr>" +
        "<tr><td colspan=2><div class='div_wsop_add_table'><table><tr style='display:none'><td class='wsfinan_edt_label'>ID RLT:</td><td><input id='wsfinan_edt_products_id' type='text' disabled value='" + data.id + "'></td></tr>" +
        "<tr style='display:none'><td class='wsfinan_edt_label'>ID:</td><td><input id='wsfinan_edt_products_id_produtos' type='text' disabled value='" + data.id_produtos + "'></td></tr>" +
        "<tr><td class='wsfinan_edt_label'>OS:</td><td><input id='wsfinan_edt_products_id_os' type='text' disabled value='" + data.id_req + "'></td></tr>" +
        "<tr><td class='wsfinan_edt_label'>Nome:</td><td><input id='wsfinan_edt_products_name' type='text' disabled value='" + data.name + "'></td></tr>" +

        "<tr><td class='wsfinan_edt_label'>Código:</td><td><input id='wsfinan_edt_products_barcode' type='text' disabled value='" + data.barcode + "'></td></tr>" +
        "<tr><td class='wsfinan_edt_label'>Qnt:</td><td><input id='wsfinan_edt_products_qnt' type='number' value='" + data.qnt + "'></td></tr>" +
        "<tr><td class='wsfinan_edt_label'>Preço:</td><td><input id='wsfinan_edt_products_price' type='number' value='" + data.price + "'></td></tr>" +
        "<tr><td class='wsfinan_edt_label'>OBS:</td><td><textarea id='wsfinan_edt_product_description'class='sun-editor-editable'>" + unclearDesc(data.obs) + "</textarea></td></tr>" +

        "<tr><td class='wsfinan_edt_label'>Ativo:</td><td><input id='wsfinan_edt_products_active' type='checkbox' " + ((data.active == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td colspan=2 class='wsfinan_edt_label_info' id='wsfinan_edt_products_info'></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Salvar' type='button' onclick='ClientEvents.emit(\"WSFinan/requisicao/produtos/edt\")'></td></tr>" +
        "</table>";

    document.body.appendChild(div);

    let editor = SUNEDITOR.create((document.getElementById('wsfinan_edt_product_description') || 'wsfinan_edt_product_description'), {
        width: "100%",
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
    editor.onChange = function (contents, core) { document.getElementById("wsfinan_edt_product_description").innerHTML = clearDesc(contents); }


});


ClientEvents.clear("WSFinan/requisicao/produtos/edt")
ClientEvents.on("WSFinan/requisicao/produtos/edt", () => {
    ClientEvents.emit("SendSocket", "WSFinan/requisicao/produto/edt", {
        id: document.getElementById("wsfinan_edt_products_id").value,
        id_os: document.getElementById("wsfinan_edt_products_id_os").value,
        obs: clearDesc(document.getElementById("wsfinan_edt_product_description").value),
        price: parseFloat(document.getElementById("wsfinan_edt_products_price").value),
        qnt: parseFloat(document.getElementById("wsfinan_edt_products_qnt").value),
        active: document.getElementById("wsfinan_edt_products_active").checked,
    });
})

ClientEvents.on("system/edited/produtos", (data) => {
    ClientEvents.emit("system_mess", { status: "OK", mess: "Produto Editado", time: 1000 });
    ClientEvents.emit("wsop_OS_filtertableForce");
    ClientEvents.emit("SendSocket", "WSFinan/requisicao/lst/edt", { id: data[0].id_os })
});
