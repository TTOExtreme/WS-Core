
ClientEvents.on("wsop/os/print", (data) => {
    ClientEvents.emit("close_menu", 'wsop_print_div')
    ClientEvents.emit("close_menu", "wsop_printop_div");
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsop_print_div menu_dragger");
    div.setAttribute("id", "wsop_print_div");

    div.innerHTML = "" +
        "<table style='width:100%;'>" +
        "<tr class='menu_header'><td><input id='wpma_sites_submit' value='Imprimir' type='button' onclick='PrintElem(\"wsop_print\")'></td><td class='wsop_print_label'><p class='wsop_add_closeButton' onclick=ClientEvents.emit(\"close_menu\",'wsop_print_div')>X</p></td></tr></table>" +
        "<div id='wsop_print' class='wsop_print'>" +
        "<div class='div_wsop_hist_table'><table ><tr><td><table style='width:768px;'>" +
        //OS ID
        "<tr style='font-size:14pt'><td>" + ("00" + new Date().getDate()).slice(-2) + "/" + ("00" + (new Date().getMonth() + 1)).slice(-2) + "/" + new Date().getFullYear() + " " + ("00" + new Date().getHours()).slice(-2) + ":" + ("00" + new Date().getMinutes()).slice(-2) + ":" + ("00" + new Date().getSeconds()).slice(-2) + "</td><td style='float:right'><b>Status: " + new window.Modules.WSOP.StatusID().StatusIdToName(data.status) + " | OS: " + data.id + "</b></td></tr>" +
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
        "<tr><td style='font-size:10pt'>" + data.C_logradouro + "," + data.C_numero + " - " + data.C_bairro + " " + data.C_municipio + "-" + data.C_uf + "  " + data.C_country + "</td><td style='font-size:10pt'>Tel.: " + data.U_telefone + "</td></tr>" +
        "<tr><td style='font-size:10pt'>" + data.C_cep + "</td></tr>" +
        "<tr><td style='font-size:10pt'>Telefone: " + data.C_telefone + " - E-Mail: " + data.C_email + "</td></tr>" +
        "</table>" +
        "<hr>" +
        "<table style='width:100%;'>" +
        //Hide Data
        "<tr style='display:none'><td class='wsop_edt_label'>Forma Envio:</td><td><Select id='wsop_edt_formaEnvio' onChange='ClientEvents.emit(\"wsop_changeBoxSize_print\")'>" + new window.Modules.WSOP.formaEnvio().envioToOptList(data.formaEnvio) + "</select></td></tr>" +
        "<tr style='display:none'><td class='wsop_edt_label'>Pais:</td><td><Select id='wsop_edt_formaEnvio_country' onChange='ClientEvents.emit(\"wsop_changeBoxSize_print\")'>" + new window.Modules.WSOP.formaEnvio().envioToOptListCountry(data.C_country) + "</select></td></tr>" +
        "<tr style='display:none'><td class='wsop_edt_label'>Estado:</td><td><Select id='wsop_edt_formaEnvio_uf' onChange='ClientEvents.emit(\"wsop_changeBoxSize_print\")'>" + new window.Modules.WSOP.formaEnvio().envioToOptListEstado(data.C_uf) + "</select></td></tr>" +
        "<tr style='display:none'><td class='wsop_edt_label'>Caixa:</td><td><Select id='wsop_edt_formaEnvio_caixa' onChange='ClientEvents.emit(\"wsop_changeBoxSize_print\")'>" + new window.Modules.WSOP.formaEnvio().envioToOptListCaixa(data.caixa) + "</select><sizecaixa id='wsop_edt_formaEnvio_size'>" + new window.Modules.WSOP.formaEnvio().getSizeCaixa(data.caixa) + "</td></tr>" +
        //OS
        "<tr><td>Forma Envio: " + new window.Modules.WSOP.formaEnvio().envioToName(data.formaEnvio) + "</td></tr>" +
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
        "<tr style='font-size:12pt'><td colspan=3>" + window.Modules.WSOP.termos.termoCompraPrivateLabel + "</td></tr><tr>" +
        "<tr style='font-size:12pt'><b><td><center><pre>Data\n\n_______________________________</td><td><center><pre>Assinatura Cliente\n\n_______________________________</td><td><center><pre>Assinatura Responsável\n\n_______________________________</td></tr><tr>" +
        "</table></tr></td></table></div>" +
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
        total += (produto.qnt * parseFloat(produto.price.replace(",", ".").replace(" ", "")));
        totalqnt += produto.qnt;
        htm += "<tr class='wsop_produto_item1'>" +
            "<td>" + produto.barcode + "</td>" +
            "<td>" + produto.name + "</td>" +
            "<td>" + produto.qnt + "</td>" +
            "<td>R$ " + parseFloat(produto.price.replace(",", ".").replace(" ", "")) + "</td>" +
            "<td>R$ " + (produto.qnt * parseFloat(produto.price.replace(",", ".").replace(" ", ""))).toFixed(2) + "</td>" +
            "<tr class='wsop_produto_item2'><td><center><img class='wsop_print_img_thumb' alt='' src='./module/WSOP/img/" + produto.img.replace(".", "_thumb.") + "'></td><td colspan=2 style='width:50%'>OBS:" + unclearDesc(produto.obs) + "</td>";
    });
    //htm += "<tr class='wsop_produto_item1'><td></td><td><b>Quantidade Total:</td><td><b>" + totalqnt + "</td><td><b>TOTAL:</td><td>R$ " + total.toFixed(2) + "</td>"

    htm += "<tr class='wsop_produto_item1'><td style='border:none'></td><td><b>Quantidade Total:</td><td><b id='qnttotal'>" + totalqnt + "</td><td><b>SUBTOTAL:</td><td>R$ " + total.toFixed(2) + "</td>"
    htm += "<tr class='wsop_produto_item3' style='"
    if (data.desconto != undefined) {
        if (data.desconto > 0) {
        } else {
            htm += " display:none; ";
            data.desconto = 0;
        }
    } else {
        htm += " display:none; ";
    }
    htm += "'><td style='border:none' colspan='3'></td><td><b>Desconto:</td><td>R$ " + parseFloat(data.desconto).toFixed(2) + "</td>";
    htm += "<tr style='display:none;'><td><select id='wsop_edt_desconto'>" + new window.Modules.WSOP.desconto().descontoToOPTList(parseFloat(data.desconto || 0).toFixed(2), total) + "</select></td></tr>"
    htm += "<tr style='display:none;'><td><div id='wsop_edt_precoEnvio'>" + data.precoEnvio + "</div></td></tr>"
    htm += "<tr id='tr_precoenvio' class='wsop_produto_item3'><td style='border:none' colspan='3'></td><td><b>Frete:</td><td id='wsop_edt_formaEnvio_precoenvio_show'>R$ Calculando</td>";
    htm += "<tr class='wsop_produto_item2'><td style='border:none' colspan='3'></td><td><b>TOTAL:</td><td id='wsop_edt_total_show'>R$ Calculando</td>";

    ClientEvents.on("wsop_changeBoxSize_print", () => {
        let newprEnvio = new window.Modules.WSOP.formaEnvio().getPrice(
            document.getElementById("wsop_edt_formaEnvio_country").value,
            document.getElementById("wsop_edt_formaEnvio_uf").value,
            document.getElementById("wsop_edt_formaEnvio").value,
            document.getElementById("wsop_edt_formaEnvio_caixa").value,
            parseInt(document.getElementById("qnttotal").innerText));

        let npacotes = new window.Modules.WSOP.formaEnvio().getNCaixas(document.getElementById("wsop_edt_formaEnvio_caixa").value, parseInt(document.getElementById("qnttotal").innerText));
        document.getElementById("wsop_edt_precoEnvio").value = newprEnvio;
        document.getElementById("wsop_edt_formaEnvio_precoenvio_show").innerText = "R$ " + newprEnvio +
            " (" + npacotes + ((npacotes > 1) ? " Pacotes)" : " Pacote)");
        ClientEvents.emit("wsop_print_reload_price");
    });


    ClientEvents.on("wsop_print_reload_price", () => {

        let price = parseFloat(parseFloat(total - document.getElementById("wsop_edt_desconto").value) + parseFloat(document.getElementById("wsop_edt_precoEnvio").value)).toFixed(2);
        if (parseFloat(document.getElementById("wsop_edt_precoEnvio").value) > 0) {
            document.getElementById("tr_precoenvio").style.display = "display";
        } else {
            document.getElementById("tr_precoenvio").style.display = "none";
        }
        document.getElementById("wsop_edt_total_show").innerText = "R$ " + price;
    })


    produtosTable.innerHTML += htm;
    ClientEvents.emit("wsop_changeBoxSize_print");
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