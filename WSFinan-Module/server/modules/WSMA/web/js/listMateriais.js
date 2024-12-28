ClientEvents.clearAll();

ClientEvents.emit("LeftMenuClose");
ClientEvents.emit("LMI-CloseAll");
ClientEvents.emit("close_menu");


ClientEvents.emit("LoadExternal", [
    "./module/WSMA/js/addMateriais.js",
    "./module/WSMA/js/edtMateriais.js",
    "./module/WSMA/js/wsmatypos.js",
    "./module/WSMA/css/index.css",
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

        if (Myself.checkPermission("WSMA/materiais/edt")) {
            let bot = document.createElement("i");
            bot.setAttribute("class", "fa fa-edit");
            bot.setAttribute("title", "Editar");
            bot.style.marginRight = "5px";
            bot.onclick = () => { ClientEvents.emit("WSMA/materiais/edt", (rowdata)) };
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
            { title: 'Nome', field: 'name', headerFilter: "input" },
            {
                title: 'Descrição',
                field: 'description',
                headerFilter: "input",
                formatter: function (cell) {
                    let data = cell.getRow().getData();
                    try {
                        data.description = JSON.parse(data.description)
                    } catch (er) {

                    }

                    return (data.description.description);
                }
            },
            {
                title: 'Inventario', field: 'inventory', headerFilter: "input",
                formatter: function (cell) {
                    return parseInt(cell.getRow().getData().id);
                }, sorter: "number"
            }
        ]
    }];

    constructor() {

        this.newCollums[0].headerMenu.push(
            {
                label: "Atualizar",
                action: function (e, column) {
                    ClientEvents.emit("SendSocket", "WSMA/materiais/lst", { id: 0 });
                },
            })
        this.newCollums[0].headerMenu.push(
            {
                label: "Adicionar",
                action: function (e, column) {
                    ClientEvents.emit("wsma/materiais/add");
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
                ClientEvents.emit("WSMA_ficha_filtertable");
            },
            rowFormatter: this.actionRowFormatter,
            rowContext: this.rowContext
        });
        this._init();
        ClientEvents.emit("SendSocket", "WSMA/materiais/lst", { id: 0, name: "", description: "" });
    }

    _init() {

        /**Receive user list and append to Table */
        ClientEvents.on("WSMA/materiais/lst", (data) => {
            if (data) {
                this.main_table.updateOrAddData(data);
            }
        });

        /**Receive user list and append to Table */
        ClientEvents.on("WSMA_ficha_filtertable", () => {
            let headerFilters = this.main_table.getHeaderFilters();
            let sendfilters = {};
            headerFilters.forEach(element => {
                sendfilters[element.field] = element.value;
            });
            ClientEvents.emit("SendSocket", "WSMA/materiais/lst", sendfilters);
        });

        ClientEvents.on("system/edited/materiais", () => { ClientEvents.emit("system_mess", { status: "OK", mess: "Material Editado com Exito", time: 1000 }); ClientEvents.emit("SendSocket", "WSMA/materiais/lst", {}); });
        ClientEvents.on("system/added/materiais", () => { ClientEvents.emit("system_mess", { status: "OK", mess: "Material Adicionado com Exito", time: 1000 }); ClientEvents.emit("SendSocket", "WSMA/materiais/lst", {}); ClientEvents.emit("close_menu"); });
    }
}
