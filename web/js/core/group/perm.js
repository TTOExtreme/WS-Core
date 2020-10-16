let table_grp_perm;

ClientEvents.on("grp/perm", (data) => {
    ClientEvents.emit("grp/lst/perm/close");
    /**
     * id
     * name
     * created In
     * created By
     * deactivateIn
     * deactivatedBy
     * active
     * connected
     * lastConnection
     * lastTry
     * lastIp
     */

    /**
     * create Show Page for group info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "grp_edt_div");
    div.setAttribute("id", "grp_edt_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_grp_edt' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'grp_edt_div')>&#9776;</td><td class='grp_edt_label'><p class='edt_grp_closeButton' onclick='ClientEvents.emit(\"grp/lst/perm/close\")'>X</p></td></tr>" +
        "<tr><td></td><td colspan='2' style='float:none' class='grp_edt_label'><center>Grupo: " + data.name + "<center></td></tr>" +
        "<tr><td colspan=2><div id='perm_table' class='tabulator' style='max-width: 1080px;width: 1080px;height: 450px;'></div></td></tr>" +
        "</table>";

    document.body.appendChild(div);

    ClientEvents.emit("SendSocket", "adm/grp/perm/data", data);

    /**
        actionFunction = "system/get/grp/perm";
        actionName = "Abrir";
        actionIcon = "buttonTick";
        confirmExecution = false;
        actionfield = "active";
        actionOptions = [];
        //*/

    /**Initialize  Table */
    table_grp_perm = new Tabulator("#perm_table", {
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
                if (confirm("Voce esta prestes a " + ((row['active'] == 1) ? "Desvincular" : "Vincular") + " a Permissão ao Grupo: " + data.name + "\nVoce tem certeza disso?")) {

                    ClientEvents.emit("SendSocket", "adm/grp/perm/set", {
                        id_group: data.id,
                        code: row.code,
                        active: ((row.active == 1) ? 0 : 1)
                    });
                    //reload the table
                    ClientEvents.emit("SendSocket", "adm/grp/perm/data", data);
                }

            }
        },
        {
            title: 'Code',
            field: 'code',
            headerFilter: "input"
        },
        {
            title: 'Permissão',
            field: 'name',
            headerFilter: "input"
        },
        {
            title: 'Descrição',
            field: 'description',
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
});

ClientEvents.on("grp/lst/perm/close", () => {
    if (document.getElementById("grp_edt_div")) {
        document.body.removeChild(document.getElementById("grp_edt_div"));
    }
});

ClientEvents.on("adm/grp/perm/set", (data) => {
    /**
     * save data and closes the page if success
     * closing part from server command
     */
})

ClientEvents.on("adm/grp/perm/data", (data) => {
    /**
     * Add data to table
     */
    if (table_grp_perm) {
        table_grp_perm.setData(data);
    }
})