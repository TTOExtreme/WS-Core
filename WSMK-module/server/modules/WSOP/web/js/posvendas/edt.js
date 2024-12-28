//<input type="color" id="html5colorpicker" onchange="clickColor(0, -1, -1, 5)" value="#ff0000" style="width:85%;">

ClientEvents.on("WSOP/posvendas/edt", (data) => {
    ClientEvents.emit("close_menu", 'wsop_posvendas_edt_div')
    if (data == undefined) { return; }
    try {
        data[0].description = JSON.parse(JSON.parse(JSON.stringify(data[0].description)))
    } catch (err) {
        data[0].description = "";
    }
    data = data[0];
    /**
     * create Show Page for user info
     */

    function unclearDesc(desc) {
        return desc.replace(new RegExp("&qt;", "g"), "\"").replace(new RegExp("&quot;", "g"), "=")
            .replace(new RegExp("&eq;", "g"), "=").replace(new RegExp("&eql;", "g"), "=")
            .replace(new RegExp("&gt;", "g"), ">").replace(new RegExp("&get;", "g"), ">")
            .replace(new RegExp("&lt;", "g"), ">").replace(new RegExp("&let;", "g"), "<")
            .replace(new RegExp("&space;", "g"), " ");
    }

    function clearDesc(desc) {
        return desc.replace(new RegExp("\"", "g"), "&qt;").replace(new RegExp("&quot;", "g"), "&qt;")
            .replace(new RegExp("=", "g"), "&eql;").replace(new RegExp("&eq;", "g"), "&eql;")
            .replace(new RegExp(">", "g"), "&get;").replace(new RegExp("&gt;", "g"), "&get;")
            .replace(new RegExp("<", "g"), "&let;").replace(new RegExp("&lt;", "g"), "&let;")
            .replace(new RegExp(" ", "g"), "&space;")
    }
    let div = document.createElement("div");
    div.setAttribute("class", "WSOP_posvendas_div menu_dragger");
    div.setAttribute("id", "wsop_posvendas_edt_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wsop_posvendas_edt' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsop_posvendas_edt_div')>&#9776;</td><td class='wsop_posvendas_edt_label'><p class='WSOP_posvendas_closeButton' onclick=ClientEvents.emit(\"close_menu\",'wsop_posvendas_edt_div')>X</p></td></tr>" +
        "<tr><td class='wsop_posvendas_edt_label'>ID:</td><td><input id='wsop_posvendas_edt_id' type='text' disabled value='" + data.id + "'></td></tr>" +
        "<tr><td class='wsop_posvendas_edt_label'>Cliente:</td><td><input id='wsop_posvendas_edt_name' type='text' value='" + unclearDesc(data.title) + "'></td></tr>" +
        "<tr><td class='wsop_posvendas_edt_label'>Descrição:</td><td><textarea id='wsop_posvendas_edt_description'class='sun-editor-editable'>" + unclearDesc(data.description.description) + "</textarea></td></tr>" +
        "<tr><td class='wsop_posvendas_edt_label'>Data:</td><td><input id='wsop_posvendas_edt_start' type='date' value='" + formatTimeAMD(data.description.start) + "'></td></tr>" +
        "<tr><td class='wsop_posvendas_edt_label'>Vendedor:</td><td><input id='wsop_posvendas_edt_vendedor' type='text' value='" + data.description.vendedor + "'></td></tr>" +
        "<tr><td class='wsop_posvendas_edt_label'>Telefone:</td><td><input id='wsop_posvendas_edt_tel' type='text' value='" + data.description.tel + "'></td></tr>" +
        "<tr style='display:none'><td class='wsop_posvendas_edt_label'>Fim:</td><td><input id='wsop_posvendas_edt_end' type='date' value='" + formatTimeAMD(data.description.end) + "'></td></tr>" +
        "<tr style='display:none'><td class='wsop_posvendas_edt_label'>Cor Fundo:</td><td><input id='wsop_posvendas_edt_bgcolor' type='color' value='" + data.description.bgcolor + "'></td></tr>" +
        "<tr style='display:none'><td class='wsop_posvendas_edt_label'>Cor Contorno:</td><td><input id='wsop_posvendas_edt_color' type='color' value='" + data.description.color + "'></td></tr>" +
        "<tr><td class='wsop_posvendas_edt_label'>Pendente:</td><td><input id='wsop_posvendas_edt_pendente' type='checkbox' " + ((data.description.pendente == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td class='wsop_posvendas_edt_label'>Ativo:</td><td><input id='wsop_posvendas_edt_active' type='checkbox' " + ((data.active == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td colspan=2 class='wsop_posvendas_edt_label_info' id='wsop_posvendas_edt_info'></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Editar' type='button' onclick='ClientEvents.emit(\"WSOP/posvendas/edtsave\")'></td></tr>" +
        "</table>";
    document.body.appendChild(div);

    ClientEvents.clear('system/posvendas/edited');
    ClientEvents.on("system/posvendas/edited", () => {
        ClientEvents.emit("system_mess", { status: "OK", mess: "Evento salvo", time: 1000 });
        ClientEvents.emit("SendSocket", "WSOP/posvendas/lst")
        if (data.reloadMulti) {
            ClientEvents.emit("close_menu", 'wsop_posvendas_edt_div');
            ClientEvents.emit("SendSocket", "WSOP/posvendas/lstids", JSON.stringify({ start: data.description.start }));
        } else {
            ClientEvents.emit("SendSocket", "WSOP/posvendas/lstid", { id: data.id });
        }
        ClientEvents.emit("close_menu", 'wsop_posvendas_edt_div');
        ClientEvents.emit("SendSocket", "WSOP/posvendas/lst", { thisMonth: new Date(data.description.start).getMonth(), thisYear: new Date(data.description.start).getFullYear() })
    });

    ClientEvents.clear('system/posvendas/added');
    ClientEvents.on("system/posvendas/added", (newdata) => {
        ClientEvents.emit("system_mess", { status: "OK", mess: "Evento Criado", time: 1000 });
        ClientEvents.emit("SendSocket", "WSOP/posvendas/lstid")
        if (data.reloadMulti) {
            ClientEvents.emit("close_menu", 'wsop_posvendas_edt_div');
            ClientEvents.emit("SendSocket", "WSOP/posvendas/lstids", JSON.stringify({ start: data.description.start }));
        } else {
            ClientEvents.emit("SendSocket", "WSOP/posvendas/lstid", { id: newdata.id });
        }
        ClientEvents.emit("close_menu", 'wsop_posvendas_edt_div');
        ClientEvents.emit("SendSocket", "WSOP/posvendas/lst", { thisMonth: new Date(data.description.start).getMonth(), thisYear: new Date(data.description.start).getFullYear() })
    });

    const editor = SUNEDITOR.create((document.getElementById('wsop_posvendas_edt_description') || 'wsop_posvendas_edt_description'), {
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
    editor.onChange = function (contents, core) { document.getElementById("wsop_posvendas_edt_description").innerHTML = contents; }
    ClientEvents.clear("WSOP/posvendas/edtsave");
    ClientEvents.on("WSOP/posvendas/edtsave", () => {
        if (document.getElementById("wsop_posvendas_edt_id").value != '0') {
            ClientEvents.emit("SendSocket", "WSOP/posvendas/edt", {
                id: document.getElementById("wsop_posvendas_edt_id").value,
                title: clearDesc(document.getElementById("wsop_posvendas_edt_name").value),
                description: JSON.stringify({
                    description: clearDesc(document.getElementById("wsop_posvendas_edt_description").value),
                    color: document.getElementById("wsop_posvendas_edt_color").value,
                    bgcolor: document.getElementById("wsop_posvendas_edt_bgcolor").value,
                    vendedor: document.getElementById("wsop_posvendas_edt_vendedor").value,
                    tel: document.getElementById("wsop_posvendas_edt_tel").value,
                    start: new Date(document.getElementById("wsop_posvendas_edt_start").value).getTime() + (12 * 3600 * 1000),
                    end: new Date(document.getElementById("wsop_posvendas_edt_end").value).getTime() + (12 * 3600 * 1000),
                    pendente: document.getElementById("wsop_posvendas_edt_pendente").checked,
                }),
                active: document.getElementById("wsop_posvendas_edt_active").checked,
            });
        } else {
            ClientEvents.emit("SendSocket", "WSOP/posvendas/add", {
                title: clearDesc(document.getElementById("wsop_posvendas_edt_name").value),
                description: JSON.stringify({
                    description: clearDesc(document.getElementById("wsop_posvendas_edt_description").value),
                    color: document.getElementById("wsop_posvendas_edt_color").value,
                    bgcolor: document.getElementById("wsop_posvendas_edt_bgcolor").value,
                    vendedor: document.getElementById("wsop_posvendas_edt_vendedor").value,
                    tel: document.getElementById("wsop_posvendas_edt_tel").value,
                    start: new Date(document.getElementById("wsop_posvendas_edt_start").value).getTime() + (12 * 3600 * 1000),
                    end: new Date(document.getElementById("wsop_posvendas_edt_end").value).getTime() + (12 * 3600 * 1000),
                    pendente: document.getElementById("wsop_posvendas_edt_pendente").checked,
                }),
                active: document.getElementById("wsop_posvendas_edt_active").checked,
            });
        }
    })


});
ClientEvents.emit("SendSocket", "WSOP/posvendas/lst");