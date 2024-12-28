
ClientEvents.on("WSFinan/requisicao/edt", (data) => {
    ClientEvents.emit("close_menu", 'wsfinan_requisicao_edt_div');
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsfinan_edt_div  menu_dragger");
    div.setAttribute("id", "wsfinan_requisicao_edt_div");

    try {
        data.description = JSON.parse(data.description)
    } catch (err) {
        data.description = { description: "" };
    }

    div.innerHTML = "" +
        "<table>" +
        "<tr class='menu_header'><td id='move_menu_wsfinan_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsfinan_requisicao_edt_div')>&#9776;</td><td class='wsfinan_edt_label' colspan=3><p class='closeButton' onclick=ClientEvents.emit(\"close_menu\",'wsfinan_requisicao_edt_div')>X</p></td></tr>" +
        "<tr><td colspan=2><div class='div_wsfinan_hist_table' style='overflow-x:hidden'><table style='width:100%'><tr><td class='wsfinan_edt_label'>ID:</td><td><input id='wsfinan_edt_id' type='text' disabled value='" + data.id + "'></td></tr>" +
        "<tr><td class='wsfinan_edt_label'>Fornecedor:</td><td><input id='wsfinan_edt_cliente' type='text' disabled value='" + data.fornecedor + "'></td></tr>" +
        "<tr><td class='wsfinan_edt_label'>Status:</td><td><Select id='wsfinan_edt_status' disabled>" + new window.Modules.WSFinan.StatusID().StatusIdToOptList(data.status) + "</select></td></tr>" +
        "<tr><td class='wsfinan_edt_label'>Ativo:</td><td><input id='wsfinan_edt_active' type='checkbox' " + ((data.active == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td class='wsfinan_edt_label'>Nome:</td><td><input id='wsfinan_edt_name' type='text' value='" + data.name + "'></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Salvar' type='button' onclick='ClientEvents.emit(\"wsfinan/requisicao/edt\")'></td></tr>" +

        "</table><hr><table>" +
        "<tr><td>Descrição:</td></tr>" +
        "<tr><td colspan =2><textarea id='wsfinan_edt_description'class='sun-editor-editable'>" + unclearDesc(data.description.description) + "</textarea></td></tr>" +
        "</table><hr>" +

        "<table style=''><tbody id='wsfinan_edt_anexos' class='wsfinan_edt_anexos'>" +
        "<tr><td colspan=5><p class='wsfinan_edt_label' style='float:left; padding:0;margin:0;'>Anexos:</p><input id='wsfinan_edt_img' style='float:right' type='button' value='Adicionar' onclick='ClientEvents.emit(\"wsfinan/requisicao/uploadIMG\",\"" + data.id + "\")'></td></tr>" +
        "</table><hr>" +
        "<table style='; border-collapse:collapse'>" +
        "<tr><td class='wsfinan_edt_label' style='float:left'>Add Produto:</td><td></td></tr>" +
        "<tr><td colspan=5>" +
        "<input id='wsfinan_searchbot' type='button' onclick='ClientEvents.emit(\"wsfinan/requisicao/searchprod\")' value='Buscar'></input>" +
        "<input id='wsfinan_edt_produto' placeholder='Produto' type='text' list='prodsearchlist'></input><datalist id='prodsearchlist'></datalist>" +
        "<input id='wsfinan_edt_id_produto' style='display:none' type='text'></input>" +
        "<input id='wsfinan_edt_qnt_produto' placeholder='Quantidade' type='number'></input>" +
        "<input id='wsfinan_edt_price_produto' placeholder='Preço' type='number'></input>" +
        "<input type='button' value='Adicionar' onClick='ClientEvents.emit(\"wsfinan/requisicao/produto/add\")'></input>" +
        "<input type='button' value='Novo Produto' onclick='ClientEvents.emit(\"WSFinan/produtos/add\")'></input></td></tr>" +
        "<tr><td colspan=5><textarea id='wsfinan_edt_description_produto'class='sun-editor-editable'></textarea></td></tr>" +
        "<tr><td colspan=5 style='height:20px'>  </td></tr>" +
        "</table><hr><table style='width: 100%; border-collapse:collapse'><tbody id='wsfinan_edt_produtos' class='wsfinan_edt_produtos'>" +
        "<tr><td class='wsfinan_edt_label' style='float:left'>Produtos:</td><td></td></tr>" +
        "</table>";

    document.body.appendChild(div);

    ClientEvents.on("wsfinan/requisicao/searchprod", () => {
        if (document.getElementById("wsfinan_edt_produto") != undefined) {
            document.getElementById("wsfinan_searchbot").value = "Buscando...";
            document.getElementById("wsfinan_searchbot").disabled = true;
            ClientEvents.emit("SendSocket", "WSFinan/requisicao/produtos/lst", { barcode: document.getElementById("wsfinan_edt_produto").value });
        }
    })

    let anexosTable = document.getElementById("wsfinan_edt_anexos");
    let htm = "";
    if (data.anexos != undefined) {
        data.anexos.forEach((anexo, index) => {
            anexo.id_req = data.id;
            htm += "" + ((index % 4 == 0) ? "<tr>" : "") + "<td><div class='wsfinan_anexo_item'><center><pre>Nome: " + anexo.name + "\nData: " + formatTime(anexo.createdIn) + "</pre></center><center><img class='wsfinan_edt_img_thumb' onclick='ClientEvents.emit(\"WSFinan/requisicao/anexo/edt\"," + JSON.stringify(anexo) + ")' alt='' src='./module/WSFinan/img/" + anexo.thumb + "'></td>";
        });
        anexosTable.innerHTML += htm;
    }

    let produtosTable = document.getElementById("wsfinan_edt_produtos");
    htm = "<tr class='wsfinan_produto_item1'><td style='width:30px'>Ações:</td><td>Código:</td><td>Nome:</td><td>OBS:</td><td>Quantidade:</td><td>Valor:</td></tr>";

    let total = 0;
    let totalqnt = 0;
    if (data.produtos != undefined) {
        data.produtos.forEach((produto) => {
            if (produto.price == null || produto.price == undefined) {
                produto.price = "0.00";
            }
            if (produto.img == null || produto.img == undefined) {
                produto.img = "./modules/wsfinan/img/file.png";
            }
            total += (produto.qnt * parseFloat(produto.price.replace(",", ".").replace(" ", "")));
            totalqnt += produto.qnt;

            ClientEvents.clear("wsfinan/requisicao/produto/edt/" + produto.id);
            ClientEvents.on("wsfinan/requisicao/produto/edt/" + produto.id, () => {
                ClientEvents.emit("WSFinan/requisicao/produto/edt", produto);
            });
            htm += "<tr class='wsfinan_produto_item1'><td style='width:30px'><input value='Excluir' type='button' onclick='ClientEvents.emit(\"wsfinan/requisicao/produto/del\", {id:" + produto.id + ", id_req:" + data.id + "})'><input type='button' value='Editar' onclick='ClientEvents.emit(\"wsfinan/requisicao/produto/edt/" + produto.id + "\")'></td>" +
                "<td>" + produto.barcode + "</td>" +
                "<td>" + produto.name + "</td>" +
                "<td>" + unclearDesc(produto.obs) + "</td>" +
                "<td>" + produto.qnt + "</td>" +
                "<td>R$ " + produto.price + "</td>";
            htm += "</td></tr>";
        });
    }

    ClientEvents.clear("wsfinan/requisicao/produto/del");
    ClientEvents.on("wsfinan/requisicao/produto/del", (proddata) => {
        if (confirm("Desaja realmente excluir o Produto?")) {
            ClientEvents.emit("SendSocket", "WSFinan/requisicao/produto/del", { id: proddata.id, id_os: proddata.id_req });
        }
    })
    ClientEvents.clear("wsfinan/requisicao/anexo/del");
    ClientEvents.on("wsfinan/requisicao/anexo/del", (proddata) => {
        if (confirm("Desaja realmente excluir o Anexo?")) {
            ClientEvents.emit("SendSocket", "WSFinan/requisicao/anexo/del", { id: proddata.id, id_os: proddata.id_req });
        }
    })

    ClientEvents.clear("wsfinan_reload_price");
    ClientEvents.on("wsfinan_reload_price", () => {

        let price = parseFloat(parseFloat(total)).toFixed(2);
        //document.getElementById("wsfinan_edt_price").innerText = price;
        document.getElementById("wsfinan_edt_total_show").innerText = "R$ " + price;

        //salva o novo preço em caso de alteração
        if (parseFloat(price) != parseFloat(data.description.price)) {
            data.description.price = price;
            console.log(parseFloat(price), parseFloat(data.description.price));
            console.log(parseFloat(price) != parseFloat(data.description.price));
            if (parseFloat(price) != parseFloat(data.description.price)) {
                setTimeout(() => { ClientEvents.emit("wsfinan/requisicao/edt") }, 500);
            }
        }
    })

    htm += "<tr class='wsfinan_produto_item1'><td style='border:none' colspan='2'></td><td><b>Quantidade Total:</td><td><b id='qnttotal'>" + totalqnt + "</td><td><b>SUBTOTAL:</td><td>R$ " + total.toFixed(2) + "</td>"
    htm += "<tr class='wsfinan_produto_item2'><td style='border:none' colspan='4'></td><td><b>TOTAL:</td><td id='wsfinan_edt_total_show'>R$ Calculando</td>";

    htm += "<tr><td style='border:none; padding-top:20px' colspan='5'></td><td><input id='wpma_sites_submit' value='Salvar' type='button' onclick='ClientEvents.emit(\"wsfinan/requisicao/edt\")'></td></tr>";
    produtosTable.innerHTML += htm;


    ClientEvents.clear("WSFinan/requisicao/fileuploaded");
    ClientEvents.on("WSFinan/requisicao/fileuploaded", () => {
        ClientEvents.emit("WSFinan_Requisicao_filtertable");
        ClientEvents.emit("SendSocket", "WSFinan/requisicao/edtview", { id: data.id });
    })
    ClientEvents.clear("WSFinan/requisicao/produto/added");
    ClientEvents.on("WSFinan/requisicao/produto/added", () => {
        ClientEvents.emit("WSFinan_Requisicao_filtertable");
        ClientEvents.emit("SendSocket", "WSFinan/requisicao/edtview", { id: data.id });
    })


    ClientEvents.clear("WSFinan/requisicao/anexo/deleted");
    ClientEvents.on("WSFinan/requisicao/anexo/deleted", () => {
        ClientEvents.emit("close_menu", "wsfinan_anexo_div");
        ClientEvents.emit("WSFinan_Requisicao_filtertable");
        ClientEvents.emit("system_mess", { status: "OK", mess: "Anexo Excluido com Exito", time: 1000 });
        ClientEvents.emit("SendSocket", "WSFinan/requisicao/edtview", { id: data.id });
    })

    ClientEvents.clear("WSFinan/requisicao/produto/deleted");
    ClientEvents.on("WSFinan/requisicao/produto/deleted", () => {
        ClientEvents.emit("close_menu", "wsfinan_anexo_div");
        ClientEvents.emit("WSFinan_Requisicao_filtertable");
        ClientEvents.emit("system_mess", { status: "OK", mess: "Produto Excluido com Exito", time: 1000 });
        ClientEvents.emit("SendSocket", "WSFinan/requisicao/edtview", { id: data.id });
    })
    ClientEvents.clear("WSFinan/requisicao/produto/edited");
    ClientEvents.on("WSFinan/requisicao/produto/edited", () => {
        ClientEvents.emit("close_menu", "wsfinan_anexo_div");
        ClientEvents.emit("WSFinan_Requisicao_filtertable");
        ClientEvents.emit("system_mess", { status: "OK", mess: "Produto Editado com Exito", time: 1000 });
        ClientEvents.emit("SendSocket", "WSFinan/requisicao/edtview", { id: data.id });
    })

    if (SUNEDITOR != undefined) {
        const editor = SUNEDITOR.create((document.getElementById('wsfinan_edt_description') || 'wsfinan_edt_description'), {
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
        editor.onChange = function (contents, core) { document.getElementById("wsfinan_edt_description").innerHTML = contents; }
        const editor1 = SUNEDITOR.create((document.getElementById('wsfinan_edt_description_produto') || 'wsfinan_edt_description_produto'), {
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
        editor1.onChange = function (contents, core) { document.getElementById("wsfinan_edt_description_produto").innerHTML = contents; }
    }
    ClientEvents.emit("wsfinan_reload_price");
});


ClientEvents.on("wsfinan/requisicao/edt", () => {
    if (document.getElementById("wsfinan_edt_id") != undefined) {
        ClientEvents.emit("SendSocket", "WSFinan/requisicao/edt", {
            id_myself: Myself.id,
            id: document.getElementById("wsfinan_edt_id").value,
            name: document.getElementById("wsfinan_edt_name").value,
            description: JSON.stringify({
                description: clearDesc(document.getElementById("wsfinan_edt_description").innerHTML),
                price: document.getElementById("wsfinan_edt_total_show").innerText
            }),
            active: document.getElementById("wsfinan_edt_active").checked
        });
    }
})


ClientEvents.on("wsfinan/requisicao/uploadIMG", (id) => {
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("multiple", "multiple");
    input.onchange = (ev) => {
        if (input.files && input.files[0]) {
            for (let i = 0; i < input.files.length; i++) {
                var sender = new FileReader();
                let ext = input.files[i].name.substring(input.files[i].name.lastIndexOf("."));
                let name = input.files[i].name.substring(0, input.files[i].name.lastIndexOf("."));

                let tr = document.createElement("tr");
                tr.innerHTML = "<td><div class='wsfinan_anexo_item'><input value='Excluir' type='button' ><img class='wsfinan_edt_img_thumb' alt='' src='./module/WSFinan/img/loading.gif'><div></td>";
                document.getElementById("wsfinan_edt_anexos").appendChild(tr);

                sender.onload = function (e) {
                    ClientEvents.emit("SendSocket", "WSFinan/requisicao/file", {
                        id_myself: Myself.id, name: name, ext: ext, stream: e.target.result, id: id
                    })
                };
                sender.readAsArrayBuffer(input.files[i]);
            }
        }
    }
    input.click();
})

ClientEvents.on("wsfinan/requisicao/produto/add", () => {
    let data = {
        id_myself: Myself.id,
        id: document.getElementById("wsfinan_edt_produto").value | "",
        id_req: document.getElementById("wsfinan_edt_id").value | "",
        qnt: document.getElementById("wsfinan_edt_qnt_produto").value | "",
        price: document.getElementById("wsfinan_edt_price_produto").value | "",
        obs: clearDesc(document.getElementById("wsfinan_edt_description_produto").innerHTML)
    }
    ClientEvents.emit("SendSocket", "WSFinan/requisicao/produto/add", data)
})

//Lista de produtos Autocomplete
ClientEvents.on("wsfinan/requisicao/produtos/lst", (arr) => {

    if (arr.length > 0) {
        document.getElementById("wsfinan_searchbot").value = "Buscar";
        document.getElementById("wsfinan_searchbot").disabled = false;
    } else {
        setTimeout(() => {
            document.getElementById("wsfinan_searchbot").value = "Buscar";
            document.getElementById("wsfinan_searchbot").disabled = false;
        }, 500);
    }

    let inp = document.getElementById("prodsearchlist");
    let val = document.getElementById("wsfinan_edt_produto");

    if (inp == undefined) return;
    inp.innerHTML = "";
    let htm = ""

    arr.forEach(item => {
        let name = item.name + " | " + item.description + "";
        let namehtml = ((name).replace(new RegExp((val.value).toLowerCase(), "g"), "<strong>" + val.value.toUpperCase() + "</strong>"));
        namehtml = ((namehtml).replace(new RegExp((val.value).toUpperCase(), "g"), "<strong>" + val.value.toUpperCase() + "</strong>"));
        namehtml = ((namehtml).replace(new RegExp(("<strong></strong>"), "g"), ""));
        htm += "<option value='" + item.id + "'>" + namehtml + "</option>";
    })
    inp.innerHTML = htm;
});