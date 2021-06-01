
ClientEvents.on("wsop/os/printop", (data) => {
    ClientEvents.emit("WSOP/os/printop/close");
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsop_print_div");
    div.setAttribute("id", "wsop_printop_div");

    div.innerHTML = "" +
        "<table style='width:100%;'>" +
        "<tr class='menu_header'><td><input id='wpma_sites_submit' value='Imprimir' type='button' onclick='PrintElem(\"wsop_print\")'></td><td class='wsop_print_label'><p class='wsop_add_closeButton' onclick='ClientEvents.emit(\"WSOP/os/printop/close\")'>X</p></td></tr></table>" +
        "<div id='wsop_print' class='wsop_print'>" +
        "<table style='width:100%;'>" +
        //OS ID
        "<tr style='font-size:14pt'><td>" + ("00" + new Date().getDate()).slice(-2) + "/" + ("00" + (new Date().getMonth() + 1)).slice(-2) + "/" + new Date().getFullYear() + " " + ("00" + new Date().getHours()).slice(-2) + ":" + ("00" + new Date().getMinutes()).slice(-2) + ":" + ("00" + new Date().getSeconds()).slice(-2) + "</td><td style='float:right'><b>Status: " + StatusIdToName(data.status) + " | OS: " + data.id + "</b></td></tr>" +
        "</table>" +
        "<hr>" +
        "<table style='width:100%;'>" +
        //emitente
        "<tr><td rowspan=7><img class='wsop_emissor_logo' alt='' src='./module/WSOP/img/" + window.Emitente.img + "' loc='" + data.img + "'></td>" +
        "<tr><td style='font-size:18pt'>" + window.Emitente.name + "</td></tr><tr>" +
        "<tr><td style='font-size:10pt'>" + window.Emitente.cpf_cnpj + "</td></tr>" +
        "<tr><td style='font-size:10pt'>" + window.Emitente.logradouro + "," + window.Emitente.numero + " - " + window.Emitente.bairro + " " + window.Emitente.municipio + "-" + window.Emitente.uf + "</td></tr>" +
        "<tr><td style='font-size:10pt'>" + window.Emitente.cep + "</td></tr>" +
        "<tr><td style='font-size:10pt'>Telefone: " + window.Emitente.telefone + " - E-Mail: " + window.Emitente.email + "</td></tr>" +
        "<tr><td style='font-size:10pt'></td></tr>" +
        "</table>" +
        "<hr>" +
        "<table style='width:100%;'>" +
        //cliente
        "<tr><td><b>Cliente:</td><td><b>Responsável:</tr>" +
        "<tr><td style='font-size:10pt'>" + data.cliente + "</td><td style='font-size:10pt'>" + data.createdBy + "</td></tr><tr>" +
        "</table>" +
        "<hr>" +
        "<table style='width:100%;'>" +
        //os
        "<tr><td style='width:70%'>Descrição:</td><td class='wsop_printop_perdas'>Status</td><td class='wsop_printop_perdas'>Responsável</td><td class='wsop_printop_perdas'>Perdas</td></tr>" +
        "<tr><td class='wsop_produto_item2' style='border:none;width:70%' rowspan=16>" + (data.description).replace(new RegExp("&lt;", "g"), "<").replace(new RegExp("&gt;", "g"), ">") +
        "</td><td class='wsop_printop_perdas'>Mockup:</td><td class='wsop_printop_perdas'></td><td class='wsop_printop_perdas'></td></tr>" +
        "<tr><td class='wsop_printop_perdas'>PDF Impressão:</td><td class='wsop_printop_perdas'></td><td class='wsop_printop_perdas'></td></tr>" +
        "<tr><td class='wsop_printop_perdas'>Impressão:</td><td class='wsop_printop_perdas'></td><td class='wsop_printop_perdas'></td></tr>" +
        "<tr><td class='wsop_printop_perdas'>Calandra:</td><td class='wsop_printop_perdas'></td><td class='wsop_printop_perdas'></td></tr>" +
        "<tr><td class='wsop_printop_perdas'>Costura:</td><td class='wsop_printop_perdas'></td><td class='wsop_printop_perdas'></td></tr>" +
        "<tr><td class='wsop_printop_perdas'>Conferencia:</td><td class='wsop_printop_perdas'></td><td class='wsop_printop_perdas'></td></tr>" +
        "<tr><td class='wsop_printop_perdas'>Embalagem:</td><td class='wsop_printop_perdas'></td><td class='wsop_printop_perdas'></td></tr>" +
        "<tr><td class='wsop_printop_perdas'>Produçao:</td><td class='wsop_printop_perdas'></td><td class='wsop_printop_perdas'></td></tr>" +
        "</table><hr>" +
        "<table style='width: 100%;'><tbody id='wsop_print_anexos' class='wsop_print_anexos'>" +
        "<tr><td colspan=4><p class='wsop_print_label' style='float:left; padding:0;margin:0;'>Anexos:</p></td></tr>" +
        "</table><hr>" +
        "<table style='width: 100%;; border-collapse:collapse'><tbody id='wsop_print_produtos' class='wsop_print_produtos'>" +
        "<tr><td class='wsop_print_label' style='float:left'>Produtos:</td><td></td></tr>" +
        "<tr><td colspan=4 style='height:20px'></td></tr>" +
        "</table>" +
        "</div>";

    document.body.appendChild(div);

    let anexosTable = document.getElementById("wsop_print_anexos");
    let htm = "";
    data.anexos.forEach((anexo, index) => {
        htm += "" + ((index % 4 == 0) ? "<tr>" : "") + "<td><div class='wsop_anexo_item'><center>" + anexo.name + "</center><center><img class='wsop_print_img_thumb' alt='' src='./module/WSOP/img/" + anexo.thumb + "'></td>";
    });
    anexosTable.innerHTML += htm;

    let produtosTable = document.getElementById("wsop_print_produtos");
    htm = "<tr class='wsop_produto_item1'><td>Código:</td><td>Item:</td><td>Quantidade:</td></tr>";
    let total = 0;
    let totalqnt = 0;
    data.produtos.forEach((produto) => {
        total += (produto.qnt * produto.price);
        totalqnt += produto.qnt;
        htm += "<tr class='wsop_produto_item1'>" +
            "<td>" + produto.barcode + "</td>" +
            "<td>" + produto.name + "</td>" +
            "<td>" + produto.qnt + "</td>" +
            "<tr class='wsop_produto_item2'><td><center><img class='wsop_print_img_thumb' alt='' src='./module/WSOP/img/" + produto.img.replace(".", "_thumb.") + "'></td><td colspan=2 style='width:75%'>OBS:" + (produto.obs).replace(new RegExp("&lt;", "g"), "<").replace(new RegExp("&gt;", "g"), ">") + "</td>";
    });
    htm += ("<tr class='wsop_produto_item1'><td></td><td><b>Qntidade Total:</td><td><b>" + totalqnt + "</td>")
    produtosTable.innerHTML += htm;
});

ClientEvents.on("WSOP/os/printop/close", () => {
    if (document.getElementById("wsop_printop_div")) {
        document.body.removeChild(document.getElementById("wsop_printop_div"));
    }
});

function PrintElem(elem) {
    var mywindow = window.open('', 'PRINT', 'width=210mm');

    mywindow.document.write('<html><head><title>' + document.title + '</title>');
    mywindow.document.write('<link rel="stylesheet" type="text/css" id="ext_..css.home.css" href="./css/home.css">' +
        '<link rel="stylesheet" type="text/css" id="ext_..css.themes.theme-dark.css" href="./css/themes/theme-dark.css">' +
        '<link rel="stylesheet" type="text/css" id="ext_..module.WSOP.css.index.css" href="./module/WSOP/css/index.css">' +
        '<link rel="stylesheet" type="text/css" id="ext_..module.WSOP.css.print.css" href="./module/WSOP/css/printer.css">');
    mywindow.document.write('</head><body style="background:none">');
    mywindow.document.write(document.getElementById(elem).innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    //console.log("printing")

    return true;
}