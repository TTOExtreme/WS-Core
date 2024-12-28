
window.table_usr_perm = null;

ClientEvents.on("usr/perm", (data) => {
    ClientEvents.emit("usr/lst/perm/close");
    /**
     * id
     * name
     * username
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
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "usr_edt_div");
    div.setAttribute("id", "usr_edt_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_usr_edt' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'usr_edt_div')>&#9776;</td><td class='usr_edt_label'><p class='edt_usr_closeButton' onclick='ClientEvents.emit(\"usr/lst/perm/close\")'>X</p></td></tr>" +
        "<tr><td></td><td colspan='2' style='float:none' class='usr_edt_label'><center>Usuário: " + data.username + "<center></td></tr>" +
        "<tr><td colspan=2><div id='perm_table' class='tabulator' style='height: 450px;'></div></td></tr>" +
        "</table>";

    document.body.appendChild(div);

    ClientEvents.emit("SendSocket", "adm/usr/perm/data", data);

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
                if (confirm("Voce esta prestes a " + ((row['active'] == 1) ? "Desvincular" : "Vincular") + " a Permissão ao Usuário: " + data.username + "\nVoce tem certeza disso?")) {

                    ClientEvents.emit("SendSocket", "adm/usr/perm/set", {
                        id_user: data.id,
                        code: row.code,
                        active: ((row.active == 1) ? 0 : 1)
                    });
                    //reload the table
                    ClientEvents.emit("SendSocket", "adm/usr/perm/data", data);
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

ClientEvents.on("usr/lst/perm/close", () => {
    if (document.getElementById("usr_edt_div")) {
        document.body.removeChild(document.getElementById("usr_edt_div"));
    }
});

ClientEvents.on("adm/usr/perm/set", (data) => {
    /**
     * save data and closes the page if success
     * closing part from server command
     */
})

ClientEvents.on("adm/usr/perm/data", (data) => {
    /**
     * Add data to table
     */
    if (window.table_usr_perm) {
        window.table_usr_perm.setData(data);
    }
})