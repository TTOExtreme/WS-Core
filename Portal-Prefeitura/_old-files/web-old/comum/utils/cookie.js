var ck_key = "DFsdfx4cv681xsdf8cv3df5fb1zcrRGDFHB6df";

function ck_new() {
    var d = new Date();
    d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = "Login=" + crypt(ck_key, JSON.stringify(indb.login)) + ";" + expires + ";path=/";
}

function ck_load() {
    if (window.location.pathname == "/login/") {
        ck_kill();
        wait_Connect(() => {
            login_init();
            login_in();
        });
    } else {
        startLoader();
        ck_load_defined();
        ck_load_login();
    }
}

function ck_load_login() {
    var name = "Login=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            var ck = c.substring(name.length, c.length);
            var login = uncrypt(ck_key, ck);
            indb.login = JSON.parse(login);
            if (window.location.pathname != "/") {
                window.location.replace(rootLocation + "");
            }
            wait_Connect(() => {
                connectSocket();
            });
        } else {
            if (window.location.pathname != "/login/") {
                window.location.replace(rootLocation + "login");
            } else {
                wait_Connect(() => {
                    login_init();
                    login_in();
                });
            }
        }
    }
}

function ck_load_defined() {
    var name = "UserDefined=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            var ck = c.substring(name.length, c.length);
            var ud = uncrypt(ck_key, ck);
            indb.UserDefined = JSON.parse(ud);
        } else {
            init_UserDefined();
        }
    }
}


function ck_new_defined() {
    var d = new Date();
    d.setTime(d.getTime() + (3650 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = "Login=" + crypt(ck_key, JSON.stringify(indb.UserDefined)) + ";" + expires + ";path=/";
}

function ck_kill() {
    document.cookie = "Login=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
wait_Load(() => {
    ck_load();
})