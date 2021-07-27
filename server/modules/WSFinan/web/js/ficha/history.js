ClientEvents.on("wsfinan/fichas/lsthist", (data) => {
    ClientEvents.emit("close_menu", 'WSFinan_lsthistory_div');

    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsfinan_edt_div menu_dragger");
    div.setAttribute("id", "WSFinan_lsthistory_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wsfinan_edt' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'WSFinan_lsthistory_div')>&#9776;</td><td class='wsfinan_edt_label'><p class='wsfinan_ficha_closeButton' onclick=ClientEvents.emit(\"close_menu\",'WSFinan_lsthistory_div')>X</p></td></tr>" +
        "<tr><td></td><td colspan='2' style='float:none' class='wsfinan_edt_label'><center>Ficha: " + data.ficha.name + "<center></td></tr>" +
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
    let wsfinan_lsthist = new Tabulator("#perm_table", {
        headerFilterPlaceholder: "Filtrar",
        index: "id",
        data: data.data,
        dataTree: true,
        dataTreeStartExpanded: false, columns: [{
            title: "",
            headerMenu: [],
            columns: [
                {
                    title: 'ID',
                    field: 'id',
                    headerFilter: "input"
                },
                {
                    title: 'Operação',
                    field: 'data',
                    formatter: ((cell) => {
                        let data = cell.getRow().getData();
                        try {
                            data.data = JSON.parse(data.data);
                        } catch (err) {
                            console.log(err);
                        }
                        if (data.data.id_in == data.id_item) {//se é uma operação de entrada
                            cell._cell.element.style.background = "#008000";
                            cell._cell.element.style.color = "#ffffff";
                        } else {
                            if (data.data.id_out == data.id_item) {//se é uma operação de saida
                                cell._cell.element.style.background = "#800000";
                                cell._cell.element.style.color = "#ffffff";

                            } else {//se for quaisquer outras operações não mudar nada

                            }
                        }
                        return data.content;
                    }),
                    headerFilter: "input"
                },
                {
                    title: 'Realizado em',
                    field: 'createdIn',
                    formatter: ((data) => formatTime(data.getRow().getData().createdIn)),
                    headerFilter: "input"
                },
                {
                    title: 'Realizado Por',
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
});
