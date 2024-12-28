

var actionFunction = "";
var actionName = "Editar";
var actionIcon = "buttonTick"; //"buttonTick" "buttonCross" "tickCross"
var actionfield = "0";
var actionCallback = updateSubnet;
var confirmExecution = false;
var actionOptions = [];
var actionRowFormatter = (data) => { };

reloadSubnetTable();

function updateSubnet(data) {
    var subnet = data;
    var htm = "<tr><td colspan=2><table class='subnets_add_table'>";
    htm += "<tr><td colspan=2><p style='text-align: center;vertical-align: middle;'>Atualizar Radio</td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>ID:</td><td><input id='add_in_id' value='" + subnet.id + "' disabled></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Nome:</td><td><input id='add_in_name' value='" + subnet.name + "'></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>IP:</td><td><input id='add_in_ip' value='" + subnet.ip + "'></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Senha:</td><td><input id='add_in_pass' value='" + subnet.Pass + "'></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Comunidade:</td><td><input id='add_in_community' value='" + subnet.community + "'></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Scan Automatico:</td><td><label class='switch'><input type='checkbox' id='add_in_autoscan' " + ((subnet.autoscan) ? "checked" : "") + "> <span class='slider round'></span></label></td></tr>";
    htm += "</table></td></tr><tr>";
    htm += "<td><center><input type='button' value='Atualizar' onclick='RadiosEdtSend()'></td>";
    htm += "<td><center><input type='button' value='Cancelar' onclick='subnetCancel()'></td>";
    htm += "</tr>";

    document.getElementById("overlay_input_table").innerHTML = htm;
    document.getElementById("overlay_input_table").style.opacity = 1;
    document.getElementById("overlay_input_table").style.top = "30vh";
}

function RadiosEdtSend() {
    startLoader();
    var data = {};
    data.id = document.getElementById("add_in_id").value;
    data.name = document.getElementById("add_in_name").value;
    data.ip = normalizeIP(document.getElementById("add_in_ip").value);
    data.Pass = document.getElementById("add_in_pass").value;
    data.community = document.getElementById("add_in_community").value;
    data.autoScan = (document.getElementById("add_in_autoscan").checked) ? 1 : 0;

    send("radios/add/radios", JSON.stringify(data));
}


function subnetCancel() {
    var h = document.getElementById("overlay_input_table");
    if (h != undefined) {
        document.getElementById("overlay_input_table").style.opacity = 0;
        document.getElementById("overlay_input_table").style.top = "-100vh";
        setTimeout(() => {
            h.innerHTML = "";
        }, 1000)
    }
}