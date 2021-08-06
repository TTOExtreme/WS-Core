ClientEvents.on("WSOP/os/add", () => {
    ClientEvents.emit("close_menu");
    let data = {
        cliente: "",
        id_cliente: "",
        description: "",
        status: "orcamento",
        barcode: "",
        cost: "",
        price: "",
        inventory: "",
        active: 1,
        prazo: "",
        formaEnvio: "",
    }

    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsop_add_div menu_dragger");
    div.setAttribute("id", "wsop_add_os_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wsop_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsop_add_os_div')>&#9776;</td><td class='wsop_edt_label'><p class='wsop_add_closeButton' onclick=ClientEvents.emit(\"close_menu\",'wsop_add_os_div')>X</p></td></tr>" +
        "<tr><td class='wsop_edt_label'>Cliente:</td><td><input id='wsop_searchclientbot' type='button' onclick='ClientEvents.emit(\"searchclient\")' value='Buscar'></input><input id='wsop_add_cliente' placeholder='Cliente' type='text' list='clientsearchlist'></input><datalist id='clientsearchlist'></datalist><input type='button' value='Novo Cliente' onclick='ClientEvents.emit(\"WSOP/clientes/add\")'></td></tr>" +
        "<tr style='display:none;'><td class='wsop_edt_label'>Cliente:</td><td><input id='wsop_add_id_cliente' type='text' value='" + data.id_cliente + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Status:</td><td><Select disabled id='wsop_add_status'>" + new window.Modules.WSOP.StatusID().StatusIdToOptList(data.status) + "</select></td></tr>" +
        "<tr><td class='wsop_edt_label'>Prazo:</td><td><Select id='wsop_add_prazo'>" + new window.Modules.WSOP.TimeCalc().prazosIdToOptList(data.prazo) + "</select></td></tr>" +
        "<tr><td class='wsop_edt_label'>FormaEnvio:</td><td><Select id='wsop_add_formaEnvio'>" + new window.Modules.WSOP.formaEnvio().envioToOptList(data.formaEnvio) + "</select></td></tr>" +
        "<tr><td class='wsop_edt_label'>FormaPagamento:</td><td><Select id='wsop_add_formaPagamento'>" + new window.Modules.WSOP.desconto().pagamentoToOPTList(data.formaPagamento) + "</select></td></tr>" +
        "<tr><td class='wsop_edt_label'>Descrição:</td><td><textarea id='wsop_add_description'class='sun-editor-editable'>" + unclearDesc(data.description) + "</textarea></td></tr>" +
        "<tr><td class='wsop_edt_label'>Ativo:</td><td><input disabled id='wsop_add_active' type='checkbox' " + ((data.active == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td colspan=2 class='wsop_edt_label_info' id='wsop_add_info'></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Adicionar' type='button' onclick='ClientEvents.emit(\"WSOP/os/save\")' ></td></tr>" +
        "</table>";

    document.body.appendChild(div);

    const editor = SUNEDITOR.create((document.getElementById('wsop_add_description') || 'wsop_add_description'), {
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
    editor.onChange = function (contents, core) { document.getElementById("wsop_add_description").innerHTML = contents; }
    //ClientEvents.emit("SendSocket", "wsop/os/clientes/lst",{name:""});
});



ClientEvents.on("WSOP/os/save", () => {
    ClientEvents.emit("SendSocket", "wsop/os/add", {
        id_myself: Myself.id,
        id_cliente: document.getElementById("wsop_add_cliente").value,
        description: clearDesc(document.getElementById("wsop_add_description").value),
        active: document.getElementById("wsop_add_active").checked,
        status: document.getElementById("wsop_add_status").value,
        prazo: document.getElementById("wsop_add_prazo").value,
        formaEnvio: document.getElementById("wsop_add_formaEnvio").value,
        formaPagamento: document.getElementById("wsop_add_formaPagamento").value,
        endingIn: new window.Modules.WSOP.TimeCalc().getPrazo(new Date().getTime(), document.getElementById("wsop_add_prazo").value),
    });
})


ClientEvents.on("searchclient", () => {
    if (document.getElementById("wsop_add_cliente") != undefined) {
        document.getElementById("wsop_searchclientbot").value = "Buscando...";
        document.getElementById("wsop_searchclientbot").disabled = true;
        ClientEvents.emit("SendSocket", "WSOP/os/clientes/lst", {
            id_myself: Myself.id, name: document.getElementById("wsop_add_cliente").value
        });
    }
})




//Lista de produtos Autocomplete
ClientEvents.on("wsop/os/clientes/lst", (arr) => {

    if (arr.length > 0) {
        document.getElementById("wsop_searchclientbot").value = "Buscar";
        document.getElementById("wsop_searchclientbot").disabled = false;
    } else {
        setTimeout(() => {
            document.getElementById("wsop_searchclientbot").value = "Buscar";
            document.getElementById("wsop_searchclientbot").disabled = false;
        }, 5000);
    }

    let inp = document.getElementById("clientsearchlist");
    let val = document.getElementById("wsop_add_cliente");

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
