
ClientEvents.on("wsop/os/del", (data) => {

    if (confirm("Voce esta prestes a " + ((data.active == 1) ? "Excluir" : "") + " A OS: " + data.id + "\nVoce tem certeza disso?")) {
        ClientEvents.emit("SendSocket", "wsop/os/del", {
            id: data.id,
            active: ((data.active == 1) ? 0 : 1)
        });
    }
});
