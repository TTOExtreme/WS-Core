
window.onload = () => {
    loadJS('/js/SH_Full.js', () => {
        SocketHandler_Initialization().then(() => {
            loadJS('/js/libs/BCypher_2.0.js', () => {
                loadJS('/js/navBar.js', () => {

                    SocketListener("Navbar.Top.Add", add_TopNavbar_Button);
                    SocketListener("Navbar.Left.Add", add_LeftNavbar_Button);
                    SocketListener("Navbar.subLeft.Add", add_subLeftNavbar_Button);
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
            }, document.head);
        });
    }, document.head);
}

