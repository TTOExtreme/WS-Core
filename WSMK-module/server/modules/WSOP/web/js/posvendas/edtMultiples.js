
window.table_usr_perm = null;

ClientEvents.on("WSOP/posvendas/edtmulti", (data) => {
    ClientEvents.emit("close_menu", 'WSOP_posvendas_edtmulti_div');

    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "WSOP_posvendas_div menu_dragger");
    div.setAttribute("id", "WSOP_posvendas_edtmulti_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_WSOP_posvendas' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'WSOP_posvendas_edtmulti_div')>&#9776;</td><td class='WSOP_posvendas_label'><p class='WSOP_posvendas_closeButton' onclick=ClientEvents.emit(\"close_menu\",'WSOP_posvendas_edtmulti_div')>X</p></td></tr>" +
        "<tr><td></td><td colspan='2' style='float:none' class='WSOP_posvendas_label'><center>Dia: " + formatTimeDMA(data.start) + "<center></td></tr>" +
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

    function unclearDesc(desc) {
        return desc.replace(new RegExp("&qt;", "g"), "\"").replace(new RegExp("&quot;", "g"), "=")
            .replace(new RegExp("&eq;", "g"), "=").replace(new RegExp("&eql;", "g"), "=")
            .replace(new RegExp("&gt;", "g"), ">").replace(new RegExp("&get;", "g"), ">")
            .replace(new RegExp("&lt;", "g"), ">").replace(new RegExp("&let;", "g"), "<")
            .replace(new RegExp("&space;", "g"), " ");
    }
    /**Initialize  Table */
    window.table_usr_perm = new Tabulator("#perm_table", {
        headerFilterPlaceholder: "Filtrar",
        index: "id",
        dataTree: true,
        dataTreeStartExpanded: false,
        columns: [{
            title: "",
            headerMenu: [{
                label: "Novo",
                action: function (e, column) {
                    ClientEvents.emit("SendSocket", "WSOP/posvendas/lstid", { id: 0, start: new Date(data.start).getTime() + (6 * 3600 * 1000) })
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
                        ClientEvents.emit("SendSocket", "WSOP/posvendas/lstid", { id: row.id, reloadMulti: true });
                    }
                },
                {
                    title: 'Cliente',
                    field: 'title',
                    headerFilter: "input"
                },
                {
                    title: 'Status',
                    field: 'description',
                    headerFilter: "input",
                    formatter: ((data) => {
                        if (data.getData().description.pendente == 0) {
                            data._cell.element.style.background = "#20f020"
                            data._cell.element.style.color = "#000"
                        } else {
                            data._cell.element.style.background = "#f02020"
                            data._cell.element.style.color = "#000"
                        }
                        return (data.getData().description.pendente == 1 ? "Pendente" : "Feito");
                    }),
                },
                {
                    title: 'Descrição',
                    field: 'description',
                    formatter: ((data) => {
                        return unclearDesc(data.getData().description.description)
                    }),
                    headerFilter: "input"
                },
                {
                    title: 'Vendedor',
                    field: 'description',
                    formatter: ((data) => { return data.getData().description.vendedor; }),
                    headerFilter: "input"
                },
                {
                    title: 'Telefone',
                    field: 'description',
                    formatter: ((data) => { return data.getData().description.tel; }),
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
