ClientEvents.clearAll();

ClientEvents.emit("LeftMenuClose");
ClientEvents.emit("LMI-CloseAll");

ClientEvents.emit("LoadExternal", [
    "./module/WSOP/js/produtos/add.js",
    "./module/WSOP/js/produtos/del.js",
    "./module/WSOP/js/produtos/edt.js",
    "./module/WSOP/js/produtos/view.js",
    "./module/WSOP/js/utils/ProdutosStruct.js",
    "./module/WSOP/css/index.css"
], () => { }, false)

if (window.UserList || window.UpdateMainTable) { // usa a mesma interface global para todas as listas
    window.UserList = null;
    clearInterval(window.UpdateMainTable);
    window.UpdateMainTable = null;
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
        ClientEvents.emit("SendSocket", "wsop/lst/produtos/ctx", { x: ev.clientX, y: ev.clientY + 10, row: row._row.data });

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
                        if (confirm("Voce esta prestes a " + ((this.actionOptions.length > 0) ? this.actionOptions[data[this.actionfield]] : this.actionName) + " o Cliente: " + data.user + "\nVoce tem certeza disso?")) {
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
            { title: 'Codigo', field: 'barcode', headerFilter: "input" },
            { title: 'Nome', field: 'name', headerFilter: "input" },
            { title: 'Modelo', field: 'description', formatter: ((data) => JSON.parse(JSON.parse(JSON.stringify(data.getRow().getData().description))).modelo), headerFilter: "input" },
            { title: 'Gola', field: 'description', formatter: ((data) => JSON.parse(JSON.parse(JSON.stringify(data.getRow().getData().description))).gola), headerFilter: "input" },
            { title: 'Vies', field: 'description', formatter: ((data) => JSON.parse(JSON.parse(JSON.stringify(data.getRow().getData().description))).vies), headerFilter: "input" },
            { title: 'Genero', field: 'description', formatter: ((data) => JSON.parse(JSON.parse(JSON.stringify(data.getRow().getData().description))).genero), headerFilter: "input" },
            { title: 'Descrição', field: 'description', formatter: ((data) => JSON.parse(JSON.parse(JSON.stringify(data.getRow().getData().description))).description), headerFilter: "input" },

            { title: 'Inventario', field: 'inventory', headerFilter: "input" },
            { title: 'Criado Em', field: 'createdIn', formatter: ((data) => formatTime(data.getRow().getData().createdIn)), headerFilter: "input" }
        ]
    }];

    constructor() {

        if (Myself.checkPermission("WSOP/cliente/add")) {
            this.newCollums[0].headerMenu.push(
                {
                    label: "Cadastrar novo Produto",
                    action: function (e, column) {
                        ClientEvents.emit("WSOP/produtos/add");
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
        ClientEvents.emit("SendSocket", "wsop/produtos/lst");
    }

    _init() {

        /**Receive user list and append to Table */
        ClientEvents.on("wsop/produtos/lst", (data) => {
            if (data) {
                this.UserListData = data;
                this.main_table.replaceData(this.UserListData);
            }
        });

        ClientEvents.on("system/added/produtos", () => { ClientEvents.emit("system_mess", { status: "OK", mess: "Produto Adicionado com Exito", time: 1000 }); ClientEvents.emit("SendSocket", "wsop/produtos/lst"); });
        ClientEvents.on("system/removed/produtos", () => { ClientEvents.emit("system_mess", { status: "OK", mess: "Produto Removido com Exito", time: 1000 }); ClientEvents.emit("SendSocket", "wsop/produtos/lst"); });
        ClientEvents.on("system/edited/produtos", () => { ClientEvents.emit("system_mess", { status: "OK", mess: "Produto Editado com Exito", time: 1000 }); ClientEvents.emit("SendSocket", "wsop/produtos/lst"); });
    }
}

new window.UserList();