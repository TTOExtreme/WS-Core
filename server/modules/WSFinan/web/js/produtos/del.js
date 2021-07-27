
ClientEvents.on("wsfinan/produtos/del", (data) => {

    if (confirm("Voce esta prestes a " + ((data.active == 1) ? "Excluir" : "") + " o Fornecedor: " + data.nome + "\nVoce tem certeza disso?")) {
        ClientEvents.emit("SendSocket", "WSFinan/produtos/del", {
            id: data.id,
            active: ((data.active == 1) ? 0 : 1)
        });
    }
});
