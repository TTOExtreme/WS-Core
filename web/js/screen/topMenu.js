

ClientEvents.setCoreEvent("TopMenu-SetItems")
let TMI_List = [];
ClientEvents.on("TopMenu-SetItems", (items) => {
    if (items) {
        let TopMenuTable = document.getElementById("TopMenuTableRow");
        TopMenuTable.innerHTML = "";
        TMI_List = [];
        items.forEach(item => {
            let mitem = new TopMenuItem(item)
            if (mitem) {
                TopMenuTable.appendChild(mitem.getItem());
                TMI_List.push(mitem);
            }
        });
    }
})

ClientEvents.setCoreEvent("call_TMI")
ClientEvents.on("call_TMI", (itemId) => {
    TMI_List.forEach(item => {
        if (item.Id == itemId) {
            if (typeof (item.Event) === "function") {//caso exista função direta
                item.Event();
            } else {
                if (!!item["EventCall"]) {
                    ClientEvents.emit(item.EventCall, item.EventData || "");
                }
                console.log(item)
            }
        }
    })
})

class TopMenuItem {
    Name;
    Event;
    Id;
    constructor(obj) {
        Object.assign(this, obj);
    }
    getItem() {
        let si = document.createElement("td");
        si.setAttribute("onclick", "ClientEvents.emit('call_TMI','" + this.Id + "')");
        si.setAttribute("class", "TMI-Item")
        si.innerHTML = "<p>" + this.Name + "</p>";
        return si;
    }
}

/*
setTimeout(() => {
    ClientEvents.emit("TopMenu-SetItems", [{ Name: "teste", Event: () => { console.log("click") }, Id: "Teste_TMI" }])
}, 1000)
//*/