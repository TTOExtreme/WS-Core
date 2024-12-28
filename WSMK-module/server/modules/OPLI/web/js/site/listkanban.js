ClientEvents.clearAll();

ClientEvents.emit("LeftMenuClose");
ClientEvents.emit("LMI-CloseAll");

//load emitente Data
ClientEvents.on("wsop/emitente/add", (data) => { window.Emitente = data; });
ClientEvents.emit("SendSocket", "wsop/emitente/lst");


ClientEvents.emit("LoadExternal", [
    "./js/libs/suneditor.min.js",
    "./css/screen/suneditor.min.css",
    "./module/OPLI/js/utils/osStatus.js",
    //"./module/OPLI/js/utils/anexo.js",
    //"./module/OPLI/js/utils/consulta.js",
    //"./module/OPLI/js/utils/ProdutosStruct.js",
    //"./module/OPLI/js/produtos/add.js",
    //"./module/OPLI/js/clientes/add.js",
    //"./module/OPLI/js/os/add.js",
    //"./module/OPLI/js/os/view.js",
    //"./module/OPLI/js/os/print.js",
    //"./module/OPLI/js/os/printop.js",
    //"./module/OPLI/js/os/del.js",
    //"./module/OPLI/js/os/edt.js",
    //"./module/OPLI/js/os/edtstatus.js",
    "./module/OPLI/css/index.css",
    "./module/OPLI/css/print.css"
], () => {
    new window.UserList();
}, false);

if (window.UserList || window.UpdateMainTable) { // usa a mesma interface global para todas as listas
    window.UserList = null;
    clearInterval(window.UpdateMainTable);
    window.UpdateMainTable = null;
}

window.UpdateMainTable = setInterval(() => {
    //ClientEvents.emit("SendSocket", "WSOP/site/lst");
}, 10 * 1000);
window.maintable = null;
window.UserList = class UserList {

    constructor() {

        window.maintable = new jKanban({
            element: "#MainScreen",
            gutter: "5px",
            widthBoard: "450px",
            itemHandleOptions: {
                enabled: true,
            },
            click: function (el) {
                console.log("Trigger on all items click!");
            },
            dropEl: function (el, target, source, sibling) {
                console.log(target.parentElement.getAttribute('data-id'));
                console.log(el, target, source, sibling)
            },
            buttonClick: function (el, boardId) {
                console.log(el);
                console.log(boardId);
                // create a form to enter element
                var formItem = document.createElement("form");
                formItem.setAttribute("class", "itemform");
                formItem.innerHTML =
                    '<div class="form-group"><textarea class="form-control" rows="2" autofocus></textarea></div><div class="form-group"><button type="submit" class="btn btn-primary btn-xs pull-right">Submit</button><button type="button" id="CancelBtn" class="btn btn-default btn-xs pull-right">Cancel</button></div>';

                window.maintable.addForm(boardId, formItem);
                formItem.addEventListener("submit", function (e) {
                    e.preventDefault();
                    var text = e.target[0].value;
                    window.maintable.addElement(boardId, {
                        title: text
                    });
                    formItem.parentNode.removeChild(formItem);
                });
                document.getElementById("CancelBtn").onclick = function () {
                    formItem.parentNode.removeChild(formItem);
                };
            },
            itemAddOptions: {
                enabled: true,
                content: '+',
                class: 'custom-button',
                footer: true
            },
            itemHandleOptions: {
                enabled: true,                                 // if board item handle is enabled or not
                handleClass: "item_handle",                         // css class for your custom item handle
                customCssHandler: "drag_handler",                        // when customHandler is undefined, jKanban will use this property to set main handler class
                customCssIconHandler: "drag_handler_icon",                   // when customHandler is undefined, jKanban will use this property to set main icon handler class. If you want, you can use font icon libraries here
                customHandler: "<span class='item_handle'>+</span> %s"// your entirely customized handler. Use %s to position item title
            },
            boards: [
                {
                    id: "_todo",
                    title: "To Do (Can drop item only in working)",
                    class: "info,good",
                    dragTo: ["_working"],
                    item: [
                        {
                            id: "_test_delete",
                            title: "<table><tr><td>Nome Card</td></tr><tr><td>opt1</td></tr><tr><td>opt1</td></tr><tr><td>opt1</td></tr><tr><td>opt1</td></tr><tr><td>opt1</td></tr></table>",
                            drag: function (el, source) {
                                console.log("START DRAG: " + el.dataset.eid);
                            },
                            dragend: function (el) {
                                console.log("END DRAG: " + el.dataset.eid);
                            },
                            drop: function (el) {
                                console.log("DROPPED: " + el.dataset.eid);
                            }
                        },
                        {
                            title: "Try Click This!",
                            click: function (el) {
                                alert("click");
                            },
                            class: ["peppe", "bello"]
                        }
                    ]
                },
                {
                    id: "_working",
                    title: "Working (Try drag me too)",
                    class: "warning",
                    item: [
                    ]
                },
                {
                    id: "_done",
                    title: "Done (Can drop item only in working)",
                    class: "success",
                    dragTo: ["_working"],
                    item: [
                    ]
                }
            ]
        });



        var allEle = window.maintable.getBoardElements("_todo");
        allEle.forEach(function (item, index) {
            //console.log(item);
        });


        this._init();
        ClientEvents.emit("SendSocket", "WSOP/site/lst");
    }

    _init() {

        /**Receive user list and append to Table */

        ClientEvents.on("wsop/site/lst", (data) => {
            if (data) {
                this.UserListData = data;
                //window.maintable.replaceData(this.UserListData);
            }
        });

        ClientEvents.on("system/added/produtos", () => {
            ClientEvents.emit("system_mess", { status: "OK", mess: "Produto Adicionado com Exito", time: 1000 });
            ClientEvents.emit("SendSocket", "wsop/site/produtos/lst");
            ClientEvents.emit("WSOP/produtos/close");
        });
        ClientEvents.on("system/added/clientes", () => {
            ClientEvents.emit("system_mess", { status: "OK", mess: "Ciente Adicionado com Exito", time: 1000 });
            ClientEvents.emit("SendSocket", "wsop/site/clientes/lst");
            ClientEvents.emit("WSOP/clientes/close");
        });
        ClientEvents.on("system/added/os", (data) => { ClientEvents.emit("SendSocket", "wsop/os/lst/edt", data); ClientEvents.emit("WSOP/os/close"); });
        ClientEvents.on("system/removed/os", () => { ClientEvents.emit("system_mess", { status: "OK", mess: "OS Removida com Exito", time: 1000 }); ClientEvents.emit("SendSocket", "wsop/os/lst"); });
        ClientEvents.on("system/edited/os", () => { ClientEvents.emit("system_mess", { status: "OK", mess: "OS Editada com Exito", time: 1000 }); ClientEvents.emit("SendSocket", "wsop/os/lst"); });
        //*/
    }
    _getStatusFilterParams() {
        let ret = [{ label: "-", value: "" }]
        OPLIstatusIDs.forEach((item, index) => {
            ret.push({ label: item.name, value: index })
        })
        console.log(ret);
        return ret;
    }
}
