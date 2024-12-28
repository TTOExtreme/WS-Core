
class Core {

    _Menus = [{
        Name: "API Loja Integrada",
        Id: "menu/OPLI",
        Permission: "OPLI/menu",
        Icon: "",
        Event: () => { },
        SubItems: [
            {
                Name: "API",
                Id: "menu/OPLI/api",
                Permission: "OPLI/menu/Api",
                Icon: "",
                EventCall: "Load",
                EventData: "./module/OPLI/js/api/edt.js",
                TopItems: [],
            },
            {
                Name: "Site",
                Id: "menu/OPLI/site",
                Permission: "OPLI/menu/site",
                Icon: "",
                EventCall: "Load",
                EventData: "./module/OPLI/js/site/list.js",
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