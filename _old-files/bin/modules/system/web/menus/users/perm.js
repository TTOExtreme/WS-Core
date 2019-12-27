
actionFunction = "system/get/users/perm";
actionName = "Abrir";
actionIcon = "buttonTick";
confirmExecution = false;
actionfield = "active";
actionOptions = [];

var userPermData = {};

actionRowFormatter = (data) => { };

actionCallback = (row) => {
    userPermData = row;
    send("system/get/users/perm", userPermData);
};

appendRoute("system/edt/users/perm", (data) => {
    send("system/get/users/perm", userPermData);
});
appendRoute("system/lst/users/perm", system_list_user_perm);

function system_list_user_perm(data) {

    const newCollums = [
        {
            title: 'Status', field: 'atr', formatter: "tickCross", headerFilter: "select", headerFilterParams:
                [{ label: "-", value: "" }, { label: "Permitido", value: "1" }, { label: "Negado", value: "0" }],
            cellClick: function (e, cell) {
                var data = cell.getData();
                if (confirm("Voce esta prestes a " + ((data['atr'] == 1) ? "Desvincular" : "Vincular") + " a Permissão ao Usuário: " + userPermData.user + "\nVoce tem certeza disso?")) {
                    system_set_perm(userPermData.id_user, data.id_Permission, ((data.atr == 1) ? 1 : 0));
                }

            }, visible: !(actionName == "")
        },
        { title: 'ID', field: 'id_Permission', headerFilter: "input" },
        { title: 'Permissão', field: 'perm_name', headerFilter: "input" },
        { title: 'Descrição', field: 'perm_desc', headerFilter: "input" },

        { title: 'Adicionado Em', field: 'addedIn', formatter: ((data) => formatTime(data.getRow().getData().addedIn)), headerFilter: "input" },
        { title: 'Adicionado Por', field: 'addedByUser', headerFilter: "input" },
        { title: 'Desativado Em', field: 'deactivatedIn', formatter: ((data) => formatTime(data.getRow().getData().deactivatedIn)), headerFilter: "input" },
        { title: 'Desativado Por', field: 'deactivatedByUser', headerFilter: "input" }
    ];

    main_table = new Tabulator("#system_bottom_table", {
        data: data,
        headerFilterPlaceholder: "Filtrar",
        index: "id_user",
        dataTree: true,
        dataTreeStartExpanded: false,
        columns: newCollums,
        height: '100%',
        paginationButtonCount: 3,
        pagination: "local",
        paginationSize: 15,
        paginationSizeSelector: [10, 15, 20, 25, 30, 50, 100, 200, 500, 1000],
        movableColumns: true,
        rowFormatter: actionRowFormatter
    });
}


system_get_users();

function system_set_perm(user_id, permission_id, active) {
    send("system/edt/users/perm", { id_user: user_id, id_Permission: permission_id, active: active });
}
