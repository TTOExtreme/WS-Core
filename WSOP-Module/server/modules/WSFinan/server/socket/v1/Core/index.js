
class Core {

    _Menus = [{
        Name: "Financeiro",
        Id: "menu/WSFinan",
        Permission: "WSFinan/menu",
        Icon: "",
        Event: () => { },
        SubItems: [
            /*
            {
                Name: "Faturamento",
                Id: "menu/WSFinan/faturamento",
                Permission: "WSFinan/financeiro/faturamento",
                Icon: "",
                EventCall: "Load",
                EventData: "./module/WSFinan/js/faturamento.js",
                TopItems: [],
            },//*/
            {
                Name: "Fichas",
                Id: "menu/WSFinan/fichas",
                Permission: "WSFinan/financeiro/ficha",
                Icon: "",
                EventCall: "Load",
                EventData: "./module/WSFinan/js/ficha/list.js",
                TopItems: [],
            },
            {
                Name: "Requisição",
                Id: "menu/WSFinan/requisicao",
                Permission: "WSFinan/financeiro/requisicao",
                Icon: "",
                EventCall: "Load",
                EventData: "./module/WSFinan/js/requisicao/list.js",
                TopItems: [],
            },
            {
                Name: "Fornecedores",
                Id: "menu/WSFinan/fornecedor",
                Permission: "WWSFinan/financeiro/fornecedor",
                Icon: "",
                EventCall: "Load",
                EventData: "./module/WSFinan/js/fornecedor/list.js",
                TopItems: [],
            },
            {
                Name: "Produtos",
                Id: "menu/WSFinan/produtos",
                Permission: "WSFinan/financeiro/produtos",
                Icon: "",
                EventCall: "Load",
                EventData: "./module/WSFinan/js/produtos/list.js",
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