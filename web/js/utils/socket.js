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

    /**
     * converte um JSON para o objeto USER
     * @param {JSON} user JSON contendo os items do usuário 
     */
    constructor(user) {
        if (user) {
            if (user.name) {
                this.name = user.name
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
        }
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
            cookie: "wscore"
        });
        this.socketInit(this);
    }

    socketInit(SocketClass) {
        //let locationSocket = document.location.hostname + ":" + (parseInt(document.location.port));
        SocketClass.socket.on('connect', function () {
            SocketClass.socket.on("auth-ok", function (data) {

                ClientEvents.setCoreEvent("SendSocket");
                ClientEvents.on("SendSocket", (ename, data) => {
                    SocketClass._send(ename, data);
                })

                SocketClass.socket.on("ClientEvents", (data) => {
                    if (data) {
                        if (data.event != undefined) {
                            //console.log(data.event)
                            ClientEvents.emit(data.event, data.data);
                        }
                    }
                })

                Myself = new UserStruct(data);
                ClientEvents.emit("Logged", Myself);
                if (SocketClass.socketStatus.reconnecting) {
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
                if (data.errmess != undefined) {
                    loginMess(data.errmess)
                }
            });
            SocketClass.socket.on("logout", function () {
                SocketClass._clearCookies();
                window.location.assign("./login");
            })
            SocketClass.socket.on('disconnect', function () {
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
                        SocketClass._reconnect()
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
        //this.socket.off();
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
        /*
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        //*/
    }
}

ClientEvents.on("Page_Loaded", () => {
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