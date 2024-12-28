
ClientEvents.on("usr/disable", (data) => {

    if (confirm("Voce esta prestes a " + ((data.active == 1) ? "Desativar" : "Ativar") + " o Usuário: " + data.username + "\nVoce tem certeza disso?")) {
        ClientEvents.emit("SendSocket", "adm/usr/disable/save", {
            id_user: data.id,
            active: ((data.active == 1) ? 0 : 1)
        });
    }
});
