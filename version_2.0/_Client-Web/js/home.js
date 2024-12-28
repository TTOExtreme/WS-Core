
window.onload = () => {
    loadJS('/js/core/SH_Full.js', () => {
        SocketHandler_Initialization().then(() => {
            loadJS('/js/libs/BCypher_2.0.js', () => {
                loadJS('/js/core/Instancia_Telas.js', () => {
                    loadJS('/js/core/navBar.js', () => {

                        SocketListener("Navbar.Top.Add", add_TopNavbar_Button);
                        SocketListener("Navbar.Left.Add", add_LeftNavbar_Button);
                        SocketListener("Navbar.subLeft.Add", add_subLeftNavbar_Button);
                        SocketListener("Navbar.fav.load", load_favorito);
                        SocketListener("Loader.JS", loadJS);
                        SocketEmit("Users.Preferences.Load");

                        /*
                            add_LeftNavbar_Button('star', 'material-symbols-outlined', "Favoritos", (ev) => { });
                            add_LeftNavbar_Button('settings', 'material-icons', "Configurações", (ev) => { });
                            add_LeftNavbar_Button('token', 'material-icons', "Modulos");
                            add_LeftNavbar_Button('terminal', 'material-icons', "Terminal");
                            add_TopNavbar_Button('terminal', 'Terminal', (ev) => { })
                            add_TopNavbar_Button('home', 'Home', (ev) => { })
                        //*/

                    }, document.head);

                    loadCSS('/css/core/ContextCreator.css', () => {
                        loadJS('/js/core/ContextCreator.js', () => {
                            _ContexCreator = new ContextCreator();
                            //_ContexCreator.CreateDummy();
                        }, document.head);
                    }, document.head);

                    _events.on("Info.Info", (data) => { console.log("INFO", data); })
                    _events.on("Info.Ok", (data) => { console.log("OK", data); })
                    _events.on("Info.Warn", (data) => { console.log("WARN", data); })
                    _events.on("Info.Erro", (data) => { console.log("ERRO", data); })


                }, document.head);
            }, document.head);
        });
    }, document.head);
}
