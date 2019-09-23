function initradios() {
    initTopMenuItems();
    startLoader();
    closeLeftMenu();
    loadCSS("Radios.css");
    document.getElementById("radioswork").setAttribute("onclick", "initradios()");

    var htm = "";
    htm += "<table id='radios_main_table' class='radios_main_table_holder'><tr>";
    htm += "<td><table id='radios_Lside_table' class='radios_Lside_table_holder noselect'></table></td>";
    htm += "<td><div class='radios_Mside_table_holder'><table id='radios_Mside_table' class='radios_Mside_table'></table></div></td>";
    htm += "<td><center><table id='radios_add_table' class='radios_add_table_holder'></table></td>";

    document.getElementById("mainPage").innerHTML = htm;
    reloadradios();
}


function reloadradios() {
    radioCancel();
    send("/get_radios", "{}");
    setTimeout(() => {
        radio_draw();
    }, 300);
}

function reloadRadiolist() {
    send("/get_radios", "{}");
    stopLoader();
}

function manualScan(ip, community) {
    getIPradio(ip, (radio) => {
        send("/scan_radio", JSON.stringify(radio));
        stopLoader();
    });
}

function appendRoutes() {
    appendRoute("/radio_list", radio_list);
    appendRoute("/radio_added", reloadradios);
    appendRoute("/radio_removed", reloadradios);
    //appendRoute("/radio_scanned", reloadHosts);

    appendRoute("/radio_hosts_list", radioUpdateHosts);

    appendRoute("/host_added", () => {
        radioCancel();
        //reloadHosts(indb.lists['radioList'], true)
    })

    appendRoute("/host_removed", () => {
        radioCancel();
        //reloadHosts(indb.lists['radioList'])
    })
}

function radio_list(data) {
    radio_clearHosts();
    indb.lists["radioList"] = data;
    stopLoader();
}

function radio_draw() {
    var mp = document.getElementById("radios_Lside_table");

    var htm = "";
    htm += "<tr class='radios_Lside_tr_item_label'><td class='radios_Lside_td_item_label'>";
    htm += "<p>Lista de Radios";
    htm += "<a title='Adicionar'  onclick='addNewradio()'>+</a>";
    htm += "<a title='Recarregar'  onclick='reloadradios()'>&#8635;</a>";
    htm += "</p></td></tr>";
    htm += "<tr><td><div class='radios_Lside_table_items_holder'>";
    htm += "<table id='radios_Lside_table_items_holder' class='radios_Lside_table'>";

    htm += "<tr class='radios_Lside_tr_item'><td class='radios_Lside_td_item'><p onclick=\"listAllRadios()\">All</p>";
    htm += "<td class='radios_Lside_td_item'><a></a></td>";
    htm += "<td class='radios_Lside_td_item'><a></a></td>";
    htm += "<td class='radios_Lside_td_item'><a></a></td>";
    htm += "</td></tr>";
    indb.lists["radioList"].forEach(e => {
        htm += "<tr class='radios_Lside_tr_item'><td class='radios_Lside_td_item'><p onclick=\"openNewradio('" + e.ip + "')\">" + e.name + "</p>";
        htm += "<td class='radios_Lside_td_item'><a title='Remover' onclick=\"removeradio('" + e.ip + "')\">&minus;</a></td>";
        htm += "<td class='radios_Lside_td_item'><a title='Escanear' onclick=\"manualScan('" + e.ip + "')\">&#8635;</a></td>";
        htm += "<td class='radios_Lside_td_item'><a title='Editar' onclick=\"updateradio('" + e.ip + "')\" style='transform:rotate(90deg);'>&#9998;</a></td>";
        htm += "</td></tr>";
    });
    htm += "</table></div></td></tr>";

    mp.innerHTML = htm;

    setTimeout(() => {
        document.getElementById("radios_Lside_table").style.opacity = "1";
        document.getElementById("radios_Lside_table_items_holder").style.opacity = "1";
    }, 100);

}
var oldMX = 0;

function radio_clearHosts() {
    var md = document.getElementById('radios_Mside_table');
    if (md != undefined) {
        //md.innerHTML = ""
    }
}

var reloadlistrarios = true;

function listAllRadios() {
    setTimeout(() => {
        reloadRadiolist();
        setTimeout(() => {
            if (reloadlistrarios)
                listAllRadios();
        }, 100);
    }, 10000)
    var radio = indb.lists["radioList"];
    var htm = "";
    if (document.getElementById("radios_hostlist_tablelist") != undefined) {
        radio.forEach((e) => {
            var row = document.getElementById("radios_hostlist_tablelist_tr_ip-" + e.ip + "");
            if (row != undefined) {
                var rhtm = "";
                var RX = "";
                if (e.RXrate > 1000000) {
                    RX = Math.round((e.RXrate / 1024) / 10.24) / 100 + " Mbps";
                } else {
                    if (e.RXrate > 1000) {
                        RX = Math.round(e.RXrate / 10.24) / 100 + " Kbps";
                    } else {
                        RX = e.RXrate + " bps";
                    }
                }
                var TX = "";
                if (e.TXrate > 1000000) {
                    TX = Math.round((e.TXrate / 1024) / 10.24) / 100 + " Mbps";
                } else {
                    if (e.TXrate > 1000) {
                        TX = Math.round(e.TXrate / 10.24) / 100 + " Kbps";
                    } else {
                        TX = e.TXrate + " bps";
                    }
                }

                rhtm += "<td class='radios_hostlist_tablelist_td_dot radio_hosts_td_alive_" + (e.seted + (e.alive * 2)) + "'><p title='" + HostData(e) + "'></p></td>";
                rhtm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + normalizeIP(e.ip) + "\">" + normalizeIP(e.ip) + "</p></td>";
                rhtm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + e.name + "\">" + e.name + "</p></td>";
                rhtm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + e.hostname + "\">" + e.hostname + "</p></td>";
                rhtm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + e.SSID + "\">" + e.SSID + "</p></td>";
                rhtm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + e.Pass + "\">" + e.Pass + "</p></td>";
                rhtm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + RX + "\">" + RX + "</p></td>";
                rhtm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + TX + "\">" + TX + "</p></td>";
                rhtm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + e.ChannelWidth + "\">" + e.ChannelWidth + " MHz</p></td>";
                rhtm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + e.AirmaxCapacity + " %\">" + e.AirmaxCapacity + " %</p></td>";
                rhtm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + e.AirmaxQuality + " %\">" + e.AirmaxQuality + " %</p></td>";
                rhtm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + e.ChannelFreq + "\">" + e.ChannelFreq + " MHz</p></td>";
                rhtm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + e.dbmPower + "\">" + e.dbmPower + " dBm</p></td>";
                rhtm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + e.RadioSignal + "\">" + e.RadioSignal + "</p></td>";
                rhtm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + e.RSSI + "\">" + e.RSSI + "</p></td>";
                rhtm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + e.CCQ + "\">" + e.CCQ + " %</p></td>";
                rhtm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + e.Noise + "\">" + e.Noise + " dBm</p></td>";

                rhtm += "<td class='radios_hostlist_tablelist_td'><a title='Editar' onclick=\"updateradio('" + e.ip + "')\" style='transform:rotate(90deg);'>&#9998;</a></td>";
                if (e.seted == 0) {
                    rhtm += "<td class='radios_hostlist_tablelist_td' title='Adicionar' onclick=\"addradio('" + e.ip + "')\"><a style='transform:rotate(90deg);'>&plus;</a></td>";
                } else {
                    rhtm += "<td class='radios_hostlist_tablelist_td' title='Editar' onclick=\"removeradio('" + e.ip + "')\"><a style='transform:rotate(90deg);'>&minus;</a></td>";
                }
                row.innerHTML = rhtm;
            }
        })

    } else {

        htm += "<tr class='radios_hostlist_section_tr '><td class='radios_hostlist_section_td'><div class='radios_hostlist_tablelist_holder'><table id='radios_hostlist_tablelist' class='radios_hostlist_tablelist'>";
        htm += "<tr class='radios_hostlist_tablelist_tr'>";
        htm += "<td class='radios_hostlist_tablelist_td_label'><input onclick='hideNonActiveHosts()' type='checkbox' id='nonActiveHosts' title='Esconder Hosts não Cadastrados'></td>";
        htm += "<td class='radios_hostlist_tablelist_td_label'><p title='IP'>IP</p></td>";
        htm += "<td class='radios_hostlist_tablelist_td_label'><p title='Nome'>Nome</p></td>";
        htm += "<td class='radios_hostlist_tablelist_td_label'><p title='Hostname'>Hostname</p></td>";
        htm += "<td class='radios_hostlist_tablelist_td_label'><p title='SSID'>SSID</p></td>";
        htm += "<td class='radios_hostlist_tablelist_td_label'><p title='SSID'>Senha</p></td>";
        htm += "<td class='radios_hostlist_tablelist_td_label'><p title='RX'>RX</p></td>";
        htm += "<td class='radios_hostlist_tablelist_td_label'><p title='TX'>TX</p></td>";
        htm += "<td class='radios_hostlist_tablelist_td_label'><p title='Abertura Canal'>Abertura Canal</p></td>";
        htm += "<td class='radios_hostlist_tablelist_td_label'><p title='Capacidade AirMax'>Capacidade AirMax</p></td>";
        htm += "<td class='radios_hostlist_tablelist_td_label'><p title='Qualidade AirMax'>Qualidade AirMax</p></td>";
        htm += "<td class='radios_hostlist_tablelist_td_label'><p title='Canal'>Canal</p></td>";
        htm += "<td class='radios_hostlist_tablelist_td_label'><p title='dBm'>dBm</p></td>";
        htm += "<td class='radios_hostlist_tablelist_td_label'><p title='Sinal'>Sinal</p></td>";
        htm += "<td class='radios_hostlist_tablelist_td_label'><p title='RSSI'>RSSI</p></td>";
        htm += "<td class='radios_hostlist_tablelist_td_label'><p title='CCQ'>CCQ</p></td>";
        htm += "<td class='radios_hostlist_tablelist_td_label'><p title='Ruido'>Ruido</p></td>";


        htm += "<td class='radios_hostlist_tablelist_td_label' colspan=2><p title='Ações'>Ações</p></td></tr>";

        radio.forEach((e) => {

            var RX = "";
            if (e.RXrate > 1000000) {
                RX = Math.round((e.RXrate / 1024) / 10.24) / 100 + " Mbps";
            } else {
                if (e.RXrate > 1000) {
                    RX = Math.round(e.RXrate / 10.24) / 100 + " Kbps";
                } else {
                    RX = e.RXrate + " bps";
                }
            }
            var TX = "";
            if (e.TXrate > 1000000) {
                TX = Math.round((e.TXrate / 1024) / 10.24) / 100 + " Mbps";
            } else {
                if (e.TXrate > 1000) {
                    TX = Math.round(e.TXrate / 10.24) / 100 + " Kbps";
                } else {
                    TX = e.TXrate + " bps";
                }
            }

            htm += "<tr id='radios_hostlist_tablelist_tr_ip-" + e.ip + "' class='" + ((e.seted == 1) ? "hostSeted_1" : "hostSeted_0") + " radios_hostlist_tablelist_tr hostSeted_" + e.seted + " hide'>";
            htm += "<td class='radios_hostlist_tablelist_td_dot radio_hosts_td_alive_" + (e.seted + (e.alive * 2)) + "'><p title='" + HostData(e) + "'></p></td>";
            htm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + normalizeIP(e.ip) + "\">" + normalizeIP(e.ip) + "</p></td>";
            htm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + e.name + "\">" + e.name + "</p></td>";
            htm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + e.hostname + "\">" + e.hostname + "</p></td>";
            htm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + e.SSID + "\">" + e.SSID + "</p></td>";
            htm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + e.Pass + "\">" + e.Pass + "</p></td>";
            htm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + RX + "\">" + RX + "</p></td>";
            htm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + TX + "\">" + TX + "</p></td>";
            htm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + e.ChannelWidth + "\">" + e.ChannelWidth + " MHz</p></td>";
            htm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + e.AirmaxCapacity + " %\">" + e.AirmaxCapacity + " %</p></td>";
            htm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + e.AirmaxQuality + " %\">" + e.AirmaxQuality + " %</p></td>";
            htm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + e.ChannelFreq + "\">" + e.ChannelFreq + " MHz</p></td>";
            htm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + e.dbmPower + "\">" + e.dbmPower + " dBm</p></td>";
            htm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + e.RadioSignal + "\">" + e.RadioSignal + "</p></td>";
            htm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + e.RSSI + "\">" + e.RSSI + "</p></td>";
            htm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + e.CCQ + "\">" + e.CCQ + " %</p></td>";
            htm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + e.Noise + "\">" + e.Noise + " dBm</p></td>";

            htm += "<td class='radios_hostlist_tablelist_td'><a title='Editar' onclick=\"updateradio('" + e.ip + "')\" style='transform:rotate(90deg);'>&#9998;</a></td>";
            if (e.seted == 0) {
                htm += "<td class='radios_hostlist_tablelist_td' title='Adicionar' onclick=\"addradio('" + e.ip + "')\"><a style='transform:rotate(90deg);'>&plus;</a></td>";
            } else {
                htm += "<td class='radios_hostlist_tablelist_td' title='Editar' onclick=\"removeradio('" + e.ip + "')\"><a style='transform:rotate(90deg);'>&minus;</a></td>";
            }

            htm += "</tr>";
            htm += "";
        })
        htm += "";
        htm += "</div></table></td></tr>";
        if (document.getElementById("radios_Mside_table") != undefined) {
            document.getElementById("radios_Mside_table").innerHTML = htm;
        }
    }
}


function draw_hostsradio(ip) {
    reloadlistrarios = false;
    var mp = document.getElementById("radios_Mside_table");

    var htm = "";
    startLoader();

    getIPradio(ip, (radio) => {
        //var radio = indb.lists["radioList"];

        if (radio != undefined) {

            //stats of radio
            htm += "<tr class='radios_hostlist_section_tr'><td class='radios_stats_section_td'><div><table id='radios_stats_table' class='radios_stats_table'><tr style='color:white'>";
            //graph of used hosts
            htm += "<td colspan=2 class='radios_stats_table_td_label'><p>Capacidade do AirMax:</p></td>";
            htm += "<td colspan=2 class='radios_stats_table_td_label'><p>Qualidade do AirMax:</p></td>";
            htm += "<td colspan=2 class='radios_stats_table_td_label'><p>CCQ:</p></td>";

            htm += "</tr><tr>"
            //Capacidade do Airmax
            htm += "<td colspan=2 class='radios_stats_table_td'  title='Capacidade do AirMax: " + radio.AirmaxCapacity + "% '>";
            htm += "<center><svg id='airmax-capacity-graph' style='width:100px;height:100px;' percent=" + radio.AirmaxCapacity + " front-color='#308030' back-color='#606060' ></svg>"
            htm += "</td>"
            //Qualidade do Airmax
            htm += "<td colspan=2 class='radios_stats_table_td'  title='Qualidade do AirMax: " + radio.AirmaxQuality + "% '>";
            htm += "<center><svg id='airmax-quality-graph' style='width:100px;height:100px;' percent=" + radio.AirmaxQuality + " front-color='#308030' back-color='#606060' ></svg>"
            htm += "</td>"
            //ccq
            htm += "<td colspan=2 class='radios_stats_table_td'  title='CCQ: " + radio.CCQ + "% '>";
            htm += "<center><svg id='ccq-graph' style='width:100px;height:100px;' percent=" + radio.CCQ + " front-color='#308030' back-color='#606060' ></svg>"
            htm += "</td>"
            htm += "</tr>"


            //Descrição da Radio 
            htm += RadioDataTable(radio)

            htm += "";
            htm += "</div></table></td></tr>";


            //Hosts list of radio

            //finalize htm
            if (htm != "") {
                htm += "</table></div></td></tr>";
                mp.innerHTML = htm;
            }
            setTimeout(() => {
                stopLoader();
                document.getElementById("radios_Mside_table").style.opacity = "1";

                setSVGPercentGraph("airmax-capacity-graph");
                setSVGPercentGraph("airmax-quality-graph");
                setSVGPercentGraph("ccq-graph");
            }, 100);
        } else {
            console.log("ERROR: radio undefined on draw radios")
            console.log(indb)
        }

    });
}



function hideNonActiveHosts() {
    var d = document.getElementById("nonActiveHosts");
    var l = document.querySelectorAll("tr.hostSeted_0");
    if (l != undefined) {
        l.forEach(e => {
            if (d.checked) {
                e.style.display = "none";
            } else {
                e.style.display = "";
            }
        })
    }
}

function openNewradio(ip) {
    // = true;
    //openradioItem(ip);
    draw_hostsradio(ip);
}

function openradioItem(ip) {
    if (ip != undefined) {
        startLoader();
        getIPradio(ip, (radio) => {
            var radioData = JSON.stringify(radio);
            send("/get_hosts_in", radioData);
        })
    }
}

function addNewradio() {
    var htm = "<tr><td colspan=2><table class='radios_add_table'>";
    htm += "<tr><td colspan=2><p style='text-align: center;vertical-align: middle;'>Adicionar Novo Radio</td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Nome:</td><td><input id='add_in_name'></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>IP:</td><td><input id='add_in_ip'></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Senha do SSID:</td><td><input id='add_in_pass'></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Comunidade:</td><td><input id='add_in_community'></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Scan Automatico:</td><td><label class='switch'><input type='checkbox' id='add_in_autoscan'> <span class='slider round'></span></label></td></tr>";
    htm += "</table></td></tr><tr>";
    htm += "<td><center><div class='button' onclick='radioAddSend()'><p style='vertical-align: middle;'>Adicionar</p></div></td>";
    htm += "<td><center><div class='button' onclick='radioCancel()'><p style='vertical-align: middle;'>Cancelar</p></div></td>";
    htm += "</tr>";

    document.getElementById("radios_add_table").innerHTML = htm;
    document.getElementById("radios_add_table").style.opacity = 1;
    document.getElementById("radios_add_table").style.top = "30vh";
}

function updateradio(ip) {
    getIPradio(ip, (radio) => {
        console.log(radio)
        var htm = "<tr><td colspan=2><table class='radios_add_table'>";
        htm += "<tr><td colspan=2><p style='text-align: center;vertical-align: middle;'>Atualizar Radio</td></tr>";
        htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>IP:</td><td><input id='add_in_ip' value='" + radio.ip + "' disabled></td></tr>";
        htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Nome:</td><td><input id='add_in_name' value='" + radio.name + "'></td></tr>";
        htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Senha do SSID:</td><td><input id='add_in_pass' value='" + radio.Pass + "'></td></tr>";
        htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Comunidade:</td><td><input id='add_in_community' value='" + radio.community + "'></td></tr>";
        htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Scan Automatico:</td><td><label class='switch'>";
        htm += "<input type='checkbox' id='add_in_autoscan'" + ((radio.autoscan == 1) ? "checked" : "") + "> <span class='slider round'></span></label></td></tr>";
        htm += "</table></td></tr><tr>";
        htm += "<td><center><div class='button' onclick='radioAddSend()'><p style='vertical-align: middle;'>Atualizar</p></div></td>";
        htm += "<td><center><div class='button' onclick='radioCancel()'><p style='vertical-align: middle;'>Cancelar</p></div></td>";
        htm += "</tr>";

        document.getElementById("radios_add_table").innerHTML = htm;
        document.getElementById("radios_add_table").style.opacity = 1;
        document.getElementById("radios_add_table").style.top = "30vh";
    });
}

function removeradio(ip) {
    getIPradio(ip, (radio) => {

        var htm = "<tr><td colspan=2><table class='radios_add_table'>";
        htm += "<tr><td colspan=2><p style='text-align: center;vertical-align: middle;'>Remover Radio</td></tr>";
        htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Remover Radio: </td><td><p>" + normalizeIP(radio.ip) + "</td></tr>";
        htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Motivo:</td><td><input id='add_in_ip'></td></tr>";
        htm += "</table></td></tr><tr>";
        htm += "<td><center><div class='button' onclick=\"radioRemoveSend('" + radio.ip + "')\"><p style='vertical-align: middle;'>Remover</p></div></td>";
        htm += "<td><center><div class='button' onclick=\"radioCancel()\"><p style='vertical-align: middle;'>Cancelar</p></div></td>";
        htm += "</tr>";

        document.getElementById("radios_add_table").innerHTML = htm;
        document.getElementById("radios_add_table").style.opacity = 1;
        document.getElementById("radios_add_table").style.top = "30vh";

    })
}

function radioAddSend() {
    startLoader();
    var data = {};
    data.name = document.getElementById("add_in_name").value;
    data.ip = normalizeIP(document.getElementById("add_in_ip").value);
    data.autoScan = (document.getElementById("add_in_autoscan").checked) ? 1 : 0;
    data.pass = document.getElementById("add_in_pass").value;
    data.community = document.getElementById("add_in_community").value;

    send("/add_radio", JSON.stringify(data));
}

function radioRemoveSend(ip) {
    getIPradio(ip, (radio) => {
        var radioData = JSON.stringify(radio);
        send("/remove_radio", radioData);
    });
}


function radioCancel() {
    var h = document.getElementById("radios_add_table");
    if (h != undefined) {
        document.getElementById("radios_add_table").style.opacity = 0;
        document.getElementById("radios_add_table").style.top = "-100vh";
        setTimeout(() => {
            h.innerHTML = "";
        }, 1000)
    }
}

function getIPradio(ip, callback) {
    ip = normalizeIP(ip);
    indb.lists["radioList"].forEach(e => {
        if (normalizeIP(e.ip) == ip) {
            callback(e);
            return;
        }
    });
}

function radioUpdateHosts(radio) {
    indb.lists["radioList"] = radio;
    stopLoader();
}

function HostData(e) {
    return "\n\
    Nome:" + e.name + "\n\
    Host:" + e.hostname + "\n\
    IP:" + normalizeIP(e.ip) + "\n\
    MAC: " + e.mac + "\n\
    Fabricante: " + e.vendor + "\n\
    Ativo: " + ((e.alive) ? "Sim" : "Não") + "\n\
    Cadastrado: " + ((e.seted) ? "Sim" : "Não") + "\n\
    ";
}

function RadioDataTable(data) {
    var htm = "";

    var RX = "";
    if (data.RXrate > 1000000) {
        RX = Math.round((data.RXrate / 1024) / 10.24) / 100 + " Mbps";
    } else {
        if (data.RXrate > 1000) {
            RX = Math.round(data.RXrate / 10.24) / 100 + " Kbps";
        } else {
            RX = data.RXrate + " bps";
        }
    }
    var TX = "";
    if (data.TXrate > 1000000) {
        TX = Math.round((data.TXrate / 1024) / 10.24) / 100 + " Mbps";
    } else {
        if (data.TXrate > 1000) {
            TX = Math.round(data.TXrate / 10.24) / 100 + " Kbps";
        } else {
            TX = data.TXrate + " bps";
        }
    }

    htm += "<td class='radios_hostlist_tablelist_td_label'><p title='IP'>IP</p></td>";
    htm += "<td class='radios_hostlist_tablelist_td_label'><p title='Nome'>Nome</p></td>";
    htm += "<td class='radios_hostlist_tablelist_td_label'><p title='Hostname'>Hostname</p></td>";
    htm += "<td class='radios_hostlist_tablelist_td_label'><p title='SSID'>SSID</p></td>";
    htm += "<td class='radios_hostlist_tablelist_td_label'><p title='Senha'>Senha</p></td>";
    htm += "<td class='radios_hostlist_tablelist_td_label'><p title='Criptografia'>Criptografia</p></td>";
    htm += "</tr><tr>";
    htm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + normalizeIP(data.ip) + "\">" + normalizeIP(data.ip) + "</p></td>";
    htm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + data.name + "\">" + data.name + "</p></td>";
    htm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + data.hostname + "\">" + data.hostname + "</p></td>";
    htm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + data.SSID + "\">" + data.SSID + "</p></td>";
    htm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + data.Pass + "\">" + data.Pass + "</p></td>";
    htm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + data.Encrypt + "\">" + data.Encrypt + "</p></td>";

    htm += "</tr><tr>";
    htm += "<td class='radios_hostlist_tablelist_td_label'><p title='RX'>RX</p></td>";
    htm += "<td class='radios_hostlist_tablelist_td_label'><p title='TX'>TX</p></td>";
    htm += "<td class='radios_hostlist_tablelist_td_label'><p title='Abertura Canal'>Abertura Canal</p></td>";
    htm += "<td class='radios_hostlist_tablelist_td_label radios_stats_table_td_label'><p title='Canal'>Canal</p></td>";
    htm += "<td class='radios_hostlist_tablelist_td_label radios_stats_table_td_label'><p title='dBm'>dBm</p></td>";
    htm += "</tr><tr>";
    htm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + RX + "\">" + RX + "</p></td>";
    htm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + TX + "\">" + TX + "</p></td>";
    htm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + data.ChannelWidth + "\">" + data.ChannelWidth + " MHz</p></td>";
    htm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + data.ChannelFreq + "\">" + data.ChannelFreq + " MHz</p></td>";
    htm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + data.dbmPower + "\">" + data.dbmPower + " dBm</p></td>";


    htm += "</tr><tr>";
    htm += "<td class='radios_hostlist_tablelist_td_label radios_stats_table_td_label'><p title='Sinal'>Sinal</p></td>";
    htm += "<td class='radios_hostlist_tablelist_td_label radios_stats_table_td_label'><p title='RSSI'>RSSI</p></td>";
    htm += "<td class='radios_hostlist_tablelist_td_label radios_stats_table_td_label'><p title='Ruido'>Ruido</p></td>";
    htm += "</tr><tr>";
    htm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + data.RadioSignal + "\">" + data.RadioSignal + "</p></td>";
    htm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + data.RSSI + "\">" + data.RSSI + "</p></td>";
    htm += "<td class='radios_hostlist_tablelist_td'><p title=\"" + data.Noise + "\">" + data.Noise + " dBm</p></td>";
    return htm;
}

function getAliveSetedCount(data) {
    if (data != undefined) {
        if (data.length > 0) {
            var alive = 0;
            var seted = 0;
            data.forEach(e => {
                if (e.alive == 1) alive++;
                if (e.seted == 1) seted++;
            })
            return { alive: alive, seted, seted };
        }
    }
}

appendRoutes();
initradios();