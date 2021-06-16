const apiManipulator = require('./dbManipulator').apiManipulator;
const imageManipulator = require('../utils/ImageManipulator').ImageManipulator;
const BCypher = require('../../../../../../core/utils/bcypher').Bcypher;
const fs = require('fs');
const path = require('path').join;

class Socket {

    _log;
    _config;
    _WSMainServer;
    _myself;
    _events;

    /**
     * Constructor for Class
     * @param {WSMainServer} WSMain
     */
    constructor(WSMainServer) {
        this._log = WSMainServer.log;
        this._config = WSMainServer.config;
        this._WSMainServer = WSMainServer;
        this._events = WSMainServer.events;
        this._Calendario = new apiManipulator(WSMainServer);
        this._imageClass = new imageManipulator();
        this._db = WSMainServer.db;
    }

    /**
     * Create Listeners for Socket
     * @param {SocketIO} io 
     * @param {class_group} Myself
     */
    socket(socket, Myself) {
        this._log.task("api-mod-wsmk-api", "Api wsmk-api Loaded", 1);
        this._myself = Myself;

        /**
         *  get all calendar data
         */
        socket.on("WSMK/calendario/lst", (req) => {
            this._myself.checkPermission("WSMK/menu/calendario").then(() => {
                this._Calendario.ListAll().then((res) => {
                    if (req[0] != null) {
                        if (typeof (req[0]) === typeof ("asd")) {
                            req[0] = JSON.parse(req[0]);
                        }
                        req[0].data = res;
                    } else {
                        req[0] = { data: [] };
                    }
                    socket.emit("ClientEvents", {
                        event: "WSMK/calendario/lst",
                        data: req[0]
                    })
                }).catch((err) => {
                    this._log.error("On loading Calendario WSMK")
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


        //WSMK/calendario/lstid
        /**
         *  get calendar data
         */
        socket.on("WSMK/calendario/lstid", (req) => {
            this._myself.checkPermission("WSMK/menu/calendario").then(() => {
                try { req[0] = JSON.parse(req[0]) } catch (err) { }
                if (req[0].id == 0 || req[0].id == "0") {
                    socket.emit("ClientEvents", {
                        event: "WSMK/calendario/edt",
                        data: [{
                            id: 0,
                            title: "",
                            description: JSON.stringify({
                                start: req[0].start,
                                end: req[0].start,
                                description: "",
                                color: "#30303030",
                                bgcolor: "#30303030"
                            }),
                            img: "",
                            active: 1
                        }]
                    })
                } else {
                    this._Calendario.ListSingle(req[0].id).then((res) => {
                        if (req[0].reloadMulti) {
                            res[0].reloadMulti = true;
                        }
                        socket.emit("ClientEvents", {
                            event: "WSMK/calendario/edt",
                            data: res
                        })
                    }).catch((err) => {
                        this._log.error("On loading Calendario WSMK")
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

        //WSMK/calendario/lstids
        /**
         *  get calendar data
         */
        socket.on("WSMK/calendario/lstids", (req) => {
            this._myself.checkPermission("WSMK/menu/calendario").then(() => {
                try { req[0] = JSON.parse(req[0]) } catch (err) { }
                this._Calendario.ListDate(req[0].start).then((res) => {
                    socket.emit("ClientEvents", {
                        event: "WSMK/calendario/edtmulti",
                        data: {
                            start: req[0].start,
                            data: res
                        }
                    })
                }).catch((err) => {
                    this._log.error("On loading Calendario WSMK")
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
        socket.on("WSMK/calendario/edt", (req) => {
            this._myself.checkPermission("WSMK/menu/calendario/edt").then(() => {
                this._Calendario.edtCalendario(req[0].id, req[0].title, req[0].description, req[0].img, req[0].active, this._myself.myself.id).then((results) => {
                    socket.emit("ClientEvents", {
                        event: "system/calendario/edited",
                        data: { id: results.insertId }
                    })
                }).catch((err) => {
                    if (!this._myself.isLogged()) {
                        socket.emit("logout", "");
                    }
                    this._log.error("On Editing Calendario on WSMK")
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
        socket.on("WSMK/calendario/add", (req) => {
            this._myself.checkPermission("WSMK/menu/calendario/add").then(() => {
                this._Calendario.addCalendario(req[0].title, req[0].description, req[0].img, req[0].active, this._myself.myself.id).then((results) => {
                    socket.emit("ClientEvents", {
                        event: "system/calendario/added",
                        data: { id: results.insertId }
                    })
                }).catch((err) => {
                    if (!this._myself.isLogged()) {
                        socket.emit("logout", "");
                    }
                    this._log.error("On Editing Calendario on WSMK")
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
         * add file
         */
        socket.on("WSMK/calendario/file", (req) => {
            this._myself.checkPermission("WSMK/menu/calendario/add").then(() => {
                try {
                    let name = new BCypher().generate_salt(48) + req[0].ext;
                    let filepath = path(__dirname + "/../../../../web/img/calendario/")
                    if (!fs.existsSync(filepath)) { fs.mkdirSync(filepath); }

                    while (fs.existsSync(filepath + name)) { // necessario para criar arquivo com nome unico
                        name = new BCypher().generate_salt(48) + req[0].ext;
                    }

                    fs.writeFileSync(filepath + name, req[0].stream);

                    if (req[0].ext == ".png" || req[0].ext == ".jpeg" || req[0].ext == ".gif" || req[0].ext == ".bmp" || req[0].ext == ".jpg") {

                        this._imageClass.thumb(filepath + name, (filepath + name).replace(".", "_thumb."), 300, 170).then(() => {

                            socket.emit("ClientEvents", {
                                event: "WSMK/calendario/fileuploaded",
                                data: {
                                    file: "calendario/" + name
                                }
                            })
                        });
                    } else {
                        socket.emit("ClientEvents", {
                            event: "WSMK/calendario/fileuploaded",
                            data: {
                                file: "file.png"
                            }
                        })
                    }

                } catch (err) {
                    if (!this._myself.isLogged()) {
                        socket.emit("logout", "");
                    }
                    this._log.error("On Uploading file to Product")
                    this._log.error(err);
                    socket.emit("ClientEvents", {
                        event: "system_mess",
                        data: {
                            status: "ERROR",
                            mess: err,
                            time: 1000
                        }
                    })
                }
            }).catch((err) => {
                this._log.warning("User Access Denied to Add Products File: " + this._myself.myself.id)
                socket.emit("ClientEvents", {
                    event: "system_mess",
                    data: {
                        status: "ERROR",
                        mess: "Acesso Negado",
                        time: 1000
                    }
                })
            })

        })
    }
}

module.exports = {
    Socket
};