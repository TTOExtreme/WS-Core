
ClientEvents.on("grp/disable", (data) => {

    if (confirm("Voce esta prestes a " + ((data.active == 1) ? "Desativar" : "Ativar") + " o Grupo: " + data.username + "\nVoce tem certeza disso?")) {
        ClientEvents.emit("SendSocket", "adm/grp/disable/save", {
            id_user: data.id,
            active: ((data.active == 1) ? 0 : 1)
        });
    }
});
