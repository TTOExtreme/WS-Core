
ClientEvents.on("wsop/os/edt", (data) => {
    ClientEvents.emit("WSOP/os/close");
    console.log(data)
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsop_add_div");
    div.setAttribute("id", "wsop_add_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wsop_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsop_add_div')>&#9776;</td><td class='wsop_edt_label'><p class='wsop_add_closeButton' onclick='ClientEvents.emit(\"WSOP/os/close\")'>X</p></td></tr>" +
        "<tr><td class='wsop_edt_label'>ID:</td><td><input id='wsop_add_id' type='text' disabled value='" + data.id + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Cliente:</td><td><input id='wsop_add_cliente' type='text' disabled value='" + data.cliente + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Descrição:</td><td><input id='wsop_add_description' type='text' value='" + data.description + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Status:</td><td><Select id='wsop_add_status'>" + StatusIdToOptList(data.status) + "</select></td></tr>" +
        "<tr><td class='wsop_edt_label'>Ativo:</td><td><input id='wsop_add_active' type='checkbox' " + ((data.active == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td colspan=2 class='wsop_edt_label_info' id='wsop_add_info'></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Editar' type='button' onclick='ClientEvents.emit(\"WSOP/os/edt\")'></td></tr>" +
        "</table>" +
        "<table id='wsop_edt_anexos'>" +
        "<tr><td class='wsop_edt_label'>Imagem:</td><td><img id='wsop_add_img_thumb' class='wsop_add_img_thumb' alt='' src='" + data.img + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'></td><td><input id='wsop_add_img' type='file' onchange='ClientEvents.emit(\"wsop/os/uploadIMG\",\"" + data.id + "\")'></td></tr>" +
        "</table>";

    document.body.appendChild(div);
});

ClientEvents.on("WSOP/os/edt", () => {
    ClientEvents.emit("SendSocket", "wsop/os/edt", {
        id: document.getElementById("wsop_add_id").value,
        description: document.getElementById("wsop_add_description").value,
        status: document.getElementById("wsop_add_status").value,
        img: document.getElementById("wsop_add_img_thumb").src,
        active: document.getElementById("wsop_add_active").checked,
    });
})


ClientEvents.on("wsop/os/uploadIMG", (id) => {
    if (document.getElementById("wsop_add_img")) {
        let input = document.getElementById("wsop_add_img");
        if (input.files && input.files[0]) {
            var sender = new FileReader();
            let ext = input.files[0].name.substring(input.files[0].name.lastIndexOf("."));

            let img = document.getElementById("wsop_add_img_thumb")
            img.setAttribute('src', "./module/WSOP/img/loading.gif")
            sender.onload = function (e) {
                ClientEvents.emit("SendSocket", "wsop/os/file", { ext: ext, stream: e.target.result, id: id })
            };

            sender.readAsArrayBuffer(input.files[0]);
        }
    }
})

ClientEvents.on("wsop/os/fileuploaded", (data) => {
    let img = document.getElementById("wsop_add_img_thumb")
    img.setAttribute('src', data.file)
    img.setAttribute("id", ""); // reseta o id do anexo adicionado

    let tr = document.createElement("tr");
    tr.innerHTML = "<td class='wsop_edt_label'><input id='wpma_sites_submit' value='Excluir' type='button' onclick='ClientEvents.emit(\"WSOP/os/del/anexo\", \"" + data.file + "\")'></td><td><img id='wsop_add_img_thumb' class='wsop_add_img_thumb' alt='' src='" + data.img + "'></td>";
    document.getElementById("wsop_edt_anexos").appendChild(tr);
})
