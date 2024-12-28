const userManipulator = require('../../../../database/_user/serverManipulator').UserServer;
const class_user = require('../../../../database/_user/class_user').User;

class Socket {

    _log;
    _config;
    _WSMainServer;
    _myself;
    _events;

    /**
     * Constructor for User Class
     * @param {WSMainServer} WSMain
     */
    constructor(WSMainServer) {
        this._log = WSMainServer.log;
        this._config = WSMainServer.config;
        this._WSMainServer = WSMainServer;
        this._events = WSMainServer.events;
        this._userServer = new userManipulator(WSMainServer);
        this._myself = new class_user(WSMainServer);
    }

    /**
     * Create Listeners for Socket
     * @param {SocketIO} io 
     * @param {class_user} Myself
     */
    socket(socket, Myself) {
        this._myself = Myself;
        this._events.emit("usr/lst/menu", this._myself);
        /**
         * List all Users
         */
        socket.on("adm/user/lst", (data) => {
            this._myself.checkPermission("menu/adm/usr").then(() => {
                this._userServer.listUser().then((data) => {
                    socket.emit("ClientEvents", { event: "adm/usr/lst", data: data })
                }).catch((err) => {
                    socket.emit("ClientEvents", { event: "system_mess", data: { status: "ERROR", mess: err, time: 1000 } })
                })
            })
        })

        /**
         * User menus
         */
        socket.on("usr/lst/menu", (data) => {
            socket.emit("ClientEvents", { event: "LeftMenu-SetItems", data: this._myself.GetMenus() })
        })

        /**
         * Context Menu List items with it calls
         */
        socket.on("adm/ust/lst/ctx", (data) => {
            let itemList = [];
            if (this._myself.checkPermissionSync("adm/usr/edt")) {
                itemList.push({ name: "Editar", active: true, event: { call: "usr/edt", data: data[0].row } });
            } else {
                itemList.push({ name: "Editar", active: false });
            }
            if (this._myself.checkPermissionSync("adm/usr/disable")) {
                itemList.push({ name: ((data[0].row.active == 1) ? "Desativar" : "Ativar"), event: { call: "usr/disable", data: data[0].row } });
            } else {
                itemList.push({ name: ((data[0].row.active == 1) ? "Desativar" : "Ativar"), active: false });
            }
            if (this._myself.checkPermissionSync("adm/usr/perm")) {
                itemList.push({ name: "Permissões", event: { call: "usr/perm", data: data[0].row } });
            } else {
                itemList.push({ name: "Permissões", active: false });
            }
            if (this._myself.checkPermissionSync("adm/usr/grp")) {
                itemList.push({ name: "Grupos", event: { call: "usr/grp", data: data[0].row } });
            } else {
                itemList.push({ name: "Grupos", active: false });
            }


            socket.emit("ClientEvents", { event: "CreateContext", data: { data: data, items: itemList } })
        });

    }


}

module.exports = { Socket };