

/**Preferencias de Usuário */
ClientEvents.setCoreEvent("usr/get/preferences"); //quando recebe dados do servidor
ClientEvents.on("usr/get/preferences", (preferences) => {
    Myself.preferences = preferences;
    console.log(Myself);

});

ClientEvents.setCoreEvent("usr/load/preferences"); //quando e feito request para o servidor
ClientEvents.on("usr/load/preferences", () => {
    ClientEvents.emit("SendSocket", "usr/get/preferences", {});
});

ClientEvents.setCoreEvent("usr/save/preferences"); //quando salva no servidor
ClientEvents.on("usr/save/preferences", () => {
    ClientEvents.emit("SendSocket", "usr/edt/preferences", Myself.preferences || {});
});

/**Barra de Favoritos */

ClientEvents.setCoreEvent("fav/add"); //adiciona aba de navegação
ClientEvents.on("fav/add", (preferences) => {

});


ClientEvents.setCoreEvent("fav/set"); //Seta aba como favorito
ClientEvents.on("fav/set", (preferences) => {

});