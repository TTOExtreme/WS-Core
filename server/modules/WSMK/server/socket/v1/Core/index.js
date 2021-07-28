
class Core {

    _Menus = [{
        Name: "Marketing",
        Id: "menu/WSMK",
        Permission: "WSMK/menu",
        Icon: "",
        Event: () => { },
        SubItems: [
            {
                Name: "Calendário",
                Id: "menu/WSMK/calendario",
                Permission: "WSMK/menu/calendario",
                Icon: "",
                EventCall: "Load",
                EventData: "./module/WSMK/js/calendario/calendario.js",
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