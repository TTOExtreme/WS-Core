
document.addEventListener("DOMContentLoaded", function (event) {
    loadExternalFiles([
        "./js/libs/EventEmitter.min.js",
        "./js/utils/eventHandler.js",
        "./js/screen/loading.js",
        "./js/libs/socket.io.js",
        "./js/utils/socket.js",
        "./js/libs/crypto-js.js",
        "./js/libs/bcypher.js",
        "./js/screen/credits.js",
        "./js/screen/sideMenu.js"
    ]).then(() => {
        ClientEvents.emit("Page_Loaded");
    }).catch(() => {
        console.log("An error ocurred when loading external files\nAre you disconnected from internet?")
    })
})

loadExternalFiles([
    "./css/index.css",
    "./css/home.css",
    "./css/screen/LeftMenu.css",
    "./css/screen/loading.css",
    "./css/themes/theme-dark.css"
]).then(() => {
}).catch(() => {
    console.log("An error ocurred when loading external files\nAre you disconnected from internet?")
})
