const groupManipulator = require('../../../../database/_group/serverManipulator').GroupServer;
const class_user = require('../../../../database/_user/class_user').User;
const class_group = require('../../../../database/_group/class_group').Group;

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
        this._groupServer = new groupManipulator(WSMainServer);
        this._myself = new class_user(WSMainServer);
        this._grupself = new class_user(WSMainServer);
    }

    /**
     * Create Listeners for Socket
     * @param {SocketIO} io 
     * @param {class_group} Myself
     */
    socket(socket, Myself) {
        this._log.task("api-mod-wsop-cliente", "Api wsop-clientes Loaded", 1);
        this._myself = Myself;

        /**
         * List all clientes
         */
        socket.on("wsop/clientes/lst", (data) => {
            this._myself.checkPermission("menu/adm/grp").then(() => {
                this._groupServer.listGroup().then((data) => {
                    socket.emit("ClientEvents", {
                        event: "adm/grp/lst",
                        data: data
                    })
                }).catch((err) => {
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
         * add cliente
         */
        socket.on("wsop/clientes/add", (data) => {
            this._myself.checkPermission("menu/adm/grp").then(() => {
                this._groupServer.listGroup().then((data) => {
                    socket.emit("ClientEvents", {
                        event: "adm/grp/lst",
                        data: data
                    })
                }).catch((err) => {
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
         * Context Menu List items with it calls for list of groups
         */
        socket.on("adm/grp/lst/ctx", (data) => {
            let itemList = [];
            if (this._myself.checkPermissionSync("adm/usr/edt")) {
                itemList.push({
                    name: "Editar",
                    active: true,
                    event: {
                        call: "grp/edt",
                        data: data[0].row
                    }
                });
            } else {
                itemList.push({
                    name: "Editar",
                    active: false
                });
            }

            if (this._myself.checkPermissionSync("adm/grp/disable")) {
                itemList.push({
                    name: ((data[0].row.active == 1) ? "Desativar" : "Ativar"),
                    active: true,
                    event: {
                        call: "grp/disable",
                        data: data[0].row
                    }
                });
            } else {
                itemList.push({
                    name: ((data[0].row.active == 1) ? "Desativar" : "Ativar"),
                    active: false
                });
            }
            //*/
            if (this._myself.checkPermissionSync("adm/grp/perm")) {
                itemList.push({
                    name: "Permissões",
                    active: true,
                    event: {
                        call: "grp/perm",
                        data: data[0].row
                    }
                });
            } else {
                itemList.push({
                    name: "Permissões",
                    active: false
                });
            }
            if (this._myself.checkPermissionSync("adm/grp/grp")) {
                itemList.push({
                    name: "Grupos",
                    active: true,
                    event: {
                        call: "grp/grp",
                        data: data[0].row
                    }
                });
            } else {
                itemList.push({
                    name: "Grupos",
                    active: false
                });
            }


            socket.emit("ClientEvents", {
                event: "CreateContext",
                data: {
                    data: data,
                    items: itemList
                }
            })
        });

    }


}

module.exports = {
    Socket
};