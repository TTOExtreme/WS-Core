//<input type="color" id="html5colorpicker" onchange="clickColor(0, -1, -1, 5)" value="#ff0000" style="width:85%;">

ClientEvents.on("WSMK/calendario/edt", (data) => {
    ClientEvents.emit("close_menu", 'wsmk_edt_div')
    try {
        data[0].description = JSON.parse(JSON.parse(JSON.stringify(data[0].description)))
    } catch (err) {
        data[0].description = "";
    }
    data = data[0];
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsmk_calendario_div menu_dragger");
    div.setAttribute("id", "wsmk_edt_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wsmk_edt' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsmk_edt_div')>&#9776;</td><td class='wsmk_edt_label'><p class='wsmk_calendario_closeButton' onclick=ClientEvents.emit(\"close_menu\",'wsmk_edt_div')>X</p></td></tr>" +
        "<tr><td class='wsmk_edt_label'>ID:</td><td><input id='wsmk_edt_id' type='text' disabled value='" + data.id + "'></td></tr>" +
        "<tr><td class='wsmk_edt_label'>Titulo:</td><td><input id='wsmk_edt_name' type='text' value='" + data.title + "'></td></tr>" +
        "<tr><td class='wsmk_edt_label'>Descrição:</td><td><textarea id='wsmk_edt_description'class='sun-editor-editable'>" + unclearDesc(data.description.description) + "</textarea></td></tr>" +
        "<tr><td class='wsmk_edt_label'>Inicio:</td><td><input id='wsmk_edt_start' type='date' value='" + formatTimeAMD(data.description.start) + "'></td></tr>" +
        "<tr style='display:none'><td class='wsmk_edt_label'>Fim:</td><td><input id='wsmk_edt_end' type='date' value='" + formatTimeAMD(data.description.end) + "'></td></tr>" +
        "<tr><td class='wsmk_edt_label'>Cor Fundo:</td><td><input id='wsmk_edt_bgcolor' type='color' value='" + data.description.bgcolor + "'></td></tr>" +
        "<tr><td class='wsmk_edt_label'>Cor Contorno:</td><td><input id='wsmk_edt_color' type='color' value='" + data.description.color + "'></td></tr>" +

        "<tr><td class='wsmk_edt_label'>Imagem:</td><td><img id='wsmk_edt_img_thumb' class='wsmk_edt_img_thumb' alt='' src='./module/WSMK/img/" + data.img.replace(".", "_thumb.") + "' loc='" + data.img + "'></td></tr>" +
        "<tr><td class='wsmk_edt_label'></td><td><input id='wsmk_edt_img' type='file' onchange='ClientEvents.emit(\"uploadIMG\")'></td></tr>" +
        "<tr><td class='wsmk_edt_label'>Ativo:</td><td><input id='wsmk_edt_active' type='checkbox' " + ((data.active == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td colspan=2 class='wsmk_edt_label_info' id='wsmk_edt_info'></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Editar' type='button' onclick='ClientEvents.emit(\"wsmk/calendario/edt\")'></td></tr>" +
        "</table>";
    document.body.appendChild(div);

    ClientEvents.clear('system/calendario/edited');
    ClientEvents.on("system/calendario/edited", (newdata) => {
        ClientEvents.emit("system_mess", { status: "OK", mess: "Evento salvo", time: 1000 });
        ClientEvents.emit("SendSocket", "WSMK/calendario/lst")
        if (data.reloadMulti) {
            ClientEvents.emit("SendSocket", "WSMK/calendario/lstids", JSON.stringify({ start: data.description.start }));
        } else {
            ClientEvents.emit("SendSocket", "WSMK/calendario/lstid", JSON.stringify(data));
        }
        ClientEvents.emit("close_menu", 'wsmk_edt_div');
        ClientEvents.emit("SendSocket", "WSMK/calendario/lst", { thisMonth: new Date(data.description.start).getMonth(), thisYear: new Date(data.description.start).getFullYear() })
    });

    ClientEvents.clear('system/calendario/added');
    ClientEvents.on("system/calendario/added", (newdata) => {
        ClientEvents.emit("system_mess", { status: "OK", mess: "Evento Criado", time: 1000 });
        ClientEvents.emit("SendSocket", "WSMK/calendario/lstid")
        if (data.reloadMulti) {
            ClientEvents.emit("SendSocket", "WSMK/calendario/lstids", JSON.stringify({ start: data.description.start }));
        } else {
            ClientEvents.emit("SendSocket", "WSMK/calendario/lstid", { id: newdata.id });
        }
        ClientEvents.emit("close_menu", 'wsmk_edt_div');
        ClientEvents.emit("SendSocket", "WSMK/calendario/lst", { thisMonth: new Date(data.description.start).getMonth(), thisYear: new Date(data.description.start).getFullYear() })
    });

    const editor = SUNEDITOR.create((document.getElementById('wsmk_edt_description') || 'wsmk_edt_description'), {
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
    editor.onChange = function (contents, core) { document.getElementById("wsmk_edt_description").innerHTML = contents; }

});

ClientEvents.on("wsmk/calendario/edt", () => {
    if (document.getElementById("wsmk_edt_id").value != 0) {
        ClientEvents.emit("SendSocket", "WSMK/calendario/edt", {
            id: document.getElementById("wsmk_edt_id").value,
            title: document.getElementById("wsmk_edt_name").value,
            description: JSON.stringify({
                description: clearDesc(document.getElementById("wsmk_edt_description").value),
                color: document.getElementById("wsmk_edt_color").value,
                bgcolor: document.getElementById("wsmk_edt_bgcolor").value,
                start: new Date(document.getElementById("wsmk_edt_start").value).getTime() + (12 * 3600 * 1000),
                end: new Date(document.getElementById("wsmk_edt_end").value).getTime() + (12 * 3600 * 1000),
            }),
            img: document.getElementById("wsmk_edt_img_thumb").getAttribute("loc"),
            active: document.getElementById("wsmk_edt_active").checked,
        });
    } else {
        ClientEvents.emit("SendSocket", "WSMK/calendario/add", {
            title: document.getElementById("wsmk_edt_name").value,
            description: JSON.stringify({
                description: clearDesc(document.getElementById("wsmk_edt_description").value),
                color: document.getElementById("wsmk_edt_color").value,
                bgcolor: document.getElementById("wsmk_edt_bgcolor").value,
                start: new Date(document.getElementById("wsmk_edt_start").value).getTime() + (12 * 3600 * 1000),
                end: new Date(document.getElementById("wsmk_edt_end").value).getTime() + (12 * 3600 * 1000),
            }),
            img: document.getElementById("wsmk_edt_img_thumb").getAttribute("loc"),
            active: document.getElementById("wsmk_edt_active").checked,
        });
    }
})


ClientEvents.emit("SendSocket", "WSMK/calendario/lst");


ClientEvents.on("uploadIMG", () => {
    if (document.getElementById("wsmk_edt_img")) {
        let input = document.getElementById("wsmk_edt_img");
        if (input.files && input.files[0]) {
            var sender = new FileReader();
            let ext = input.files[0].name.substring(input.files[0].name.lastIndexOf("."));
            let name = input.files[0].name.substring(0, input.files[0].name.lastIndexOf("."));

            let img = document.getElementById("wsmk_edt_img_thumb")
            img.setAttribute('src', "./module/WSMK/img/loading.gif")
            sender.onload = function (e) {
                ClientEvents.emit("SendSocket", "WSMK/calendario/file", { name: name, ext: ext, stream: e.target.result })
            };

            sender.readAsArrayBuffer(input.files[0]);
        }
    }
})
ClientEvents.on("WSMK/calendario/fileuploaded", (data) => {
    let img = document.getElementById("wsmk_edt_img_thumb")
    img.setAttribute('src', "./module/WSMK/img/" + data.file)
    img.setAttribute('loc', data.file)
})