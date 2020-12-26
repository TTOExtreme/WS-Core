
class Core {

    _Menus = [{
        Name: "Ordem de Prod.",
        Id: "menu/WSOP",
        Permission: "menu/WSOP",
        Icon: "",
        Event: () => { },
        SubItems: [
            {
                Name: "Clientes",
                Id: "menu/WSOP/Cliente",
                Permission: "menu/WSOP/Cliente",
                Icon: "",
                EventCall: "Load",
                EventData: "./module/WSOP/js/clientes/list.js",
                TopItems: [],
            },
            {
                Name: "Produtos",
                Id: "menu/WSOP/produtos",
                Permission: "menu/WSOP/produtos",
                Icon: "",
                EventCall: "Load",
                EventData: "./module/WSOP/js/produtos/list.js",
                TopItems: [],
            },
            {
                Name: "OS",
                Id: "menu/WSOP/OS",
                Permission: "menu/WSOP/OS",
                Icon: "",
                EventCall: "Load",
                EventData: "./module/WSOP/js/OS/list.js",
                TopItems: [],
            },
            {
                Name: "Emitente",
                Id: "menu/WSOP/OS",
                Permission: "menu/WSOP/OS",
                Icon: "",
                EventCall: "Load",
                EventData: "./module/WSOP/js/OS/list.js",
                TopItems: [],
            }
        ],
        TopItems: [],
    }]

    _socket;
    _Myself;

    constructor(socket, Myself) {
        this._socket = socket;
        this._Myself = Myself;

        this._Myself.AppendMenus(this._Menus);
    }

}
module.exports = { Core };