ClientEvents.on("WSOP/os/anexo/edt", (data) => {
    ClientEvents.emit("WSOP/os/anexo/close");
    //console.log(data)
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsop_add_div");
    div.setAttribute("id", "wsop_anexo_div");
    let ext = data.filename.substring(data.filename.lastIndexOf("."));
    if (ext != ".png" && ext != ".jpeg" && ext != ".gif" && ext != ".bmp" && ext != ".png") {
        data.replace_img = "file_thumb.png";
    }
    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wsop_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsop_anexo_div')>&#9776;</td><td class='wsop_edt_label'><p class='wsop_add_closeButton' onclick='ClientEvents.emit(\"WSOP/os/anexo/close\")'>X</p></td></tr>" +
        "<tr><td><center>" + (data.name || "") + "</center></td></tr>" +
        "<tr><td><img class='wsop_anexo_img' alt='' src='./module/WSOP/img/" + (data.replace_img || data.filename) + "'></td></tr>" +
        "<tr><td><a id='download_img' href=\"./module/WSOP/img/" + data.filename + "\" download=\"" + (data.name || "anexo") + data.filename.substring(data.filename.lastIndexOf(".")) + "\"></a></td></tr>" +
        "<tr><td><input id='wpma_sites_submit' value='Excluir' type='button'  onclick='ClientEvents.emit(\"SendSocket\",\"wsop/os/anexo/del\", {id:" + data.id + "})'><input id='wpma_sites_submit' value='Download' type='button' onclick='document.getElementById(\"download_img\").click()'></td></tr>" +
        "</table>";

    document.body.appendChild(div);
});

ClientEvents.on("WSOP/os/anexo/view", (data) => {
    ClientEvents.emit("WSOP/os/anexo/close");
    //console.log(data)
    if (data.thumb == undefined && data.img != undefined) {
        data.thumb = data.img.replace(".", "_thumb.");
    }
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsop_add_div");
    div.setAttribute("id", "wsop_anexo_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wsop_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsop_anexo_div')>&#9776;</td><td class='wsop_edt_label'><p class='wsop_add_closeButton' onclick='ClientEvents.emit(\"WSOP/os/anexo/close\")'>X</p></td></tr>" +
        "<tr><td><center>" + (data.name || "") + "</center></td></tr>" +
        "<tr><td><img class='wsop_anexo_img' alt='' src='./module/WSOP/img/" + data.filename + "'></td></tr>" +
        "<tr><td><a id='download_img' href=\"./module/WSOP/img/" + data.filename + "\" download=\"" + (data.name || "imagem") + data.filename.substring(data.filename.lastIndexOf(".")) + "\"></a></td></tr>" +
        "<tr><td><input id='wpma_sites_submit' value='Download' type='button' onclick='document.getElementById(\"download_img\").click()'></td></tr>" +
        "</table>";

    document.body.appendChild(div);
});

ClientEvents.on("WSOP/os/anexo/close", () => {
    if (document.getElementById("wsop_anexo_div")) {
        document.body.removeChild(document.getElementById("wsop_anexo_div"));
    }
});