
ClientEvents.on("usr/set/pass", (data) => {
    ClientEvents.emit("usr/set/pass/close");
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "change_pass_div");
    div.setAttribute("id", "change_pass_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_change_pass' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'change_pass_div')>&#9776;</td><td class='change_pass_label'><p class='change_pass_closeButton' onclick='ClientEvents.emit(\"usr/set/pass/close\")'>X</p></td></tr>" +
        "<tr><td class='usr_edt_label'>ID:</td><td><input id='usredtid' type='text' disabled value='" + data.id + "'></td></tr>" +
        "<tr><td class='usr_edt_label'>Nome:</td><td><input id='usredtname' disabled type='text' value='" + data.name + "'></td></tr>" +
        "<tr><td class='usr_edt_label'>Usuário:</td><td><input type='text' disabled value='" + data.username + "'></td></tr>" +
        "<tr><td class='change_pass_label'>Senha:</td><td><input id='change_pass_pass1' type='text'></td></tr>" +
        "<tr><td class='change_pass_label'>Confirmação:</td><td><input id='change_pass_pass2' type='text'></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Alterar' type='button' onclick='ClientEvents.emit(\"usr/set/pass/save\")'></td></tr>" +
        "</table>";

    document.body.appendChild(div);
});

ClientEvents.on("usr/set/pass/close", () => {
    if (document.getElementById("change_pass_div")) {
        document.body.removeChild(document.getElementById("change_pass_div"));
    }
});

ClientEvents.on("usr/set/pass/save", () => {
    let pass1 = document.getElementById("change_pass_pass1").value;
    let pass2 = document.getElementById("change_pass_pass2").value;
    if (pass1 != "" && pass2 != "") {
        if (pass1 == pass2) {
            ClientEvents.emit("SendSocket", "usr/set/pass", {
                id_user: document.getElementById("usredtid").value,
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
