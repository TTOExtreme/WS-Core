

ClientEvents.setCoreEvent("TopMenu-SetItems")
ClientEvents.on("TopMenu-SetItems", (items) => {
    if (items) {
        let TopMenuTable = document.getElementById("TopMenuTableRow");
        TopMenuTable.innerHTML = "";
        items.forEach(item => {
            let mitem = new TopMenuItem(item)
            if (mitem) {
                TopMenuTable.appendChild(mitem.getItem());
            }
        });
    }
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
        si.onclick = () => { if (typeof (this.Event) === "function") { this.Event(); } };
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