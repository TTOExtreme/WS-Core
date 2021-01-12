

document.addEventListener("DOMContentLoaded", function (event) {
    document.body.style.opacity = 0;
    loadExternalFiles([
        "./js/utils/eventHandler.js",
        "./js/libs/socket.io.js",
        "./js/libs/crypto-js.js",
        "./js/screen/loading.js",
        "./js/utils/formaters.js",
        "./js/screen/systemMessage.js",
        "./js/utils/socket.js",
        "./js/libs/bcypher.js",
        "./js/libs/tabulator.min.js",
        "./js/screen/menuDragger.js",
        "./js/screen/credits.js",
        "./js/screen/sideMenu.js",
        "./js/screen/topMenu.js",
        "./js/screen/contextCreator.js",
        "./js/core/user/changepass.js"
    ]).then(() => {
        ClientEvents.setCoreEvent("LoadExternal");
        ClientEvents.on("LoadExternal", (list, callback, refreshOnError = true, index = 5) => {
            loadExternalFiles(list).then(() => {
                callback();
            }).catch((err) => {
                console.log("An error ocurred when loading external css\nAre you disconnected from internet?")
                console.log(err);
                if (index <= 0) {
                    if (refreshOnError) {
                        window.location.reload();
                    }
                } else {
                    setTimeout(() => {
                        ClientEvents.emit("LoadExternal", callback, index - 1);
                    })
                }
            })

        })
        ClientEvents.emit("Page_Loaded");
        document.body.style.opacity = 1;
    }).catch((err) => {
        console.log("An error ocurred when loading external files\nAre you disconnected from internet?")
        console.log(err);
        setTimeout(() => { window.location.reload(); }, 1000);
    })
})

loadExternalFiles([
    "./css/index.css",
    "./css/home.css",
    "./css/screen/TopMenu.css",
    "./css/screen/tabulator.css",
    "./css/screen/LeftMenu.css",
    "./css/screen/loading.css",
    "./css/screen/contextCreator.css",
    "./css/themes/theme-dark.css"
]).then(() => {
}).catch((err) => {
    console.log("An error ocurred when loading external css\nAre you disconnected from internet?")
    console.log(err);
    setTimeout(() => { window.location.reload(); }, 1000);
})
