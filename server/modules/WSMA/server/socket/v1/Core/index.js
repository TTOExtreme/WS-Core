
class Core {

    _Menus = [{
        Name: "Materiais",
        Id: "menu/WSMA",
        Permission: "WSMA/menu",
        Icon: "",
        Event: () => { },
        SubItems: [
            {
                Name: "Lista Materiais",
                Id: "menu/WSMA/listma",
                Permission: "WSMA/menu/list",
                Icon: "",
                EventCall: "Load",
                EventData: "./module/WSMA/js/listMateriais.js",
                TopItems: [],
            },
            {
                Name: "Lista Serviços",
                Id: "menu/WSMA/listsv",
                Permission: "WSMA/menu/list",
                Icon: "",
                EventCall: "Load",
                EventData: "./module/WSMA/js/listServicos.js",
                TopItems: [],
            },
            {
                Name: "Entrada",
                Id: "menu/WSMA/in",
                Permission: "WSMA/menu/in",
                Icon: "",
                EventCall: "Load",
                EventData: "./module/WSMA/js/in.js",
                TopItems: [],
            },
            {
                Name: "Saida",
                Id: "menu/WSMA/out",
                Permission: "WSMA/menu/out",
                Icon: "",
                EventCall: "Load",
                EventData: "./module/WSMA/js/out.js",
                TopItems: [],
            },
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