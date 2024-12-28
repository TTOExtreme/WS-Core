class TableHandler {


    //#region Tabulator
    config = {
        layout: "fitColumns",
        height: "calc(100vh - 70px)",

        width: "100%",
        //columns: columns,
        movableColumns: false,
        resizableColumnFit: true,
        resizableColumns: true,

        //rowContextMenu: this.rowMenu,

        persistence: true,
        //persistenceID: persistenceID,
        persistenceMode: "local",

        pagination: "local",
        paginationSize: 50,
        paginationSizeSelector: [10, 50, 100, 1000, 5000],
        paginationCounter: "rows",

    };

    Setup_tabulator(id, callback) {


        const table = new Tabulator(id, this.config);
        if (typeof (callback) == 'function') {
            callback(table);
        } else {
            console.error("Callback é nullo", callback);
        }
    }

    //Menu de escolha de colunas
    headerMenu() {
        let menu = [];
        let ncolsVisible = 0;
        let persistenceID = this.options.persistenceID;
        for (let column of this.getColumns()) {

            //create checkbox element using font awesome icons
            let icon = document.createElement("input");
            icon.setAttribute('type', 'checkbox');
            icon.checked = column.isVisible();
            //icon.classList.add("fas");
            if (column.isVisible()) { ncolsVisible++ };

            //build label
            let label = document.createElement("span");
            let title = document.createElement("span");

            title.textContent = " " + column.getDefinition().title;

            label.appendChild(icon);
            label.appendChild(title);

            //create menu item
            menu.push({
                label: label,
                action: (e) => {
                    //prevent menu closing
                    e.stopPropagation();
                    //toggle current column visibility
                    localStorage.removeItem("tabulator-" + persistenceID + "-columns");
                    column.toggle();
                    icon.checked = column.isVisible();
                }
            });
        }


        //build label
        let label = document.createElement("span");
        let title = document.createElement("span");

        title.textContent = "Limpar Definiçoes ";

        label.appendChild(title);

        //create menu item
        menu.push({
            label: label,
            action: (e) => {
                //prevent menu closing
                e.stopPropagation();
                //Limpa os dados salvos
                localStorage.removeItem("tabulator-" + persistenceID + "-columns");
            }
        });

        return menu;
    };

    //#endregion
}