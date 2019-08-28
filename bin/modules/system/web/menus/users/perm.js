
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

    row.getElement().appendChild(holderEl);

    var subTable = new Tabulator(tableEl, {
        layout: "fitColumns",
        data: row.getData().permissions,
        columns: [
            { title: "Date", field: "date", sorter: "date" },
            { title: "Engineer", field: "engineer" },
            { title: "Action", field: "actions" },
        ]
    })
};

actionCallback = (row) => {
    console.log(row);
    //send("system/get/users/perm", row);
};


system_get_users();