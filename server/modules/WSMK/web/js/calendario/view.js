
ClientEvents.on("WSMK/view", (data) => {
    ClientEvents.emit("close_menu", 'wsmk_view_div')
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsmk_calendario_div menu_dragger");
    div.setAttribute("id", "wsmk_view_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wsop_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsmk_view_div')>&#9776;<p class='wsmk_calendario_closeButton' onclick='ClientEvents.emit(\"close_menu\", \"wsmk_view_div\")'>X</p></td></tr>" +
        "<tr><td><center>" + (data.name || "") + "</center></td></tr>" +
        "<tr><td><img class='wsop_anexo_img' alt='' src='./module/WSMK/img/" + (data.img + "") + "'></td></tr>" +
        "<tr><td><a id='download_img' href=\"./module/WSMK/img/" + data.img + "\" download=\"" + (data.title || "imagem") + data.img.substring(data.img.lastIndexOf(".")) + "\"></a></td></tr>" +
        "<tr><td style='border:1px solid #303030'>" + unclearDescdata.description(data.description) + "</td></tr>" +
        "<tr><td><input id='wpma_sites_submit' value='Download' type='button' onclick='document.getElementById(\"download_img\").click()'></td></tr>" +
        "</table>";

    document.body.appendChild(div);
});
