ClientEvents.clearAll();

ClientEvents.emit("LeftMenuClose");
ClientEvents.emit("LMI-CloseAll");
ClientEvents.emit("close_menu");

//load emitente Data
ClientEvents.on("wsop/emitente/add", (data) => { window.Emitente = data; });
ClientEvents.emit("SendSocket", "wsop/emitente/lst");


ClientEvents.emit("LoadExternal", [
    "./module/WSOP/js/utils/osStatus.js",
    "./module/WSOP/js/utils/timeCalc.js",
    "./module/WSOP/js/utils/formaEnvio.js",
    "./module/WSOP/js/utils/anexo.js",
    "./module/WSOP/js/utils/consulta.js",
    "./module/WSOP/js/utils/ProdutosStruct.js",
    "./module/WSOP/js/produtos/add.js",
    "./module/WSOP/js/clientes/add.js",
    "./module/WSOP/js/os/add.js",
    "./module/WSOP/js/os/view.js",
    "./module/WSOP/js/os/history.js",
    "./module/WSOP/js/os/print.js",
    "./module/WSOP/js/os/printop.js",
    "./module/WSOP/js/os/del.js",
    "./module/WSOP/js/os/edt.js",
    "./module/WSOP/js/os/edtstatus.js",
    "./module/WSOP/js/os/history.js",
    "./module/WSOP/css/index.css",
    "./module/WSOP/css/print.css"
], () => {
    new window.UserList();
}, false);

if (window.UserList || window.UpdateMainTable) { // usa a mesma interface global para todas as listas
    window.UserList = null;
    clearInterval(window.UpdateMainTable);
    window.UpdateMainTable = null;
}

window.UpdateMainTable = setInterval(() => {
    ClientEvents.emit("SendSocket", "wsop/os/lst");
}, 10 * 1000);

window.UserList = class UserList {

    /**Defines of Table */
    actionFunction = "null";
    actionName = "Ações";
    //actionIcon = "handle"; //"buttonTick" "buttonCross" "tickCross"
    actionIcon = function (cell, formatterParams, onRendered) { //plain text value
        //console.log(cell);
        let rowdata = cell._cell.row.data;
        //console.log(rowdata);
        let htm = document.createElement("div");

        if (Myself.checkPermission("WSOP/os/osview")) {
            let bot = document.createElement("i");
            bot.setAttribute("class", "fa fa-print");
            bot.setAttribute("title", "Imprimir OS");
            bot.style.marginRight = "5px";
            bot.onclick = () => { ClientEvents.emit("wsop/os/print", (rowdata)) };
            htm.appendChild(bot);
        }
        if (Myself.checkPermission("WSOP/os/opview")) {
            let bot = document.createElement("i");
            bot.setAttribute("class", "fa fa-print");
            bot.setAttribute("title", "Imprimir OP");
            bot.style.marginRight = "5px";
            bot.onclick = () => { ClientEvents.emit("wsop/os/printop", (rowdata)) };
            htm.appendChild(bot);
        }
        if (Myself.checkPermission("WSOP/os/edt")) {
            let bot = document.createElement("i");
            bot.setAttribute("class", "fa fa-edit");
            bot.setAttribute("title", "Editar");
            bot.style.marginRight = "5px";
            bot.onclick = () => { ClientEvents.emit("wsop/os/edt", (rowdata)) };
            htm.appendChild(bot);
        }
        if (Myself.checkPermission("WSOP/os/edt")) {
            let bot = document.createElement("i");
            bot.setAttribute("class", "fa fa-mail-forward");
            bot.setAttribute("title", "Mudar Status");
            bot.style.marginRight = "5px";
            bot.onclick = () => { ClientEvents.emit("wsop/os/edtstatus", (rowdata)) };
            htm.appendChild(bot);
        }
        if (Myself.checkPermission("WSOP/os/osview")) {
            let bot = document.createElement("i");
            bot.setAttribute("class", "fa fa-eye");
            bot.setAttribute("title", "Visualizar");
            bot.style.marginRight = "5px";
            bot.onclick = () => { ClientEvents.emit("wsop/os/view", (rowdata)) };
            htm.appendChild(bot);
        }
        if (Myself.checkPermission("WSOP/os/osview")) {
            let bot = document.createElement("i");
            bot.setAttribute("class", "fa fa-history");
            bot.setAttribute("title", "Historico");
            bot.style.marginRight = "5px";
            bot.onclick = () => { ClientEvents.emit("wsop/os/history", (rowdata)) };
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
        //console.log(ev);
        ClientEvents.emit("SendSocket", "wsop/lst/os/ctx", { x: ev.clientX, y: ev.clientY + 10, row: row._row.data });

        ev.preventDefault(); // prevent the browsers default context menu form appearing.
    }

    main_table;

    newCollums = [{
        title: "Ações",
        headerMenu: [],
        columns: [
            { title: this.actionName, formatter: this.actionIcon },
            { title: 'ID', field: 'id', headerFilter: "input" },
            { title: 'Cliente', field: 'cliente', headerFilter: "input" },
            {
                title: 'Status', field: 'status', headerFilter: "select", headerFilterParams: this._getStatusFilterParams(),
                formatter: function (cell) {
                    cell._cell.element.style.background = new window.Modules.WSOP.StatusID().StatusIdToBgColor(cell.getRow().getData().status);
                    cell._cell.element.style.color = new window.Modules.WSOP.StatusID().StatusIdToColor(cell.getRow().getData().status);
                    return new window.Modules.WSOP.StatusID().StatusIdToName(cell.getRow().getData().status);
                }
            },
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
        this.newCollums[0].headerMenu.push(
            {
                label: "Atualizar",
                action: function (e, column) {
                    ClientEvents.emit("SendSocket", "wsop/os/lst");
                }
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

        ClientEvents.on("system/added/produtos", () => {
            ClientEvents.emit("system_mess", { status: "OK", mess: "Produto Adicionado com Exito", time: 1000 });
            ClientEvents.emit("SendSocket", "wsop/os/produtos/lst");
            ClientEvents.emit("WSOP/produtos/close");
        });
        ClientEvents.on("system/added/clientes", () => {
            ClientEvents.emit("system_mess", { status: "OK", mess: "Ciente Adicionado com Exito", time: 1000 });
            ClientEvents.emit("SendSocket", "wsop/os/clientes/lst");
            ClientEvents.emit("WSOP/clientes/close");
        });
        ClientEvents.on("system/added/os", (data) => { ClientEvents.emit("SendSocket", "wsop/os/lst/edt", data); ClientEvents.emit("WSOP/os/close"); });
        ClientEvents.on("system/removed/os", () => { ClientEvents.emit("system_mess", { status: "OK", mess: "OS Removida com Exito", time: 1000 }); ClientEvents.emit("SendSocket", "wsop/os/lst"); });
        ClientEvents.on("system/edited/os", () => { ClientEvents.emit("system_mess", { status: "OK", mess: "OS Editada com Exito", time: 1000 }); ClientEvents.emit("SendSocket", "wsop/os/lst"); });
    }

    _getStatusFilterParams() {
        let ret = [{ label: "-", value: "" }]
        new window.Modules.WSOP.StatusID().statusIDs.forEach((item, index) => {
            ret.push({ label: item.name, value: index })
        })
        return ret;
    }
}
