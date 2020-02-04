let socket;
let socketCfg = {
    routes: {},
    connected: false,
    ReconnectionTimes: [5, 10, 20, 30, 60],
    ReconnectionIndex: 0,
}
let socketStatus = {
    logged: false,
    connected: false,
    reconnecting: false,
}

let myself;


class UserStruct {
    name;
    username;
    uuid;
    preferences;
    createdIn;
    lastConnection;
    lastTry;
    lastIp;

    /**
     * converte um JSON para o objeto USER
     * @param {JSON} user JSON contendo os items do usuário 
     */
    constructor(user) {
        if (user.name) { this.name = user.name }
        if (user.username) { this.username = user.username }
        if (user.uuid) { this.uuid = user.uuid }
        if (user.preferences) { this.preferences = user.preferences }
        if (user.createdIn) { this.createdIn = user.createdIn }
        if (user.lastConnection) { this.lastConnection = user.lastConnection }
        if (user.lastTry) { this.lastTry = user.lastTry }
        if (user.lastIp) { this.lastIp = user.lastIp }
    }

}

ClientEvents.on("Page_Loaded", () => {
    console.log("Start Socket")
    socketCfg.connected = false;
    socket = io.connect(window.location.origin + "/websocket/v1", {
        reconnection: false,
        transports: ['websocket'],
        cookie: "wscore"
    });

    //let locationSocket = document.location.hostname + ":" + (parseInt(document.location.port));
    socket.on('connect', function () {
        socket.on("auth-ok", function (data) {
            myself = new UserStruct(data);
            ClientEvents.emit("Logged", myself);
            if (socketStatus.reconnecting) {
                ClientEvents.emit("system_mess", { status: "OK", mess: "Conectado", time: 1000 })
            }
            socketStatus.logged = true;
            socketStatus.reconnecting = true;
        });
        socket.on("auth-err", function (data) {
            if (data.errmess != undefined) {
                loginMess(data.errmess)
            }
        });
        socket.on("data", function (data) {
            let udata = uncrypt(indb.login.UUID.substring(0, 16), data);
            //executeRoute(JSON.parse(udata));
            ck_new();
        });
        socket.on("logout", function () {
            window.location.assign("./login");
        })
        socket.on('disconnect', function () {
            socketStatus.connected = false;
            socketStatus.logged = false;
            ClientEvents.emit("system_mess", { status: "ERROR", mess: "Desconectado", time: 1000 })
            ClientEvents.emit("system_mess", {
                status: "INFO", mess: "Tentando Reconectar em", countdown: ((ReconnectionIndex < ReconnectionTimes.length) ? ReconnectionTimes[ReconnectionIndex] : ReconnectionTimes[ReconnectionTimes.length - 1])
            }, reconnect)
        })
        socket.emit("auth");
    });
    socket.on('connect_failed', function () {
        ReconnectionIndex++;
        ClientEvents.emit("system_mess", { status: "ERROR", mess: "Falha ao Conectar", time: 1000 })
        ClientEvents.emit("system_mess", {
            status: "INFO", mess: "Tentando Reconectar em", countdown: ((ReconnectionIndex < ReconnectionTimes.length) ? ReconnectionTimes[ReconnectionIndex] : ReconnectionTimes[ReconnectionTimes.length - 1])
        }, reconnect)
    })
    socket.on("connect_error", function () {
        ReconnectionIndex++;
        ClientEvents.emit("system_mess", { status: "ERROR", mess: "Falha ao Reconectar", time: 1000 })
        ClientEvents.emit("system_mess", {
            status: "INFO", mess: "Tentando Reconectar em", countdown: ((ReconnectionIndex < ReconnectionTimes.length) ? ReconnectionTimes[ReconnectionIndex] : ReconnectionTimes[ReconnectionTimes.length - 1])
        }, reconnect)
    })
    socket.on("reconnect_failed", function () {
        ReconnectionIndex++;
        ClientEvents.emit("system_mess", { status: "ERROR", mess: "Falha ao Reconectar", time: 1000 })
        ClientEvents.emit("system_mess", {
            status: "INFO", mess: "Tentando Reconectar em", countdown: ((ReconnectionIndex < ReconnectionTimes.length) ? ReconnectionTimes[ReconnectionIndex] : ReconnectionTimes[ReconnectionTimes.length - 1])
        }, reconnect)
    })
    socket.on("reconnect_error", function () {
        ReconnectionIndex++;
        ClientEvents.emit("system_mess", { status: "ERROR", mess: "Falha ao Reconectar", time: 1000 })
        ClientEvents.emit("system_mess", {
            status: "INFO", mess: "Tentando Reconectar em", countdown: ((ReconnectionIndex < ReconnectionTimes.length) ? ReconnectionTimes[ReconnectionIndex] : ReconnectionTimes[ReconnectionTimes.length - 1])
        }, reconnect)
    })
})

function reconnect() {
    if (socketStatus.reconnecting) {
        ClientEvents.emit("system_mess", { status: "OK", mess: "Reconectando", time: 1000 })
    }
    socket.off();
    initSocket();
}

function connectSocket() {
    if (!socketStatus.logged) {
        socket.emit('auth', indb.login);
    }
}

function send(route, data) {
    socket.emit("data", crypt(indb.login.UUID.substring(32, 48), JSON.stringify({ route: route, data: data })));
}

function appendRoute(route, callback) {
    routes[route] = callback;
}

/*
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
//*/

/*
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
        socketStatus.logged = true;
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
//*/

function wait_Connect(callback) {
    if (!socketStatus.connected) {
        setTimeout(() => { wait_Connect(callback) }, 500);
    } else { callback(); }
}

function system_redirect(data) {
    console.log(data)
    //window.location = data.location;
}
/*
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
//*/