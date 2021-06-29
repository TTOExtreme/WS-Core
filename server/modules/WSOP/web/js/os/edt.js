
ClientEvents.on("wsop/os/edt", (data) => {
    ClientEvents.emit("close_menu", 'wsop_edt_div');
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsop_edt_div  menu_dragger");
    div.setAttribute("id", "wsop_edt_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr class='menu_header'><td id='move_menu_wsop_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsop_edt_div')>&#9776;</td><td class='wsop_edt_label' colspan=3><p class='wsop_add_closeButton' onclick=ClientEvents.emit(\"close_menu\",'wsop_edt_div')>X</p></td></tr>" +
        "<tr><td class='wsop_edt_label'>ID:</td><td><input id='wsop_edt_id' type='text' disabled value='" + data.id + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Cliente:</td><td><input id='wsop_edt_cliente' type='text' disabled value='" + data.cliente + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Descrição:</td><td><textarea id='wsop_edt_description'class='sun-editor-editable'>" + unclearDesc(data.description) + "</textarea></td></tr>" +
        "<tr><td class='wsop_edt_label'>Status:</td><td><Select id='wsop_edt_status' disabled>" + new window.Modules.WSOP.StatusID().StatusIdToOptList(data.status) + "</select></td></tr>" +
        "<tr><td class='wsop_edt_label'>Prazo:</td><td><Select id='wsop_edt_prazo'>" + new window.Modules.WSOP.TimeCalc().prazosIdToOptList(data.prazo) + "</select></td></tr>" +
        "<tr><td class='wsop_edt_label'>Data Entrega:</td><td><input type='date' id='wsop_edt_endingIn' value='" + formatTimeAMD(data.endingIn) + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Forma Envio:</td><td><Select id='wsop_edt_formaEnvio' onChange='ClientEvents.emit(\"wsop_changeBoxSize\")'>" + new window.Modules.WSOP.formaEnvio().envioToOptList(data.formaEnvio) + "</select></td></tr>" +
        "<tr style='display:none'><td class='wsop_edt_label'>Pais:</td><td><Select id='wsop_edt_formaEnvio_country' onChange='ClientEvents.emit(\"wsop_changeBoxSize\")'>" + new window.Modules.WSOP.formaEnvio().envioToOptListCountry(data.C_country) + "</select></td></tr>" +
        "<tr style='display:none'><td class='wsop_edt_label'>Estado:</td><td><Select id='wsop_edt_formaEnvio_uf' onChange='ClientEvents.emit(\"wsop_changeBoxSize\")'>" + new window.Modules.WSOP.formaEnvio().envioToOptListEstado(data.C_uf) + "</select></td></tr>" +
        "<tr><td class='wsop_edt_label'>Caixa:</td><td><Select id='wsop_edt_formaEnvio_caixa' onChange='ClientEvents.emit(\"wsop_changeBoxSize\")'>" + new window.Modules.WSOP.formaEnvio().envioToOptListCaixa(data.caixa) + "</select><sizecaixa id='wsop_edt_formaEnvio_size'>" + new window.Modules.WSOP.formaEnvio().getSizeCaixa(data.caixa) + "</td></tr>" +
        "<tr><td class='wsop_edt_label'>Ativo:</td><td><input id='wsop_edt_active' type='checkbox' " + ((data.active == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td class='wsop_edt_label'>Cod. Rastreio:</td><td><input id='wsop_edt_rastreio' type='text' value='" + (data.rastreio || "") + "'></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Salvar' type='button' onclick='ClientEvents.emit(\"WSOP/os/edt\")'></td></tr>" +
        "</table><hr>" +
        "<table style=''><tbody id='wsop_edt_anexos' class='wsop_edt_anexos'>" +
        "<tr><td colspan=5><p class='wsop_edt_label' style='float:left; padding:0;margin:0;'>Anexos:</p><input id='wsop_edt_img' style='float:right' type='button' value='Adicionar' onclick='ClientEvents.emit(\"wsop/os/uploadIMG\",\"" + data.id + "\")'></td></tr>" +
        "</table><hr>" +
        "<table style='; border-collapse:collapse'><tbody id='wsop_edt_produtos' class='wsop_edt_produtos'>" +
        "<tr><td class='wsop_edt_label' style='float:left'>Produtos:</td><td></td></tr>" +
        "<tr><td colspan=5>" +
        "<input id='wsop_searchbot' type='button' onclick='ClientEvents.emit(\"searchprod\")' value='Buscar'></input>" +
        "<input id='wsop_edt_produto' placeholder='Produto' type='text' list='prodsearchlist'></input><datalist id='prodsearchlist'></datalist>" +
        "<input id='wsop_edt_id_produto' style='display:none' type='text'></input>" +
        "<input id='wsop_edt_qnt_produto' placeholder='Quantidade' type='text'></input>" +
        "<input type='button' value='Adicionar' onClick='ClientEvents.emit(\"wsop/os/produto/add\")'></input>" +
        "<input type='button' value='Novo Produto' onclick='ClientEvents.emit(\"WSOP/produtos/add\")'></input></td></tr>" +
        "<tr><td colspan=5><textarea id='wsop_edt_description_produto'class='sun-editor-editable'></textarea></td></tr>" +
        "<tr><td colspan=5 style='height:20px'>  </td></tr>" +
        "</table>";

    document.body.appendChild(div);

    ClientEvents.on("searchprod", () => {
        if (document.getElementById("wsop_edt_produto") != undefined) {
            document.getElementById("wsop_searchbot").value = "Buscando...";
            document.getElementById("wsop_searchbot").disabled = true;
            ClientEvents.emit("SendSocket", "wsop/os/produtos/lst", { barcode: document.getElementById("wsop_edt_produto").value });
        }
    })
    ClientEvents.on("wsop_changeBoxSize", () => {
        document.getElementById("wsop_edt_formaEnvio_size").innerHTML = new window.Modules.WSOP.formaEnvio().getSizeCaixa(document.getElementById("wsop_edt_formaEnvio_caixa").value)

        let newprEnvio = new window.Modules.WSOP.formaEnvio().getPrice(
            document.getElementById("wsop_edt_formaEnvio_country").value,
            document.getElementById("wsop_edt_formaEnvio_uf").value,
            document.getElementById("wsop_edt_formaEnvio").value,
            document.getElementById("wsop_edt_formaEnvio_caixa").value,
            parseInt(document.getElementById("qnttotal").innerText));

        document.getElementById("wsop_edt_formaEnvio_precoenvio").innerText = newprEnvio;
        let npacotes = new window.Modules.WSOP.formaEnvio().getNCaixas(document.getElementById("wsop_edt_formaEnvio_caixa").value, parseInt(document.getElementById("qnttotal").innerText));
        document.getElementById("wsop_edt_formaEnvio_precoenvio_show").innerText = "R$ " + newprEnvio +
            " (" + npacotes + ((npacotes > 1) ? " Pacotes)" : " Pacote)");

    });

    let anexosTable = document.getElementById("wsop_edt_anexos");
    let htm = "";
    if (data.anexos != undefined) {
        data.anexos.forEach((anexo, index) => {
            anexo.id_os = data.id;
            htm += "" + ((index % 4 == 0) ? "<tr>" : "") + "<td><div class='wsop_anexo_item'><center>" + anexo.name + "</center><center><img class='wsop_edt_img_thumb' onclick='ClientEvents.emit(\"WSOP/os/anexo/edt\"," + JSON.stringify(anexo) + ")' alt='' src='./module/WSOP/img/" + anexo.thumb + "'></td>";
        });
        anexosTable.innerHTML += htm;
    }

    let produtosTable = document.getElementById("wsop_edt_produtos");
    htm = "<tr class='wsop_produto_item1'><td style='width:30px'>Ações:</td><td>Código:</td><td>Item:</td><td>Quantidade:</td><td>Valor:</td></tr>";

    let total = 0;
    let totalqnt = 0;
    if (data.produtos != undefined) {
        data.produtos.forEach((produto) => {
            total += (produto.qnt * parseFloat(produto.price.replace(",", ".").replace(" ", "")));
            totalqnt += produto.qnt;

            ClientEvents.clear("wsop/os/produto/edt/" + produto.id);
            ClientEvents.on("wsop/os/produto/edt/" + produto.id, () => {
                ClientEvents.emit("wsop/os/produto/edt", produto);
            });
            htm += "<tr class='wsop_produto_item1'><td style='width:30px'><input value='Excluir' type='button' onclick='ClientEvents.emit(\"SendSocket\",\"wsop/os/produto/del\", {id:" + produto.id + ", id_os:" + data.id + "})'><input type='button' value='Editar' onclick='ClientEvents.emit(\"wsop/os/produto/edt/" + produto.id + "\")'></td>" +
                "<td>" + produto.barcode + "</td>" +
                "<td>" + produto.name + "</td>" +
                "<td>" + produto.qnt + "</td>" +
                "<td>" + produto.price + " R$</td>" +
                "<tr class='wsop_produto_item2'><td>OBS:</td><td colspan=3>" + unclearDesc(produto.obs) + "</td><td><center><img id='wsop_edt_img_thumb' class='wsop_edt_img_thumb' alt='' src='./module/WSOP/img/" + produto.img.replace(".", "_thumb.") + "' onclick='ClientEvents.emit(\"WSOP/os/anexo/view\"," + JSON.stringify({ name: produto.name, filename: produto.img }) + ")'></td>";
        });
    }

    //Redefine o preco de envio caso ainda esteja aberto a OS
    if (data.status != "finalizado") {
        let newprecoEnvio = new window.Modules.WSOP.formaEnvio().getPrice(data.C_country, data.C_uf, data.formaEnvio, data.caixa, totalqnt);
        if (newprecoEnvio != data.precoEnvio) {
            data.precoEnvio = newprecoEnvio;
            //ClientEvents.on("WSOP/os/edt");
        }
    }

    htm += "<tr class='wsop_produto_item1'><td style='border:none'></td><td><b>Quantidade Total:</td><td><b id='qnttotal'>" + totalqnt + "</td><td><b>SUBTOTAL:</td><td>R$ " + total.toFixed(2) + "</td>"
    htm += "<tr class='wsop_produto_item3'><td style='border:none' colspan='3'></td><td><b>Desconto:</td><td> <select id='wsop_edt_desconto'>" + new window.Modules.WSOP.desconto().descontoToOPTList(parseFloat(data.desconto || 0).toFixed(2), total) + "</select></td>";
    htm += "<tr style='display:none'><td id='wsop_edt_formaEnvio_precoenvio'>" + data.precoEnvio + "</td>";
    htm += "<tr style='display:none'><td id='wsop_edt_price'>" + parseFloat(parseFloat(total - data.desconto) + parseFloat(data.precoEnvio)).toFixed(2) + "</td>";
    htm += "<tr class='wsop_produto_item3'><td style='border:none' colspan='3'></td><td><b>Frete:</td><td id='wsop_edt_formaEnvio_precoenvio_show'>R$ Calculando</td>";
    htm += "<tr class='wsop_produto_item2'><td style='border:none' colspan='3'></td><td><b>TOTAL:</td><td>R$ " + parseFloat(parseFloat(total - data.desconto) + parseFloat(data.precoEnvio)).toFixed(2) + "</td>";

    htm += "<tr><td style='border:none; padding-top:20px' colspan='4'></td><td><input id='wpma_sites_submit' value='Salvar' type='button' onclick='ClientEvents.emit(\"WSOP/os/edt\")'></td></tr>";
    produtosTable.innerHTML += htm;

    if (parseFloat(parseFloat(total - data.desconto) + parseFloat(data.precoEnvio)).toFixed(2) != data.price) {
        setTimeout(() => { ClientEvents.emit("WSOP/os/edt") }, 50);
    }

    ClientEvents.clear("wsop/os/fileuploaded");
    ClientEvents.on("wsop/os/fileuploaded", () => {
        ClientEvents.emit("SendSocket", "wsop/os/lst/edt", { id: data.id });
    })
    ClientEvents.clear("wsop/os/produto/added");
    ClientEvents.on("wsop/os/produto/added", () => {
        ClientEvents.emit("SendSocket", "wsop/os/lst/edt", { id: data.id });
    })
    if (SUNEDITOR != undefined) {
        const editor = SUNEDITOR.create((document.getElementById('wsop_edt_description') || 'wsop_edt_description'), {
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
        editor.onChange = function (contents, core) { document.getElementById("wsop_edt_description").innerHTML = contents; }
        const editor1 = SUNEDITOR.create((document.getElementById('wsop_edt_description_produto') || 'wsop_edt_description_produto'), {
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
        editor1.onChange = function (contents, core) { document.getElementById("wsop_edt_description_produto").innerHTML = contents; }
    }
    ClientEvents.emit("wsop_changeBoxSize");
});


ClientEvents.on("WSOP/os/edt", () => {
    ClientEvents.emit("SendSocket", "wsop/os/edt", {
        id: document.getElementById("wsop_edt_id").value,
        description: clearDesc(document.getElementById("wsop_edt_description").innerHTML),
        prazo: document.getElementById("wsop_edt_prazo").value,
        country: document.getElementById("wsop_edt_formaEnvio_country").value,
        uf: document.getElementById("wsop_edt_formaEnvio_uf").value,
        caixa: document.getElementById("wsop_edt_formaEnvio_caixa").value,
        endingIn: new Date(document.getElementById("wsop_edt_endingIn").value).getTime() + 24 * 3600000, //Adiciona um dia para sanar um bug de salvar um dia para traz
        formaEnvio: document.getElementById("wsop_edt_formaEnvio").value,
        precoEnvio: document.getElementById("wsop_edt_formaEnvio_precoenvio").value,
        desconto: document.getElementById("wsop_edt_desconto").value,
        active: document.getElementById("wsop_edt_active").checked,
        rastreio: document.getElementById("wsop_edt_rastreio").value,
        price: document.getElementById("wsop_edt_price").innerText,
    });
})

ClientEvents.on("WSOP/os/edtproduct", () => {
    ClientEvents.emit("SendSocket", "wsop/os/edtproduct", {
        id: document.getElementById("wsop_edt_id_produto").value | "",
        id_os: document.getElementById("wsop_edt_id").value | "",
        description: clearDesc(document.getElementById("wsop_edt_description").innerHTML),
        status: document.getElementById("wsop_edt_status").value,
        active: document.getElementById("wsop_edt_active").checked,
    });
})

ClientEvents.on("wsop/os/uploadIMG", (id) => {
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.onchange = (ev) => {
        if (input.files && input.files[0]) {
            var sender = new FileReader();
            let ext = input.files[0].name.substring(input.files[0].name.lastIndexOf("."));
            let name = input.files[0].name.substring(0, input.files[0].name.lastIndexOf("."));

            let tr = document.createElement("tr");
            tr.innerHTML = "<td><div class='wsop_anexo_item'><input value='Excluir' type='button' ><img class='wsop_edt_img_thumb' alt='' src='./module/WSOP/img/loading.gif'><div></td>";
            document.getElementById("wsop_edt_anexos").appendChild(tr);

            sender.onload = function (e) {
                ClientEvents.emit("SendSocket", "wsop/os/file", { name: name, ext: ext, stream: e.target.result, id: id })
            };
            sender.readAsArrayBuffer(input.files[0]);
        }
    }
    input.click();
})

ClientEvents.on("wsop/os/produto/add", () => {
    let data = {
        id: document.getElementById("wsop_edt_produto").value | "",
        id_os: document.getElementById("wsop_edt_id").value | "",
        qnt: document.getElementById("wsop_edt_qnt_produto").value | "",
        obs: clearDesc(document.getElementById("wsop_edt_description_produto").innerHTML)
    }
    ClientEvents.emit("SendSocket", "wsop/os/produto/add", data)
})

//Lista de produtos Autocomplete
ClientEvents.on("wsop/os/produtos/lst", (arr) => {

    if (arr.length > 0) {
        document.getElementById("wsop_searchbot").value = "Buscar";
        document.getElementById("wsop_searchbot").disabled = false;
    } else {
        setTimeout(() => {
            document.getElementById("wsop_searchbot").value = "Buscar";
            document.getElementById("wsop_searchbot").disabled = false;
        }, 5000);
    }

    let inp = document.getElementById("prodsearchlist");
    let val = document.getElementById("wsop_edt_produto");

    if (inp == undefined) return;
    inp.innerHTML = "";
    let htm = ""

    arr.forEach(item => {
        let name = item.barcode + " | " + item.name + " | Estoque(" + item.inventory + ")";
        let namehtml = ((name).replace(new RegExp((val.value).toLowerCase(), "g"), "<strong>" + val.value.toUpperCase() + "</strong>"));
        namehtml = ((namehtml).replace(new RegExp((val.value).toUpperCase(), "g"), "<strong>" + val.value.toUpperCase() + "</strong>"));
        htm += "<option value='" + item.id + "'>" + namehtml + "</option>";
    })
    inp.innerHTML = htm;

    /*
    var currentFocus;


    let addActive = (x) => {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }

    let removeActive = (x) => {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    let closeAllLists = (elmnt) => {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    //execute a function when someone writes in the text field
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        let lim = 8;
        for (i = 0; i < arr.length; i++) {
            let name = arr[i].barcode + " | " + arr[i].name + " | Estoque(" + arr[i].inventory + ")";
            ;
            if ((name + "").toLowerCase().indexOf((val + "").toLowerCase()) > -1 && lim > 0) {
                lim--;
                b = document.createElement("DIV");
                b.setAttribute("id", arr[i].id)

                let namehtml = ((name).replace(new RegExp((val).toLowerCase(), "g"), "<strong>" + val.toUpperCase() + "</strong>"));
                namehtml = ((namehtml).replace(new RegExp((val).toUpperCase(), "g"), "<strong>" + val.toUpperCase() + "</strong>"));

                b.innerHTML = namehtml;
                b.innerHTML += "<input type='hidden' value='" + (name + " | Estoque(" + arr[i].inventory + ")") + "'>";
                b.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    document.getElementById("wsop_edt_id_produto").value = this.getAttribute("id");
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });

    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) { //down
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) { //up
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) { //enter
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
    //*/
});