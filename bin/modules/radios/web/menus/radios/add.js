function addNewSubnet() {
    var htm = "<tr><td colspan=2><table class='radios_add_table'>";
    htm += "<tr><td colspan=2><p style='text-align: center;vertical-align: middle;'>Adicionar Novo Radio</td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Nome:</td><td><input id='add_in_name'></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>IP:</td><td><input id='add_in_ip'></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Comunidade:</td><td><input id='add_in_community'></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Scan Automatico:</td><td><label class='switch'><input type='checkbox' id='add_in_autoscan'> <span class='slider round'></span></label></td></tr>";
    htm += "</table></td></tr><tr>";
    htm += "<td><center><input type='button' value='Adicionar' onclick='radiosAddSend()'></td>";
    htm += "<td><center><input type='button' value='Fechar' onclick='radiosCancel()'></td>";
    htm += "</tr>";

    document.getElementById("overlay_input_table").innerHTML = htm;
    document.getElementById("overlay_input_table").style.opacity = 1;
    document.getElementById("overlay_input_table").style.top = "30vh";
}

function radiosAddSend() {
    startLoader();
    var data = {};
    data.name = document.getElementById("add_in_name").value;
    data.ip = normalizeIP(document.getElementById("add_in_ip").value);
    data.community = document.getElementById("add_in_community").value;
    data.autoScan = (document.getElementById("add_in_autoscan").checked) ? 1 : 0;
    console.log("Added");
    send("radios/add/radios", JSON.stringify(data));
}

function radiosCancel() {
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