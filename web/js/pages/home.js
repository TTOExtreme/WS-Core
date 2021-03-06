

document.addEventListener("DOMContentLoaded", function (event) {
    function EndLoad(i = 0) {
        if (ClientEvents != undefined) {
            loadExternalFiles([

                "./js/screen/loading.js",
                "./js/utils/formaters.js",
                "./js/screen/systemMessage.js",
                "./js/utils/socket.js",
                "./js/libs/bcypher.js",
                "./js/libs/jkanban.min.js",
                "./js/screen/favoritos.js",
                "./js/screen/menuDragger.js",
                "./js/screen/credits.js",
                "./js/screen/sideMenu.js",
                "./js/screen/contextCreator.js",
                "./js/core/user/changepass.js",
                "./js/libs/tabulator.min.js",
            ]).then(() => {
                ClientEvents.setCoreEvent("LoadExternal");
                ClientEvents.on("LoadExternal", (list, callback, refreshOnError = true, index = 5) => {
                    loadExternalFiles(list).then(() => {
                        if (callback != undefined) {
                            callback();
                        } else {
                            //console.log("Callback Null");
                            //console.log(list)
                            //console.log(index);
                        }
                    }).catch((err) => {
                        console.log("An error ocurred when loading external css\nAre you disconnected from internet?")
                        console.log(err);
                        if (index <= 0) {
                            if (refreshOnError) {
                                window.location.reload();
                            }
                        } else {
                            setTimeout(() => {
                                ClientEvents.emit("LoadExternal", list, callback, index - 1);
                            })
                        }
                    })

                })
                ClientEvents.emit("Page_Loaded");
                document.body.style.opacity = 1;
                ClientEvents.emit("LoadExternal", [
                    "./js/libs/suneditor.min.js"
                ], () => {
                    ClientEvents.emit("system_mess", {
                        status: "INFO",
                        mess: "Todos os Modulos Carregados",
                        time: 1000
                    })
                });
            }).catch(err => {
                console.log("An error ocurred when loading external files\nAre you disconnected from internet?")
                console.log(err);
                setTimeout(() => { window.location.reload(); }, 1000);
            })
        } else {
            if (i < 50) {
                setTimeout(() => {
                    EndLoad(i + 1);
                }, 100);
            } else {
                window.location.reload();//força o reload da pagina caso aconteça algum erro
            }
        }
    }

    document.body.style.opacity = 0;
    loadExternalFiles([
        "./js/utils/eventHandler.js",
        "./js/libs/socket.io.js",
        "./js/libs/crypto-js.js",
    ]).then(() => {
        EndLoad(0);
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
    "./css/screen/jkanban.min.css",
    "./css/screen/LeftMenu.css",
    "./css/screen/loading.css",
    "./css/screen/contextCreator.css",
    "./css/fontAwesome.min.css",
    "./css/themes/theme-dark.css",
    "./css/screen/suneditor.min.css",
]).then(() => {
}).catch((err) => {
    console.log("An error ocurred when loading external css\nAre you disconnected from internet?")
    console.log(err);
    setTimeout(() => { window.location.reload(); }, 1000);
})
