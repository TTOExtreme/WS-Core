
ClientEvents.on("wsop/clientes/del", (data) => {

    if (confirm("Voce esta prestes a " + ((data.active == 1) ? "Excluir" : "") + " o Cliente: " + data.nome + "\nVoce tem certeza disso?")) {
        ClientEvents.emit("SendSocket", "wsop/clientes/del", {
            id: data.id,
            active: ((data.active == 1) ? 0 : 1)
        });
    }
});
