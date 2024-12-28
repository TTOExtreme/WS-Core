function addNewSubnet() {
    var htm = "<tr><td colspan=2><table class='subnets_add_table'>";
    htm += "<tr><td colspan=2><p style='text-align: center;vertical-align: middle;'>Adicionar Nova Rede</td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Nome:</td><td><input id='add_in_name'></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>IP:</td><td><input id='add_in_ip'></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Gateway:</td><td><input id='add_in_gtw'></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>NetMask:</td><td><input id='add_in_nmask'></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Scan Automatico:</td><td><label class='switch'><input type='checkbox' id='add_in_autoscan'> <span class='slider round'></span></label></td></tr>";
    htm += "</table></td></tr><tr>";
    htm += "<td><center><input type='button' value='Adicionar' onclick='subnetAddSend()'></td>";
    htm += "<td><center><input type='button' value='Fechar' onclick='subnetCancel()'></td>";
    htm += "</tr>";

    document.getElementById("overlay_input_table").innerHTML = htm;
    document.getElementById("overlay_input_table").style.opacity = 1;
    document.getElementById("overlay_input_table").style.top = "30vh";
}

function subnetAddSend() {
    startLoader();
    var data = {};
    data.name = document.getElementById("add_in_name").value;
    data.ip = normalizeIP3(document.getElementById("add_in_ip").value);
    data.gtw = normalizeIP(document.getElementById("add_in_gtw").value);
    data.netmask = normalizeNetmask(document.getElementById("add_in_nmask").value);
    data.autoScan = (document.getElementById("add_in_autoscan").checked) ? 1 : 0;

    send("ipam/add/subnets", JSON.stringify(data));
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

function getIPSubnet(ip, callback) {
    ip = normalizeIP3(ip);
    indb.lists["SubnetList"].forEach(e => {
        if (normalizeIP3(e.ip) == ip) {
            callback(e);
            return;
        }
    });
}
addNewSubnet();