var rows_each_request = 20;
var rowsIndex = 1
var main_table = null;

function system_users_init() {
    appendRoutes();
    send("system/get/users/menu", {});
    system_get_users();
}
function system_get_users() {
    indb.lists["UserList"] = [];
    send("system/get/users", { start: 0, end: rows_each_request });
    //send("system/get/users", { start: rows_each_request * (rowsIndex - 1), end: rows_each_request * rowsIndex });
}
//Add new


function appendRoutes() {
    appendRoute("system/list/users/menu", changeSystemMenuItems);
    appendRoute("system/list/users", system_list_users);
    appendRoute("system/append/users", system_append_users);
    appendRoute("system/added/users", () => { system_get_users(); system_mess({ status: "OK", mess: "Usuário Adicionado com Exito", time: 1000 }); });
    appendRoute("system/removed/users", () => { system_get_users(); system_mess({ status: "OK", mess: "Usuário Removido com Exito", time: 1000 }); });
    appendRoute("system/edited/users", () => { system_get_users(); system_mess({ status: "OK", mess: "Usuário Editado com Exito", time: 1000 }); });
    appendRoute("system/disabled/users", () => { system_get_users(); system_mess({ status: "OK", mess: "Usuário Desabilitado com Exito", time: 1000 }); });
    appendRoute("system/enabled/users", () => { system_get_users(); system_mess({ status: "OK", mess: "Usuário Habilitado com Exito", time: 1000 }); });
}

var actionFunction = "null";
var actionName = "";
var actionIcon = "handle"; //"buttonTick" "buttonCross" "tickCross"
var actionfield = "0";
var actionCallback = null;
var confirmExecution = false;
var actionOptions = [];
var actionRowFormatter = (data) => { };

function system_list_users(data) {
    indb.lists["UserList"] = data;
    reloadUserTable();
}
function system_append_users(data) {
    if (data[0] != undefined) {
        rowsIndex++;
        indb.lists["UserList"] = [].concat(indb.lists["UserList"], data);
        send("system/get/users", { start: rows_each_request * (rowsIndex - 1), end: rows_each_request * rowsIndex });
    } else {
        console.log(indb);
        reloadUserTable();
    }
    //reloadUserTable();
}

function reloadUserTable() {
    menuCancel();

    const newCollums = [
        {
            title: actionName, field: actionfield, formatter: actionIcon, cellClick: function (e, cell) {
                var data = cell.getData();
                if (confirmExecution) {
                    if (confirm("Voce esta prestes a " + ((actionOptions.length > 0) ? actionOptions[data[actionfield]] : actionName) + " o Usuário: " + data.user + "\nVoce tem certeza disso?")) {
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
        { title: 'Nome', field: 'username', headerFilter: "input" },
        { title: 'Login', field: 'user', headerFilter: "input" },
        { title: 'Conectado', field: 'isConnected', formatter: "tickCross", headerFilter: "select", headerFilterParams: [{ label: "-", value: "" }, { label: "Conectado", value: "1" }, { label: "Desconectado", value: "0" }] },
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
        { title: 'Desativado Por', field: 'deactivatedByUser', headerFilter: "input" }
    ];

    main_table = new Tabulator("#system_bottom_table", {
        data: indb.lists["UserList"],
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
        layout: "fitColumns",
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


system_users_init();