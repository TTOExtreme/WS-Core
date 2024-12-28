
ClientEvents.setCoreEvent("usr/edt/pass");
ClientEvents.on("usr/edt/pass", () => {
    ClientEvents.emit("close_menu", 'change_pass_div');
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "change_pass_div");
    div.setAttribute("id", "change_pass_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_change_pass' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'change_pass_div')>&#9776;</td><td class='change_pass_label'><p class='change_pass_closeButton' onclick=ClientEvents.emit(\"close_menu\", 'change_pass_div')>X</p></td></tr>" +
        "<tr><td class='change_pass_label'>Senha:</td><td><input id='change_pass_pass1' type='text'></td></tr>" +
        "<tr><td class='change_pass_label'>Confirmação:</td><td><input id='change_pass_pass2' type='text'></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Alterar' type='button' onclick='ClientEvents.emit(\"usr/edt/pass/save\")'></td></tr>" +
        "</table>";

    document.body.appendChild(div);
});


ClientEvents.setCoreEvent("usr/edt/pass/save");
ClientEvents.on("usr/edt/pass/save", () => {
    let pass1 = document.getElementById("change_pass_pass1").value;
    let pass2 = document.getElementById("change_pass_pass2").value;
    if (pass1 != "" && pass2 != "") {
        if (pass1 == pass2) {
            ClientEvents.emit("SendSocket", "usr/edt/pass", {
                pass: pass1,
            });
        } else {
            ClientEvents.emit("system_mess", {
                mess: "Senhas Divergentes",
                status: "ERROR"
            })
        }
    } else {
        ClientEvents.emit("system_mess", {
            mess: "Senhas Vazias",
            status: "ERROR"
        })
    }
})
