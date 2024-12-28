ClientEvents.on("WSFinan/requisicao/anexo/edt", (data) => {
    ClientEvents.emit("close_menu", "wsfinan_anexo_div");
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsfinan_add_div menu_dragger");
    div.setAttribute("id", "wsfinan_anexo_div");
    let ext = data.filename.substring(data.filename.lastIndexOf("."));
    if (ext != ".png" && ext != ".jpeg" && ext != ".gif" && ext != ".bmp" && ext != ".jpg") {
        data.replace_img = "file_thumb.png";
    }
    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wsfinan_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsfinan_anexo_div')>&#9776;</td><td class='wsfinan_edt_label'><p class='closeButton' onclick=ClientEvents.emit('close_menu','wsfinan_anexo_div')>X</p></td></tr>" +
        "<tr><td><center><pre>Nome: " + data.name + "\nData: " + formatTime(data.createdIn) + "</pre></center></td></tr>" +
        "<tr><td><img class='wsfinan_anexo_img' alt='' src='./module/WSFinan/img/" + (data.replace_img || data.filename) + "'></td></tr>" +
        "<tr><td><a id='download_img' href=\"./module/WSFinan/img/" + data.filename + "\" download=\"" + (data.name || "anexo") + data.filename.substring(data.filename.lastIndexOf(".")) + "\"></a></td></tr>" +
        "<tr><td><input id='wpma_sites_submit' value='Excluir' type='button'  onclick='ClientEvents.emit(\"wsfinan/requisicao/anexo/del\", {id:" + data.id + ",id_os:" + data.id_req + "})'><input id='wpma_sites_submit' value='Download' type='button' onclick='document.getElementById(\"download_img\").click()'></td></tr>" +
        "</table>";

    document.body.appendChild(div);
});

ClientEvents.on("WSFinan/requisicao/anexo/view", (data) => {
    ClientEvents.emit("close_menu", "wsfinan_anexo_div");
    if (data.thumb == undefined && data.img != undefined) {
        data.thumb = data.img.replace(".", "_thumb.");
    }
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsfinan_add_div");
    div.setAttribute("id", "wsfinan_anexo_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wsfinan_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsfinan_anexo_div')>&#9776;</td><td class='wsfinan_edt_label'><p class='closeButton' onclick=ClientEvents.emit('close_menu','wsfinan_anexo_div')>X</p></td></tr>" +
        "<tr><td><center><pre>Nome: " + data.name + "\nData: " + formatTime(data.createdIn) + "</pre></center></td></tr>" +
        "<tr><td><img class='wsfinan_anexo_img' alt='' src='./module/WSFinan/img/" + data.filename + "'></td></tr>" +
        "<tr><td><a id='download_img' href=\"./module/WSFinan/img/" + data.filename + "\" download=\"" + (data.name || "imagem") + data.filename.substring(data.filename.lastIndexOf(".")) + "\"></a></td></tr>" +
        "<tr><td><input id='wpma_sites_submit' value='Download' type='button' onclick='document.getElementById(\"download_img\").click()'></td></tr>" +
        "</table>";

    document.body.appendChild(div);
});
