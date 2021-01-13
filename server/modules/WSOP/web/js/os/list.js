ClientEvents.clearAll();

ClientEvents.emit("LeftMenuClose");
ClientEvents.emit("LMI-CloseAll");

//load emitente Data
ClientEvents.on("wsop/emitente/add", (data) => { window.Emitente = data; });
ClientEvents.emit("SendSocket", "wsop/emitente/lst");


ClientEvents.emit("LoadExternal", [
    "./js/libs/suneditor.min.js",
    "./css/screen/suneditor.min.css",
    "./module/WSOP/js/utils/osStatus.js",
    "./module/WSOP/js/utils/anexo.js",
    "./module/WSOP/js/os/add.js",
    "./module/WSOP/js/os/view.js",
    "./module/WSOP/js/os/print.js",
    "./module/WSOP/js/os/printop.js",
    "./module/WSOP/js/os/del.js",
    "./module/WSOP/js/os/edt.js",
    "./module/WSOP/css/index.css",
    "./module/WSOP/css/print.css"
], () => {
    new window.UserList();
}, false);

if (window.UserList) { // usa a mesma interface global para todas as listas
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
        ClientEvents.emit("SendSocket", "wsop/lst/os/ctx", { x: ev.clientX, y: ev.clientY + 10, row: row._row.data });

        ev.preventDefault(); // prevent the browsers default context menu form appearing.
    }

    main_table;

    newCollums = [{
        title: "Ações",
        headerMenu: [],
        columns: [
            {
                title: this.actionName, field: this.actionfield, formatter: this.actionIcon, cellClick: function (e, cell) {
                    let data = cell.getData();
                    if (this.confirmExecution) {
                        if (confirm("Voce esta prestes a " + ((this.actionOptions.length > 0) ? this.actionOptions[data[this.actionfield]] : this.actionName) + " a OS: " + data.id + "\nVoce tem certeza disso?")) {
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
            { title: 'Cliente', field: 'cliente', headerFilter: "input" },
            { title: 'Status', field: 'status', headerFilter: "select", headerFilterParams: this._getStatusFilterParams(), formatter: ((data) => StatusIdToName(data.getRow().getData().status)) },
            { title: 'Expira Em', field: 'endingIn', formatter: ((data) => formatTime(data.getRow().getData().createdIn)), headerFilter: "input" },
            { title: 'Criado Em', field: 'createdIn', formatter: ((data) => formatTime(data.getRow().getData().createdIn)), headerFilter: "input" },
        ]
    }];

    constructor() {

        if (Myself.checkPermission("WSOP/os/add")) {
            this.newCollums[0].headerMenu.push(
                {
                    label: "Abrir OS",
                    action: function (e, column) {
                        ClientEvents.emit("WSOP/os/add");
                    }
                })
        }
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
        ClientEvents.emit("SendSocket", "wsop/os/lst");
    }

    _init() {

        /**Receive user list and append to Table */
        ClientEvents.on("wsop/os/lst", (data) => {
            if (data) {
                this.UserListData = data;
                this.main_table.replaceData(this.UserListData);
            }
        });

        ClientEvents.on("system/added/os", (data) => { ClientEvents.emit("SendSocket", "wsop/os/lst/edt", data); ClientEvents.emit("WSOP/os/close"); });
        ClientEvents.on("system/removed/os", () => { ClientEvents.emit("system_mess", { status: "OK", mess: "OS Removida com Exito", time: 1000 }); ClientEvents.emit("SendSocket", "wsop/os/lst"); });
        ClientEvents.on("system/edited/os", () => { ClientEvents.emit("system_mess", { status: "OK", mess: "OS Editada com Exito", time: 1000 }); ClientEvents.emit("SendSocket", "wsop/os/lst"); });
    }
    _getStatusFilterParams() {
        let ret = [{ label: "-", value: "" }]
        statusIDs.forEach((item, index) => {
            ret.push({ label: item, value: index })
        })
        return ret;
    }
}
