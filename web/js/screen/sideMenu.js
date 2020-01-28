ClientEvents.on("LeftMenuOpen", () => {

    let lm = document.getElementById("leftMenuHolder")
    if (lm) {
        if (!lm.classList.contains("LeftMenuOpen")) {
            lm.classList.toggle("LeftMenuOpen")
        }
    }
})
ClientEvents.on("LeftMenuClose", () => {
    let lm = document.getElementById("leftMenuHolder")
    if (lm) {
        if (lm.classList.contains("LeftMenuOpen")) {
            lm.classList.toggle("LeftMenuOpen")
        }
    }
})


ClientInitializers.push(new Promise((resolve, reject) => {
    document.getElementById("openLeftMenu").onclick = () => {
        ClientEvents.emit("LeftMenuOpen");
    }
    document.getElementById("closeLeftMenu").onclick = () => {
        ClientEvents.emit("LeftMenuClose");
    }
    resolve();
}));

ClientEvents.on("LeftMenu-SetItems", (items) => {
    if (items) {
        if (items.length) {
            items.forEach(item => {
                if (item.name &&
                    item.icon &&
                    item.eventname) {

                }
            });
        }
    }
})