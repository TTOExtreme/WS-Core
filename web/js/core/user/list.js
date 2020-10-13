ClientEvents.clearAll();

ClientEvents.emit("LeftMenuClose");
ClientEvents.emit("LMI-CloseAll");

ClientEvents.emit("LoadExternal", [
    "./js/core/user/edt.js",
    "./js/core/user/perm.js",
    "./js/core/user/disable.js",
    "./js/core/user/edt.js",
    "./js/core/user/grp.js",
    "./css/core/user/index.css"
], () => { }, false)

if (window.UserList) {
    window.UserList = null;
}

window.UserList = class UserList {

    /**Defines of Table */
    actionFunction = "null";
    actionName = "";
    actionIcon = "handle"; //"buttonTick" "buttonCross" "tickCross"
    actionfield = "0";
    actionCallback = null;
    confirmExecution = false;
    actionOptions = [];
    actionRowFormatter = (data) => { };
    UserListData = [];
    rowContext = (ev, row) => {
        //console.log(ev);
        ClientEvents.emit("SendSocket", "adm/usr/lst/ctx", { x: ev.clientX, y: ev.clientY + 10, row: row._row.data });

        ev.preventDefault(); // prevent the browsers default context menu form appearing.
    }

    main_table;

    newCollums = [
        {
            title: this.actionName, field: this.actionfield, formatter: this.actionIcon, cellClick: function (e, cell) {
                let data = cell.getData();
                if (this.confirmExecution) {
                    if (confirm("Voce esta prestes a " + ((this.actionOptions.length > 0) ? this.actionOptions[data[this.actionfield]] : this.actionName) + " o Usuário: " + data.user + "\nVoce tem certeza disso?")) {
                        if (this.actionCallback != null) {
                            this.actionCallback(data);
                        } else {
                            send(this.actionFunction, data);
                        }
                    }
                } else {
                    if (this.actionCallback != null) {
                        this.actionCallback(data);
                    } else {
                        send(this.actionFunction, data);
                    }
                }
            }, visible: !(this.actionName == "")
        },
        { title: 'Nome', field: 'name', headerFilter: "input" },
        { title: 'Login', field: 'username', headerFilter: "input" },
        { title: 'Conectado', field: 'connected', formatter: "tickCross", headerFilter: "select", headerFilterParams: [{ label: "-", value: "" }, { label: "Conectado", value: "1" }, { label: "Desconectado", value: "0" }] },
        { title: 'Ultimo Login', field: 'lastConnection', formatter: ((data) => formatTime(data.getRow().getData().lastConnection)), headerFilter: "input" },
        //{ title: 'Ultima Tentativa', field: 'lastTry', formatter: ((data) => formatTime(data.getRow().getData().lastTry)), headerFilter: "input" },
        { title: 'Ultimo IP', field: 'lastIp', headerFilter: "input" },
        {
            title: 'Ativo', field: 'active', headerFilter: "input", formatter: "lookup", formatterParams: {
                "1": "Ativo",
                "0": "Desativado"
            }
        },
        { title: 'Criado Em', field: 'createdIn', formatter: ((data) => formatTime(data.getRow().getData().createdIn)), headerFilter: "input" },
        { title: 'Criado Por', field: 'createdBy', headerFilter: "input" },
        //{ title: 'Desativado Em', field: 'deactivatedIn', formatter: ((data) => formatTime(data.getRow().getData().deactivatedIn)), headerFilter: "input" },
        //{ title: 'Desativado Por', field: 'deactivatedBy', headerFilter: "input" }
    ];

    constructor() {

        /**Initialize  Table */
        this.main_table = new Tabulator("#MainScreen", {
            data: this.UserListData,
            headerFilterPlaceholder: "Filtrar",
            index: "id",
            dataTree: true,
            dataTreeStartExpanded: false,
            columns: this.newCollums,
            height: '100%',
            paginationButtonCount: 3,
            pagination: "local",
            paginationSize: 15,
            paginationSizeSelector: [10, 15, 20, 25, 30, 50, 100, 200, 500, 1000],
            movableColumns: true,
            layout: "fitColumns",
            rowFormatter: this.actionRowFormatter,
            rowContext: this.rowContext
        });
        this._init();
        ClientEvents.emit("SendSocket", "adm/user/lst");
    }

    _init() {

        /**Receive user list and append to Table */
        ClientEvents.on("adm/usr/lst", (data) => {
            if (data) {
                this.UserListData = data;
                this.main_table.replaceData(this.UserListData);
            }
        });
        //ClientEvents.on("system/list/users/menu", changeSystemMenuItems);
        //ClientEvents.on("system/list/users", system_list_users);
        //ClientEvents.on("system/append/users", system_append_users);

        ClientEvents.on("system/added/users", () => { system_get_users(); ClientEvents.emit("system_mess", { status: "OK", mess: "Usuário Adicionado com Exito", time: 1000 }); });
        ClientEvents.on("system/removed/users", () => { system_get_users(); ClientEvents.emit("system_mess", { status: "OK", mess: "Usuário Removido com Exito", time: 1000 }); });
        ClientEvents.on("system/edited/users", () => { system_get_users(); ClientEvents.emit("system_mess", { status: "OK", mess: "Usuário Editado com Exito", time: 1000 }); });
        ClientEvents.on("system/disabled/users", () => { system_get_users(); ClientEvents.emit("system_mess", { status: "OK", mess: "Usuário Desabilitado com Exito", time: 1000 }); });
        ClientEvents.on("system/enabled/users", () => { system_get_users(); ClientEvents.emit("system_mess", { status: "OK", mess: "Usuário Habilitado com Exito", time: 1000 }); });

        ClientEvents.on("adm/usr/edt", (data) => {

        })
    }

    createActionField(row) {
        let data = row.getRow().getData();
        htm = "<table><tr>"
        htm += "<td class='action_item'><a onclick=\"User_execute('" + data + "')\" style='transform:rotate(90deg);'>&#9998;</a></td>";
        htm += "</tr></table>"
        return htm;
    }
}

new window.UserList();