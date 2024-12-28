var rows_each_request = 20;
var rowsIndex = 1
var main_table = null;

function radios_radios_init() {
    appendRoutes();
    send("radios/top/menu/radios", {});
    radios_get_radios();
}
function radios_get_radios() {
    stopLoader();
    //menuCancel();
    indb.lists["radiosList"] = [];
    send("radios/get/radios", {});
}
//Add new


function appendRoutes() {
    appendRoute("radios/list/radios/menu", changeRadiosMenuItems);
    appendRoute("radios/list/radios", radios_list_radios);
    appendRoute("radios/added/radios", () => { radios_get_radios(); system_mess({ status: "OK", mess: "Radio Adicionado com Exito", time: 1000 }); });
    appendRoute("radios/removed/radios", () => { radios_get_radios(); system_mess({ status: "OK", mess: "Radio Removido com Exito", time: 1000 }); });
    appendRoute("radios/edited/radios", () => { radios_get_radios(); system_mess({ status: "OK", mess: "Radio Editado com Exito", time: 1000 }); });
    appendRoute("radios/disabled/radios", () => { radios_get_radios(); system_mess({ status: "OK", mess: "Radio Desabilitado com Exito", time: 1000 }); });
    appendRoute("radios/enabled/radios", () => { radios_get_radios(); system_mess({ status: "OK", mess: "Radio Habilitado com Exito", time: 1000 }); });
    appendRoute("radios/scanned/radios", () => { radios_get_radios(); stopLoader(); system_mess({ status: "OK", mess: "Radio Escaneado com Exito", time: 1000 }); });
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
    reloadSubnetTable();
}
function radios_append_radios(data) {
    if (data[0] != undefined) {
        rowsIndex++;
        indb.lists["radiosList"] = [].concat(indb.lists["radiosList"], data);
        send("radios/get/radios", { start: rows_each_request * (rowsIndex - 1), end: rows_each_request * rowsIndex });
    } else {
        //console.log(indb);
        reloadSubnetTable();
    }
    //reloadSubnetTable();
}

function reloadSubnetTable() {
    //menuCancel();

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
        { title: 'Nome', field: 'name', headerFilter: "input", frozen: true },
        { title: 'ID', field: 'id', headerFilter: "input" },
        { title: 'IP', field: 'ip', headerFilter: "input", formatter: ((data) => normalizeIP(data.getRow().getData().ip)) },
        { title: 'SSID', field: 'SSID', headerFilter: "input" },
        { title: 'Pass', field: 'pass', headerFilter: "input" },
        {
            title: 'Modo', field: 'RadioMode', headerFilter: "select", headerFilterParams:
                [{ label: "-", value: "" }, { label: "Estação", value: "1" }, { label: "AP", value: "2" }, { label: "AP Repetidora", value: "3" }, { label: "AP WSD", value: "4" }],
            formatter: ((data) => {
                let v = data.getRow().getData().RadioMode;
                return ((v == 1) ? "Estação" : ((v == 2) ? "AP" : ((v == 3) ? "AP Repetidora" : ((v == 4) ? "AP WSD" : "-"))));
            })
        },
        { title: 'Community', field: 'community', headerFilter: "input" },
        { title: 'Frequencia', field: 'ChannelFreq', headerFilter: "input" },
        { title: 'DBM', field: 'dbmPower', headerFilter: "input" },
        { title: 'RadioSignal', field: 'RadioSignal', headerFilter: "input" },
        { title: 'RSSI', field: 'RSSI', headerFilter: "input" },
        { title: 'Noise', field: 'Noise', headerFilter: "input" },
        { title: 'TXrate', field: 'TXrate', headerFilter: "input" },
        { title: 'RXrate', field: 'RXrate', headerFilter: "input" },
        { title: 'ChannelWidth', field: 'ChannelWidth', headerFilter: "input" },
        { title: 'AirmaxQuality', field: 'AirmaxQuality', headerFilter: "input" },
        { title: 'AirmaxCapacity', field: 'AirmaxCapacity', headerFilter: "input" }
    ];

    main_table = new Tabulator("#radios_bottom_table", {
        data: indb.lists["radiosList"],
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

var section = "lst";

function createActionField(row) {
    var data = row.getRow().getData();

    htm = "<table><tr>"
    htm += "<td class='action_item'><a onclick=\"User_execute('" + data + "')\" style='transform:rotate(90deg);'>&#9998;</a></td>";
    htm += "</tr></table>"

    return htm;

}


radios_radios_init();