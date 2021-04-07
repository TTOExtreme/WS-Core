ClientEvents.clearAll();

ClientEvents.emit("LeftMenuClose");
ClientEvents.emit("LMI-CloseAll");

//load emitente Data
ClientEvents.on("wsop/emitente/add", (data) => { window.Emitente = data; });
ClientEvents.emit("SendSocket", "wsop/emitente/lst");


ClientEvents.emit("LoadExternal", [
    "./js/libs/suneditor.min.js",
    "./css/screen/suneditor.min.css",
    "./module/OPLI/js/utils/osStatus.js",
    //"./module/OPLI/js/utils/anexo.js",
    //"./module/OPLI/js/utils/consulta.js",
    //"./module/OPLI/js/utils/ProdutosStruct.js",
    //"./module/OPLI/js/produtos/add.js",
    //"./module/OPLI/js/clientes/add.js",
    //"./module/OPLI/js/os/add.js",
    //"./module/OPLI/js/os/view.js",
    //"./module/OPLI/js/os/print.js",
    //"./module/OPLI/js/os/printop.js",
    //"./module/OPLI/js/os/del.js",
    //"./module/OPLI/js/os/edt.js",
    //"./module/OPLI/js/os/edtstatus.js",
    "./module/OPLI/css/index.css",
    "./module/OPLI/css/print.css"
], () => {
    new window.UserList();
}, false);

if (window.UserList || window.UpdateMainTable) { // usa a mesma interface global para todas as listas
    window.UserList = null;
    clearInterval(window.UpdateMainTable);
    window.UpdateMainTable = null;
}

window.UpdateMainTable = setInterval(() => {
    ClientEvents.emit("SendSocket", "WSOP/site/lst");
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

        if (Myself.checkPermission("WSOP/menu/site")) {
            let bot = document.createElement("i");
            bot.setAttribute("class", "fa fa-print");
            bot.setAttribute("title", "Imprimir OS");
            bot.style.marginRight = "5px";
            bot.onclick = () => { ClientEvents.emit("wsop/site/print", (rowdata)) };
            htm.appendChild(bot);
        }
        if (Myself.checkPermission("WSOP/menu/site")) {
            let bot = document.createElement("i");
            bot.setAttribute("class", "fa fa-print");
            bot.setAttribute("title", "Imprimir OP");
            bot.style.marginRight = "5px";
            bot.onclick = () => { ClientEvents.emit("wsop/site/printop", (rowdata)) };
            htm.appendChild(bot);
        }
        if (Myself.checkPermission("WSOP/site/edt")) {
            let bot = document.createElement("i");
            bot.setAttribute("class", "fa fa-edit");
            bot.setAttribute("title", "Editar");
            bot.style.marginRight = "5px";
            bot.onclick = () => { ClientEvents.emit("wsop/site/edt", (rowdata)) };
            htm.appendChild(bot);
        }
        if (Myself.checkPermission("WSOP/site/edt")) {
            let bot = document.createElement("i");
            bot.setAttribute("class", "fa fa-mail-forward");
            bot.setAttribute("title", "Mudar Status");
            bot.style.marginRight = "5px";
            bot.onclick = () => { ClientEvents.emit("wsop/site/edtstatus", (rowdata)) };
            htm.appendChild(bot);
        }
        if (Myself.checkPermission("WSOP/site/edt")) {
            let bot = document.createElement("i");
            bot.setAttribute("class", "fa fa-eye");
            bot.setAttribute("title", "Visualizar");
            bot.style.marginRight = "5px";
            bot.onclick = () => { ClientEvents.emit("wsop/site/view", (rowdata)) };
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
        ClientEvents.emit("SendSocket", "wsop/lst/site/ctx", { x: ev.clientX, y: ev.clientY + 10, row: row._row.data });

        ev.preventDefault(); // prevent the browsers default context menu form appearing.
    }

    main_table;

    newCollums = [{
        title: "Ações",
        headerMenu: [],
        columns: [
            { title: this.actionName, formatter: this.actionIcon },
            { title: 'ID', field: 'id', headerFilter: "input", visible: false },
            { title: 'ID L.I.', field: 'id_li', headerFilter: "input" },
            { title: 'Nome', field: 'name', headerFilter: "input" },
            { title: 'Cliente', field: 'nome_cliente', headerFilter: "input" },
            //{ title: 'Status', field: 'status', headerFilter: "input" },
            {
                title: 'Status', field: 'status', headerFilter: "select", headerFilterParams: this._getStatusFilterParams(),
                formatter: function (cell) {
                    cell._cell.element.style.background = OPLIStatusIdToBgColor(cell.getRow().getData().status);
                    cell._cell.element.style.color = OPLIStatusIdToColor(cell.getRow().getData().status);
                    return OPLIStatusIdToName(cell.getRow().getData().status);
                }
            },
            { title: 'Expira Em', field: 'endingIn', formatter: ((data) => formatTime(data.getRow().getData().createdIn)), headerFilter: "input" },
            { title: 'Criado Em', field: 'createdIn', formatter: ((data) => formatTime(data.getRow().getData().createdIn)), headerFilter: "input" },
        ]
    }];

    constructor() {

        this.newCollums[0].headerMenu.push(
            {
                label: "Atualizar",
                action: function (e, column) {
                    ClientEvents.emit("SendSocket", "WSOP/site/lst");
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
        ClientEvents.emit("SendSocket", "WSOP/site/lst");
    }

    _init() {

        /**Receive user list and append to Table */
        ClientEvents.on("wsop/site/lst", (data) => {
            if (data) {
                this.UserListData = data;
                this.main_table.replaceData(this.UserListData);
            }
        });

        ClientEvents.on("system/added/produtos", () => {
            ClientEvents.emit("system_mess", { status: "OK", mess: "Produto Adicionado com Exito", time: 1000 });
            ClientEvents.emit("SendSocket", "wsop/site/produtos/lst");
            ClientEvents.emit("WSOP/produtos/close");
        });
        ClientEvents.on("system/added/clientes", () => {
            ClientEvents.emit("system_mess", { status: "OK", mess: "Ciente Adicionado com Exito", time: 1000 });
            ClientEvents.emit("SendSocket", "wsop/site/clientes/lst");
            ClientEvents.emit("WSOP/clientes/close");
        });
        ClientEvents.on("system/added/os", (data) => { ClientEvents.emit("SendSocket", "wsop/os/lst/edt", data); ClientEvents.emit("WSOP/os/close"); });
        ClientEvents.on("system/removed/os", () => { ClientEvents.emit("system_mess", { status: "OK", mess: "OS Removida com Exito", time: 1000 }); ClientEvents.emit("SendSocket", "wsop/os/lst"); });
        ClientEvents.on("system/edited/os", () => { ClientEvents.emit("system_mess", { status: "OK", mess: "OS Editada com Exito", time: 1000 }); ClientEvents.emit("SendSocket", "wsop/os/lst"); });
    }
    _getStatusFilterParams() {
        let ret = [{ label: "-", value: "" }]
        OPLIstatusIDs.forEach((item, index) => {
            ret.push({ label: item.name, value: index })
        })
        console.log(ret);
        return ret;
    }
}
