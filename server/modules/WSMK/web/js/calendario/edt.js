//<input type="color" id="html5colorpicker" onchange="clickColor(0, -1, -1, 5)" value="#ff0000" style="width:85%;">

ClientEvents.on("WSMK/calendario/edt", (data) => {
    ClientEvents.emit("close_menu", 'wsmk_edt_div')
    console.log(data);
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
        "<tr><td class='wsmk_edt_label'>Descrição:</td><td><input id='wsmk_edt_description' type='text' value='" + data.description.description + "'></td></tr>" +
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
    ClientEvents.on("system/calendario/edited", () => {
        ClientEvents.emit("system_mess", { status: "OK", mess: "Evento salvo", time: 1000 });
        ClientEvents.emit("SendSocket", "WSMK/calendario/lst")
        if (data.reloadMulti) {
            ClientEvents.emit("close_menu", 'wsmk_edt_div');
            ClientEvents.emit("SendSocket", "WSMK/calendario/lstids", JSON.stringify({ start: data.description.start }));
        } else {
            ClientEvents.emit("SendSocket", "WSMK/calendario/lstid", JSON.stringify(data));
        }
    });

    ClientEvents.clear('system/calendario/added');
    ClientEvents.on("system/calendario/added", () => {
        ClientEvents.emit("system_mess", { status: "OK", mess: "Evento Criado", time: 1000 });
        ClientEvents.emit("SendSocket", "WSMK/calendario/lstid")
        if (data.reloadMulti) {
            ClientEvents.emit("close_menu", 'wsmk_edt_div');
            ClientEvents.emit("SendSocket", "WSMK/calendario/lstids", JSON.stringify({ start: data.description.start }));
        } else {
            ClientEvents.emit("SendSocket", "WSMK/calendario/lstid", JSON.stringify(data));
        }
    });

});

ClientEvents.on("wsmk/calendario/edt", () => {
    if (document.getElementById("wsmk_edt_id").value != 0) {
        ClientEvents.emit("SendSocket", "WSMK/calendario/edt", {
            id: document.getElementById("wsmk_edt_id").value,
            title: document.getElementById("wsmk_edt_name").value,
            description: JSON.stringify({
                description: document.getElementById("wsmk_edt_description").value,
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
                description: document.getElementById("wsmk_edt_description").value,
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
    console.log("upload")
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