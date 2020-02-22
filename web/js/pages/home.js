

document.addEventListener("DOMContentLoaded", function (event) {
    document.body.style.opacity = 0;
    loadExternalFiles([
        "./js/utils/eventHandler.js",
        "./js/libs/socket.io.js",
        "./js/libs/crypto-js.js",
        "./js/screen/loading.js",
        "./js/screen/systemMessage.js",
        "./js/utils/socket.js",
        "./js/libs/bcypher.js",
        "./js/screen/credits.js",
        "./js/screen/sideMenu.js",
        "./js/screen/topMenu.js"
    ]).then(() => {
        ClientEvents.emit("Page_Loaded");
        document.body.style.opacity = 1;
    }).catch((err) => {
        console.log("An error ocurred when loading external files\nAre you disconnected from internet?")
        console.log(err);
    })
})

loadExternalFiles([
    "./css/index.css",
    "./css/home.css",
    "./css/screen/TopMenu.css",
    "./css/screen/LeftMenu.css",
    "./css/screen/loading.css",
    "./css/themes/theme-dark.css"
]).then(() => {
}).catch((err) => {
    console.log("An error ocurred when loading external css\nAre you disconnected from internet?")
    console.log(err);
})
