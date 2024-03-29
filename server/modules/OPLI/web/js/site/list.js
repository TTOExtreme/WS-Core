ClientEvents.clearAll();

ClientEvents.emit("LeftMenuClose");
ClientEvents.emit("LMI-CloseAll");
ClientEvents.emit("close_menu");

//load emitente Data
ClientEvents.on("wsop/emitente/add", (data) => { window.Emitente = data; });
ClientEvents.emit("SendSocket", "wsop/emitente/lst");


ClientEvents.emit("LoadExternal", [
    //"./js/libs/suneditor.min.js",
    "./css/screen/suneditor.min.css",
    "./module/OPLI/js/utils/osStatus.js",
    "./module/OPLI/js/utils/html5-qrcode.min.js",
    "./module/OPLI/js/utils/qrcodeAnalizer.js",
    //"./module/OPLI/js/utils/anexo.js",
    //"./module/OPLI/js/utils/consulta.js",
    //"./module/OPLI/js/utils/ProdutosStruct.js",
    //"./module/OPLI/js/produtos/add.js",
    //"./module/OPLI/js/clientes/add.js",
    //"./module/OPLI/js/site/add.js",
    "./module/OPLI/js/site/view.js",
    "./module/OPLI/js/site/printop.js",
    //"./module/OPLI/js/site/print.js",
    //"./module/OPLI/js/site/printop.js",
    //"./module/OPLI/js/site/del.js",
    //"./module/OPLI/js/site/edt.js",
    "./module/OPLI/js/site/edtstatus.js",
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


window.UserList = class UserList {

    /**Defines of Table */
    actionFunction = "null";
    actionName = "Ações";
    //actionIcon = "handle"; //"buttonTick" "buttonCross" "tickCross"
    actionIcon = function (cell, formatterParams, onRendered) { //plain text value
        let rowdata = cell._cell.row.data;
        let htm = document.createElement("div");
        /*
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
        }//*/
        if (Myself.checkPermission("OPLI/menu/site")) {
            let bot = document.createElement("i");
            bot.setAttribute("class", "fa fa-mail-forward");
            bot.setAttribute("title", "Mudar Status");
            bot.style.marginRight = "5px";
            bot.onclick = () => { ClientEvents.emit("WSOP/site/changestatus", rowdata) };
            htm.appendChild(bot);
        }
        if (Myself.checkPermission("OPLI/menu/site")) {
            let bot = document.createElement("i");
            bot.setAttribute("class", "fa fa-eye");
            bot.setAttribute("title", "Visualizar");
            bot.style.marginRight = "5px";
            bot.onclick = () => { ClientEvents.emit("SendSocket", "WSOP/site/lstid", { id: rowdata.id }); };
            htm.appendChild(bot);
        }
        if (Myself.checkPermission("OPLI/menu/site")) {
            let bot = document.createElement("i");
            bot.setAttribute("class", "fa fa-print");
            bot.setAttribute("title", "Imprimir");
            bot.style.marginRight = "5px";
            bot.onclick = () => { ClientEvents.emit("SendSocket", "WSOP/site/lstidprint", { id: rowdata.id }); };
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
    RetrievingData = []; // quais itens faltam carregar
    DownloadedData = []; //Itens carregados para download
    rowContext = (ev, row) => {
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
            {
                title: 'ID L.I.', field: 'id_li', headerFilter: "input",
                formatter: function (cell) {
                    cell._cell.element.style.background = window.utils.OPLIStatusIdToBgColor(cell.getRow().getData().status);
                    cell._cell.element.style.color = window.utils.OPLIStatusIdToColor(cell.getRow().getData().status);
                    return cell.getRow().getData().id_li;
                }
            },
            { title: 'Nome', field: 'name', headerFilter: "input" },
            { title: 'Cliente', field: 'nome_cliente', headerFilter: "input" },
            //{ title: 'Status', field: 'status', headerFilter: "input" },
            {
                title: 'Status', field: 'status', headerFilter: "select", headerFilterParams: this._getStatusFilterParams(),
                formatter: function (cell) {
                    cell._cell.element.style.background = window.utils.OPLIStatusIdToBgColor(cell.getRow().getData().status);
                    cell._cell.element.style.color = window.utils.OPLIStatusIdToColor(cell.getRow().getData().status);
                    return window.utils.OPLIStatusIdToName(cell.getRow().getData().status);
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
                    ClientEvents.emit("SendSocket", "WSOP/site/lst", { id: "", name: "", nome_cliente: "", status: "", createdIn: "", endingIn: "" });
                }
            })
        this.newCollums[0].headerMenu.push(
            {
                label: "Download CSV",
                action: function (e, column) {
                    ClientEvents.emit("WSOP/site/dnl", {});
                }
            })
        this.newCollums[0].headerMenu.push(
            {
                label: "Download Em Produção para CSV",
                action: function (e, column) {
                    ClientEvents.emit("SendSocket", "WSOP/site/lstdownload/emproducao", { status: "(17,15)" });
                    //ClientEvents.emit("WSOP/site/dnl/emproducao", {});
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
            height: ((screen.width > 600) ? "100%" : "calc(100% - 30px)"),
            paginationButtonCount: 3,
            pagination: "local",
            paginationSize: 15,
            paginationSizeSelector: [10, 15, 20, 25, 30, 50, 100, 200, 500, 1000],
            movableColumns: true,
            layout: ((screen.width > 600) ? "fitColumns" : "fitData"),
            rowFormatter: this.actionRowFormatter,
            rowContext: this.rowContext,
            dataFiltering: function (filters) {
                ClientEvents.emit("opli_site_filtertable");
            },
        });
        this._init();
        ClientEvents.emit("SendSocket", "WSOP/site/lst", { id: "", name: "", nome_cliente: "", status: "", createdIn: "", endingIn: "" });
    }

    _init() {

        /**Receive user list and append to Table */
        ClientEvents.on("wsop/site/lst", (data) => {
            if (data) {
                this.UserListData = data;
                this.main_table.setData(this.UserListData);
                /*
                setTimeout(() => { //moved to here for broadcasting problems
                    ClientEvents.emit("SendSocket", "WSOP/site/lst");
                }, 60 * 1000);//*/
            }
        });



        // Filter table ========================================
        let timeouttimer = new Date().getTime();
        let lsearch = "";
        /**Receive user list and append to Table */
        ClientEvents.on("opli_site_filtertable", () => {
            let headerFilters = this.main_table.getHeaderFilters();
            let sendfilters = {};
            headerFilters.forEach(element => {
                sendfilters[element.field] = element.value;
            });
            if (headerFilters.length > 0 && timeouttimer - new Date().getTime() < 0 && lsearch != JSON.stringify(sendfilters)) {
                lsearch = JSON.stringify(sendfilters);
                //console.log(sendfilters);
                timeouttimer = new Date().getTime() + (1 * 100);
                ClientEvents.emit("SendSocket", "WSOP/site/lst", sendfilters);
            }
        });


        /**Receive user list and append to Table */
        ClientEvents.on("wsop/site/lst/append", (data) => {
            if (data) {
                this.main_table.updateOrAddData(data);
            }
        });

        ClientEvents.on("system/edited/sitedata", () => { ClientEvents.emit("system_mess", { status: "OK", mess: "Site Editado com Exito", time: 1000 }); ClientEvents.emit("SendSocket", "WSOP/site/lst"); });

        ClientEvents.on("wsop/site/download", (data) => {
            ClientEvents.emit("system_mess", { status: "OK", mess: "Download Pedido: " + data[0].id_li, time: 1000 });
            data.forEach(dataitem => {
                this.RetrievingData.splice(this.RetrievingData.indexOf(dataitem.id), 1)
            })
            this.DownloadedData = this.DownloadedData.concat(data);
            if (this.RetrievingData.length < 1) {
                ClientEvents.emit("WSOP/site/dnlsave", {});
            }
        })
        ClientEvents.on("wsop/site/download/emproducao", (data) => {
            if (data.results.length > 0) {
                ClientEvents.emit("system_mess", { status: "OK", mess: "Download Pedido: " + data.results[0].id_li, time: 1000 });
                /*
                data.results.forEach(dataitem => {
                    this.RetrievingData.splice(this.RetrievingData.indexOf(dataitem.id), 1)
                })
                //*/
                this.DownloadedData = this.DownloadedData.concat(data.results);
                //if (data.last) {
                ClientEvents.emit("WSOP/site/dnlsave/emproducao", {});
                //}
            }
        })

        function downloadrecprod(index = 0, lasteq = 0, length = 100, RetrievingData) {
            setTimeout(() => {
                if (RetrievingData.length == length) {
                    downloadrecprod(index + 1, lasteq, length, RetrievingData);
                } else {
                    if (lasteq - index > 10) {
                        ClientEvents.emit("WSOP/site/dnlsave/emproducao", {});
                    } else {
                        downloadrecprod(index + 1, lasteq + 1, RetrievingData.length, RetrievingData)
                    }
                }
            }, 1000)
        }

        function downloadrec(index = 0, lasteq = 0, length = 100, RetrievingData) {
            setTimeout(() => {
                if (RetrievingData.length == length) {
                    downloadrec(index + 1, lasteq, length, RetrievingData);
                } else {
                    if (lasteq - index > 10) {
                        ClientEvents.emit("WSOP/site/dnlsave", {});
                    } else {
                        downloadrec(index + 1, lasteq + 1, RetrievingData.length, RetrievingData)
                    }
                }
            }, 1000)
        }

        ClientEvents.on("WSOP/site/dnl", () => {
            let max = 5000, min = 0;
            try {
                max = parseInt(prompt("Numero do ultimo pedido:", "5000"));
                min = parseInt(prompt("Numero do primeiro pedido:", "0"));
                for (let id = max; id >= 0; id--) {
                    this.RetrievingData.push(id);
                    if (id % 100 == 0) {
                        setTimeout(() => {
                            ClientEvents.emit("SendSocket", "WSOP/site/lstdownload", { id: id });
                        }, 1000 + id / 10);
                    }
                }
                downloadrec(0, 0, 0, this.RetrievingData);
            } catch (err) {
                ClientEvents.emit("system_mess", { status: "ERROR", mess: "Número invalido", time: 1000 });
                console.log(err)
            }
        });

        ClientEvents.on("WSOP/site/dnl/emproducao", () => {
            let max = 5000, min = 0;
            try {
                /*
                max = parseInt(prompt("Numero do ultimo pedido:", "5000"));
                min = parseInt(prompt("Numero do primeiro pedido:", "0"));
                for (let id = max; id >= min; id--) {
                    //this.RetrievingData.push(id);
                    if (id % 100 == 0) {
                        setTimeout(() => {
                            ClientEvents.emit("SendSocket", "WSOP/site/lstdownload/emproducao", { id: id, last: (id == min) });
                        }, 1000 + id / 10);
                    }
                }
                //*/
                ClientEvents.emit("SendSocket", "WSOP/site/lstdownload/emproducao", { status: "17" });

                //downloadrecprod(0, 0, 0, this.RetrievingData);
            } catch (err) {
                ClientEvents.emit("system_mess", { status: "ERROR", mess: "Número invalido", time: 1000 });
                console.log(err)
            }
        });

        ClientEvents.on("WSOP/site/dnlsave", () => {
            if (this.UserListData != undefined) {
                let csv = "OS;status;data;mensagem;codigo;produtos;tamanho;qnt";


                let getTamanho = (barcode) => {

                    if (barcode.indexOf("-pp") > -1) { return "PP"; }
                    if (barcode.indexOf("-gg") > -1) { return "GG"; }
                    if (barcode.indexOf("-exg") > -1) { return "EXG"; }
                    if (barcode.indexOf("-exgg") > -1) { return "EXGG"; }
                    if (barcode.indexOf("-g3") > -1) { return "G3"; }
                    if (barcode.indexOf("-g4") > -1) { return "G4"; }
                    if (barcode.indexOf("-p") > -1) { return "P"; }
                    if (barcode.indexOf("-m") > -1) { return "M"; }
                    if (barcode.indexOf("-g") > -1) { return "G"; }
                    if (barcode.indexOf("-rn") > -1) { return "RN"; }
                    if (barcode.indexOf("-2") > -1) { return "2"; }
                    if (barcode.indexOf("-4") > -1) { return "4"; }
                    if (barcode.indexOf("-6") > -1) { return "6"; }
                    if (barcode.indexOf("-8") > -1) { return "8"; }
                    if (barcode.indexOf("-10") > -1) { return "10"; }
                    if (barcode.indexOf("-12") > -1) { return "12"; }
                    if (barcode.indexOf("-14") > -1) { return "14"; }
                    if (barcode.indexOf("-16") > -1) { return "16"; }
                }

                this.DownloadedData.forEach(os => {
                    try {
                        csv += "\n#" + os.id_li + ";" + window.utils.OPLIStatusIdToName(os.status) + ";" + formatTime(os.endingIn) + ";" + os.description.replace(new RegExp("\n", "g"), " ") + ";;";
                        let prods = JSON.parse(os.products);
                        prods.forEach(prod => {
                            let tam = getTamanho(prod.sku);
                            csv += "\n;;;;\"" + prod.sku + "\";\"" + prod.nome + "\"";
                            csv += ";\"" + tam + "\"";
                            csv += ";\"" + parseInt(prod.quantidade) + "\"";


                            /*"[{"altura":9,"disponibilidade":6,"id":97982435,"largura":27,"linha":1,"ncm":"",
                            "nome":"Conjunto Regata e Shorts |PRETO |  MIKASA OPEN - ETAPA SÃO PAULO",
                            "pedido":"/api/v1/pedido/4419","peso":"0.400","preco_cheio":"115.6000","preco_custo":null,
                            "preco_promocional":"99.0000","preco_subtotal":"99.0000","preco_venda":"99.0000",
                            "produto":"/api/v1/produto/68522024","produto_pai":"/api/v1/produto/68522020",
                            "profundidade":17,"quantidade":"1.000","sku":"ZX3SK62BR-g-SJ0LMJNDC","tipo":"atributo_opcao"}]"//*/
                        })
                    } catch (err) {

                    }
                });

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

        ClientEvents.on("WSOP/site/dnlsave/emproducao", () => {
            if (this.UserListData != undefined) {
                let csv = "OS;status;data;mensagem;obsInterna;codigo;produtos;tamanho;qnt";


                let getTamanho = (barcode) => {

                    if (barcode.indexOf("-pp") > -1) { return "PP"; }
                    if (barcode.indexOf("-gg") > -1) { return "GG"; }
                    if (barcode.indexOf("-exg") > -1) { return "EXG"; }
                    if (barcode.indexOf("-exgg") > -1) { return "EXGG"; }
                    if (barcode.indexOf("-g3") > -1) { return "G3"; }
                    if (barcode.indexOf("-g4") > -1) { return "G4"; }
                    if (barcode.indexOf("-p") > -1) { return "P"; }
                    if (barcode.indexOf("-m") > -1) { return "M"; }
                    if (barcode.indexOf("-g") > -1) { return "G"; }
                    if (barcode.indexOf("-rn") > -1) { return "RN"; }
                    if (barcode.indexOf("-2") > -1) { return "2"; }
                    if (barcode.indexOf("-4") > -1) { return "4"; }
                    if (barcode.indexOf("-6") > -1) { return "6"; }
                    if (barcode.indexOf("-8") > -1) { return "8"; }
                    if (barcode.indexOf("-10") > -1) { return "10"; }
                    if (barcode.indexOf("-12") > -1) { return "12"; }
                    if (barcode.indexOf("-14") > -1) { return "14"; }
                    if (barcode.indexOf("-16") > -1) { return "16"; }
                }

                this.DownloadedData.forEach(os => {
                    try {
                        if (os.status == "17" || os.status == "15") {
                            csv += "\n#" + os.id_li + ";" + window.utils.OPLIStatusIdToName(os.status) + ";" + formatTime(os.endingIn) + ";" + unclearDesc(os.description) + ";" + unclearDesc(os.obs) + ";";
                            let prods = JSON.parse(os.products);
                            prods.forEach(prod => {
                                let tam = getTamanho(prod.sku);
                                csv += "\n;;;;;\"" + prod.sku + "\";\"" + prod.nome + "\"";
                                csv += ";\"" + tam + "\"";
                                csv += ";\"" + parseInt(prod.quantidade) + "\"";


                                /*"[{"altura":9,"disponibilidade":6,"id":97982435,"largura":27,"linha":1,"ncm":"",
                                "nome":"Conjunto Regata e Shorts |PRETO |  MIKASA OPEN - ETAPA SÃO PAULO",
                                "pedido":"/api/v1/pedido/4419","peso":"0.400","preco_cheio":"115.6000","preco_custo":null,
                                "preco_promocional":"99.0000","preco_subtotal":"99.0000","preco_venda":"99.0000",
                                "produto":"/api/v1/produto/68522024","produto_pai":"/api/v1/produto/68522020",
                                "profundidade":17,"quantidade":"1.000","sku":"ZX3SK62BR-g-SJ0LMJNDC","tipo":"atributo_opcao"}]"//*/
                            })
                        }
                    } catch (err) {

                    }
                });

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
    _getStatusFilterParams() {
        let ret = [{ label: "-", value: "" }]
        window.utils.OPLIstatusIDs.forEach((item, index) => {
            if (item.name != "Checar STATUS")
                ret.push({ label: item.name, value: index })
        })
        return ret;
    }
}

