var rows_each_request = 20;
var rowsIndex = 1
var main_table = null;

function radios_radios_init() {
    appendRoutes();
    send("radios/top/menu/connection", {});
    radios_get_connection();
}
function radios_get_connection() {
    stopLoader();
    menuCancel();
    indb.lists["radiosList"] = [];
    indb.lists["connectionList"] = [];
    send("radios/get/radios", {});
    send("radios/get/connection", {});
}
//Add new


function appendRoutes() {
    appendRoute("radios/list/connection/menu", changeRadiosMenuItems);
    appendRoute("radios/list/radios", radios_list_radios);
    appendRoute("radios/list/connection", radios_list_connection);
    appendRoute("radios/added/connection", () => { radios_get_connection(); system_mess({ status: "OK", mess: "Enlace Adicionado com Exito", time: 1000 }); });
    appendRoute("radios/removed/connection", () => { radios_get_connection(); system_mess({ status: "OK", mess: "Enlace Removido com Exito", time: 1000 }); });
}

var actionFunction = "null";
var actionName = "";
var actionIcon = "handle"; //"buttonTick" "buttonCross" "tickCross"
var actionfield = "0";
var actionCallback = null;
var confirmExecution = false;
var actionOptions = [];
var actionRowFormatter = (data) => { };

function radios_list_radios(data) {
    indb.lists["radiosList"] = data;
}
function radios_list_connection(data) {
    indb.lists["connectionList"] = data;
    reloadSubnetTable();
}
function radios_append_radios(data) {
    if (data[0] != undefined) {
        rowsIndex++;
        indb.lists["radiosList"] = [].concat(indb.lists["radiosList"], data);
        send("radios/get/radios", { start: rows_each_request * (rowsIndex - 1), end: rows_each_request * rowsIndex });
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
                    if (confirm("Voce esta prestes a " + ((actionOptions.length > 0) ? actionOptions[data[actionfield]] : actionName) + " a Radio: " + data.name + "\nVoce tem certeza disso?")) {
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
            }, visible: !(actionName == ""), frozen: true
        },
        { title: 'AP', field: 'id_radio_ap', headerFilter: "input", formatter: ((data) => { console.log(searchRadio(data.getRow().getData().id_radio_ap)); return searchRadio(data.getRow().getData().id_radio_ap).name }) },
        { title: 'Estação', field: 'id_radio_st', headerFilter: "input", formatter: ((data) => { return searchRadio(data.getRow().getData().id_radio_st).name }) }
    ];

    main_table = new Tabulator("#radios_bottom_table", {
        data: indb.lists["connectionList"],
        headerFilterPlaceholder: "Filtrar",
        index: "ip",
        columns: newCollums,
        height: '100%',
        paginationButtonCount: 3,
        pagination: "local",
        paginationSize: 30,
        paginationSizeSelector: [10, 15, 20, 25, 30, 50, 100, 200, 500, 1000],
        movableColumns: true,
        layout: "fitDataFill",
        rowFormatter: actionRowFormatter
    });
}


function searchRadio(id) {
    let ret = { name: "-", ip: "-" };
    indb.lists["radiosList"].forEach(item => {
        if (item.id == id) {
            ret = item;
        }
    });
    return ret;
}

var section = "lst";

function createActionField(row) {
    var data = row.getRow().getData();

    htm = "<table><tr>"
    htm += "<td class='action_item'><a onclick=\"User_execute('" + data + "')\" style='transform:rotate(90deg);'>&#9998;</a></td>";
    htm += "</tr></table>"

    return htm;

}


radios_radios_init();