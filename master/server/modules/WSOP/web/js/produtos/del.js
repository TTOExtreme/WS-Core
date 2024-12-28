
ClientEvents.on("wsop/produtos/del", (data) => {

    if (confirm("Voce esta prestes a " + ((data.active == 1) ? "Excluir" : "") + " o Produto: " + data.name + "\nVoce tem certeza disso?")) {
        ClientEvents.emit("SendSocket", "wsop/produtos/del", {
            id: data.id,
            active: ((data.active == 1) ? 0 : 1)
        });
    }
});
