
ClientEvents.on("wsop/os/view", (data) => {
    ClientEvents.emit("close_menu", "wsop_os_view_div");
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsop_edt_div menu_dragger");
    div.setAttribute("id", "wsop_os_view_div");




    let sc = []
    try {
        sc = JSON.parse(data.statusChange);
    } catch (err) {
        try {
            sc = unclearJSON(data.statusChange);
            if (typeof (sc) != "object") {
                sc = JSON.parse(sc);
            }
        } catch (err) {
            console.log(data.statusChange);
            console.log(err);
        }
    }
    let histdata = "";
    if (sc != undefined) {
        if (sc.length >= 0) {
            histdata = "OBS:<pre style='border:1px solid #303030'>" + unclearDesc(sc[sc.length - 1].obs) + "</pre>";
        }
    }


    div.innerHTML = "" +
        "<table style='width:100%;'>" +
        "<tr class='menu_header'><td id='move_menu_wsop_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsop_os_view_div')>&#9776;</td><td class='wsop_edt_label'><p class='wsop_add_closeButton' onclick=ClientEvents.emit(\"close_menu\",'wsop_os_view_div')>X</p></td></tr></table>" +
        "<div id='wsop_edt' class='wsop_edt'>" +
        "<table style='width:100%;'><tr><td colspan=2><div class='div_wsop_hist_table' style='overflow-x:hidden'><table style='width:100%'>" +
        //OS ID
        "<tr style='font-size:14pt'><td>" + ("00" + new Date().getDate()).slice(-2) + "/" + ("00" + (new Date().getMonth() + 1)).slice(-2) + "/" + new Date().getFullYear() + " " + ("00" + new Date().getHours()).slice(-2) + ":" + ("00" + new Date().getMinutes()).slice(-2) + ":" + ("00" + new Date().getSeconds()).slice(-2) + "</td><td style='float:right'><b>Status: " + new window.Modules.WSOP.StatusID().StatusIdToName(data.status) + " | OS: " + data.id + "</b></td></tr>" +
        "</table>" +
        "<hr>" +
        "<table style='width:100%;'>" +
        //os
        "<tr><td>Cliente: " + data.cliente + "</td></tr>" +
        "<tr><td>Vendedor: " + data.createdBy + "</td></tr>" +
        "</table><hr>" +
        "<table style='width: 100%;'>" +
        "<tr><td>" + histdata + "</td></tr>" +
        "</table><hr>" +
        "<table style='width: 100%;'>" +
        "<tr><td>Descrição:</td></tr>" +
        "<tr><td class='wsop_produto_item2' style='border:none'>" + unclearDesc(data.description) + "</p></td></tr>" +
        "</table><hr>" +
        "<table style='width: 100%;'><tbody id='wsop_edt_anexos' class='wsop_edt_anexos'>" +
        "<tr><td colspan=4><p class='wsop_edt_label' style='float:left; padding:0;margin:0;'>Anexos:</p></td></tr>" +
        "</table><hr>" +
        "<table style='width: 100%;; border-collapse:collapse'><tbody id='wsop_edt_produtos' class='wsop_edt_produtos'>" +
        "<tr><td class='wsop_edt_label' style='float:left'>Produtos:</td><td></td></tr>" +
        "<tr><td colspan=4 style='height:20px'></td></tr>" +
        "</table>" +
        "</div>";

    document.body.appendChild(div);

    let anexosTable = document.getElementById("wsop_edt_anexos");
    let htm = "";
    data.anexos.forEach((anexo, index) => {
        htm += "" + ((index % 4 == 0) ? "<tr>" : "") + "<td><div class='wsop_anexo_item'><center><pre>Nome: " + anexo.name + "\nData: " + formatTime(anexo.createdIn) + "</pre></center><center><img class='wsop_edt_img_thumb' onclick='ClientEvents.emit(\"WSOP/os/anexo/view\"," + JSON.stringify(anexo) + ")' alt='' src='./module/WSOP/img/" + anexo.thumb + "'></td>";
    });
    anexosTable.innerHTML += htm;

    let produtosTable = document.getElementById("wsop_edt_produtos");
    htm = "<tr class='wsop_produto_item1'><td style='width:30px'>Ações:</td><td>Código:</td><td>Item:</td><td>Quantidade:</td></tr>";
    data.produtos.forEach((produto) => {
        htm += "<tr class='wsop_produto_item1'><td style='width:30px'></td>" +
            "<td>" + produto.barcode + "</td>" +
            "<td>" + produto.name + "</td>" +
            "<td>" + produto.qnt + "</td>" +
            "<tr class='wsop_produto_item2'><td>OBS:</td><td colspan=2>" + unclearDesc(produto.obs) + "</td><td><center><img id='wsop_edt_img_thumb' class='wsop_edt_img_thumb' alt='' src='./module/WSOP/img/" + produto.img.replace(".", "_thumb.") + "' onclick='ClientEvents.emit(\"WSOP/os/anexo/view\"," + JSON.stringify({ name: produto.name, filename: produto.img }) + ")'></td>";
    });
    produtosTable.innerHTML += htm;

    ClientEvents.emit("SendSocket", "wsop/os/produtos/lst");
});
