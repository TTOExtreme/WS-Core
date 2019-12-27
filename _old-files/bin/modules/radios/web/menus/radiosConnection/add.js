function addNewSubnet() {
    var htm = "<tr><td colspan=2><table class='radios_add_table'>";
    htm += "<tr><td colspan=2><p style='text-align: center;vertical-align: middle;'>Adicionar Novo Enlace</td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>AP:</td><td><select id='add_in_ap'>" + radioOptionsAP() + "</select></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Estação:</td><td><select id='add_in_st'>" + radioOptionsST() + "</select></td></tr>";
    htm += "</table></td></tr><tr>";
    htm += "<td><center><input type='button' value='Adicionar' onclick='connectionAddSend()'></td>";
    htm += "<td><center><input type='button' value='Fechar' onclick='radiosCancel()'></td>";
    htm += "</tr>";

    document.getElementById("overlay_input_table").innerHTML = htm;
    document.getElementById("overlay_input_table").style.opacity = 1;
    document.getElementById("overlay_input_table").style.top = "30vh";
}

function connectionAddSend() {
    startLoader();
    var data = {};
    data.id_radio_ap = document.getElementById("add_in_ap").value;
    data.id_radio_st = document.getElementById("add_in_st").value;

    send("radios/add/connection", JSON.stringify(data));
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

function radioOptionsAP() {
    let list = "";
    indb.lists["radiosList"].forEach(e => {
        //if (e.RadioMode != 1)
        list += "<option value='" + e.id + "'>" + e.name + "</option>"
    });
    return list;
}

function radioOptionsST() {
    let list = "";
    indb.lists["radiosList"].forEach(e => {
        //if (e.RadioMode <= 1)
        list += "<option value='" + e.id + "'>" + e.name + "</option>"
    });
    return list;
}
addNewSubnet();