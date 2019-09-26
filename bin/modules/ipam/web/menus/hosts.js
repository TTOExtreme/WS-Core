var rows_each_request = 20;
var rowsIndex = 1
var main_table = null;

function ipam_host_init() {
    appendRoutes();
    send("ipam/top/menu/hosts", {});
    ipam_get_host();
}
function ipam_get_host() {
    stopLoader();
    menuCancel();
    indb.lists["hostsList"] = [];
    send("ipam/get/subnets", {});
}
//Add new


function appendRoutes() {
    appendRoute("ipam/list/hosts/menu", changeIpamMenuItems);
    appendRoute("ipam/list/subnets", ipam_list_host);
    appendRoute("ipam/list/hosts", update_subnet);
    appendRoute("ipam/added/hosts", () => { ipam_get_host(); system_mess({ status: "OK", mess: "Host Adicionado com Exito", time: 1000 }); });
    appendRoute("ipam/removed/hosts", () => { ipam_get_host(); system_mess({ status: "OK", mess: "Host Removido com Exito", time: 1000 }); });
    appendRoute("ipam/edited/hosts", (data) => { send("ipam/get/singlehost", { ip: data.data.ip }); system_mess({ status: "OK", mess: "Host Editado com Exito", time: 1000 }); });
    appendRoute("ipam/disabled/hosts", () => { ipam_get_host(); system_mess({ status: "OK", mess: "Host Desabilitado com Exito", time: 1000 }); });
    appendRoute("ipam/enabled/hosts", () => { ipam_get_host(); system_mess({ status: "OK", mess: "Host Habilitado com Exito", time: 1000 }); });
}


var actionFunction = "null";
var actionName = "Ações";
var actionIcon = "buttonTick"; //"buttonTick" "buttonCross" "tickCross"
var actionfield = "";
var actionCallback = (data) => {
    if (data.hosts != undefined) {
        main_table.setData(data.hosts);
    } else {
        actionIcon = "";
    }
};
var confirmExecution = false;
var actionOptions = [];
var actionRowFormatter = (data) => { return "Abrir"; };

function ipam_list_host(data) {
    indb.lists["hostsList"] = data;
    reloadSubnetTable();
    indb.lists["hostsList"].forEach(subnet => {
        send("ipam/get/hosts", subnet);
    });
}

function update_subnet(data) {
    stopLoader();
    menuCancel();
    console.log(data);
    if (main_table != null) {
        main_table.updateData([data]);
    }
}

function reloadSubnetTable() {
    menuCancel();

    const newCollums = [
        {
            title: actionName, field: actionfield, formatter: actionIcon, cellClick: function (e, cell) {
                var data = cell.getData();
                if (confirmExecution) {
                    if (confirm("Voce esta prestes a " + ((actionOptions.length > 0) ? actionOptions[data[actionfield]] : actionName) + " o Host: " + normalizeIP(data.ip) + "\nVoce tem certeza disso?")) {
                        if (actionCallback != null) {
                            actionCallback(data);
                        } else {
                            send(actionFunction, data);
                        }
                    }
                } else {
                    if (actionCallback != null) {
                        actionCallback(data);
                    } else {
                        send(actionFunction, data);
                    }
                }
            }, visible: !(actionName == "")
        },
        {
            title: 'Status', field: 'status', headerFilter: "select", headerFilterParams:
                [{ label: "-", value: "" }, { label: "Livre", value: "0" }, { label: "Inativo", value: "1" }, { label: "Ativo", value: "3" }],
            headerFilterFunc: filterStatus, formatter: ((data) => {
                return (data.getRow().getData().seted == undefined) ? "-" :
                    ("<div class='div_dot div_dot_" + (data.getRow().getData().seted + (data.getRow().getData().alive * 2)) +
                        "'><p title='" + HostData(data.getRow().getData()) + "'></p></div>")
            })
        },
        { title: 'Nome', field: 'name', headerFilter: "input", formatter: ((data) => { return (data.getRow().getData().name == undefined) ? "-" : data.getRow().getData().name }) },
        { title: 'Hostname', field: 'hostname', headerFilter: "input", formatter: ((data) => { return (data.getRow().getData().hostname == undefined) ? "-" : data.getRow().getData().hostname }) },
        { title: 'IP', field: 'ip', headerFilter: "input", formatter: ((data) => normalizeIP(data.getRow().getData().ip)) },
        { title: 'MAC', field: 'mac', headerFilter: "input", formatter: ((data) => { return (data.getRow().getData().mac == undefined) ? "-" : data.getRow().getData().mac }) },
        { title: 'Fabricante', field: 'vendor', headerFilter: "input", formatter: ((data) => { return (data.getRow().getData().vendor == undefined) ? "-" : data.getRow().getData().vendor }) },
        { title: 'Portas Abertas', field: 'openPorts', headerFilter: "input", formatter: ((data) => { return (data.getRow().getData().vendor == undefined) ? "-" : data.getRow().getData().vendor }) }
    ];

    main_table = new Tabulator("#ipam_bottom_table", {
        data: indb.lists["hostsList"],
        headerFilterPlaceholder: "Filtrar",
        index: "ip",
        dataTree: false,
        /*
        dataTreeChildField: "hosts",
        dataTreeStartExpanded: false,
        dataTreeChildIndent: 25,
        //*/

        columns: newCollums,
        height: '100%',
        paginationButtonCount: 3,
        pagination: "local",
        paginationSize: 15,
        paginationSizeSelector: [10, 15, 20, 25, 30, 50, 100, 200, 500, 1000],
        movableColumns: true,
        layout: "fitColumns",
        rowFormatter: actionRowFormatter
    });
}

function filterStatus(headerValue, cellValue, rowData, filterParams) {
    //headerValue - the value of the header filter element
    //cellValue- the value of the column in this row
    //rowData - the data for the row being filtered
    //filterParams - params object passed to the headerFilterFuncParams property

    var matched = false;

    if (headerValue == rowData.seted + (rowData.alive * 2)) {
        matched = true;
    }

    return matched;
}

var section = "lst";

function createActionField(row) {
    var data = row.getRow().getData();

    htm = "<table><tr>"
    htm += "<td class='action_item'><a onclick=\"User_execute('" + data + "')\" style='transform:rotate(90deg);'>&#9998;</a></td>";
    htm += "</tr></table>"

    return htm;

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

ipam_host_init();


function menuCancel() {
    var h = document.getElementById("overlay_input_table");
    if (h != undefined) {
        document.getElementById("overlay_input_table").style.opacity = 0;
        document.getElementById("overlay_input_table").style.top = "-100vh";
    }
}