
window.table_usr_perm = null;

ClientEvents.on("WSMK/calendario/edtmulti", (data) => {
    ClientEvents.emit("close_menu", 'WSMK_calendario_edtmulti_div');

    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsmk_calendario_div menu_dragger");
    div.setAttribute("id", "WSMK_calendario_edtmulti_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_WSMK_calendario' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'WSMK_calendario_edtmulti_div')>&#9776;</td><td class='WSMK_calendario_label'><p class='WSMK_calendario_closeButton' onclick=ClientEvents.emit(\"close_menu\",'WSMK_calendario_edtmulti_div')>X</p></td></tr>" +
        "<tr><td></td><td colspan='2' style='float:none' class='WSMK_calendario_label'><center>Dia: " + formatTimeDMA(data.start) + "<center></td></tr>" +
        "<tr><td colspan=2><div id='perm_table' class='tabulator' style='max-width: 1080px;width: 1080px;height: 450px;'></div></td></tr>" +
        "</table>";

    document.body.appendChild(div);

    /**
        actionFunction = "system/get/users/perm";
        actionName = "Abrir";
        actionIcon = "buttonTick";
        confirmExecution = false;
        actionfield = "active";
        actionOptions = [];
        //*/

    /**Initialize  Table */
    window.table_usr_perm = new Tabulator("#perm_table", {
        headerFilterPlaceholder: "Filtrar",
        index: "id",
        dataTree: true,
        dataTreeStartExpanded: false,
        columns: [{
            title: 'Status',
            field: 'active',
            formatter: "tickCross",
            headerFilter: "select",
            headerFilterParams: [{
                label: "-",
                value: ""
            }, {
                label: "Permitido",
                value: "1"
            }, {
                label: "Negado",
                value: "0"
            }],
            cellClick: function (e, cell) {
                var row = cell.getData();
                row.reloadMulti = true;
                ClientEvents.emit("WSMK/calendario/edt", [row]);
            }
        },
        {
            title: 'Titulo',
            field: 'title',
            headerFilter: "input"
        },
        {
            title: 'Descrição',
            field: 'description',
            formatter: ((data) => { return data.description; }),
            headerFilter: "input"
        },

        {
            title: 'Adicionado Em',
            field: 'createdIn',
            formatter: ((data) => formatTime(data.getRow().getData().createdIn)),
            headerFilter: "input"
        },
        {
            title: 'Adicionado Por',
            field: 'createdBy',
            headerFilter: "input"
        },
        {
            title: 'Desativado Em',
            field: 'deactivatedIn',
            formatter: ((data) => formatTime(data.getRow().getData().deactivatedIn)),
            headerFilter: "input"
        },
        {
            title: 'Desativado Por',
            field: 'deactivatedBy',
            headerFilter: "input"
        }
        ],
        paginationButtonCount: 3,
        pagination: "local",
        paginationSize: 15,
        paginationSizeSelector: [10, 15, 20, 25, 30, 50, 100, 200, 500, 1000],
        movableColumns: true,
        layout: "fitColumns",
        rowFormatter: this.actionRowFormatter,
        rowContext: this.rowContext
    });

    window.table_usr_perm.setData(data.data);
});
