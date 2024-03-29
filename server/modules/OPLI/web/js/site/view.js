ClientEvents.on("wsop/site/view", (data) => {
    ClientEvents.emit("close_menu", 'wsop_os_view_div');
    data = data[0];
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "opli_edt_div menu_dragger");
    div.setAttribute("id", "wsop_os_view_div");

    div.innerHTML = "" +
        "<table style='width:100%;'>" +
        "<tr class='menu_header'><td id='move_menu_wsop_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsop_os_view_div')>&#9776;</td><td class='opli_edt_label'><p class='closeButton' onclick='ClientEvents.emit(\"close_menu\", \"wsop_os_view_div\")'>X</p></td></tr></table>" +
        "<div id='wsop_edt' class='opli_edt'>" +
        "<table style='width:100%;'>" +
        //OS ID
        "<tr style='font-size:14pt'><td>" + ("00" + new Date().getDate()).slice(-2) + "/" + ("00" + (new Date().getMonth() + 1)).slice(-2) + "/" + new Date().getFullYear() + " " + ("00" + new Date().getHours()).slice(-2) + ":" + ("00" + new Date().getMinutes()).slice(-2) + ":" + ("00" + new Date().getSeconds()).slice(-2) + "</td><td style='float:right'><b>Status: " + window.utils.OPLIStatusIdToName(data.status) + " | OS: " + data.id_li + "</b></td></tr>" +
        "</table>" +
        "<hr>" +
        "<table style='width:100%;'>" +
        //os
        "<tr ><td><input disabled id='opli_edt_id' value='" + data.id + "'></input></td></tr>" +
        "<tr><td>OBS Cliente:</td></tr>" +
        "<tr><td class='opli_produto_item2' style=''>" + unclearDesc(data.description + "") + "</p></td></tr>" +
        "<tr><td>OBS Interna:</td></tr>" +
        "<tr><td class='opli_produto_item2' style=''><textarea style='width: calc(100% - 10px); height: 150px;' id='opli_edt_obs'>" + unclearDesc(data.obs + "") + "</textarea></td></tr>" +
        "<tr><td class='opli_produto_item2' style='border:none'>Peso: <input type='number' id='opli_edt_peso' value='" + parseFloat(data.peso) + "'></input></td></tr>" +
        "<tr><td class='opli_produto_item2' style='border:none'><input type='button' value='salvar' onclick='ClientEvents.emit(\"opli/save/site\")'></input></td></tr>" +
        "</table><hr>" +
        "<table style='width: 100%;; border-collapse:collapse'><tbody id='wsop_edt_produtos' class='opli_edt_produtos'>" +
        "<tr><td class='opli_edt_label' style='float:left'>Produtos:</td><td></td></tr>" +
        "<tr><td colspan=4 style='height:20px'></td></tr>" +
        "</table>" +
        "</div>";

    document.body.appendChild(div);

    let getTamanho = (barcode) => {

        if (barcode.indexOf("-pp") > -1) { return "PP"; }
        if (barcode.indexOf("-gg") > -1) { return "GG"; }
        if (barcode.indexOf("-exg") > -1) { return "EXG"; }
        if (barcode.indexOf("-exgg") > -1) { return "EXGG"; }
        if (barcode.indexOf("-g3") > -1) { return "G3"; }
        if (barcode.indexOf("-g4") > -1) { return "G4"; }
        if (barcode.indexOf("-p") > -1) { return "P"; }
        if (barcode.indexOf("-m") > -1) { return "M"; }
        if (barcode.indexOf("-g") > -1) { return "G"; }
        if (barcode.indexOf("-rn") > -1) { return "RN"; }
        if (barcode.indexOf("-2") > -1) { return "2"; }
        if (barcode.indexOf("-4") > -1) { return "4"; }
        if (barcode.indexOf("-6") > -1) { return "6"; }
        if (barcode.indexOf("-8") > -1) { return "8"; }
        if (barcode.indexOf("-10") > -1) { return "10"; }
        if (barcode.indexOf("-12") > -1) { return "12"; }
        if (barcode.indexOf("-14") > -1) { return "14"; }
        if (barcode.indexOf("-16") > -1) { return "16"; }
    }

    let anexosTable = document.getElementById("wsop_edt_anexos");
    let htm = "";
    if (data.anexo != undefined) {
        data.anexos.forEach((anexo, index) => {
            htm += "" + ((index % 4 == 0) ? "<tr>" : "") + "<td><div class='wsop_anexo_item'><center>" + anexo.name + "</center><center><img class='opli_edt_img_thumb' onclick='ClientEvents.emit(\"WSOP/site/anexo/view\"," + JSON.stringify(anexo) + ")' alt='' src='./module/WSOP/img/" + anexo.thumb + "'></td>";
        });
        anexosTable.innerHTML += htm;

    }
    let produtosTable = document.getElementById("wsop_edt_produtos");
    htm = "<tr class='opli_produto_item1'><td>Código:</td><td>Tamanho:</td><td>Quantidade:</td></tr>";

    if (data.products != undefined) {
        try {
            data.products = JSON.parse((data.products))
        } catch (eer) { }

        data.products.forEach((produto) => {
            barcode = produto.sku || "";
            barcode = barcode.replace("-rn", "")
            barcode = barcode.replace("-2", "")
            barcode = barcode.replace("-4", "")
            barcode = barcode.replace("-6", "")
            barcode = barcode.replace("-8", "")
            barcode = barcode.replace("-10", "")
            barcode = barcode.replace("-12", "")
            barcode = barcode.replace("-14", "")
            barcode = barcode.replace("-16", "")
            barcode = barcode.replace("-pp", "")
            barcode = barcode.replace("-p", "")
            barcode = barcode.replace("-m", "")
            barcode = barcode.replace("-gg", "")
            barcode = barcode.replace("-exg", "")
            barcode = barcode.replace("-exgg", "")
            barcode = barcode.replace("-g3", "")
            barcode = barcode.replace("-g4", "")
            barcode = barcode.replace("-g", "")

            htm += "<tr class='opli_produto_item1'>" +
                "<td>" + produto.sku + "</td>" +
                "<td><center>" + getTamanho(produto.sku) + "</td>" +
                "<td><center>" + produto.quantidade + "</td>" +
                "</tr><tr class='opli_produto_item3'><td colspan=3>" + produto.nome + "</td></tr>" +
                "<tr class='opli_produto_item2'><td><center><img class='opli_edt_img_thumb' alt='Imagem indisponivel' src='./module/WSOP/img/produtos/" + barcode + "_thumb.jpg'></td>" +
                "<td><input value='Validar' type='button' onclick='ClientEvents.emit(\"WSOP/site/qrcode\"," + JSON.stringify({ id: produto.sku, data: produto.sku }) + ")'></input></td><td>Valido:";

            for (let i = 0; i < parseInt(produto.quantidade); i++) {
                htm += "<input id='" + produto.sku + "' type='checkbox' onchange='ClientEvents.emit(\"WSOP/site/checkstatus\"," + JSON.stringify(data.products) + ")'></input>"
            }

            htm += " </tr>";
        });
        produtosTable.innerHTML += htm;
    }
    produtosTable.innerHTML += "<tr class='opli_produto_item1'><td style='width:30px'><input id='wsop_changestatus' onclick='ClientEvents.emit(\"WSOP/site/changestatus\"," + JSON.stringify(data) + ")' type='button' value='Expedição' disabled></td></tr>";

    ClientEvents.emit("SendSocket", "wsop/site/produtos/lst");
});


ClientEvents.on('WSOP/site/checkstatus', (data) => {
    if (data[0]) {
        let enab = true;
        data.forEach(item => {
            enab = enab && document.getElementById(item.sku).checked;
        })
        document.getElementById('wsop_changestatus').disabled = !enab;
    }
})

ClientEvents.on('WSOP/site/changestatus', (data) => {
})

ClientEvents.on("opli/save/site", () => {
    let data = {
        id: document.getElementById("opli_edt_id").value,
        obs: document.getElementById("opli_edt_obs").value,
        peso: document.getElementById("opli_edt_peso").value
    }
    ClientEvents.emit("SendSocket", "WSOP/site/edt", data);
})