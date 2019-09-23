function inithosts() {
    initTopMenuItems();
    changeTopMenuItems([{ name: "Export to CSV", onclick: "export_csv()" }]);
    startLoader();
    closeLeftMenu();
    loadCSS("Hosts.css");
    document.getElementById("hostsnetwork").setAttribute("onclick", "inithosts()");

    var htm = "";
    htm += "<table id='hosts_main_table' class='hosts_main_table_holder'><tr>";
    htm += "<td><div class='hosts_Mside_table_holder'><table id='hosts_Mside_table' class='hosts_Mside_table'></table></div></td>";
    htm += "<td><center><table id='hosts_add_table' class='hosts_add_table_holder'></table></td>";

    document.getElementById("mainPage").innerHTML = htm;
    reloadhosts();
}

function reloadhosts(data) {
    subnetCancel();
    send("/get_all_hosts", "{}");
    if (data != undefined) {
        startLoader();
        setTimeout(() => {
            reloadHosts(data);
        }, 500);
    }
}

function reloadHosts(data) {
    startLoader();
    openSubnetItem(data.ip);
    stopLoader();
}

function appendRoutes() {
    appendRoute("/hosts_hosts_list", subnetUpdateHosts);
}

function subnet_list(data) {
    subnet_clearHosts();
    indb.lists["SubnetList"] = data;
    subnet_draw();
    stopLoader();
}

var oldMX = 0;

function subnet_clearHosts() {
    var md = document.getElementById('hosts_Mside_table');
    if (md != undefined) {
        //md.innerHTML = ""
    }
}

var changeSubnet = true;
var force = false;

function draw_hostsSubnet() {
    document.getElementById("hosts_Mside_table").style.opacity = "0";
    var mx = 64;
    startLoader();
    var subnet = indb.lists["SubnetHosts"];

    if (subnet != undefined) {
        if (subnet.hosts != undefined) {

            var mp = document.getElementById("hosts_Mside_table");
            var htm = "";

            if (document.getElementById("hosts_hostlist_tablelist") != undefined) {

                document.getElementById("hosts_hostlist_tablelist").innerHTML = htmListHosts(subnet);

            } else {

                htm += "<tr class='hosts_hostlist_section_tr '><td class='hosts_hostlist_section_td'><div class='hosts_hostlist_tablelist_holder'><table id='hosts_hostlist_tablelist' class='hosts_hostlist_tablelist'>";

                htm += htmListHosts(subnet);

                htm += "";
                htm += "</div></table></td></tr>";
            }
            //finalize htm
            if (htm != "" &&
                changeSubnet &&
                document.getElementById("hosts_ipmap_table") == undefined &&
                document.getElementById("hosts_stats_table") == undefined &&
                document.getElementById("hosts_hostlist_tablelist") == undefined
            ) {
                htm += "</table></div></td></tr>";
                mp.innerHTML = htm;
            }


            //Hosts list of subnet


            setTimeout(() => {
                stopLoader();
                document.getElementById("hosts_Mside_table").style.opacity = "1";

            }, 100);
        } else {
            console.log("ERROR: subnet.data undefined on draw hosts")
            console.log(indb)
        }
    } else {
        console.log("ERROR: subnet undefined on draw hosts")
        console.log(indb)
    }

}

function hideNonActiveHosts() {
    datatoexport = [];
    var d = document.getElementById("nonActiveHosts");
    var l = document.querySelectorAll("tr.hostSeted_0");
    if (l != undefined) {
        l.forEach(e => {
            if (d.checked) {
                e.style.display = "none";
            } else {
                e.style.display = "";
                datatoexport.push(JSON.parse(e.getAttribute("data")));
            }
        })
    }
}

var datatoexport = [];

function filterUpdate() {
    hideNonActiveHosts();
    datatoexport = [];
    var d = document.getElementById("nonActiveHosts");
    var l = document.querySelectorAll("tr.hostSeted_1");
    if (l != undefined) {
        l.forEach(e => {
            var fitems = e.getElementsByTagName("p");
            var hide = false;
            for (let f of fitems) {
                if (!hide) {
                    if (document.getElementById("input" + f.id) != undefined) {
                        var val = document.getElementById("input" + f.id).value;
                        if (val != "") {
                            if (f.innerHTML.indexOf(val) == -1) {
                                hide = true;
                            } else {
                                hide = false;
                            }
                        }
                    }
                }
            }

            if (hide) {
                e.style.display = "none";
            } else {
                e.style.display = "";
                datatoexport.push(JSON.parse(e.getAttribute("data")));
            }
        })
    }
}

function export_csv() {
    //console.log(datatoexport);

    //prompt fields to export
    var htm = "<tr><td colspan=2><table class='hosts_add_table'>";
    htm += "<tr><td colspan=2><p style='text-align: center;vertical-align: middle;'>Atualizar Host</td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>IP:</td><td><input id='addin_ip' type='checkbox' checked></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Nome:</td><td><input id='addin_name' type='checkbox' checked></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Host:</td><td><input id='addin_host' type='checkbox' checked></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>MAC:</td><td><input id='addin_mac' type='checkbox' checked></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Portas Abertas:</td><td><input id='addin_ports' type='checkbox' checked></td></tr>";
    htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Fabricante:</td><td><input id='addin_vendor' type='checkbox' checked></td></tr>";
    htm += "</table></td></tr><tr>";
    htm += "<td><center><div class='button' onclick='export_csv_save()'><p style='vertical-align: middle;'>Salvar</p></div></td>";
    htm += "<td><center><div class='button' onclick='subnetCancel()'><p style='vertical-align: middle;'>Cancelar</p></div></td>";
    htm += "</tr>";

    document.getElementById("hosts_add_table").innerHTML = htm;
    document.getElementById("hosts_add_table").style.opacity = 1;
    document.getElementById("hosts_add_table").style.top = "30vh";
}

function export_csv_save() {
    startLoader();
    var data = {};
    data.name = document.getElementById("addin_name").checked;
    data.ip = document.getElementById("addin_ip").checked;
    data.mac = document.getElementById("addin_mac").checked;
    data.hostname = document.getElementById("addin_host").checked;
    data.vendor = document.getElementById("addin_vendor").checked;
    data.ports = document.getElementById("addin_ports").checked;

    var rows = [];
    var r = [];

    if (data.name) r.push("nome");
    if (data.ip) r.push("ip");
    if (data.hostname) r.push("host");
    if (data.mac) r.push("mac");
    if (data.vendor) r.push("fabricante");
    if (data.ports) r.push("portas");

    rows.push(r);


    datatoexport.forEach(e => {
        r = [];
        if (data.name) r.push(e.name);
        if (data.ip) r.push(e.ip);
        if (data.hostname) r.push(e.hostname);
        if (data.mac) r.push(e.mac);
        if (data.vendor) r.push((e.vendor).replace(new RegExp(",", "g"), "."));
        if (data.ports) r.push(e.portsOpen);
        rows.push(r);
        console.log(r);
    })

    let csvContent = "data:text/csv;charset=utf-8,";

    rows.forEach(function (rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("styles", "position:absolute; display:none");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Export.csv");
    document.body.appendChild(link); // Required for FF

    link.click();
    stopLoader();
    subnetCancel();
}

function htmListHosts(subnet) {
    datatoexport = [];
    var htm = "<tr class='hosts_hostlist_tablelist_tr'>";
    htm += "<td class='hosts_hostlist_tablelist_td_label'><input onclick='hideNonActiveHosts()' type='checkbox' id='nonActiveHosts' title='Esconder Hosts não Cadastrados'></td>";
    htm += "<td class='hosts_hostlist_tablelist_td_label'><p title='IP'>IP</p></td>";
    htm += "<td class='hosts_hostlist_tablelist_td_label'><p title='Nome'>Nome</p></td>";
    htm += "<td class='hosts_hostlist_tablelist_td_label'><p title='Host'>Host</p></td>";
    htm += "<td class='hosts_hostlist_tablelist_td_label'><p title='MAC'>MAC</p></td>";
    htm += "<td class='hosts_hostlist_tablelist_td_label'><p title='Portas Abertas'>Portas Abertas</p></td>";
    htm += "<td class='hosts_hostlist_tablelist_td_label'><p title='Fabricante'>Fabricante</p></td>";
    htm += "<td class='hosts_hostlist_tablelist_td_label' colspan=2><p title='Ações'>Ações</p></td>";

    htm += "<tr class='hosts_hostlist_tablelist_tr'>";
    htm += "<td class='hosts_hostlist_tablelist_td_dot subnet_hosts_td_alive_3'><p title='Filtrar' onclick='filterUpdate()'></p></td>"
    htm += "<td class='hosts_hostlist_tablelist_td_label'><input id='input_ip' type='text'></input></td>";
    htm += "<td class='hosts_hostlist_tablelist_td_label'><input id='input_name' type='text'></input></td>";
    htm += "<td class='hosts_hostlist_tablelist_td_label'><input id='input_host' type='text'></input></td>";
    htm += "<td class='hosts_hostlist_tablelist_td_label'><input id='input_mac' type='text'></input></td>";
    htm += "<td class='hosts_hostlist_tablelist_td_label'><input id='input_ports' type='text'></input></td>";
    htm += "<td class='hosts_hostlist_tablelist_td_label'><input id='input_vendor' type='text'></input></td>";
    htm += "<td class='hosts_hostlist_tablelist_td_label' colspan=2></td>";

    subnet.hosts.forEach((e) => {
        htm += "<tr data=\'" + JSON.stringify(e) + "\' id='hosts_hostlist_tablelist_tr_ip-" + e.ip + "' class='" + ((e.seted == 1) ? "hostSeted_1" : "hostSeted_0") + " hosts_hostlist_tablelist_tr hostSeted_" + e.seted + " hide'>";
        htm += "<td class='hosts_hostlist_tablelist_td_dot subnet_hosts_td_alive_" + (e.seted + (e.alive * 2)) + "'><p title='" + HostData(e) + "'></p></td>";
        htm += "<td class='hosts_hostlist_tablelist_td'><p id='_ip' title=\"" + normalizeIP(e.ip) + "\">" + normalizeIP(e.ip) + "</p></td>";
        htm += "<td class='hosts_hostlist_tablelist_td'><p id='_name' title=\"" + e.name + "\">" + e.name + "</p></td>";
        htm += "<td class='hosts_hostlist_tablelist_td'><p id='_host' title=\"" + e.hostname + "\">" + e.hostname + "</p></td>";
        htm += "<td class='hosts_hostlist_tablelist_td'><p id='_mac' title=\"" + e.mac + "\">" + e.mac + "</p></td>";
        htm += "<td class='hosts_hostlist_tablelist_td'><p id='_ports' title=\"" + ((e.portsOpen != undefined || e.portsOpen != null) ? e.portsOpen : "-") + "\">" + ((e.portsOpen != undefined || e.portsOpen != null) ? e.portsOpen : "-") + "</p></td>";
        htm += "<td class='hosts_hostlist_tablelist_td'><p id='_vendor' title=\"" + e.vendor + "\">" + e.vendor + "</p></td>";
        htm += "<td class='hosts_hostlist_tablelist_td'><a title='Editar' onclick=\"updateHost('" + e.ip + "')\" style='transform:rotate(90deg);'>&#9998;</a></td>";
        if (e.seted == 0) {
            htm += "<td class='hosts_hostlist_tablelist_td' onclick=\"addHost('" + e.ip + "')\" title='Adicionar'><a style='transform:rotate(90deg);'>&plus;</a></td>";
        } else {
            htm += "<td class='hosts_hostlist_tablelist_td' onclick=\"removeHost('" + e.ip + "')\" title='Editar'><a style='transform:rotate(90deg);'>&minus;</a></td>";
        }
        htm += "</tr>";
        htm += "";

        datatoexport.push(e);
    })
    return htm;
}

function addHost(ip) {
    getIPHost(ip, (host) => {
        var htm = "<tr><td colspan=2><table class='hosts_add_table'>";
        htm += "<tr><td colspan=2><p style='text-align: center;vertical-align: middle;'>Adicionar Host</td></tr>";
        htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Rede:</td><td><input id='add_in_subnet' value='" + normalizeIP(host.subnet) + "' disabled></td></tr>";
        htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>IP:</td><td><input id='add_in_ip' value='" + normalizeIP(host.ip) + "' disabled></td></tr>";
        htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Nome:</td><td><input id='add_in_name' value='" + host.name + "'></td></tr>";
        htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Host:</td><td><input id='add_in_hostname' value='" + host.hostname + "'></td></tr>";
        htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Mac:</td><td><input id='add_in_mac' value='" + host.mac + "'></td></tr>";
        htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Fabricante:</td><td><input id='add_in_vendor' value='" + host.vendor + "'></td></tr>";
        htm += "</table></td></tr><tr>";
        htm += "<td><center><div class='button' onclick='subnetHostAddSend()'><p style='vertical-align: middle;'>Atualizar</p></div></td>";
        htm += "<td><center><div class='button' onclick='subnetCancel()'><p style='vertical-align: middle;'>Cancelar</p></div></td>";
        htm += "</tr>";

        document.getElementById("hosts_add_table").innerHTML = htm;
        document.getElementById("hosts_add_table").style.opacity = 1;
        document.getElementById("hosts_add_table").style.top = "30vh";
    });
}

function updateHost(ip) {
    getIPHost(ip, (host) => {
        var htm = "<tr><td colspan=2><table class='hosts_add_table'>";
        htm += "<tr><td colspan=2><p style='text-align: center;vertical-align: middle;'>Atualizar Host</td></tr>";
        htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Rede:</td><td><input id='add_in_subnet' value='" + normalizeIP(host.subnet) + "' disabled></td></tr>";
        htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>IP:</td><td><input id='add_in_ip' value='" + normalizeIP(host.ip) + "' disabled></td></tr>";
        htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Nome:</td><td><input id='add_in_name' value='" + host.name + "'></td></tr>";
        htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Host:</td><td><input id='add_in_hostname' value='" + host.hostname + "'></td></tr>";
        htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Mac:</td><td><input id='add_in_mac' value='" + host.mac + "'></td></tr>";
        htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Fabricante:</td><td><input id='add_in_vendor' value='" + host.vendor + "'></td></tr>";
        htm += "</table></td></tr><tr>";
        htm += "<td><center><div class='button' onclick='subnetHostAddSend()'><p style='vertical-align: middle;'>Atualizar</p></div></td>";
        htm += "<td><center><div class='button' onclick='subnetCancel()'><p style='vertical-align: middle;'>Cancelar</p></div></td>";
        htm += "</tr>";

        document.getElementById("hosts_add_table").innerHTML = htm;
        document.getElementById("hosts_add_table").style.opacity = 1;
        document.getElementById("hosts_add_table").style.top = "30vh";
    });
}

function removeHost(ip) {
    getIPHost(ip, (host) => {
        var htm = "<tr><td colspan=2><table class='hosts_add_table'>";
        htm += "<tr><td colspan=2><p style='text-align: center;vertical-align: middle;'>Remover Host</td></tr>";
        htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Remover Subrede: </td><td><p>" + normalizeIP4(host.ip) + "</td></tr>";
        htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Motivo:</td><td><input id='add_in_ip'></td></tr>";
        htm += "</table></td></tr><tr>";
        htm += "<td><center><div class='button' onclick='hostRemoveSend(\"" + host.ip + "\")'><p style='vertical-align: middle;'>Atualizar</p></div></td>";
        htm += "<td><center><div class='button' onclick='subnetCancel()'><p style='vertical-align: middle;'>Cancelar</p></div></td>";
        htm += "</tr>";

        document.getElementById("hosts_add_table").innerHTML = htm;
        document.getElementById("hosts_add_table").style.opacity = 1;
        document.getElementById("hosts_add_table").style.top = "30vh";
    });
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

function subnetRemoveSend(ip) {
    getIPSubnet(ip, (subnet) => {
        var subnetData = JSON.stringify(subnet);
        send("/remove_subnet", subnetData);
    });
}

function hostRemoveSend(ip) {
    getIPHost(ip, (host) => {
        var hostData = JSON.stringify(host);
        send("/remove_host", hostData);
    });
}

function subnetCancel() {
    var h = document.getElementById("hosts_add_table");
    if (h != undefined) {
        document.getElementById("hosts_add_table").style.opacity = 0;
        document.getElementById("hosts_add_table").style.top = "-100vh";
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

function getIPHost(ip, callback) {
    ip = normalizeIP(ip);
    indb.lists["SubnetHosts"].hosts.forEach(e => {
        if (normalizeIP(e.ip) == ip) {
            callback(e);
            return;
        }
    });
}

function subnetUpdateHosts(subnet) {
    indb.lists["SubnetHosts"] = subnet;
    draw_hostsSubnet();
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

function HostDataTable(data) {
    return `
    <tr><td>Nome:</td><td>` + data.name + `</td>                                                 <td style='background:tranparent;padding:10px;'></td><td>IP Range:</td><td>` + GetInitialHost(data.ip) + ` - ` + GetEndHost(data.ip, data.netmask) + `</td></tr>
    <tr><td>IP:</td><td>` + normalizeIP(data.ip) + `</td>                                        <td style='background:tranparent;padding:10px;'></td><td>Quantidade de Hosts:</td><td>` + GetNHosts(data.netmask) + `</td></tr>
    <tr><td>Mascara:</td><td>` + GetFullNetmask(data.netmask) + ` / ` + data.netmask + `</td>    <td style='background:tranparent;padding:10px;'></td><td>Scan Automatico:</td><td class='hosts_hostlist_tablelist_td_dot subnet_hosts_td_alive_` + (1 + (data.autoscan * 2)) + `'><p></p></td></tr>
    <tr><td>Gateway:</td><td>` + normalizeIP(data.gtw) + `</td>                                  
    `;
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
inithosts();