
ClientEvents.on("wsop/os/print", (data) => {
    ClientEvents.emit("WSOP/os/print/close");
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsop_print_div");
    div.setAttribute("id", "wsop_print_div");

    div.innerHTML = "" +
        "<table style='width:100%;'>" +
        "<tr class='menu_header'><td><input id='wpma_sites_submit' value='Imprimir' type='button' onclick='PrintElem(\"wsop_print\")'></td><td class='wsop_print_label'><p class='closeButton' onclick='ClientEvents.emit(\"WSOP/os/print/close\")'>X</p></td></tr></table>" +
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
        "<tr><td style='font-size:10pt'>" + data.C_cpf_cnpj + "</td><td style='font-size:10pt'>E-Mail: " + data.U_email + "</td></tr>" +
        "<tr><td style='font-size:10pt'>" + data.C_logradouro + "," + data.C_numero + " - " + data.C_bairro + " " + data.C_municipio + "-" + data.C_uf + "</td><td style='font-size:10pt'>Tel.: " + data.U_telefone + "</td></tr>" +
        "<tr><td style='font-size:10pt'>" + data.C_cep + "</td></tr>" +
        "<tr><td style='font-size:10pt'>Telefone: " + data.C_telefone + " - E-Mail: " + data.C_email + "</td></tr>" +
        "</table>" +
        "<hr>" +
        "<table style='width:100%;'>" +
        //os
        "<tr><td>Descrição:</td></tr>" +
        "<tr><td class='wsop_produto_item2' style='border:none'>" + unclearDesc(data.description) + "</p></td></tr>" +
        "</table><hr>" +
        "<table style='width: 100%;'><tbody id='wsop_print_anexos' class='wsop_print_anexos'>" +
        "<tr><td colspan=4><p class='wsop_print_label' style='float:left; padding:0;margin:0;'>Anexos:</p></td></tr>" +
        "</table><hr>" +
        "<table style='width: 100%;; border-collapse:collapse'><tbody id='wsop_print_produtos' class='wsop_print_produtos'>" +
        "<tr><td class='wsop_print_label' style='float:left'>Produtos:</td><td></td></tr>" +
        "<tr><td colspan=4 style='height:20px'></td></tr>" +
        "</table>" +
        "<table style='width:100%;'>" +
        "<tr style='font-size:12pt'><b><td><center><pre>Data\n\n_______________________________</td><td><center><pre>Assinatura Cliente\n\n_______________________________</td><td><center><pre>Assinatura Responsável\n\n_______________________________</td></tr><tr>" +
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
    htm = "<tr class='wsop_produto_item1'><td>Código:</td><td>Item:</td><td>Quantidade:</td><td>Preço Unit.</td><td>SubTotal</td></tr>";
    let total = 0;
    let totalqnt = 0;
    data.produtos.forEach((produto) => {
        total += (produto.qnt * (produto.price).replace(" ", ""));
        totalqnt += produto.qnt;
        htm += "<tr class='wsop_produto_item1'>" +
            "<td>" + produto.barcode + "</td>" +
            "<td>" + produto.name + "</td>" +
            "<td>" + produto.qnt + "</td>" +
            "<td>R$ " + (produto.price).replace(" ", "") + "</td>" +
            "<td>R$ " + (produto.qnt * (produto.price).replace(" ", "")).toFixed(2) + "</td>" +
            "<tr class='wsop_produto_item2'><td><center><img class='wsop_print_img_thumb' alt='' src='./module/WSOP/img/" + produto.img.replace(".", "_thumb.") + "'></td><td colspan=2 style='width:50%'>OBS:" + unclearDesc(produto.obs) + "</td>";
    });
    htm += "<tr class='wsop_produto_item2'><td></td><td><b>Quantidade Total:</td><td><b>" + totalqnt + "</td><td><b>TOTAL:</td><td>R$ " + total.toFixed(2) + "</td>"
    produtosTable.innerHTML += htm;
});

ClientEvents.on("WSOP/os/print/close", () => {
    if (document.getElementById("wsop_print_div")) {
        document.body.removeChild(document.getElementById("wsop_print_div"));
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

    return true;
}