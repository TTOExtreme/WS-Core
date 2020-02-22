ClientEvents.clearAll();

ClientEvents.emit("LeftMenuClose");
ClientEvents.emit("LMI-CloseAll");
ClientEvents.on("adm/user/lst", (data) => {
    let mainScreen = document.getElementById("MainScreen");
})