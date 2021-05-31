
ClientEvents.on("wsop/os/edt", (data) => {
    ClientEvents.emit("WSOP/os/edt/close");
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsop_edt_div");
    div.setAttribute("id", "wsop_edt_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr class='menu_header'><td id='move_menu_wsop_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsop_edt_div')>&#9776;</td><td class='wsop_edt_label'><p class='wsop_add_closeButton' onclick='ClientEvents.emit(\"WSOP/os/edt/close\")'>X</p></td></tr>" +
        "<tr><td class='wsop_edt_label'>ID:</td><td><input id='wsop_edt_id' type='text' disabled value='" + data.id + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Cliente:</td><td><input id='wsop_edt_cliente' type='text' disabled value='" + data.cliente + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Descrição:</td><td><textarea id='wsop_edt_description'class='sun-editor-editable'>" + data.description + "</textarea></td></tr>" +
        "<tr><td class='wsop_edt_label'>Status:</td><td><Select id='wsop_edt_status'>" + StatusIdToOptList(data.status) + "</select></td></tr>" +
        "<tr><td class='wsop_edt_label'>Ativo:</td><td><input id='wsop_edt_active' type='checkbox' " + ((data.active == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Editar' type='button' onclick='ClientEvents.emit(\"WSOP/os/edt\")'></td></tr>" +
        "</table><hr>" +
        "<table style='width: calc(100vw - 250px);'><tbody id='wsop_edt_anexos' class='wsop_edt_anexos'>" +
        "<tr><td colspan=4><p class='wsop_edt_label' style='float:left; padding:0;margin:0;'>Anexos:</p><input id='wsop_edt_img' style='float:right' type='button' value='Adicionar' onclick='ClientEvents.emit(\"wsop/os/uploadIMG\",\"" + data.id + "\")'></td></tr>" +
        "</table><hr>" +
        "<table style='width: calc(100vw - 250px);; border-collapse:collapse'><tbody id='wsop_edt_produtos' class='wsop_edt_produtos'>" +
        "<tr><td class='wsop_edt_label' style='float:left'>Produtos:</td><td></td></tr>" +
        "<tr><td colspan=4><input id='wsop_edt_produto' placeholder='Produto' type='text'><input id='wsop_edt_id_produto' style='display:none' type='text'><input id='wsop_edt_qnt_produto' placeholder='Quantidade' type='text'><input type='button' value='Adicionar' onClick='ClientEvents.emit(\"wsop/os/produto/add\")'><input type='button' value='Novo Produto' onclick='ClientEvents.emit(\"WSOP/produtos/add\")'></td></tr>" +
        "<tr><td colspan=4><textarea id='wsop_edt_description_produto'class='sun-editor-editable'></textarea></td></tr>" +
        "<tr><td colspan=4 style='height:20px'>  </td></tr>" +
        "</table>";

    document.body.appendChild(div);

    let anexosTable = document.getElementById("wsop_edt_anexos");
    let htm = "";
    data.anexos.forEach((anexo, index) => {
        htm += "" + ((index % 4 == 0) ? "<tr>" : "") + "<td><div class='wsop_anexo_item'><center>" + anexo.name + "</center><center><img class='wsop_edt_img_thumb' onclick='ClientEvents.emit(\"WSOP/os/anexo/edt\"," + JSON.stringify(anexo) + ")' alt='' src='./module/WSOP/img/" + anexo.thumb + "'></td>";
    });
    anexosTable.innerHTML += htm;

    let produtosTable = document.getElementById("wsop_edt_produtos");
    htm = "<tr class='wsop_produto_item1'><td style='width:30px'>Ações:</td><td>Código:</td><td>Item:</td><td>Quantidade:</td></tr>";
    data.produtos.forEach((produto) => {
        htm += "<tr class='wsop_produto_item1'><td style='width:30px'><input value='Excluir' type='button' onclick='ClientEvents.emit(\"SendSocket\",\"wsop/os/produto/del\", {id:" + produto.id + "})'></td>" +
            "<td>" + produto.barcode + "</td>" +
            "<td>" + produto.name + "</td>" +
            "<td>" + produto.qnt + "</td>" +
            "<tr class='wsop_produto_item2'><td>OBS:</td><td colspan=2>" + (produto.obs).replace(new RegExp("&lt;", "g"), "<").replace(new RegExp("&gt;", "g"), ">") + "</td><td><center><img id='wsop_edt_img_thumb' class='wsop_edt_img_thumb' alt='' src='./module/WSOP/img/" + produto.img.replace(".", "_thumb.") + "' onclick='ClientEvents.emit(\"WSOP/os/anexo/view\"," + JSON.stringify({ name: produto.name, filename: produto.img }) + ")'></td>";
    });
    produtosTable.innerHTML += htm;

    ClientEvents.clear("wsop/os/fileuploaded");
    ClientEvents.on("wsop/os/fileuploaded", () => {
        ClientEvents.emit("SendSocket", "wsop/os/lst/edt", { id: data.id });
    })
    ClientEvents.clear("wsop/os/produto/added");
    ClientEvents.on("wsop/os/produto/added", () => {
        ClientEvents.emit("SendSocket", "wsop/os/lst/edt", { id: data.id });
    })
    const editor = SUNEDITOR.create((document.getElementById('wsop_edt_description') || 'wsop_edt_description'), {
        width: "calc(100vw - 350px)",
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
        width: "calc(100vw - 270px)",
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
    ClientEvents.emit("SendSocket", "wsop/os/produtos/lst");
});

ClientEvents.on("WSOP/os/edt/close", () => {
    if (document.getElementById("wsop_edt_div")) {
        document.body.removeChild(document.getElementById("wsop_edt_div"));
    }
});

ClientEvents.on("WSOP/os/edt", () => {
    ClientEvents.emit("SendSocket", "wsop/os/edt", {
        id: document.getElementById("wsop_edt_id").value,
        description: document.getElementById("wsop_edt_description").innerHTML,
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
        id: document.getElementById("wsop_edt_id_produto").value | "",
        id_os: document.getElementById("wsop_edt_id").value | "",
        qnt: document.getElementById("wsop_edt_qnt_produto").value | "",
        obs: document.getElementById("wsop_edt_description_produto").innerHTML
    }
    ClientEvents.emit("SendSocket", "wsop/os/produto/add", data)
})


ClientEvents.on("wsop/os/produtos/lst", (arr) => {
    let inp = document.getElementById("wsop_edt_produto");
    if (inp == undefined) return;
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

    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        let lim = 4;
        for (i = 0; i < arr.length; i++) {
            let name = arr[i].barcode + " | " + arr[i].name;
            if ((name + "").toLowerCase().indexOf((val + "").toLowerCase()) > -1 && lim > 0) {
                lim--;
                b = document.createElement("DIV");
                b.setAttribute("id", arr[i].id)
                let namehtml = ((arr[i].barcode + "").replace(new RegExp((val + ""), "g"), "<strong>" + (val + "").toUpperCase() + "</strong>")) + " | " + ((arr[i].name + "").replace(new RegExp((val + ""), "g"), "<strong>" + (val + "").toUpperCase() + "</strong>")) + " | Estoque(" + arr[i].inventory + ")";
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
});