ClientEvents.clearAll();

ClientEvents.emit("LeftMenuClose");
ClientEvents.emit("LMI-CloseAll");

/**Defines of Table */

let actionFunction = "null";
let actionName = "";
let actionIcon = "handle"; //"buttonTick" "buttonCross" "tickCross"
let actionfield = "0";
let actionCallback = null;
let confirmExecution = false;
let actionOptions = [];
let actionRowFormatter = (data) => { };

let UserList = [];


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
    { title: 'Nome', field: 'name', headerFilter: "input" },
    { title: 'Login', field: 'username', headerFilter: "input" },
    { title: 'Conectado', field: 'isConnected', formatter: "tickCross", headerFilter: "select", headerFilterParams: [{ label: "-", value: "" }, { label: "Conectado", value: "1" }, { label: "Desconectado", value: "0" }] },
    { title: 'Ultimo Login', field: 'lastLogin', formatter: ((data) => formatTime(data.getRow().getData().lastLogin)), headerFilter: "input" },
    //{ title: 'Ultima Tentativa', field: 'lastTry', formatter: ((data) => formatTime(data.getRow().getData().lastTry)), headerFilter: "input" },
    { title: 'Ultimo IP', field: 'lastIp', headerFilter: "input" },
    {
        title: 'Ativo', field: 'active', headerFilter: "input", formatter: "lookup", formatterParams: {
            "1": "Ativo",
            "0": "Inativo"
        }
    },
    { title: 'Criado Em', field: 'createdIn', formatter: ((data) => formatTime(data.getRow().getData().createdIn)), headerFilter: "input" },
    { title: 'Criado Por', field: 'createdBy', headerFilter: "input" },
    //{ title: 'Desativado Em', field: 'deactivatedIn', formatter: ((data) => formatTime(data.getRow().getData().deactivatedIn)), headerFilter: "input" },
    //{ title: 'Desativado Por', field: 'deactivatedBy', headerFilter: "input" }
];

/*
Array(1)
id: 1
name: "Administrador"
username: "admin"
createdIn: 1582330025205
createdBy: 1
deactivatedIn: null
deactivatedBy: null
active: 1
connected: null
lastConnection: null
lastTry: null
lastIp: null
user: undefined
isConnected: undefined
lastLogin: undefined
deactivatedByUser: undefined
*/

/**Receive user list and append to Table */
ClientEvents.on("adm/usr/lst", (data) => {
    if (data) {
        UserList = data;
        main_table.replaceData(UserList);
    }
});


function createActionField(row) {
    var data = row.getRow().getData();
    htm = "<table><tr>"
    htm += "<td class='action_item'><a onclick=\"User_execute('" + data + "')\" style='transform:rotate(90deg);'>&#9998;</a></td>";
    htm += "</tr></table>"
    return htm;
}

//ClientEvents.on("system/list/users/menu", changeSystemMenuItems);
//ClientEvents.on("system/list/users", system_list_users);
//ClientEvents.on("system/append/users", system_append_users);
ClientEvents.on("system/added/users", () => { system_get_users(); ClientEvents.emit("system_mess", { status: "OK", mess: "Usuário Adicionado com Exito", time: 1000 }); });
ClientEvents.on("system/removed/users", () => { system_get_users(); ClientEvents.emit("system_mess", { status: "OK", mess: "Usuário Removido com Exito", time: 1000 }); });
ClientEvents.on("system/edited/users", () => { system_get_users(); ClientEvents.emit("system_mess", { status: "OK", mess: "Usuário Editado com Exito", time: 1000 }); });
ClientEvents.on("system/disabled/users", () => { system_get_users(); ClientEvents.emit("system_mess", { status: "OK", mess: "Usuário Desabilitado com Exito", time: 1000 }); });
ClientEvents.on("system/enabled/users", () => { system_get_users(); ClientEvents.emit("system_mess", { status: "OK", mess: "Usuário Habilitado com Exito", time: 1000 }); });

/**Initialize  Table */
let main_table = new Tabulator("#MainScreen", {
    data: UserList,
    headerFilterPlaceholder: "Filtrar",
    index: "id",
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
ClientEvents.emit("SendSocket", "adm/user/lst");