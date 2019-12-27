
document.addEventListener("DOMContentLoaded", function (event) {
    console.log("Start Loading")
    loadExternalFiles([
        "./js/libs/EventEmitter.min.js",
        "./js/utils/eventHandler.js",
        "./css/index.css",
        "./css/login.css",
        "./css/screen/loading.css",
        "./js/screen/loading.js",
        "./js/libs/crypto-js.js",
        "./js/libs/bcypher.js",
    ]).then(() => {
        console.log("Finished Loading")
        ClientEvents.emit("Page_Loaded");
    }).catch(() => {
        console.log("An error ocurred when loading external files\nAre you disconnected from internet?")
    })
})

