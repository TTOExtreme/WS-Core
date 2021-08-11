ClientEvents.clearAll();

ClientEvents.emit("LeftMenuClose");
ClientEvents.emit("LMI-CloseAll");
ClientEvents.emit("close_menu");

ClientEvents.emit("LoadExternal", [
    "./module/WSFinan/js/utils/requisicaoStatus.js",
    "./module/WSFinan/js/utils/anexo.js",
    "./module/WSFinan/js/produtos/add.js",
    "./module/WSFinan/js/fornecedor/add.js",
    "./module/WSFinan/js/requisicao/add.js",
    "./module/WSFinan/js/requisicao/edtproduto.js",
    "./module/WSFinan/js/requisicao/view.js",
    "./module/WSFinan/js/requisicao/edt.js",
    "./module/WSFinan/js/requisicao/edtstatus.js",
    "./module/WSFinan/js/requisicao/history.js",
    "./module/WSFinan/css/index.css"
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
    ClientEvents.emit("SendSocket", "wsop/os/lst");
}, 10 * 1000);
//*/

window.UserList = class UserList {

    /**Defines of Table */
    actionFunction = "null";
    actionName = "Ações";
    //actionIcon = "handle"; //"buttonTick" "buttonCross" "tickCross"
    actionIcon = function (cell, formatterParams, onRendered) { //plain text value
        let rowdata = cell._cell.row.data;
        let htm = document.createElement("div");

        if (Myself.checkPermission("WSFinan/financeiro/requisicao")) {
            let bot = document.createElement("i");
            bot.setAttribute("class", "fa fa-edit");
            bot.setAttribute("title", "Editar");
            bot.style.marginRight = "5px";
            bot.onclick = () => { ClientEvents.emit("SendSocket", "WSFinan/requisicao/edtview", (rowdata)) };
            htm.appendChild(bot);
        }
        if (Myself.checkPermission("WSFinan/financeiro/requisicao")) {
            let bot = document.createElement("i");
            bot.setAttribute("class", "fa fa-mail-forward");
            bot.setAttribute("title", "Mudar Status");
            bot.style.marginRight = "5px";
            bot.onclick = () => { ClientEvents.emit("WSFinan/requisicao/edtstatus", (rowdata)) };
            htm.appendChild(bot);
        }
        if (Myself.checkPermission("WSFinan/financeiro/requisicao")) {
            let bot = document.createElement("i");
            bot.setAttribute("class", "fa fa-eye");
            bot.setAttribute("title", "Visualizar");
            bot.style.marginRight = "5px";
            bot.onclick = () => { ClientEvents.emit("SendSocket", "WSFinan/requisicao/view", (rowdata)) };
            htm.appendChild(bot);
        }
        if (Myself.checkPermission("WSFinan/financeiro/requisicao")) {
            let bot = document.createElement("i");
            bot.setAttribute("class", "fa fa-history");
            bot.setAttribute("title", "Historico");
            bot.style.marginRight = "5px";
            bot.onclick = () => { ClientEvents.emit("SendSocket", "WSFinan/requisicao/history", (rowdata)) };
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
        ClientEvents.emit("SendSocket", "wsop/lst/os/ctx", { x: ev.clientX, y: ev.clientY + 10, row: row._row.data });

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
            {
                title: 'Nome', field: 'name', headerFilter: "input"
            },/*
            {
                title: 'Preço', field: 'description', headerFilter: "input",
                formatter: function (cell) {
                    let h = cell.getRow().getData().description;
                    try {
                        if (typeof (h) == "string") {
                            h = JSON.parse(h).price;
                        } else {
                            h = h.price;
                        }
                    } catch (e) {
                        h = "-"
                    }
                    return h;
                }
            },//*/
            { title: 'Fornecedor', field: 'fornecedor', headerFilter: "input" },
            { title: 'Responsavel', field: 'createdBy', headerFilter: "input", visible: true },
            {
                title: 'Status', field: 'status', headerFilter: "select", headerFilterParams: this._getStatusFilterParams(),
                formatter: function (cell) {
                    cell._cell.element.style.background = new window.Modules.WSFinan.StatusID().StatusIdToBgColor(cell.getRow().getData().status);
                    cell._cell.element.style.color = new window.Modules.WSFinan.StatusID().StatusIdToColor(cell.getRow().getData().status);
                    return new window.Modules.WSFinan.StatusID().StatusIdToName(cell.getRow().getData().status);
                }
            },
            { title: 'Criado Em', field: 'createdIn', formatter: ((data) => formatTime(data.getRow().getData().createdIn)), headerFilter: "input" },
        ]
    }];

    constructor() {

        if (Myself.checkPermission("WSFinan/financeiro/requisicao")) {
            this.newCollums[0].headerMenu.push(
                {
                    label: "Abrir Requisicao",
                    action: function (e, column) {
                        ClientEvents.emit("wsfinan/requisicao/add");
                    }
                })
        }
        this.newCollums[0].headerMenu.push(
            {
                label: "Atualizar",
                action: function (e, column) {
                    ClientEvents.emit("SendSocket", "WSFinan/requisicao/lst", {});
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
            rowContext: this.rowContext,
            dataFiltering: function (filters) {
                ClientEvents.emit("WSFinan_Requisicao_filtertable");
            },
        });
        this.main_table.setSort([
            { column: "id", dir: "desc" }, //sort by this first
        ]);
        this._init();
        ClientEvents.emit("SendSocket", "WSFinan/requisicao/lst", {});
    }

    _init() {

        /**Receive user list and reset Table  uses only for update without filtering*/
        ClientEvents.on("wsfinan/requisicao/lst", (data) => {
            if (data) {
                this.UserListData = data;
                this.main_table.setData(data);
            }
        });

        /**Receive user list and append to Table */
        ClientEvents.on("wsfinan/requisicao/lstappend", (data) => {
            if (data) {
                this.UserListData = data;
                this.main_table.setData(data);
            }
        });

        let timeouttimer = new Date().getTime();
        let lsearch = "";
        /**Receive user list and append to Table */
        ClientEvents.on("WSFinan_Requisicao_filtertable", () => {
            let headerFilters = this.main_table.getHeaderFilters();
            let sendfilters = {};
            headerFilters.forEach(element => {
                sendfilters[element.field] = element.value;
            });
            if (headerFilters.length > 0 && timeouttimer - new Date().getTime() < 0 && lsearch != JSON.stringify(sendfilters)) {
                lsearch = JSON.stringify(sendfilters);
                timeouttimer = new Date().getTime() + (1 * 100);
                ClientEvents.emit("SendSocket", "WSOP/os/lstappend", sendfilters);
            }
        });
        ClientEvents.on("system/added/requisicao", (data) => {
            ClientEvents.emit("SendSocket", "WSFinan/requisicao/edtview", { id: data.id });
            ClientEvents.emit("SendSocket", "WSFinan/requisicao/lst", {});
            ClientEvents.emit("close_menu", "wsfinan_add_requisicao_div");
        });
        ClientEvents.on("system/removed/requisicao", () => {
            ClientEvents.emit("system_mess", { status: "OK", mess: "Requisicão Removida com Exito", time: 1000 });
            ClientEvents.emit("SendSocket", "WSFinan/requisicao/lst", {});
            ClientEvents.emit("close_menu", "wsfinan_add_requisicao_div");
        });
        ClientEvents.on("WSFinan/requisicao/edited", () => {
            ClientEvents.emit("system_mess", { status: "OK", mess: "Requisicao Editada com Exito", time: 1000 });
            ClientEvents.emit("SendSocket", "WSFinan/requisicao/lst", {});
            ClientEvents.emit("close_menu", "wsfinan_add_requisicao_div");
            ClientEvents.emit("SendSocket", "WSFinan/requisicao/edtview", { id: data.id });
        });
    }

    _getStatusFilterParams() {
        let ret = [{ label: "-", value: "" }]
        new window.Modules.WSFinan.StatusID().statusIDs.forEach((item, index) => {
            ret.push({ label: item.name, value: item.code })
        })
        return ret;
    }
}
