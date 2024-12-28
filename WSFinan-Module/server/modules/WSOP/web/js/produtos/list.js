ClientEvents.clearAll();

ClientEvents.emit("LeftMenuClose");
ClientEvents.emit("LMI-CloseAll");
ClientEvents.emit("close_menu");

ClientEvents.emit("LoadExternal", [
    "./module/WSOP/js/produtos/add.js",
    "./module/WSOP/js/produtos/del.js",
    "./module/WSOP/js/produtos/edt.js",
    "./module/WSOP/js/produtos/view.js",
    "./module/WSOP/js/utils/ProdutosStruct.js",
    "./module/WSOP/css/index.css"
], () => {
    new window.UserList();
}, false)

if (window.UserList || window.UpdateMainTable) { // usa a mesma interface global para todas as listas
    window.UserList = null;
    clearInterval(window.UpdateMainTable);
    window.UpdateMainTable = null;
}


window.UserList = class UserList {

    /**Defines of Table */
    actionFunction = "null";
    actionName = "Ações";
    //actionIcon = "handle"; //"buttonTick" "buttonCross" "tickCross"
    actionIcon = function (cell, formatterParams, onRendered) { //plain text value
        let rowdata = cell._cell.row.data;
        let htm = document.createElement("div");

        let bot = document.createElement("i");
        bot.setAttribute("class", "fa fa-globe");
        bot.setAttribute("title", "Visitar URL");
        bot.style.marginRight = "5px";
        bot.onclick = () => { window.open(rowdata.url, "_blanck") };
        htm.appendChild(bot);

        return htm;
    };
    actionfield = "0";
    actionCallback = null;
    confirmExecution = false;
    actionOptions = [];
    actionRowFormatter = (data) => { };
    UserListData = [];
    rowContext = (ev, row) => {
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
            {
                title: 'Modelo', field: 'description', formatter: ((data) => {
                    try {
                        return JSON.parse(JSON.parse(JSON.stringify(data.getRow().getData().description))).modelo;
                    } catch (err) { }
                    return "-";
                }), headerFilter: "input"
            },
            {
                title: 'Gola', field: 'description', formatter: ((data) => {
                    try {
                        return JSON.parse(JSON.parse(JSON.stringify(data.getRow().getData().description))).gola;
                    } catch (err) { }
                    return "-"
                }), headerFilter: "input"
            },
            {
                title: 'Vies', field: 'description', formatter: ((data) => {
                    try {
                        return JSON.parse(JSON.parse(JSON.stringify(data.getRow().getData().description))).vies;
                    } catch (err) { } return "-"
                }), headerFilter: "input"
            },
            {
                title: 'Genero', field: 'description', formatter: ((data) => {
                    try {
                        return JSON.parse(JSON.parse(JSON.stringify(data.getRow().getData().description))).genero;
                    } catch (err) { } return "-"
                }), headerFilter: "input"
            },
            {
                title: 'Descrição', field: 'description', formatter: ((data) => {
                    try {
                        return JSON.parse(JSON.parse(JSON.stringify(data.getRow().getData().description))).description;
                    } catch (err) { }
                    return "-";
                }), headerFilter: "input"
            },

            { title: 'Inventario', field: 'inventory', headerFilter: "input" },
            { title: 'Criado Em', field: 'createdIn', formatter: ((data) => formatTime(data.getRow().getData().createdIn)), headerFilter: "input" }
        ]
    }];

    constructor() {

        if (Myself.checkPermission("WSOP/produtos/add")) {
            this.newCollums[0].headerMenu.push(
                {
                    label: "Cadastrar novo Produto",
                    action: function (e, column) {
                        ClientEvents.emit("WSOP/produtos/add");
                    }
                })
            this.newCollums[0].headerMenu.push(
                {
                    label: "Download CSV",
                    action: function (e, column) {
                        ClientEvents.emit("WSOP/produtos/dnl", {});
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
            rowContext: this.rowContext,
            dataFiltering: function (filters) {
                ClientEvents.emit("wsop_Products_filtertable");
            },
        });
        this._init();
        ClientEvents.emit("SendSocket", "WSOP/produtos/lst", { name: "", barcode: "" });
    }

    _init() {

        /**Receive user list and append to Table */
        ClientEvents.on("wsop/produtos/lst", (data) => {
            if (data) {
                this.UserListData = data;
                this.main_table.updateOrAddData(this.UserListData);
            }
        });

        ClientEvents.on("system/added/produtos", () => { ClientEvents.emit("system_mess", { status: "OK", mess: "Produto Adicionado com Exito", time: 1000 }); ClientEvents.emit("SendSocket", "WSOP/produtos/lst", { name: "", barcode: "" }); });
        ClientEvents.on("system/removed/produtos", () => { ClientEvents.emit("system_mess", { status: "OK", mess: "Produto Removido com Exito", time: 1000 }); ClientEvents.emit("SendSocket", "WSOP/produtos/lst", { name: "", barcode: "" }); });
        ClientEvents.on("system/edited/produtos", () => { ClientEvents.emit("system_mess", { status: "OK", mess: "Produto Editado com Exito", time: 1000 }); ClientEvents.emit("SendSocket", "WSOP/produtos/lst", { name: "", barcode: "" }); });

        let timeouttimer = new Date().getTime();
        let lsearch = "";
        /**Receive user list and append to Table */
        ClientEvents.on("wsop_Products_filtertable", () => {
            let headerFilters = this.main_table.getHeaderFilters();
            let sendfilters = {};
            headerFilters.forEach(element => {
                sendfilters[element.field] = element.value;
            });
            if (headerFilters.length > 0 && timeouttimer - new Date().getTime() < 0 && lsearch != JSON.stringify(sendfilters)) {
                lsearch = JSON.stringify(sendfilters);
                timeouttimer = new Date().getTime() + (1 * 100);
                ClientEvents.emit("SendSocket", "WSOP/produtos/lst", sendfilters);
            }
        });

        ClientEvents.on("WSOP/produtos/dnl", () => {
            if (this.UserListData != undefined) {
                let csv = "codigo;codigonovo;nome;genero;modelo;gola;vies;preco;url;descricao;ativo";

                this.UserListData.forEach(os => {
                    try {
                        csv += "\n" + os.barcode + ";"
                            + ";"
                            + os.name + ";"
                            + JSON.parse(JSON.parse(JSON.stringify(os.description))).genero + ";"
                            + JSON.parse(JSON.parse(JSON.stringify(os.description))).modelo + ";"
                            + JSON.parse(JSON.parse(JSON.stringify(os.description))).gola + ";"
                            + JSON.parse(JSON.parse(JSON.stringify(os.description))).vies + ";"
                            + os.price + ";"
                            + os.url + ";"
                            + JSON.parse(JSON.parse(JSON.stringify(os.description))).description + ";"
                            + (os.active == 1 ? "Sim" : "Não");



                        /*
                        { title: 'Nome', field: 'name', headerFilter: "input" },
                        { title: 'Modelo', field: 'description', formatter: ((data) => JSON.parse(JSON.parse(JSON.stringify(os.description))).modelo), headerFilter: "input" },
                        { title: 'Gola', field: 'description', formatter: ((data) => JSON.parse(JSON.parse(JSON.stringify(os.description))).gola), headerFilter: "input" },
                        { title: 'Vies', field: 'description', formatter: ((data) => JSON.parse(JSON.parse(JSON.stringify(os.description))).vies), headerFilter: "input" },
                        { title: 'Genero', field: 'description', formatter: ((data) => JSON.parse(JSON.parse(JSON.stringify(os.description))).genero), headerFilter: "input" },
                        { title: 'Descrição', field: 'description', formatter: ((data) => JSON.parse(JSON.parse(JSON.stringify(os.description))).description), headerFilter: "input" },
    
                        
                        "[{"altura":9,"disponibilidade":6,"id":97982435,"largura":27,"linha":1,"ncm":"",
                        "nome":"Conjunto Regata e Shorts |PRETO |  MIKASA OPEN - ETAPA SÃO PAULO",
                        "pedido":"/api/v1/pedido/4419","peso":"0.400","preco_cheio":"115.6000","preco_custo":null,
                        "preco_promocional":"99.0000","preco_subtotal":"99.0000","preco_venda":"99.0000",
                        "produto":"/api/v1/produto/68522024","produto_pai":"/api/v1/produto/68522020",
                        "profundidade":17,"quantidade":"1.000","sku":"ZX3SK62BR-g-SJ0LMJNDC","tipo":"atributo_opcao"}]"//*/
                    } catch (err) {

                    }
                })

                let downloadLink = document.createElement("a");
                let blob = new Blob(["\ufeff", csv]);
                let url = URL.createObjectURL(blob);
                downloadLink.href = url;
                downloadLink.download = "data.csv";

                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }

        });
    }
}
