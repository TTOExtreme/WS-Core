
class Core {

    _Menus = [{
        Name: "Ordem de Prod.",
        Id: "WSOP/menu",
        Permission: "WSOP/menu",
        Icon: "",
        Event: () => { },
        SubItems: [
            {
                Name: "Api",
                Id: "WSOP/menu/api",
                Permission: "WSOP/menu/api",
                Icon: "",
                EventCall: "Load",
                EventData: "./module/WSOP/js/api/edt.js",
                TopItems: [],
            },
            {
                Name: "Pós Vendas",
                Id: "WSOP/menu/PosVendas",
                Permission: "WSOP/menu/posvendas",
                Icon: "",
                EventCall: "Load",
                EventData: "./module/WSOP/js/posvendas/list.js",
                TopItems: [],
            },
            {
                Name: "Vendas",
                Id: "WSOP/menu/Vendas",
                Permission: "WSOP/menu/vendas",
                Icon: "",
                EventCall: "Load",
                EventData: "./module/WSOP/js/vendas/list.js",
                TopItems: [],
            },
            {
                Name: "Design",
                Id: "WSOP/menu/Design",
                Permission: "WSOP/menu/design",
                Icon: "",
                EventCall: "Load",
                EventData: "./module/WSOP/js/design/list.js",
                TopItems: [],
            },
            {
                Name: "PrePress",
                Id: "WSOP/menu/Prepress",
                Permission: "WSOP/menu/prepress",
                Icon: "",
                EventCall: "Load",
                EventData: "./module/WSOP/js/prepress/list.js",
                TopItems: [],
            },
            {
                Name: "Calandra",
                Id: "WSOP/menu/Calandra",
                Permission: "WSOP/menu/calandra",
                Icon: "",
                EventCall: "Load",
                EventData: "./module/WSOP/js/calandra/list.js",
                TopItems: [],
            },
            {
                Name: "Costura",
                Id: "WSOP/menu/Costura",
                Permission: "WSOP/menu/costura",
                Icon: "",
                EventCall: "Load",
                EventData: "./module/WSOP/js/costura/list.js",
                TopItems: [],
            },
            {
                Name: "Expedição",
                Id: "WSOP/menu/Expedicao",
                Permission: "WSOP/menu/expedicao",
                Icon: "",
                EventCall: "Load",
                EventData: "./module/WSOP/js/expedicao/list.js",
                TopItems: [],
            },
            {
                Name: "Clientes",
                Id: "WSOP/menu/Cliente",
                Permission: "WSOP/menu/cliente",
                Icon: "",
                EventCall: "Load",
                EventData: "./module/WSOP/js/clientes/list.js",
                TopItems: [],
            },
            {
                Name: "Produtos",
                Id: "WSOP/menu/produtos",
                Permission: "WSOP/menu/produtos",
                Icon: "",
                EventCall: "Load",
                EventData: "./module/WSOP/js/produtos/list.js",
                TopItems: [],
            },
            {
                Name: "OS",
                Id: "WSOP/menu/OS",
                Permission: "WSOP/menu/os",
                Icon: "",
                EventCall: "Load",
                EventData: "./module/WSOP/js/os/list.js",
                TopItems: [],
            },
            {
                Name: "Emitente",
                Id: "WSOP/menu/emitente",
                Permission: "WSOP/menu/emitente",
                Icon: "",
                EventCall: "Load",
                EventData: "./module/WSOP/js/emitente/list.js",
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