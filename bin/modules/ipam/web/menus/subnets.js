var rows_each_request = 20;
var rowsIndex = 1
var main_table = null;

function ipam_subnet_init() {
    appendRoutes();
    send("ipam/top/menu/subnet", {});
    ipam_get_subnet();
}
function ipam_get_subnet() {
    indb.lists["subnetList"] = [];
    send("ipam/get/subnets", {});
    //send("ipam/get/subnet", { start: rows_each_request * (rowsIndex - 1), end: rows_each_request * rowsIndex });
}
//Add new


function appendRoutes() {
    appendRoute("ipam/list/subnet/menu", changeIpamMenuItems);
    appendRoute("ipam/list/subnets", ipam_list_subnet);
    appendRoute("ipam/added/subnet", () => { ipam_get_subnet(); ipam_mess({ status: "OK", mess: "Rede Adicionada com Exito", time: 1000 }); });
    appendRoute("ipam/removed/subnet", () => { ipam_get_subnet(); ipam_mess({ status: "OK", mess: "Rede Removida com Exito", time: 1000 }); });
    appendRoute("ipam/edited/subnet", () => { ipam_get_subnet(); ipam_mess({ status: "OK", mess: "Rede Editada com Exito", time: 1000 }); });
    appendRoute("ipam/disabled/subnet", () => { ipam_get_subnet(); ipam_mess({ status: "OK", mess: "Rede Desabilitada com Exito", time: 1000 }); });
    appendRoute("ipam/enabled/subnet", () => { ipam_get_subnet(); ipam_mess({ status: "OK", mess: "Rede Habilitada com Exito", time: 1000 }); });
}

var actionFunction = "null";
var actionName = "";
var actionIcon = "handle"; //"buttonTick" "buttonCross" "tickCross"
var actionfield = "0";
var actionCallback = null;
var confirmExecution = false;
var actionOptions = [];
var actionRowFormatter = (data) => { };

function ipam_list_subnet(data) {
    console.log(indb);
    indb.lists["subnetList"] = data;
    reloadSubnetTable();
}
function ipam_append_subnet(data) {
    if (data[0] != undefined) {
        rowsIndex++;
        indb.lists["subnetList"] = [].concat(indb.lists["subnetList"], data);
        send("ipam/get/subnet", { start: rows_each_request * (rowsIndex - 1), end: rows_each_request * rowsIndex });
    } else {
        console.log(indb);
        reloadSubnetTable();
    }
    //reloadSubnetTable();
}

function reloadSubnetTable() {
    menuCancel();

    const newCollums = [
        {
            title: actionName, field: actionfield, formatter: actionIcon, cellClick: function (e, cell) {
                var data = cell.getData();
                if (confirmExecution) {
                    if (confirm("Voce esta prestes a " + ((actionOptions.length > 0) ? actionOptions[data[actionfield]] : actionName) + " o Rede: " + data.user + "\nVoce tem certeza disso?")) {
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
        { title: 'Nome', field: 'name', headerFilter: "input" },
        { title: 'IP', field: 'ip', headerFilter: "input" }/*,
        { title: 'Mascara', field: 'netmask', formatter: "tickCross", headerFilter: "select", headerFilterParams: [{ label: "-", value: "" }, { label: "Conectado", value: "1" }, { label: "Desconectado", value: "0" }] },
        { title: 'Ultimo Login', field: 'lastLogin', formatter: ((data) => formatTime(data.getRow().getData().lastLogin)), headerFilter: "input" },
        { title: 'Ultima Tentativa', field: 'lastTry', formatter: ((data) => formatTime(data.getRow().getData().lastTry)), headerFilter: "input" },
        { title: 'Ultimo IP', field: 'lastIp', headerFilter: "input" },
        {
            title: 'Ativo', field: 'active', headerFilter: "input", formatter: "lookup", formatterParams: {
                "1": "Ativo",
                "0": "Inativo"
            }
        },
        { title: 'Adicionado Em', field: 'addedIn', formatter: ((data) => formatTime(data.getRow().getData().addedIn)), headerFilter: "input" },
        { title: 'Adicionado Por', field: 'addedByUser', headerFilter: "input" },
        { title: 'Desativado Em', field: 'deactivatedIn', formatter: ((data) => formatTime(data.getRow().getData().deactivatedIn)), headerFilter: "input" },
        { title: 'Desativado Por', field: 'deactivatedByUser', headerFilter: "input" }//*/
    ];

    main_table = new Tabulator("#ipam_bottom_table", {
        data: indb.lists["subnetList"],
        headerFilterPlaceholder: "Filtrar",
        index: "id_user",
        dataTree: true,
        dataTreeStartExpanded: false,
        columns: newCollums,
        height: '100%',
        paginationButtonCount: 3,
        pagination: "local",
        paginationSize: 15,
        paginationSizeSelector: [10, 15, 20, 25, 30, 50, 100, 200, 500, 1000],
        movableColumns: true,
        rowFormatter: actionRowFormatter
    });
}

var section = "lst";

function createActionField(row) {
    var data = row.getRow().getData();

    htm = "<table><tr>"
    htm += "<td class='action_item'><a onclick=\"User_execute('" + data + "')\" style='transform:rotate(90deg);'>&#9998;</a></td>";
    htm += "</tr></table>"

    return htm;

}


ipam_subnet_init();