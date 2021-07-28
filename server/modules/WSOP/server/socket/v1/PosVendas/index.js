const PosvendasManipulator = require('./dbManipulator').PosvendasManipulator;

class Socket {

    _log;
    _config;
    _WSMainServer;
    _myself;
    _events;

    /**
     * Constructor for group Class
     * @param {WSMainServer} WSMain
     */
    constructor(WSMainServer) {
        this._log = WSMainServer.log;
        this._config = WSMainServer.config;
        this._WSMainServer = WSMainServer;
        this._events = WSMainServer.events;
        this._PosvendasClass = new PosvendasManipulator(WSMainServer);
        this._log.task("api-mod-wsop-cliente", "Api wsop-posvendas Loaded", 1);
    }

    /**
     * Create Listeners for Socket
     * @param {SocketIO} io 
     * @param {class_group} Myself
     */
    socket(socket, Myself) {
        this._myself = Myself;

        /**
         *  get all calendar data
         */
        socket.on("WSOP/posvendas/lst", (req) => {
            this._myself.checkPermission("WSOP/menu/posvendas").then(() => {
                this._PosvendasClass.ListAll().then((res) => {
                    if (req[0] != null) {
                        if (typeof (req[0]) === typeof ("asd")) {
                            req[0] = JSON.parse(req[0]);
                        }
                        req[0].data = res;
                    } else {
                        req[0] = { data: [] };
                    }
                    socket.emit("ClientEvents", {
                        event: "wsop/posvendas/lst",
                        data: req[0]
                    })
                }).catch((err) => {
                    this._log.error("On loading Calendario WSOP")
                    this._log.error(err);
                    if (!this._myself.isLogged()) {
                        socket.emit("logout", "");
                    }
                    socket.emit("ClientEvents", {
                        event: "system_mess",
                        data: {
                            status: "ERROR",
                            mess: err,
                            time: 1000
                        }
                    })
                })
            })
        })


        //WSOP/posvendas/lstid
        /**
         *  get calendar data
         */
        socket.on("WSOP/posvendas/lstid", (req) => {
            this._myself.checkPermission("WSOP/menu/posvendas").then(() => {
                try { req[0] = JSON.parse(req[0]) } catch (err) { }
                if (req[0].id == 0 || req[0].id == "0") {
                    socket.emit("ClientEvents", {
                        event: "WSOP/posvendas/edt",
                        data: [{
                            id: 0,
                            title: "",
                            description: JSON.stringify({
                                start: req[0].start,
                                end: req[0].start,
                                description: "",
                                vendedor: "",
                                pendente: 0,
                                tel: "",
                                color: "#30303030",
                                bgcolor: "#30303030"
                            }),
                            img: "",
                            active: 1
                        }]
                    })
                } else {
                    this._PosvendasClass.ListSingle(req[0].id).then((res) => {
                        if (req[0].reloadMulti) {
                            res[0].reloadMulti = true;
                        }
                        socket.emit("ClientEvents", {
                            event: "WSOP/posvendas/edt",
                            data: res
                        })
                    }).catch((err) => {
                        this._log.error("On loading Calendario WSOP")
                        this._log.error(err);
                        if (!this._myself.isLogged()) {
                            socket.emit("logout", "");
                        }
                        socket.emit("ClientEvents", {
                            event: "system_mess",
                            data: {
                                status: "ERROR",
                                mess: err,
                                time: 1000
                            }
                        })
                    })
                }
            })
        })

        //WSOP/posvendas/lstids
        /**
         *  get calendar data
         */
        socket.on("WSOP/posvendas/lstids", (req) => {
            this._myself.checkPermission("WSOP/menu/posvendas").then(() => {
                try { req[0] = JSON.parse(req[0]) } catch (err) { }
                this._PosvendasClass.ListDate(req[0].start).then((res) => {
                    socket.emit("ClientEvents", {
                        event: "WSOP/posvendas/edtmulti",
                        data: {
                            start: req[0].start,
                            data: res
                        }
                    })
                }).catch((err) => {
                    this._log.error("On loading Calendario WSOP")
                    this._log.error(err);
                    if (!this._myself.isLogged()) {
                        socket.emit("logout", "");
                    }
                    socket.emit("ClientEvents", {
                        event: "system_mess",
                        data: {
                            status: "ERROR",
                            mess: err,
                            time: 1000
                        }
                    })
                })
            })
        })

        /**
         * edit Calendario Cards
         */
        socket.on("WSOP/posvendas/edt", (req) => {
            this._myself.checkPermission("WSOP/posvendas/edt").then(() => {
                this._PosvendasClass.edtCalendario(req[0].id, req[0].title, req[0].description, req[0].active, this._myself.myself.id).then((results) => {
                    socket.emit("ClientEvents", {
                        event: "system/posvendas/edited",
                        data: { id: results.insertId }
                    })
                }).catch((err) => {
                    if (!this._myself.isLogged()) {
                        socket.emit("logout", "");
                    }
                    this._log.error("On Editing Calendario on WSOP")
                    this._log.error(err);
                    socket.emit("ClientEvents", {
                        event: "system_mess",
                        data: {
                            status: "ERROR",
                            mess: err,
                            time: 1000
                        }
                    })
                })
            })
        })

        /**
         * Add Calendario Cards
         */
        socket.on("WSOP/posvendas/add", (req) => {
            this._myself.checkPermission("WSOP/posvendas/add").then(() => {
                this._PosvendasClass.addCalendario(req[0].title, req[0].description, req[0].img, req[0].active, this._myself.myself.id).then((results) => {
                    socket.emit("ClientEvents", {
                        event: "system/posvendas/added",
                        data: { id: results.insertId }
                    })
                }).catch((err) => {
                    if (!this._myself.isLogged()) {
                        socket.emit("logout", "");
                    }
                    this._log.error("On Editing Calendario on WSOP")
                    this._log.error(err);
                    socket.emit("ClientEvents", {
                        event: "system_mess",
                        data: {
                            status: "ERROR",
                            mess: err,
                            time: 1000
                        }
                    })
                })
            })
        })

    }


}

module.exports = {
    Socket
};