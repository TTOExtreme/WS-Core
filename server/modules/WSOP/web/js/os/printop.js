
ClientEvents.on("wsop/os/printop", (data) => {
    ClientEvents.emit("close_menu");
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsop_print_div menu_dragger");
    div.setAttribute("id", "wsop_printop_div");


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
        "<tr class='menu_header'><td><input id='wpma_sites_submit' value='Imprimir' type='button' onclick='PrintElem(\"wsop_print\")'></td><td class='wsop_print_label'><p class='wsop_add_closeButton' onclick=ClientEvents.emit(\"close_menu\",'wsop_printop_div')>X</p></td></tr></table>" +


        "<div class='div_wsop_hist_table'>" +
        "<div id='wsop_print' class='wsop_print'><table style='width:100%;'><tr><td><table style='min-width:768px;'>" +
        //OS ID
        "<tr style='font-size:14pt'><td>" + formatTime(data.createdIn) + "</td><td style='float:right'><b>Status: " + new window.Modules.WSOP.StatusID().StatusIdToName(data.status) + " | OS: " + data.id + "</b></td></tr>" +
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
        "<tr><td>Forma Envio: " + new window.Modules.WSOP.formaEnvio().envioToName(data.formaEnvio) + "</td></tr>" +
        "<tr><td>Descrição:</td>" +
        "</table><hr>" +
        "<table style='width: 100%;'>" +
        "<tr><td>" + histdata + "</td></tr>" +
        "</table><hr>" +
        "<table style='width: 100%;'><tbody id='wsop_print_anexos' class='wsop_print_anexos'>" +
        "<tr><td colspan=4><p class='wsop_print_label' style='float:left; padding:0;margin:0;'>Anexos:</p></td></tr>" +
        "</table><hr>" +
        "<table style='width: 100%;; border-collapse:collapse'><tbody id='wsop_print_produtos' class='wsop_print_produtos'>" +
        "<tr><td class='wsop_print_label' style='float:left'>Produtos:</td><td></td></tr>" +
        "<tr><td colspan=4 style='height:20px'></td></tr>" +
        "</table></tr></td></table></div>" +
        "</div>";

    document.body.appendChild(div);

    let anexosTable = document.getElementById("wsop_print_anexos");
    let htm = "";
    if (data.anexos != undefined) {
        data.anexos.forEach((anexo, index) => {
            htm += "" + ((index % 4 == 0) ? "<tr>" : "") + "<td><div class='wsop_anexo_item'><center><pre>Nome: " + anexo.name + "\nData: " + formatTime(anexo.createdIn) + "</pre></center><center><img class='wsop_print_img_thumb' alt='' src='./module/WSOP/img/" + anexo.thumb + "'></td>";
        });
        anexosTable.innerHTML += htm;
    }
    let produtosTable = document.getElementById("wsop_print_produtos");
    htm = "";
    let total = 0;
    let totalqnt = 0;

    if (data.anexos != undefined) {
        data.produtos.forEach((produto) => {
            try {
                produto.description = JSON.parse(produto.description)
            } catch (err) {
                produto.description = { gola: "-", vies: "-", genero: "-", modelo: "-" }
            }
            total += (produto.qnt * produto.price);
            totalqnt += produto.qnt;
            htm += "<tr class='wsop_produto_item1'>" +
                "<td>Cod: " + produto.barcode + "</td>" +
                "<td>Nome: " + produto.name + "</td>" +
                "<td>Genero: " + produto.description.genero + "</td>" +
                "<td>QNT: " + produto.qnt + "</td>" +
                "</tr><tr class='wsop_produto_item3'>" +
                "<td>Modelo: " + produto.description.modelo + "</td>" +
                "<td>Tecido: " + (produto.description.tecido != undefined ? produto.description.tecido : "-") + "</td>" +
                "<td>Vies: " + produto.description.vies + "</td>" +
                "<td>Gola: " + produto.description.gola + "</td>" +
                "<tr class='wsop_produto_item2'><td style='width:250px'><center>";
            produto.img.split(",").forEach(img => {
                htm +=
                    "<img id='wsop_edt_img_thumb' class='wsop_edt_img_thumb' alt='' src='./module/WSOP/img/" + img.replace(".", "_thumb.") + "' onclick='ClientEvents.emit(\"WSOP/os/anexo/view\"," + JSON.stringify({ name: produto.name, filename: img, createdIn: produto.createdIn }) + ")'>";
            })
            htm += "</td><td colspan=3 style='width:75%'>OBS:" + unclearDesc(produto.obs) + "</td>";
        });
        htm += ("<tr class='wsop_produto_item2'><td></td><td><b>Quantidade Total:</td><td><b>" + totalqnt + "</td>")
        produtosTable.innerHTML += htm;
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