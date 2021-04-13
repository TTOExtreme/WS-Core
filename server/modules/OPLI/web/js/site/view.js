ClientEvents.on("wsop/site/view", (data) => {
    ClientEvents.emit("WSOP/site/view/close");
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "opli_edt_div");
    div.setAttribute("id", "wsop_os_view_div");

    div.innerHTML = "" +
        "<table style='width:100%;'>" +
        "<tr class='menu_header'><td id='move_menu_wsop_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsop_os_view_div')>&#9776;</td><td class='opli_edt_label'><p class='wsop_add_closeButton' onclick='ClientEvents.emit(\"WSOP/site/view/close\")'>X</p></td></tr></table>" +
        "<div id='wsop_edt' class='opli_edt'>" +
        "<table style='width:100%;'>" +
        //OS ID
        "<tr style='font-size:14pt'><td>" + ("00" + new Date().getDate()).slice(-2) + "/" + ("00" + (new Date().getMonth() + 1)).slice(-2) + "/" + new Date().getFullYear() + " " + ("00" + new Date().getHours()).slice(-2) + ":" + ("00" + new Date().getMinutes()).slice(-2) + ":" + ("00" + new Date().getSeconds()).slice(-2) + "</td><td style='float:right'><b>Status: " + OPLIStatusIdToName(data.status) + " | OS: " + data.id_li + "</b></td></tr>" +
        "</table>" +
        "<hr>" +
        "<table style='width:100%;'>" +
        //os
        "<tr><td>Descrição:</td></tr>" +
        "<tr><td class='wsop_produto_item2' style='border:none'>" + (data.description).replace(new RegExp("&lt;", "g"), "<").replace(new RegExp("&gt;", "g"), ">") + "</p></td></tr>" +
        "</table><hr>" +
        "<table style='width: 100%;'><tbody id='wsop_edt_anexos' class='opli_edt_anexos'>" +
        "<tr><td colspan=4><p class='opli_edt_label' style='float:left; padding:0;margin:0;'>Anexos:</p></td></tr>" +
        "</table><hr>" +
        "<table style='width: 100%;; border-collapse:collapse'><tbody id='wsop_edt_produtos' class='opli_edt_produtos'>" +
        "<tr><td class='opli_edt_label' style='float:left'>Produtos:</td><td></td></tr>" +
        "<tr><td colspan=4 style='height:20px'></td></tr>" +
        "</table>" +
        "</div>";

    document.body.appendChild(div);

    let anexosTable = document.getElementById("wsop_edt_anexos");
    let htm = "";
    if (data.anexo != undefined) {
        data.anexos.forEach((anexo, index) => {
            htm += "" + ((index % 4 == 0) ? "<tr>" : "") + "<td><div class='wsop_anexo_item'><center>" + anexo.name + "</center><center><img class='opli_edt_img_thumb' onclick='ClientEvents.emit(\"WSOP/site/anexo/view\"," + JSON.stringify(anexo) + ")' alt='' src='./module/WSOP/img/" + anexo.thumb + "'></td>";
        });
        anexosTable.innerHTML += htm;

    }
    let produtosTable = document.getElementById("wsop_edt_produtos");
    htm = "<tr class='wsop_produto_item1'><td style='width:30px'>Ações:</td><td>Código:</td><td>Item:</td><td>Tamanho:</td><td>Quantidade:</td></tr>";

    if (data.products != undefined) {
        data.products = JSON.parse(data.products)
        data.products.forEach((produto) => {
            htm += "<tr class='wsop_produto_item1'>" +
                "<td>" + produto.sku + "</td>" +
                "<td colspan=2>" + produto.nome + "</td>" +
                "<td>" + produto.sku.substring((produto.sku.lastIndexOf("-") > -1) ? produto.sku.lastIndexOf("-") + 1 : 0) + "</td>" +
                "<td>" + produto.quantidade + "</td>" +
                "<tr class='wsop_produto_item2'><td><center><img class='opli_edt_img_thumb' alt='Imagem indisponivel' src='./module/OPLI/img/site/" + produto.sku + ".img'></td>" +
                "<td><input value='Validar' type='button' onclick='ClientEvents.emit(\"WSOP/site/qrcode\"," + JSON.stringify({ id: produto.sku, data: produto.sku }) + ")'></input></td><td>Valido:";

            for (let i = 0; i < parseInt(produto.quantidade); i++) {
                htm += "<input id='" + produto.sku + "' type='checkbox' onchange='ClientEvents.emit(\"WSOP/site/checkstatus\"," + JSON.stringify(data.products) + ")'></input>"
            }

            htm += " </td><td></td><td></td></tr>";
        });
        produtosTable.innerHTML += htm;
    }
    produtosTable.innerHTML += "<tr class='wsop_produto_item1'><td style='width:30px'><input id='wsop_changestatus' onclick='ClientEvents.emit(\"WSOP/site/changestatus\"," + JSON.stringify(data) + ")' type='button' value='Expedição' disabled></td></tr>";

    ClientEvents.emit("SendSocket", "wsop/site/produtos/lst");
});

ClientEvents.on("WSOP/site/view/close", () => {
    if (document.getElementById("wsop_os_view_div")) {
        document.body.removeChild(document.getElementById("wsop_os_view_div"));
    }
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
    console.log(data)
})