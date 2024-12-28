ClientEvents.clearAll();

ClientEvents.emit("LeftMenuClose");
ClientEvents.emit("LMI-CloseAll");
ClientEvents.emit("close_menu");

ClientEvents.emit("LoadExternal", [
    "./module/WSFinan/js/produtos/add.js",
    "./module/WSFinan/js/utils/consulta.js",
    "./module/WSFinan/js/produtos/del.js",
    "./module/WSFinan/js/produtos/edt.js",
    "./module/WSFinan/css/index.css"
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
    actionfield = "0";
    actionCallback = null;
    confirmExecution = false;
    actionOptions = [];
    actionRowFormatter = (data) => { };
    actionIcon = function (cell, formatterParams, onRendered) { //plain text value
        let rowdata = cell._cell.row.data;
        let htm = document.createElement("div");

        if (Myself.checkPermission("WSFinan/produtos/edt")) {
            let bot = document.createElement("i");
            bot.setAttribute("class", "fa fa-edit");
            bot.setAttribute("title", "Editar");
            bot.style.marginRight = "5px";
            bot.onclick = () => { ClientEvents.emit("wsfinan/produtos/edt", (rowdata)) };
            htm.appendChild(bot);
        }
        return htm;
    };
    UserListData = [];
    rowContext = (ev, row) => {
        //ClientEvents.emit("SendSocket", "wsop/lst/clientes/ctx", { x: ev.clientX, y: ev.clientY + 10, row: row._row.data });

        ev.preventDefault(); // prevent the browsers default context menu form appearing.
    }

    main_table;

    newCollums = [{
        title: "Ações",
        headerMenu: [],
        columns: [
            {
                title: this.actionName, field: this.actionfield, formatter: this.actionIcon
            },
            { title: 'ID', field: 'id', headerFilter: "input" },
            { title: 'Nome', field: 'name', headerFilter: "input" },
            { title: 'Código', field: 'barcode', headerFilter: "input" },
            { title: 'Criado Em', field: 'createdIn', formatter: ((data) => formatTime(data.getRow().getData().createdIn)), headerFilter: "input" },
            { title: 'Criado Por', field: 'createdBy', headerFilter: "input" }
        ]
    }];

    constructor() {

        if (Myself.checkPermission("WSFinan/produtos/add")) {
            this.newCollums[0].headerMenu.push(
                {
                    label: "Cadastrar novo Produto",
                    action: function (e, column) {
                        ClientEvents.emit("WSFinan/produtos/add");
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
        ClientEvents.emit("SendSocket", "WSFinan/produtos/lst");
    }

    _init() {

        /**Receive user list and append to Table */
        ClientEvents.on("WSFinan/produtos/lst", (data) => {
            if (data) {
                this.UserListData = data;
                this.main_table.updateOrAddData(this.UserListData);
            }
        });

        ClientEvents.on("system/added/produtos", () => { ClientEvents.emit("system_mess", { status: "OK", mess: "Produto Adicionado com Exito", time: 1000 }); ClientEvents.emit("SendSocket", "WSFinan/produtos/lst"); });
        ClientEvents.on("system/removed/produtos", () => { ClientEvents.emit("system_mess", { status: "OK", mess: "Produto Removido com Exito", time: 1000 }); ClientEvents.emit("SendSocket", "WSFinan/produtos/lst"); });
        ClientEvents.on("system/edited/produtos", () => { ClientEvents.emit("system_mess", { status: "OK", mess: "Produto Editado com Exito", time: 1000 }); ClientEvents.emit("SendSocket", "WSFinan/produtos/lst"); });
    }
}

new window.UserList();