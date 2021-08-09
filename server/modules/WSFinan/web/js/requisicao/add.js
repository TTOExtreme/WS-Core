ClientEvents.on("wsfinan/requisicao/add", () => {
    ClientEvents.emit("close_menu", "wsfinan_add_requisicao_div");
    let data = {
        name: "",
        fornecedor: "",
        id_fornecedor: "",
        description: "",
        status: "orcamento",
        active: 1
    }

    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsfinan_add_div menu_dragger");
    div.setAttribute("id", "wsfinan_add_requisicao_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wsfinan_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsfinan_add_requisicao_div')>&#9776;</td><td class='wsfinan_edt_label'><p class='closeButton' onclick=ClientEvents.emit(\"close_menu\",'wsfinan_add_requisicao_div')>X</p></td></tr>" +
        "<tr><td class='wsfinan_edt_label'>Fornecedor:</td><td><input id='wsfinan_searchclientbot' type='button' onclick='ClientEvents.emit(\"searchfornecedorwsfinan\")' value='Buscar'></input><input id='wsfinan_add_fornecedor' placeholder='Cliente' type='text' list='clientsearchlist'></input><datalist id='clientsearchlist'></datalist><input type='button' value='Novo Cliente' onclick='ClientEvents.emit(\"WSFinan/fornecedor/add\")'></td></tr>" +
        "<tr style='display:none;'><td class='wsfinan_edt_label'>Fornecedor ID:</td><td><input id='wsfinan_add_id_fornecedor' type='text' value='" + data.id_cliente + "'></td></tr>" +
        "<tr><td class='wsfinan_edt_label'>Status:</td><td><Select disabled id='wsfinan_add_status'>" + new window.Modules.WSFinan.StatusID().StatusIdToOptList(data.status) + "</select></td></tr>" +
        "<tr><td class='wsfinan_edt_label'>Nome:</td><td><input id='wsfinan_add_name' type='text' value='" + data.name + "'></td></tr>" +
        "<tr><td class='wsfinan_edt_label'>Descrição:</td><td><textarea id='wsfinan_add_description'class='sun-editor-editable'>" + unclearDesc(data.description) + "</textarea></td></tr>" +
        "<tr><td class='wsfinan_edt_label'>Ativo:</td><td><input disabled id='wsfinan_add_active' type='checkbox' " + ((data.active == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Adicionar' type='button' onclick='ClientEvents.emit(\"WSfinan/requisicao/save\")' ></td></tr>" +
        "</table>";

    document.body.appendChild(div);

    const editor = SUNEDITOR.create((document.getElementById('wsfinan_add_description') || 'wsfinan_add_description'), {
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
    editor.onChange = function (contents, core) { document.getElementById("wsfinan_add_description").innerHTML = contents; }
    //ClientEvents.emit("SendSocket", "wsfinan/requisicao/clientes/lst",{name:""});
});


ClientEvents.on("WSfinan/requisicao/save", () => {
    ClientEvents.emit("SendSocket", "WSFinan/requisicao/add", {
        id_myself: Myself.id,
        id_fornecedor: document.getElementById("wsfinan_add_fornecedor").value,
        name: document.getElementById("wsfinan_add_name").value,
        description: {
            description: clearDesc(document.getElementById("wsfinan_add_description").value)
        },
        active: document.getElementById("wsfinan_add_active").checked,
        status: document.getElementById("wsfinan_add_status").value
    });
})


ClientEvents.on("searchfornecedorwsfinan", () => {
    if (document.getElementById("wsfinan_add_fornecedor") != undefined) {
        document.getElementById("wsfinan_searchclientbot").value = "Buscando...";
        document.getElementById("wsfinan_searchclientbot").disabled = true;
        ClientEvents.emit("SendSocket", "WSfinan/requisicao/fornecedor/lst", {
            id_myself: Myself.id, name: document.getElementById("wsfinan_add_fornecedor").value
        });
        setTimeout(() => {
            document.getElementById("wsfinan_searchclientbot").value = "Buscar";
            document.getElementById("wsfinan_searchclientbot").disabled = false;
        }, 5000);
    }
})




//Lista de produtos Autocomplete
ClientEvents.on("wsfinan/requisicao/fornecedor/lst", (arr) => {


    document.getElementById("wsfinan_searchclientbot").value = "Buscar";
    document.getElementById("wsfinan_searchclientbot").disabled = false;

    let inp = document.getElementById("fornecedorsearchlist");
    let val = document.getElementById("wsfinan_add_fornecedor");

    if (inp == undefined) return;
    inp.innerHTML = "";
    let htm = ""

    arr.forEach(item => {
        let name = item.name + " | " + item.responsavel;
        let namehtml = ((name).replace(new RegExp((val.value).toLowerCase(), "g"), "<strong>" + val.value.toUpperCase() + "</strong>"));
        namehtml = ((namehtml).replace(new RegExp((val.value).toUpperCase(), "g"), "<strong>" + val.value.toUpperCase() + "</strong>"));
        namehtml = ((namehtml).replace(new RegExp(("<strong></strong>"), "g"), ""));
        htm += "<option value='" + item.id + "'>" + namehtml + "</option>";
    })
    inp.innerHTML = htm;
    inp.focus();
});
