function initSubnets() {
    appendRoutes();
    initTopMenuItems();
    startLoader();
    closeLeftMenu();
    loadCSS("Subnets.css");
    //document.getElementById("subnetwork").setAttribute("onclick", "initSubnets()");

    var htm = "";
    htm += "<table id='subnets_main_table' class='subnets_main_table_holder'><tr>";
    htm += "<td><table id='subnets_Lside_table' class='subnets_Lside_table_holder noselect'></table></td>";
    htm += "<td><div class='subnets_Mside_table_holder'><table id='subnets_Mside_table' class='subnets_Mside_table'></table></div></td>";
    htm += "<td><center><table id='subnets_add_table' class='subnets_add_table_holder'></table></td>";

    document.getElementById("mainPage").innerHTML = htm;
    reloadSubnets();
}
/*
function manualScan(ip) {
    startLoader();
    getIPSubnet(ip, (data) => {
        send("/scanSubnet", JSON.stringify(data));
    })
}
/*
function fullManualScan(ip) {
    startLoader();
    getIPSubnet(ip, (data) => {
        send("/fullScanSubnet", JSON.stringify(data));
    })
}//*/

function reloadSubnets(data) {
    subnetCancel();
    send("subnets/get/subnets", {});
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
    appendRoute("subnets/list/subnets", subnet_list);
    appendRoute("subnets/update/subnets", reloadSubnets);
    appendRoute("subnets/list/hosts", host_list);

    appendRoute("subnets/update/hosts", () => {
        subnetCancel();
        reloadHosts(indb.lists['SubnetHosts'])
    })
}

function subnet_list(data) {
    console.log(data)
    subnet_clearHosts();
    indb.lists["SubnetList"] = data;
    subnet_draw();
    stopLoader();
}
function host_list(data) {
    subnet_clearHosts();
    indb.lists["HostList"] = data;
    subnet_drawHosts();
    stopLoader();
}

function subnet_draw() {
    var mp = document.getElementById("subnets_Lside_table");

    var htm = "";
    htm += "<tr class='subnets_Lside_tr_item_label'><td class='subnets_Lside_td_item_label table_header'>";
    htm += "<p>Lista de Redes";
    htm += "<a title='Adicionar'  onclick='addNewSubnet()'>+</a>";
    htm += "<a title='Recarregar'  onclick='reloadSubnets()'>&#8635;</a>";
    htm += "</p></td></tr>";
    htm += "<tr><td><div class='subnets_Lside_table_items_holder'>";
    htm += "<table id='subnets_Lside_table_items_holder' class='subnets_Lside_table'>";
    indb.lists["SubnetList"].forEach(e => {
        htm += "<tr class='subnets_Lside_tr_item'><td class='subnets_Lside_td_item'><p onclick=\"openNewSubnet('" + e.ip + "')\">" + normalizeIP(e.ip) + "/" + e.netmask + "</p>";
        htm += "<td class='subnets_Lside_td_item'><a title='Remover' onclick=\"removeSubnet('" + e.ip + "')\">&minus;</a></td>";
        htm += "<td class='subnets_Lside_td_item'><a title='Escanear' onclick=\"manualScan('" + e.ip + "')\">&#8635;</a></td>";
        htm += "<td class='subnets_Lside_td_item'><a title='Escaneamento Completo' onclick=\"fullManualScan('" + e.ip + "')\">&#8635;</a></td>";
        htm += "<td class='subnets_Lside_td_item'><a title='Editar' onclick=\"updateSubnet('" + e.ip + "')\" style='transform:rotate(90deg);'>&#9998;</a></td>";
        htm += "</td></tr>";
    });
    htm += "</table></div></td></tr>";

    mp.innerHTML = htm;
    setTimeout(() => {
        document.getElementById("subnets_Lside_table").style.opacity = "1";
        document.getElementById("subnets_Lside_table_items_holder").style.opacity = "1";
    }, 300);
}
var oldMX = 0;

function subnet_clearHosts() {
    var md = document.getElementById('subnets_Mside_table');
    if (md != undefined) {
        //md.innerHTML = ""
    }
}

window.addEventListener("resize", () => { subnet_drawHosts(false); })
var changeSubnet = true;
var force = false;

function subnet_drawHosts() {
    document.getElementById("subnets_Mside_table").style.opacity = "0";
    var mx = 64;
    startLoader();
    var subnet = indb.lists["HostList"];

    if (subnet != undefined) {
        if (subnet.hosts != undefined) {
            var md = document.getElementById('subnets_ipmap_table_holder');
            if (md != undefined) {
                var w = (md.offsetWidth / 18);//size
                mx = Math.floor((w / 4) - 0.5) * 4;
                if (mx <= 0) { mx = 8 };
            }
            //if ((oldMX == mx && md != undefined) && (!force || !changeSubnet)) { return; }
            oldMX = mx;

            var mp = document.getElementById("subnets_Mside_table");


            var htm = "";
            //ipmap for active hosts
            if (document.getElementById("subnets_ipmap_table") != undefined) {
                var rhtm = "<tr class='subnets_ipmap_table_tr'>";
                var x = 0, y = 0;
                //
                subnet.hosts.forEach((e) => {
                    rhtm += "<td class='subnets_ipmap_table_td subnet_hosts_td_alive_" + (e.seted + (e.alive * 2)) + "'><p title='" + HostData(e) + "'></p></td>"
                    if (x < mx) {
                    } else {
                        x = -1;
                        rhtm += "</tr><tr class='subnets_ipmap_table_tr'>"
                    }
                    x++;
                })
                rhtm += "</tr>";
                document.getElementById("subnets_ipmap_table").innerHTML = rhtm;
            } else {
                htm += "<tr class='subnets_ipmap_section_tr'><td class='subnets_ipmap_section_td'><div onload='subnet_drawHosts()' id='subnets_ipmap_table_holder' class='subnets_ipmap_table_holder'><table id='subnets_ipmap_table' class='subnets_ipmap_table'>";
                var x = 0, y = 0;
                //
                subnet.hosts.forEach((e) => {
                    htm += "<td class='subnets_ipmap_table_td subnet_hosts_td_alive_" + (e.seted + (e.alive * 2)) + "'><p title='" + HostData(e) + "'></p></td>"
                    if (x < mx) {
                    } else {
                        x = -1;
                        htm += "</tr><tr class='subnets_ipmap_table_tr'>"
                    }
                    x++;
                })
                htm += "";
                htm += "</div></table></td></tr>";
            }


            var s = getAliveSetedCount(subnet.hosts);
            var seted = s.seted;
            var alive = s.alive;

            if (document.getElementById("subnets_stats_table") != undefined) {
                if (document.getElementById("percent-used") != undefined) document.getElementById("percent-used").setAttribute("percent", Math.floor((seted / subnet.hosts.length) * 100));
                if (document.getElementById("percent-alive") != undefined) document.getElementById("percent-alive").setAttribute("percent", Math.floor((alive / subnet.hosts.length) * 100));
                if (document.getElementById("percent-used-holder") != undefined) document.getElementById("percent-used-holder").setAttribute("title", "Hosts cadastrados: " + seted + "/" + subnet.hosts.length);
                if (document.getElementById("percent-alive-holder") != undefined) document.getElementById("percent-alive-holder").setAttribute("title", "Hosts Ativos: " + alive + "/" + subnet.hosts.length);
                if (document.getElementById("subnets_stats_table_infotable") != undefined) document.getElementById("subnets_stats_table_infotable").innerHTML = HostDataTable(subnet);
            } else {
                //stats of subnet

                htm += "<tr class='subnets_stats_section_tr'><td class='subnets_stats_section_td'><div><table id='subnets_stats_table' class='subnets_stats_table'><tr class='table_header'>";
                //graph of used hosts
                htm += "<td class='subnets_stats_table_td_label'><p>Cadastrado:</p></td>";
                htm += "<td class='subnets_stats_table_td_label'><p>Ativo:</p></td>";
                htm += "<td class='subnets_stats_table_td_label'><p>Rede:</p></td>";

                htm += "</tr><tr>"
                //cadastrado
                htm += "<td id='percent-used-holder' class='subnets_stats_table_td'  title='Hosts cadastrados: " + seted + "/" + subnet.hosts.length + "'>";
                htm += "<svg id='percent-used' style='width:100px;height:100px;' percent=" + Math.floor((seted / subnet.hosts.length) * 100) + " front-color='#308030' back-color='#606060' ></svg>"
                htm += "</td>"
                //ativo
                htm += "<td class='subnets_stats_table_td'  title='Hosts Ativos: " + alive + "/" + subnet.hosts.length + "'>";
                htm += "<svg id='percent-alive' style='width:100px;height:100px;' percent=" + Math.floor((alive / subnet.hosts.length) * 100) + " front-color='#308030' back-color='#606060' ></svg>"
                htm += "</td>"
                //Descrição da rede 
                htm += "<td class='subnets_stats_table_td'>";
                htm += "<table id='subnets_stats_table_infotable' class='subnets_stats_table_infotable'>" + HostDataTable(subnet) + "</table>"
                htm += "</td>"

                htm += "";
                htm += "</div></table></td></tr>";
            }

            //Hosts list of subnet
            if (document.getElementById("subnets_hostlist_tablelist") != undefined) {

                document.getElementById("subnets_hostlist_tablelist").innerHTML = htmListHosts(subnet);

            } else {

                htm += "<tr class='subnets_hostlist_section_tr '><td class='subnets_hostlist_section_td'>" +
                    "<div class='subnets_hostlist_tablelist_holder ag-theme-dark' id='subnets_hostlist_tablelist_holder'>";//<table id='subnets_hostlist_tablelist' class='subnets_hostlist_tablelist'>";

                //htm += htmListHosts(subnet);

                htm += "";
                htm += "</div></table></td></tr>";
            }
            //finalize htm
            if (htm != "" &&
                changeSubnet &&
                document.getElementById("subnets_ipmap_table") == undefined &&
                document.getElementById("subnets_stats_table") == undefined &&
                document.getElementById("subnets_hostlist_tablelist") == undefined
            ) {
                htm += "</table></div></td></tr>";
                mp.innerHTML = htm;
            }
            force = false;
            changeSubnet = false;
            setTimeout(() => {
                if (md != undefined) {
                    stopLoader();
                    document.getElementById("subnets_Mside_table").style.opacity = "1";

                    setSVGPercentGraph("percent-used");
                    setSVGPercentGraph("percent-alive");

                    setTable();

                } else {
                    subnet_drawHosts();
                }
            }, 100);
        } else {
            console.log("ERROR: subnet.data undefined on draw subnets")
            //console.log(indb)
        }
    } else {
        console.log("ERROR: subnet undefined on draw subnets")
        //console.log(indb)
    }

}

//******************************************************************************************** */
//new table list

/*
function onPrintColumns() {
    var cols = gridOptions.columnApi.getAllGridColumns();
    var colToNameFunc = function (col, index) {
        return index + ' = ' + col.getId();
    };
    var colNames = cols.map(colToNameFunc).join(', ');
    console.log('columns are: ' + colNames);
}//*/

function setTable() {//tabulator
    var hot = new Tabulator("#subnets_hostlist_tablelist_holder", {
        data: indb.lists["HostList"].hosts,

        columns: [
            { title: "Ações", frozen: true, formatter: createActionField },
            { title: 'IP', field: 'ip', frozen: true, headerFilter: "input" },
            { title: 'Nome', field: 'name', headerFilter: "input" },
            { title: 'Host', field: 'hostname', headerFilter: "input" },
            { title: 'MAC', field: 'mac', headerFilter: "input" },
            { title: 'Portas Abertas', field: 'portsOpen', headerFilter: "input" },
            { title: 'Fabricante', field: 'vendor', headerFilter: "input" }
        ],
        height: '100%',
    });
}
/*
function setTable() { // ag-table
    var columnDefs = [
        {
            headerName: 'Ações', field: 'Ações', pinned: 'left',
            cellRenderer: (params) => { return createActionField(params.data) }
        },
        { headerName: 'IP', field: 'ip', pinned: 'left' },
        { headerName: 'Nome', field: 'name', editable: true },
        { headerName: 'Host', field: 'hostname' },
        { headerName: 'MAC', field: 'mac' },
        { headerName: 'Portas Abertas', field: 'portsOpen' },
        { headerName: 'Fabricante', field: 'vendor' }
    ];

    var gridOptions = {
        suppressDragLeaveHidesColumns: true,
        defaultColDef: {
            width: 150,
            // make every column editable
            editable: false,
            // make every column use 'text' filter by default
            filter: 'agTextColumnFilter',
            //make multple page list
            pagination: true,
            //make colums to be resizable
            resizable: true,
        },
        columnDefs: columnDefs,
        //make the floating filter
        floatingFilter: true,

    };



    var gridDiv = document.getElementById('subnets_hostlist_tablelist_holder');
    new agGrid.Grid(gridDiv, gridOptions);

    gridOptions.api.setRowData(indb.lists["HostList"].hosts);
}
//*/

function action() {

}
function createActionField(row) {
    var data = row.getRow().getData();

    var htm = "<table><tr>"
    htm += "<td class='action_item'><a title='Editar' onclick=\"updateHost('" + data.ip + "')\" style='transform:rotate(90deg);'>&#9998;</a></td>";
    if (data.seted == 0) {
        htm += "<td class='action_item' onclick=\"addHost('" + data.ip + "')\" title='Adicionar'><a style='transform:rotate(90deg);'>&plus;</a></td>";
    } else {
        htm += "<td class='action_item' onclick=\"removeHost('" + data.ip + "')\" title='Remover'><a style='transform:rotate(90deg);'>&minus;</a></td>";
    }

    htm += "</tr></table>"

    return htm;

}

//******************************************************************** */


function htmListHosts(subnet) {
    var htm = "<tr class='subnets_hostlist_tablelist_tr'>";
    htm += "<td class='subnets_hostlist_tablelist_td_label'><input onclick='hideNonActiveHosts()' type='checkbox' id='nonActiveHosts' title='Esconder Hosts não Cadastrados'></td>";
    htm += "<td class='subnets_hostlist_tablelist_td_label'><p title='IP'>IP</p></td>";
    htm += "<td class='subnets_hostlist_tablelist_td_label'><p title='Nome'>Nome</p></td>";
    htm += "<td class='subnets_hostlist_tablelist_td_label'><p title='Host'>Host</p></td>";
    htm += "<td class='subnets_hostlist_tablelist_td_label'><p title='MAC'>MAC</p></td>";
    htm += "<td class='subnets_hostlist_tablelist_td_label'><p title='Portas Abertas'>Portas Abertas</p></td>";
    htm += "<td class='subnets_hostlist_tablelist_td_label'><p title='Fabricante'>Fabricante</p></td>";
    htm += "<td class='subnets_hostlist_tablelist_td_label' colspan=2><p title='Ações'>Ações</p></td>";

    subnet.hosts.forEach((e) => {
        htm += "<tr id='subnets_hostlist_tablelist_tr_ip-" + e.ip + "' class='" + ((e.seted == 1) ? "hostSeted_1" : "hostSeted_0") + " subnets_hostlist_tablelist_tr hostSeted_" + e.seted + " hide'>";
        htm += "<td class='subnets_hostlist_tablelist_td_dot subnet_hosts_td_alive_" + (e.seted + (e.alive * 2)) + "'><p title='" + HostData(e) + "'></p></td>";
        htm += "<td class='subnets_hostlist_tablelist_td'><p title=\"" + normalizeIP(e.ip) + "\">" + normalizeIP(e.ip) + "</p></td>";
        htm += "<td class='subnets_hostlist_tablelist_td'><p title=\"" + e.name + "\">" + e.name + "</p></td>";
        htm += "<td class='subnets_hostlist_tablelist_td'><p title=\"" + e.hostname + "\">" + e.hostname + "</p></td>";
        htm += "<td class='subnets_hostlist_tablelist_td'><p title=\"" + e.mac + "\">" + e.mac + "</p></td>";
        htm += "<td class='subnets_hostlist_tablelist_td'><p title=\"" + ((e.portsOpen != undefined || e.portsOpen != null) ? e.portsOpen : "-") + "\">" + ((e.portsOpen != undefined || e.portsOpen != null) ? e.portsOpen : "-") + "</p></td>";
        htm += "<td class='subnets_hostlist_tablelist_td'><p title=\"" + e.vendor + "\">" + e.vendor + "</p></td>";
        htm += "<td class='subnets_hostlist_tablelist_td'><a title='Editar' onclick=\"updateHost('" + e.ip + "')\" style='transform:rotate(90deg);'>&#9998;</a></td>";
        if (e.seted == 0) {
            htm += "<td class='subnets_hostlist_tablelist_td' onclick=\"addHost('" + e.ip + "')\" title='Adicionar'><a style='transform:rotate(90deg);'>&plus;</a></td>";
        } else {
            htm += "<td class='subnets_hostlist_tablelist_td' onclick=\"removeHost('" + e.ip + "')\" title='Editar'><a style='transform:rotate(90deg);'>&minus;</a></td>";
        }
        htm += "</tr>";
        htm += "";
    })
    return htm;
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

function openNewSubnet(ip) {
    changeSubnet = true;
    openSubnetItem(ip);
}

function openSubnetItem(ip) {
    if (ip != undefined) {
        startLoader();
        getIPSubnet(ip, (subnet) => {
            var subnetData = JSON.stringify(subnet);
            send("subnet/get/hosts", subnetData);
        })
    }
}

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
    htm += "<td><center><input type='button' value='Cancelar' onclick='subnetCancel()'></td>";
    htm += "</tr>";

    document.getElementById("subnets_add_table").innerHTML = htm;
    document.getElementById("subnets_add_table").style.opacity = 1;
    document.getElementById("subnets_add_table").style.top = "30vh";
}

function updateSubnet(ip) {
    getIPSubnet(ip, (subnet) => {
        var htm = "<tr><td colspan=2><table class='subnets_add_table'>";
        htm += "<tr><td colspan=2><p style='text-align: center;vertical-align: middle;'>Atualizar Rede</td></tr>";
        htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Nome:</td><td><input id='add_in_name' value='" + subnet.name + "'></td></tr>";
        htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>IP:</td><td><input id='add_in_ip' value='" + subnet.ip + "'></td></tr>";
        htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Gateway:</td><td><input id='add_in_gtw' value='" + subnet.gtw + "'></td></tr>";
        htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>NetMask:</td><td><input id='add_in_nmask' value='" + subnet.netmask + "'></td></tr>";
        htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Scan Automatico:</td><td><label class='switch'><input type='checkbox' id='add_in_autoscan' " + ((subnet.autoscan) ? "checked" : "") + "> <span class='slider round'></span></label></td></tr>";
        htm += "</table></td></tr><tr>";
        htm += "<td><center><input type='button' value='Adicionar' onclick='subnetAddSend()'></td>";
        htm += "<td><center><input type='button' value='Cancelar' onclick='subnetCancel()'></td>";
        htm += "</tr>";

        document.getElementById("subnets_add_table").innerHTML = htm;
        document.getElementById("subnets_add_table").style.opacity = 1;
        document.getElementById("subnets_add_table").style.top = "30vh";
    });
}

function removeSubnet(ip) {
    getIPSubnet(ip, (subnet) => {

        var htm = "<tr><td colspan=2><table class='subnets_add_table'>";
        htm += "<tr><td colspan=2><p style='text-align: center;vertical-align: middle;'>Remover Rede</td></tr>";
        htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Remover Subrede: </td><td><p>" + normalizeIP(subnet.ip) + "</td></tr>";
        htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Motivo:</td><td><input id='add_in_ip'></td></tr>";
        htm += "</table></td></tr><tr>";
        htm += "<td><center><input onclick=\"subnetRemoveSend('" + subnet.ip + "')\" value='Remover'></td>";
        htm += "<td><center><input type='button' value='Cancelar' onclick='subnetCancel()'></td>";
        htm += "</tr>";

        document.getElementById("subnets_add_table").innerHTML = htm;
        document.getElementById("subnets_add_table").style.opacity = 1;
        document.getElementById("subnets_add_table").style.top = "30vh";

    })
}

function addHost(ip) {
    getIPHost(ip, (host) => {
        var htm = "<tr><td colspan=2><table class='subnets_add_table'>";
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

        document.getElementById("subnets_add_table").innerHTML = htm;
        document.getElementById("subnets_add_table").style.opacity = 1;
        document.getElementById("subnets_add_table").style.top = "30vh";
    });
}

function updateHost(ip) {
    getIPHost(ip, (host) => {
        var htm = "<tr><td colspan=2><table class='subnets_add_table'>";
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

        document.getElementById("subnets_add_table").innerHTML = htm;
        document.getElementById("subnets_add_table").style.opacity = 1;
        document.getElementById("subnets_add_table").style.top = "30vh";
    });
}

function removeHost(ip) {
    getIPHost(ip, (host) => {
        var htm = "<tr><td colspan=2><table class='subnets_add_table'>";
        htm += "<tr><td colspan=2><p style='text-align: center;vertical-align: middle;'>Remover Host</td></tr>";
        htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Remover Subrede: </td><td><p>" + normalizeIP4(host.ip) + "</td></tr>";
        htm += "<tr><td><p style='text-align: right;vertical-align: middle;'>Motivo:</td><td><input id='add_in_ip'></td></tr>";
        htm += "</table></td></tr><tr>";
        htm += "<td><center><div class='button' onclick='hostRemoveSend(\"" + host.ip + "\")'><p style='vertical-align: middle;'>Atualizar</p></div></td>";
        htm += "<td><center><div class='button' onclick='subnetCancel()'><p style='vertical-align: middle;'>Cancelar</p></div></td>";
        htm += "</tr>";

        document.getElementById("subnets_add_table").innerHTML = htm;
        document.getElementById("subnets_add_table").style.opacity = 1;
        document.getElementById("subnets_add_table").style.top = "30vh";
    });
}

function subnetAddSend() {
    startLoader();
    var data = {};
    data.name = document.getElementById("add_in_name").value;
    data.ip = normalizeIP3(document.getElementById("add_in_ip").value);
    data.gtw = normalizeIP(document.getElementById("add_in_gtw").value);
    data.netmask = normalizeNetmask(document.getElementById("add_in_nmask").value);
    data.autoScan = (document.getElementById("add_in_autoscan").checked) ? 1 : 0;

    send("/add_subnet", JSON.stringify(data));
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
    var h = document.getElementById("subnets_add_table");
    if (h != undefined) {
        document.getElementById("subnets_add_table").style.opacity = 0;
        document.getElementById("subnets_add_table").style.top = "-100vh";
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
    subnet_drawHosts();
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
    <tr><td>Mascara:</td><td>` + GetFullNetmask(data.netmask) + ` / ` + data.netmask + `</td>    <td style='background:tranparent;padding:10px;'></td><td>Scan Automatico:</td><td class='subnets_hostlist_tablelist_td_dot subnet_hosts_td_alive_` + (1 + (data.autoscan * 2)) + `'><p></p></td></tr>
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

initSubnets();