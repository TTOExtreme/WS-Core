ClientEvents.clearAll();

ClientEvents.emit("LeftMenuClose");
ClientEvents.emit("LMI-CloseAll");

ClientEvents.emit("LoadExternal", [
    "./module/WPMA/js/sites/edt.js",
    "./module/WPMA/js/sites/disable.js",
    "./module/WPMA/js/sites/rem.js",
    "./module/WPMA/js/sites/grp.js",
    "./module/WPMA/css/sites/index.css"
], () => { }, false)

if (window.DataTableList) {
    window.DataTableList = null;
}

window.DataTableList = class SiteList {

    /**Defines of Table */
    actionFunction = "null";
    actionName = "";
    actionIcon = "handle"; //"buttonTick" "buttonCross" "tickCross"
    actionfield = "0";
    actionCallback = null;
    confirmExecution = false;
    actionOptions = [];

    actionRowFormatter = (data) => { };
    DataTableListData = [];
    rowContext = (ev, row) => {
        //console.log(ev);
        ClientEvents.emit("SendSocket", "adm/WPMA/sites/lst/ctx", { x: ev.clientX, y: ev.clientY + 10, row: row._row.data });

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
        { title: 'ID', field: 'id', headerFilter: "input" },
        { title: 'Nome', field: 'name', headerFilter: "input" },
        { title: 'Descrição', field: 'description', headerFilter: "input" },
        { title: 'Rota', field: 'route', headerFilter: "input" },
        { title: 'Subdomínio', field: 'subdomain', headerFilter: "input" },
        { title: 'Pasta', field: 'folder', headerFilter: "input" },
        //{ title: 'Ultimo Login', field: 'lastConnection', formatter: ((data) => formatTime(data.getRow().getData().lastConnection)), headerFilter: "input" },
        //{ title: 'Ultima Tentativa', field: 'lastTry', formatter: ((data) => formatTime(data.getRow().getData().lastTry)), headerFilter: "input" },
        //{ title: 'Ultimo IP', field: 'lastIp', headerFilter: "input" },
        { title: 'Ativo', field: 'active', formatter: "tickCross", headerFilter: "select", headerFilterParams: [{ label: "-", value: "" }, { label: "Ativo", value: "1" }, { label: "Inativo", value: "0" }] },

        { title: 'Criado Em', field: 'createdIn', formatter: ((data) => formatTime(data.getRow().getData().createdIn)), headerFilter: "input" },
        { title: 'Criado Por', field: 'createdBy', headerFilter: "input" },
        { title: 'Desativado Em', field: 'deactivatedIn', formatter: ((data) => formatTime(data.getRow().getData().deactivatedIn)), headerFilter: "input" },
        { title: 'Desativado Por', field: 'deactivatedBy', headerFilter: "input" },
        { title: 'Modificado Em', field: 'modifiedIn', formatter: ((data) => formatTime(data.getRow().getData().modifiedIn)), headerFilter: "input" },
        { title: 'Modificado Por', field: 'modifiedBy', headerFilter: "input" },
        { title: 'Log', field: 'log', formatter: "tickCross", headerFilter: "select", headerFilterParams: [{ label: "-", value: "" }, { label: "Ativo", value: "1" }, { label: "Desativado", value: "0" }] },

    ];

    constructor() {

        /**Initialize  Table */
        this.main_table = new Tabulator("#MainScreen", {
            data: this.DataTableListData,
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
            //layout: "fitColumns", //colunas na tabela
            layout: "fitDataFill", //colunas pelos dados
            rowFormatter: this.actionRowFormatter,
            rowContext: this.rowContext
        });
        this._init();
        ClientEvents.emit("SendSocket", "adm/WPMA/sites/lst");
    }

    _init() {

        /**Receive user list and append to Table */
        ClientEvents.on("adm/WPMA/sites/lst", (data) => {
            if (data) {
                this.DataTableListData = data;
                this.main_table.replaceData(this.DataTableListData);
            }
        });
        //ClientEvents.on("system/list/users/menu", changeSystemMenuItems);
        //ClientEvents.on("system/list/users", system_list_users);
        //ClientEvents.on("system/append/users", system_append_users);

        ClientEvents.on("system/added/sites", () => { system_get_users(); ClientEvents.emit("system_mess", { status: "OK", mess: "Usuário Adicionado com Exito", time: 1000 }); });
        ClientEvents.on("system/removed/sites", () => { system_get_users(); ClientEvents.emit("system_mess", { status: "OK", mess: "Usuário Removido com Exito", time: 1000 }); });
        ClientEvents.on("system/edited/sites", () => { system_get_users(); ClientEvents.emit("system_mess", { status: "OK", mess: "Usuário Editado com Exito", time: 1000 }); });
        ClientEvents.on("system/disabled/sites", () => { system_get_users(); ClientEvents.emit("system_mess", { status: "OK", mess: "Usuário Desabilitado com Exito", time: 1000 }); });
        ClientEvents.on("system/enabled/sites", () => { system_get_users(); ClientEvents.emit("system_mess", { status: "OK", mess: "Usuário Habilitado com Exito", time: 1000 }); });

        ClientEvents.on("adm/WPMA/sites/edt", (data) => {

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

new window.DataTableList();