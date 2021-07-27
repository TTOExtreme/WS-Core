
class Core {

    _Menus = [{
        Name: "Financeiro",
        Id: "menu/WSFinan",
        Permission: "WSFinan/menu",
        Icon: "",
        Event: () => { },
        SubItems: [
            {
                Name: "Faturamento",
                Id: "menu/WSFinan/faturamento",
                Permission: "WSFinan/financeiro/faturamento",
                Icon: "",
                EventCall: "Load",
                EventData: "./module/WSFinan/js/faturamento.js",
                TopItems: [],
            },
            {
                Name: "Fichas",
                Id: "menu/WSFinan/fichas",
                Permission: "WSFinan/financeiro/ficha",
                Icon: "",
                EventCall: "Load",
                EventData: "./module/WSFinan/js/ficha.js",
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