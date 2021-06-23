
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
        "<tr><td id='move_menu_WSMK_calendario' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'WSMK_calendario_edtmulti_div')>&#9776;</td><td class='WSMK_calendario_label'><p class='wsmk_calendario_closeButton' onclick=ClientEvents.emit(\"close_menu\",'WSMK_calendario_edtmulti_div')>X</p></td></tr>" +
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
        dataTreeStartExpanded: false, columns: [{
            title: "",
            headerMenu: [{
                label: "Novo",
                action: function (e, column) {
                    ClientEvents.emit("SendSocket", "WSMK/calendario/lstid", { id: 0, start: new Date(data.start).getTime() + (6 * 3600 * 1000) })
                }
            }],
            columns: [

                {
                    title: 'Ações',
                    formatter: ((data) => {
                        return "<i class='fa fa-pencil' aria-hidden='true'></i>";
                    }),
                    cellClick: function (e, cell) {
                        var row = cell.getData();
                        ClientEvents.emit("SendSocket", "WSMK/calendario/lstid", { id: row.id, reloadMulti: true });
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
                    formatter: ((data) => { return unclearDesc(data.getData().description.description); }),
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
                }
            ]
        }],
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
