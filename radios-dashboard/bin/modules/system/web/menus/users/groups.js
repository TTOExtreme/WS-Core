

actionFunction = "system/get/users/perm";
actionName = "Abrir";
actionIcon = "buttonTick";
confirmExecution = false;
actionfield = "active";
actionOptions = [];


actionRowFormatter = (data) => {
    //create and style holder elements
    var holderEl = document.createElement("div");
    var tableEl = document.createElement("div");

    holderEl.style.boxSizing = "border-box";
    holderEl.style.padding = "4px 4px 4px 4px";
    holderEl.style.borderTop = "1px solid #333";
    holderEl.style.borderBotom = "1px solid #333";
    holderEl.style.background = "var(--div)";

    tableEl.style.border = "1px solid #333";

    holderEl.appendChild(tableEl);

    data.getElement().appendChild(holderEl);
    console.log(data.getData().groups);

    var subTable = new Tabulator(tableEl, {
        headerFilterPlaceholder: "Filtrar",
        index: "id_user",
        dataTree: true,
        dataTreeStartExpanded: false,
        layout: "fitColumns",
        movableColumns: true,
        data: data.getData().groups,
        columns: [
            { title: "ID", field: "id_group" },
            { title: "Grupo", field: "grp" },
            { title: "Nome", field: "groupname" },
        ]
    })
};

actionCallback = (row) => {
    //console.log(row);
    //send("system/get/users/perm", row);
    send("system/get/users/groups", row);
};

appendRoute("system/list/users/groups", system_list_users_group);

function system_list_users_group(data) {
    console.log(data);
    //reloadUserGroupTable();
}


system_get_users();

