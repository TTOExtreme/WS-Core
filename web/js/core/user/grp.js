window.table_usr_grp = null;

ClientEvents.on("usr/grp", (data) => {
    ClientEvents.emit("grp/lst/grp/close");
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
    div.setAttribute("class", "usr_edt_div");
    div.setAttribute("id", "grp_edt_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_usr_edt' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'grp_edt_div')>&#9776;</td><td class='usr_edt_label'><p class='edt_grp_closeButton' onclick='ClientEvents.emit(\"grp/lst/grp/close\")'>X</p></td></tr>" +
        "<tr><td></td><td colspan='2' style='float:none' class='usr_edt_label'><center>Usuário: " + data.name + "<center></td></tr>" +
        "<tr><td colspan=2><div id='perm_table' class='tabulator' style='max-width: 1080px;width: 1080px;height: 450px;'></div></td></tr>" +
        "</table>";

    document.body.appendChild(div);

    ClientEvents.emit("SendSocket", "adm/usr/grp/data", data);

    /**
        actionFunction = "system/get/usr/grp";
        actionName = "Abrir";
        actionIcon = "buttonTick";
        confirmExecution = false;
        actionfield = "active";
        actionOptions = [];
        //*/

    /**Initialize  Table */

    window.table_usr_grp = new Tabulator("#perm_table", {
        headerFilterPlaceholder: "Filtrar",
        index: "id",
        dataTree: true,
        dataTreeStartExpanded: [true, true, true, true, false],
        columns: [{
            title: "Actions",
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
                    if (row.id_origin == row.id || row.id_origin == undefined) {
                        if (confirm("Voce esta prestes a " + ((row['active'] == 1) ? "Desvincular" : "Vincular") + " o Usuário ao Grupo: " + data.name + "\nVoce tem certeza disso?")) {
                            ClientEvents.emit("SendSocket", "adm/usr/grp/set", {
                                id_user: data.id,
                                id_group: row.id,
                                active: ((row.active == 1) ? 0 : 1)
                            });
                            //reload the table
                            ClientEvents.emit("SendSocket", "adm/usr/grp/data", data);
                        }
                    } else {
                        confirm("Esse Grupo faz parte de uma Hierarquia de grupo.\n E não pode ser desativada por um filho.");
                    }
                }
            },
            {
                title: 'ID',
                field: 'id',
                headerFilter: "input"
            },
            {
                title: 'name',
                field: 'name',
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
            }]
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

});

ClientEvents.on("grp/lst/grp/close", () => {
    if (document.getElementById("grp_edt_div")) {
        document.body.removeChild(document.getElementById("grp_edt_div"));
    }
});

/**
 * save data and closes the page if success
 * closing part from server command
 */
ClientEvents.on("adm/usr/grp/set", () => {
})

ClientEvents.on("adm/usr/grp/data", (data) => {
    /**
     * Add data to table
     */
    if (window.table_usr_grp) {
        data = freeHierarchy(
            data,
            "_children",
            { active: 0, name: "limite da tabela", createdIn: null, createdBy: null, modifiedIn: null, modifiedBy: null, deactivatedIn: null, deactivatedBy: null },
            7)
        window.table_usr_grp.setData(data);
    }
})

function freeHierarchy(array, nameOfChild, override = {}, nLevels) {
    if (array) {
        if (nLevels <= 0) {
            return [override];
        } else {
            array.forEach((item, index, arr) => {
                array[index][nameOfChild] = freeHierarchy(item[nameOfChild], nameOfChild, override, nLevels - 1);
            })
            return array;
        }
    }
}