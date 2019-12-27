
actionFunction = "system/edt/users";
actionName = "Editar";
actionIcon = "tickCross";
confirmExecution = false;
actionfield = "active";
actionOptions = ["Ativar", "Desativar"];
actionRowFormatter = (data) => { };
system_get_users();

actionCallback = system_edt_user;

function system_edt_user(data) {
    var user = data;
    var htm = "<tr><td colspan=2><table class='sub_menu_over'>";
    htm += "<tr><td colspan=2><p style='text-align: center;vertical-align: middle;'>Editar Usuário</td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Nome:</td><td><input id='edt_in_name' value='" + user.username + "'></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Login:</td><td><input id='edt_in_username' value='" + user.user + "'></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Senha:</td><td><input id='edt_in_pass' type='password'></td></tr>";
    htm += "</table></td></tr><tr>";
    htm += "<td><center><input type='button' value='Adicionar' onclick='system_edt_user_()'></td>";
    htm += "<td><center><input type='button' value='Cancelar' onclick='menuCancel()'></td>";
    htm += "</tr>";

    document.getElementById("sub_menu_over").innerHTML = htm;
    document.getElementById("sub_menu_over").style.opacity = 1;
    document.getElementById("sub_menu_over").style.top = "30vh";
}

function system_edt_user_() {
    var usr = {};
    usr.user = document.getElementById("edt_in_name").value;
    usr.pass = document.getElementById("edt_in_pass").value;
    usr.username = document.getElementById("edt_in_username").value;

    if (usr.user != undefined && usr.user != "" &&
        usr.pass != undefined && usr.pass != "" &&
        usr.username != undefined && usr.username != ""
    ) {
        send("system/edt/user", usr);
    }
}