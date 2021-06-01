let socket;

class UserStruct {
    name;
    username;
    uuid;
    preferences;
    createdIn;
    lastConnection;
    lastTry;
    lastIp;
    permissions;

    /**
     * converte um JSON para o objeto USER
     * @param {JSON} user JSON contendo os items do usuário 
     */
    constructor(user) {
        if (user) {
            if (user.name) {
                this.name = user.name
            }
            if (user.id) {
                this.id = user.id
            }
            if (user.username) {
                this.username = user.username
            }
            if (user.uuid) {
                this.uuid = user.uuid
            }
            if (user.preferences) {
                this.preferences = user.preferences
            }
            if (user.createdIn) {
                this.createdIn = user.createdIn
            }
            if (user.lastConnection) {
                this.lastConnection = user.lastConnection
            }
            if (user.lastTry) {
                this.lastTry = user.lastTry
            }
            if (user.lastIp) {
                this.lastIp = user.lastIp
            }
            if (user.permissions) {
                this.permissions = user.permissions
            }
        }
    }

    checkPermission(permissionCode) {
        if (this.permissions) {
            if (this.permissions.filter(perm => (perm.code_Permission === permissionCode & perm.active === 1))[0] != undefined ||
                this.permissions.filter(perm => (perm.code_Permission === "adm/system" & perm.active === 1))[0] != undefined) {
                return true;
            }
        }
        return false;
    }
}

let Myself = new UserStruct();

class Socket {
    socket;
    socketCfg = {
        routes: {},
        connected: false,
        ReconnectionTimes: [5, 10, 20, 30, 60],
        ReconnectionIndex: 0,
    }
    socketStatus = {
        logged: false,
        connected: false,
        reconnecting: false,
    }


    constructor() {
        this._init();
    }
    _init() {
        this.socketCfg.connected = false;
        this.socket = io.connect(window.location.origin + "/websocket/v1", {
            reconnection: false,
            transports: ['websocket'],
            cookie: "wscore",
            forceNew: false
        });
        this.socketInit(this);
    }

    socketInit(SocketClass) {
        //let locationSocket = document.location.hostname + ":" + (parseInt(document.location.port));
        SocketClass.socket.on('connect', function () {
            SocketClass.socket.on("auth-ok", function (data) {

                ClientEvents.clear("SendSocket");
                ClientEvents.setCoreEvent("SendSocket");
                ClientEvents.on("SendSocket", (ename, data) => {
                    SocketClass._send(ename, data);
                })

                SocketClass.socket.on("ClientEvents", (data) => {
                    if (data) {
                        if (data.event != undefined) {
                            ClientEvents.emit(data.event, data.data);
                        }
                    }
                })

                Myself = new UserStruct(data);
                ClientEvents.emit("Logged", Myself);
                if (SocketClass.socketStatus.reconnecting) {
                    SocketClass.socketCfg.ReconnectionIndex = 0;
                    ClientEvents.emit("system_mess", {
                        status: "OK",
                        mess: "Conectado",
                        time: 1000
                    })
                }

                SocketClass.socketStatus.logged = true;
                SocketClass.socketStatus.reconnecting = true;
            });
            SocketClass.socket.on("auth-err", function (data) {
                if (data != undefined) {
                    ClientEvents.emit("system_mess", {
                        status: "ERROR",
                        mess: "Falha de autenticação do UUID. Redirecionando para o login.",
                        countdown: 5,
                        callback: () => {
                            window.location.assign("./login");
                        }
                    })
                }
            });
            ClientEvents.clear("Logout");
            ClientEvents.setCoreEvent("Logout");
            ClientEvents.on("Logout", () => {
                SocketClass._clearCookies();
                window.location.assign("./login");
            })
            SocketClass.socket.on("logout", function () {
                SocketClass._clearCookies();
                window.location.assign("./login");
            })
            SocketClass.socket.on('disconnect', function () {
                SocketClass.socket.disconnect();
                SocketClass.socketStatus.connected = false;
                SocketClass.socketStatus.logged = false;
                ClientEvents.emit("system_mess", {
                    status: "ERROR",
                    mess: "Desconectado",
                    time: 1000
                })
                ClientEvents.emit("system_mess", {
                    status: "INFO",
                    mess: "Tentando Reconectar em",
                    countdown: ((SocketClass.socketCfg.ReconnectionIndex < SocketClass.socketCfg.ReconnectionTimes.length) ? SocketClass.socketCfg.ReconnectionTimes[SocketClass.socketCfg.ReconnectionIndex] : SocketClass.socketCfg.ReconnectionTimes[SocketClass.socketCfg.ReconnectionTimes.length - 1]),
                    callback: () => {
                        SocketClass._reconnect();
                        //SocketClass.socket.connect();
                    }
                })
            })
            SocketClass.socket.emit("auth");
        });
        SocketClass.socket.on('connect_failed', function () {
            SocketClass.socketCfg.ReconnectionIndex++;
            ClientEvents.emit("system_mess", {
                status: "ERROR",
                mess: "Falha ao Conectar",
                time: 1000
            })
            ClientEvents.emit("system_mess", {
                status: "INFO",
                mess: "Tentando Reconectar em",
                countdown: ((SocketClass.socketCfg.ReconnectionIndex < SocketClass.socketCfg.ReconnectionTimes.length) ? SocketClass.socketCfg.ReconnectionTimes[SocketClass.socketCfg.ReconnectionIndex] : SocketClass.socketCfg.ReconnectionTimes[SocketClass.socketCfg.ReconnectionTimes.length - 1]),
                callback: () => {
                    SocketClass._reconnect()
                }
            })

        })
        SocketClass.socket.on("connect_error", function () {
            SocketClass.socketCfg.ReconnectionIndex++;
            ClientEvents.emit("system_mess", {
                status: "ERROR",
                mess: "Falha ao Reconectar",
                time: 1000
            })
            ClientEvents.emit("system_mess", {
                status: "INFO",
                mess: "Tentando Reconectar em",
                countdown: ((SocketClass.socketCfg.ReconnectionIndex < SocketClass.socketCfg.ReconnectionTimes.length) ? SocketClass.socketCfg.ReconnectionTimes[SocketClass.socketCfg.ReconnectionIndex] : SocketClass.socketCfg.ReconnectionTimes[SocketClass.socketCfg.ReconnectionTimes.length - 1]),
                callback: () => {
                    SocketClass._reconnect()
                }
            })
        })
        SocketClass.socket.on("reconnect_failed", function () {
            SocketClass.socketCfg.ReconnectionIndex++;
            ClientEvents.emit("system_mess", {
                status: "ERROR",
                mess: "Falha ao Reconectar",
                time: 1000
            })
            ClientEvents.emit("system_mess", {
                status: "INFO",
                mess: "Tentando Reconectar em",
                countdown: ((SocketClass.socketCfg.ReconnectionIndex < SocketClass.socketCfg.ReconnectionTimes.length) ? SocketClass.socketCfg.ReconnectionTimes[SocketClass.socketCfg.ReconnectionIndex] : SocketClass.socketCfg.ReconnectionTimes[SocketClass.socketCfg.ReconnectionTimes.length - 1]),
                callback: () => {
                    SocketClass._reconnect()
                }
            })
        })
        SocketClass.socket.on("reconnect_error", function () {
            SocketClass.socketCfg.ReconnectionIndex++;
            ClientEvents.emit("system_mess", {
                status: "ERROR",
                mess: "Falha ao Reconectar",
                time: 1000
            })
            ClientEvents.emit("system_mess", {
                status: "INFO",
                mess: "Tentando Reconectar em",
                countdown: ((SocketClass.socketCfg.ReconnectionIndex < SocketClass.socketCfg.ReconnectionTimes.length) ? SocketClass.socketCfg.ReconnectionTimes[SocketClass.socketCfg.ReconnectionIndex] : SocketClass.socketCfg.ReconnectionTimes[SocketClass.socketCfg.ReconnectionTimes.length - 1]),
                callback: () => {
                    SocketClass._reconnect()
                }
            })
        })
    }

    _reconnect() {
        this.socketStatus.reconnecting = true;
        ClientEvents.emit("system_mess", {
            status: "OK",
            mess: "Reconectando",
            time: 1000
        })
        //this.socket.connect();
        ClientEvents.clearAllDupes();
        this._init();
    }

    _connectSocket() {
        if (!this.socketStatus.logged) {
            this.socket.emit('auth', indb.login);
        }
    }

    _send(ename, ...data) {
        //console.log("Send: " + ename);
        this.socket.emit(ename, data);
        //this.socket.emit("data", crypt(indb.login.UUID.substring(32, 48), JSON.stringify({ route: route, data: data })));
    }

    _appendRoute(route, callback) {
        routes[route] = callback;
    }
    _clearCookies() {

        document.cookie = "wscore=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        //*/
    }
}

ClientEvents.clear("Page_Loaded");
ClientEvents.setCoreEvent("Page_Loaded");
ClientEvents.on("Page_Loaded", () => {
    console.log("new Socket appended ")
    socket = new Socket();
})

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