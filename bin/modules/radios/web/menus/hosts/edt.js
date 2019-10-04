

var actionFunction = "";
var actionName = "Editar";
var actionIcon = "buttonTick"; //"buttonTick" "buttonCross" "tickCross"
var actionfield = "0";
var actionCallback = (data) => {
    if (data.hosts != undefined) {
        main_table.setData(data.hosts);
    } else {
        updateHost(data);
    }
};
var confirmExecution = false;
var actionOptions = [];
var actionRowFormatter = (data) => { };

reloadSubnetTable();

function updateHost(host) {
    var htm = "<tr><td colspan=2><table class='hosts_add_table'>";
    htm += "<tr><td colspan=2><p style='text-align: center;vertical-align: middle;'>Atualizar Host</td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Rede:</td><td><input id='add_in_subnet' value='" + normalizeIP(host.subnet) + "' disabled></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>IP:</td><td><input id='add_in_ip' value='" + normalizeIP(host.ip) + "' disabled></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Nome:</td><td><input id='add_in_name' value='" + host.name + "'></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Host:</td><td><input id='add_in_hostname' value='" + host.hostname + "'></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Mac:</td><td><input id='add_in_mac' value='" + host.mac + "'></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Fabricante:</td><td><input id='add_in_vendor' value='" + host.vendor + "'></td></tr>";
    htm += "</table></td></tr><tr>";
    htm += "<td><center><input type='button' value='Editar' onclick='subnetHostAddSend()'></td>";
    htm += "<td><center><input type='button' value='Fechar' onclick='subnetCancel()'></td>";
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

    send("ipam/add/hosts", data);
}


function subnetCancel() {
    var h = document.getElementById("overlay_input_table");
    if (h != undefined) {
        document.getElementById("overlay_input_table").style.opacity = 0;
        document.getElementById("overlay_input_table").style.top = "-100vh";
    }
}