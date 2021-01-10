
ClientEvents.on("wsop/os/view", (data) => {
    ClientEvents.emit("WSOP/os/view/close");
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsop_edt_div");
    div.setAttribute("id", "wsop_edt_div");

    div.innerHTML = "" +
        "<table style='width:100%;'>" +
        "<tr class='menu_header'><td id='move_menu_wsop_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsop_edt_div')>&#9776;</td><td class='wsop_edt_label'><p class='wsop_add_closeButton' onclick='ClientEvents.emit(\"WSOP/os/view/close\")'>X</p></td></tr>" +
        "<tr><td class='wsop_edt_label'>ID:</td><td><p id='wsop_edt_id'>" + data.id + "</p></td></tr>" +
        "<tr><td class='wsop_edt_label'>Cliente:</td><td><p id='wsop_edt_cliente'>" + data.cliente + "</p></td></tr>" +
        "<tr><td class='wsop_edt_label'>Descrição:</td><td><p id='wsop_edt_description'>" + data.description + "</p></td></tr>" +
        "<tr><td class='wsop_edt_label'>Status:</td><td><p id='wsop_edt_status'>" + StatusIdToName(data.status) + "</p></td></tr>" +
        "</table><hr>" +
        "<table style='width: calc(100vw - 250px);'><tbody id='wsop_edt_anexos' class='wsop_edt_anexos'>" +
        "<tr><td colspan=4><p class='wsop_edt_label' style='float:left; padding:0;margin:0;'>Anexos:</p></td></tr>" +
        "</table><hr>" +
        "<table style='width: calc(100vw - 250px);; border-collapse:collapse'><tbody id='wsop_edt_produtos' class='wsop_edt_produtos'>" +
        "<tr><td class='wsop_edt_label' style='float:left'>Produtos:</td><td></td></tr>" +
        "<tr><td colspan=4 style='height:20px'>  </td></tr>" +
        "</table>";

    document.body.appendChild(div);

    let anexosTable = document.getElementById("wsop_edt_anexos");
    let htm = "";
    data.anexos.forEach((anexo, index) => {
        htm += "" + ((index % 4 == 0) ? "<tr>" : "") + "<td><div class='wsop_anexo_item'><center>" + anexo.name + "</center><center><img class='wsop_edt_img_thumb' onclick='ClientEvents.emit(\"WSOP/os/anexo/view\"," + JSON.stringify(anexo) + ")' alt='' src='./module/WSOP/img/" + anexo.thumb + "'></td>";
    });
    anexosTable.innerHTML += htm;

    let produtosTable = document.getElementById("wsop_edt_produtos");
    htm = "<tr class='wsop_produto_item1'><td style='width:30px'>Ações:</td><td>Código:</td><td>Item:</td><td>Quantidade:</td></tr>";
    data.produtos.forEach((produto) => {
        htm += "<tr class='wsop_produto_item1'><td style='width:30px'></td>" +
            "<td>" + produto.barcode + "</td>" +
            "<td>" + produto.name + "</td>" +
            "<td>" + produto.qnt + "</td>" +
            "<tr class='wsop_produto_item2'><td>OBS:</td><td colspan=2>" + (produto.obs).replace(new RegExp("&lt;", "g"), "<").replace(new RegExp("&gt;", "g"), ">") + "</td><td><center><img id='wsop_edt_img_thumb' class='wsop_edt_img_thumb' alt='' src='./module/WSOP/img/" + produto.img.replace(".", "_thumb.") + "' onclick='ClientEvents.emit(\"WSOP/os/anexo/view\"," + JSON.stringify({ name: produto.name, filename: produto.img }) + ")'></td>";
    });
    produtosTable.innerHTML += htm;

    ClientEvents.emit("SendSocket", "wsop/os/produtos/lst");
});

ClientEvents.on("WSOP/os/view/close", () => {
    if (document.getElementById("wsop_edt_div")) {
        document.body.removeChild(document.getElementById("wsop_edt_div"));
    }
});
