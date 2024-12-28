

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
    htm += "<tr><td colspan=2><p style='text-align: center;vertical-align: middle;'>Atualizar Rede</td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Nome:</td><td><input id='add_in_name' value='" + subnet.name + "'></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>IP:</td><td><input id='add_in_ip' value='" + subnet.ip + "'></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Gateway:</td><td><input id='add_in_gtw' value='" + subnet.gtw + "'></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>NetMask:</td><td><input id='add_in_nmask' value='" + subnet.netmask + "'></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Scan Automatico:</td><td><label class='switch'><input type='checkbox' id='add_in_autoscan' " + ((subnet.autoscan) ? "checked" : "") + "> <span class='slider round'></span></label></td></tr>";
    htm += "</table></td></tr><tr>";
    htm += "<td><center><input type='button' value='Atualizar' onclick='subnetAddSend()'></td>";
    htm += "<td><center><input type='button' value='Cancelar' onclick='subnetCancel()'></td>";
    htm += "</tr>";

    document.getElementById("overlay_input_table").innerHTML = htm;
    document.getElementById("overlay_input_table").style.opacity = 1;
    document.getElementById("overlay_input_table").style.top = "30vh";
}

function subnetHostAddSend() {
    startLoader();
    var data = {};
    data.name = document.getElementById("add_in_name").value;
    data.ip = normalizeIP(document.getElementById("add_in_ip").value);
    data.subnet = normalizeIP3(document.getElementById("add_in_subnet").value);
    data.mac = document.getElementById("add_in_mac").value;
    data.hostname = document.getElementById("add_in_hostname").value;
    data.vendor = document.getElementById("add_in_vendor").value;

    send("/add_host", JSON.stringify(data));
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