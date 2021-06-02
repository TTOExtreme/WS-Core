
ClientEvents.on("wsop/os/history", (data) => {
    ClientEvents.emit("close_menu", 'wsop_history_div')
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsop_add_div menu_dragger");
    div.setAttribute("id", "wsop_history_div");

    let htm = "";

    let sc = JSON.parse(data.statusChange);
    if (sc != undefined) {
        if (sc.length >= 0) {
            sc.forEach(status => {
                htm += "<tr class='wsop_hist_data'><td>" + new window.Modules.WSOP.StatusID().getStatusName(status.status) + "</td>" +
                    "<td>" + status.inUser + "</td>" +
                    "<td><center>" + formatTimeSpend((status.out != undefined ? status.out : new Date().getTime()) - status.in) + "</td>" +
                    "<td><center>" + formatTime(status.in) + "</td>" +
                    "<td><center>" + (status.out != undefined ? formatTime(status.out) : "-") + "</td></tr>";
            });
        }
    }

    div.innerHTML = "" +
        "<table>" +
        "<tr class='menu_header'><td id='move_menu_wsop_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsop_history_div')>&#9776;</td><td class='wsop_edt_label'><p class='wsop_add_closeButton' onclick=ClientEvents.emit(\"close_menu\",'wsop_history_div')>X</p></td></tr>" +
        "<tr><td class='wsop_edt_label'>ID OS:</td><td><input type='text' disabled value='" + data.id + "'></td></tr>" +
        "<tr><td colspan=3></br></td></tr>" +
        "</table><table  class='wsop_hist_table'>" +
        "<tr class='wsop_hist_label'><td>Status</td>" +
        "<td>Resposável</td>" +
        "<td>Tempo no Status</td>" +
        "<td>Entrada</td>" +
        "<td>Saida</td></tr>" +
        htm +
        "</table>";
    document.body.appendChild(div);
});
