let socket;

let routes = {};
let connected = false;
let logged = false;

const ReconnectionTimes = [5, 10, 20, 30, 60];
let ReconnectionIndex = 0;
let reconnecting = false;
let locationSocket = window.location.host;

function initSocket() {
    connected = false;
    logged = false;
    socket = io.connect(locationSocket + "/user", { reconnection: false, transports: ['websocket'] }); //use the next port to communicate

    //let locationSocket = document.location.hostname + ":" + (parseInt(document.location.port));
    socket.on('connect', function () {
        socket.on("hs", function (data) {
            connected = true;
            ReconnectionIndex = 0;
            if (reconnecting) {
                connectSocket();
            }
        })
        socket.on("auth-ok", function (data) {
            if (!logged) {
                //console.log(data)
                if (connected) {
                    executeRoute({ route: "login", data: data });
                }
                if (reconnecting) {
                    system_mess({ status: "OK", mess: "Conectado", time: 1000 });
                }
            }
            logged = true;
            reconnecting = true;
        });
        socket.on("auth-err", function (data) {
            if (data.errmess != undefined) {
                loginMess(data.errmess)
            }
        });
        socket.on("data", function (data) {
            let udata = uncrypt(indb.login.UUID.substring(0, 16), data);
            executeRoute(JSON.parse(udata));
            ck_new();
        });
        socket.on("logout", function () {
            if (window.location.pathname != "/login/") {
                window.location.replace(rootLocation + "login/");
            }
        })
        socket.on('disconnect', function () {
            connected = false;
            logged = false;
            system_mess({ status: "ERROR", mess: "Desconectado", time: 1000 });
            system_mess({
                status: "INFO", mess: "Tentando Reconectar em", countdown: ((ReconnectionIndex < ReconnectionTimes.length) ? ReconnectionTimes[ReconnectionIndex] : ReconnectionTimes[ReconnectionTimes.length - 1])
            }, reconnect);
        })

    });
    socket.on('connect_failed', function () {
        ReconnectionIndex++;
        system_mess({ status: "ERROR", mess: "Falha ao Conectar", time: 1000 });
        system_mess({
            status: "INFO", mess: "Tentando Reconectar em", countdown: ((ReconnectionIndex < ReconnectionTimes.length) ? ReconnectionTimes[ReconnectionIndex] : ReconnectionTimes[ReconnectionTimes.length - 1])
        }, reconnect);
    })
    socket.on("connect_error", function () {
        ReconnectionIndex++;
        system_mess({ status: "ERROR", mess: "Falha ao Reconectar", time: 1000 });
        system_mess({
            status: "INFO", mess: "Tentando Reconectar em", countdown: ((ReconnectionIndex < ReconnectionTimes.length) ? ReconnectionTimes[ReconnectionIndex] : ReconnectionTimes[ReconnectionTimes.length - 1])
        }, reconnect);
    })
    socket.on("reconnect_failed", function () {
        ReconnectionIndex++;
        system_mess({ status: "ERROR", mess: "Falha ao Reconectar", time: 1000 });
        system_mess({
            status: "INFO", mess: "Tentando Reconectar em", countdown: ((ReconnectionIndex < ReconnectionTimes.length) ? ReconnectionTimes[ReconnectionIndex] : ReconnectionTimes[ReconnectionTimes.length - 1])
        }, reconnect);
    })
    socket.on("reconnect_error", function () {
        ReconnectionIndex++;
        system_mess({ status: "ERROR", mess: "Falha ao Reconectar", time: 1000 });
        system_mess({
            status: "INFO", mess: "Tentando Reconectar em", countdown: ((ReconnectionIndex < ReconnectionTimes.length) ? ReconnectionTimes[ReconnectionIndex] : ReconnectionTimes[ReconnectionTimes.length - 1])
        }, reconnect);
    })
}

function reconnect() {
    if (reconnecting) {
        system_mess({ status: "OK", mess: "Reconectando", time: 1000 });
    }
    socket.off();
    initSocket();
}

function connectSocket() {
    if (!logged) {
        socket.emit('auth', indb.login);
    }
}

function send(route, data) {
    socket.emit("data", crypt(indb.login.UUID.substring(32, 48), JSON.stringify({ route: route, data: data })));
}

function appendRoute(route, callback) {
    routes[route] = callback;
}

function executeRoute(u) {
    //console.log(u)
    if (u != undefined) {
        if (u.route != undefined) {
            if (routes[u.route] != undefined) {
                routes[u.route](u.data);
            }
        }
    }
}


appendRoute("login", (retrive) => {
    if (retrive != undefined) {
        let jr = JSON.parse(retrive);
        if (jr.username != undefined) {
            indb.login.username = jr.username;
        }
        if (jr.id_user != undefined) {
            indb.login.id = jr.id_user;
        }
        if (jr.UUID != undefined) {
            indb.login.UUID = jr.UUID;
        }
        if (jr.lastLogin != undefined) {
            indb.login.lastLogin = jr.lastLogin;
        }
        if (jr.addedIn != undefined) {
            indb.login.addedIn = jr.addedIn;
        }
        logged = true;
        ck_new();

        if (window.location.pathname == "/login/") {
            window.location.replace(rootLocation + "");
        } else {
            loadScript("comum/screen/side_menu.js");
            loadScript("comum/screen/top_menu.js");
        }
        //login_out();
    }
})

function wait_Connect(callback) {
    if (!connected) {
        setTimeout(() => { wait_Connect(callback) }, 500);
    } else { callback(); }
}

function system_redirect(data) {
    console.log(data)
    //window.location = data.location;
}

appendRoute("system/redirect", system_redirect);
appendRoute("system/ok", system_mess);
appendRoute("system/error", system_mess);
appendRoute("system/info", system_mess);
appendRoute("system/added", () => { menuCancel(); system_mess({ status: "OK", mess: "Adicionado com Exito", time: 1000 }); });
appendRoute("system/removed", () => { menuCancel(); system_mess({ status: "OK", mess: "Removido com Exito", time: 1000 }); });
appendRoute("system/edited", () => { menuCancel(); system_mess({ status: "OK", mess: "Editado com Exito", time: 1000 }); });
appendRoute("system/disabled", () => { menuCancel(); system_mess({ status: "OK", mess: "Desabilitado com Exito", time: 1000 }); });
appendRoute("system/enable", () => { menuCancel(); system_mess({ status: "OK", mess: "Habilitado com Exito", time: 1000 }); });


wait_Load(() => {
    initSocket();
})