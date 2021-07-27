ClientEvents.clearAll();

ClientEvents.emit("LeftMenuClose");
ClientEvents.emit("LMI-CloseAll");
ClientEvents.emit("close_menu");


ClientEvents.emit("LoadExternal", [
    "./module/WSFinan/js/addficha.js",
    "./module/WSFinan/js/movevalue.js",
    "./module/WSFinan/js/history.js",
    "./module/WSFinan/css/index.css",
], () => {
    new window.UserList();
}, false);

if (window.UserList || window.UpdateMainTable) { // usa a mesma interface global para todas as listas
    window.UserList = null;
    clearInterval(window.UpdateMainTable);
    window.UpdateMainTable = null;
}
/*
window.UpdateMainTable = setInterval(() => {
    ClientEvents.emit("SendSocket", "wsop/os/lst", { id: 0, name: "", description: "" });
}, 10 * 1000);//*/

window.UserList = class UserList {

    /**Defines of Table */
    actionFunction = "null";
    actionName = "Ações";
    //actionIcon = "handle"; //"buttonTick" "buttonCross" "tickCross"
    actionIcon = function (cell, formatterParams, onRendered) { //plain text value
        let rowdata = cell._cell.row.data;
        let htm = document.createElement("div");

        if (Myself.checkPermission("WSFinan/fichas/edt")) {
            let bot = document.createElement("i");
            bot.setAttribute("class", "fa fa-edit");
            bot.setAttribute("title", "Editar");
            bot.style.marginRight = "5px";
            bot.onclick = () => { ClientEvents.emit("wsfinan/fichas/edt", (rowdata)) };
            htm.appendChild(bot);
        }
        if (Myself.checkPermission("WSFinan/fichas/move")) {
            let bot = document.createElement("i");
            bot.setAttribute("class", "fa fa-mail-forward");
            bot.setAttribute("title", "Movimentar");
            bot.style.marginRight = "5px";
            bot.onclick = () => { ClientEvents.emit("wsfinan/fichas/move", (rowdata)) };
            htm.appendChild(bot);
        }
        if (Myself.checkPermission("WSFinan/financeiro/ficha")) {
            let bot = document.createElement("i");
            bot.setAttribute("class", "fa fa-history");
            bot.setAttribute("title", "Historico");
            bot.style.marginRight = "5px";
            bot.onclick = () => { ClientEvents.emit("SendSocket", "WSFinan/fichas/lsthist", (rowdata)) };
            htm.appendChild(bot);
        }

        return htm;
    };
    actionfield = "0";
    actionCallback = null;
    confirmExecution = false;
    actionOptions = [];
    actionRowFormatter = (data) => { };
    UserListData = [];
    rowContext = (ev, row) => {
        //ClientEvents.emit("SendSocket", "wsop/lst/os/ctx", { x: ev.clientX, y: ev.clientY + 10, row: row._row.data });

        ev.preventDefault(); // prevent the browsers default context menu form appearing.
    }

    main_table;

    newCollums = [{
        title: "Ações",
        headerMenu: [],
        columns: [
            { title: this.actionName, formatter: this.actionIcon },
            {
                title: 'ID', field: 'id', headerFilter: "input",
                formatter: function (cell) {
                    return parseInt(cell.getRow().getData().id);
                }, sorter: "number"
            },
            { title: 'Ficha', field: 'name', headerFilter: "input" },
            { title: 'Valor em Ficha', field: 'valueAttached', headerFilter: "input" },
            { title: 'Reservado', field: 'valueReserved', headerFilter: "input" },
            { title: 'Pendente', field: 'valuePending', headerFilter: "input" },
        ]
    }];

    constructor() {

        this.newCollums[0].headerMenu.push(
            {
                label: "Atualizar",
                action: function (e, column) {
                    ClientEvents.emit("SendSocket", "WSFinan/fichas/lst", { id: 0 });
                },
            })
        this.newCollums[0].headerMenu.push(
            {
                label: "Adicionar",
                action: function (e, column) {
                    ClientEvents.emit("wsfinan/fichas/add");
                },
            })
        this.newCollums[0].headerMenu.push(
            {
                label: "Movimentar Valor",
                action: function (e, column) {
                    ClientEvents.emit("wsfinan/fichas/move");
                },
            })
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
            dataFiltering: function (filters) {
                ClientEvents.emit("wsfinan_ficha_filtertable");
            },
            rowFormatter: this.actionRowFormatter,
            rowContext: this.rowContext
        });
        this._init();
        ClientEvents.emit("SendSocket", "WSFinan/fichas/lst", { id: 0, name: "", description: "" });
    }

    _init() {

        /**Receive user list and append to Table */
        ClientEvents.on("wsfinan/fichas/lst", (data) => {
            if (data) {
                this.UserListData = data;
                this.main_table.updateOrAddData(this.UserListData);
            }
        });

        /**Receive user list and append to Table */
        ClientEvents.on("wsfinan_ficha_filtertable", () => {
            let headerFilters = this.main_table.getHeaderFilters();
            let sendfilters = {};
            headerFilters.forEach(element => {
                sendfilters[element.field] = element.value;
            });
            ClientEvents.emit("SendSocket", "WSFinan/fichas/lst", sendfilters);
        });

        ClientEvents.on("system/edited/ficha", () => { ClientEvents.emit("system_mess", { status: "OK", mess: "Ficha Editada com Exito", time: 1000 }); ClientEvents.emit("SendSocket", "WSFinan/fichas/lst", {}); });
        ClientEvents.on("system/added/ficha", () => { ClientEvents.emit("system_mess", { status: "OK", mess: "Ficha Adicionada com Exito", time: 1000 }); ClientEvents.emit("SendSocket", "WSFinan/fichas/lst", {}); ClientEvents.emit("close_menu"); });
        ClientEvents.on("system/moved/ficha", () => { ClientEvents.emit("system_mess", { status: "OK", mess: "Valores Movidos com Exito", time: 1000 }); ClientEvents.emit("SendSocket", "WSFinan/fichas/lst", {}); ClientEvents.emit("close_menu"); });
    }
}
