

/**Preferencias de Usuário */
ClientEvents.setCoreEvent("usr/get/preferences"); //quando recebe dados do servidor
ClientEvents.on("usr/get/preferences", (preferences) => {
    Myself.preferences = preferences;
    ClientEvents.emit("SendSocket", "usr/lst/menu", {});
});

ClientEvents.setCoreEvent("usr/load/preferences"); //quando e feito request para o servidor
ClientEvents.on("usr/load/preferences", () => {
    ClientEvents.emit("SendSocket", "usr/get/preferences", Myself);
});

ClientEvents.setCoreEvent("usr/save/preferences"); //quando salva no servidor
ClientEvents.on("usr/save/preferences", () => {
    ClientEvents.emit("SendSocket", "usr/edt/preferences", Myself);
});

/**Barra de Favoritos */


ClientEvents.setCoreEvent("fav/add"); //adiciona aba de navegação
ClientEvents.on("fav/add", (item) => {
    if (Myself.preferences == undefined) { Myself.preferences = { favoritos: [] } }
    if (Myself.preferences.favoritos == undefined) { Myself.preferences = { favoritos: [] } }

    let TopMenuTable = document.getElementById("TopMenuTableRow");
    item.isFav = Myself.preferences.favoritos.find((val) => (val == item.Id)) != undefined;
    let mitem = new favBar(item)
    if (mitem && !document.getElementById("fav_" + item.Id)) {
        TopMenuTable.appendChild(mitem.getItem());
    }
});


ClientEvents.setCoreEvent("fav/set"); //Seta aba como favorito
ClientEvents.on("fav/set", (Id) => {
    if (!Myself.preferences) { Myself.preferences = { favoritos: [] } }
    if (!Myself.preferences.favoritos) { Myself.preferences = { favoritos: [] } }

    if (!Myself.preferences.favoritos.find(val => val == Id)) {
        Myself.preferences.favoritos.push(Id);
        window.Abas[Id].isFav = true;
    } else {
        Myself.preferences.favoritos = Myself.preferences.favoritos.filter(item => item != Id);
        window.Abas[Id].isFav = false;
    }
    ClientEvents.emit("usr/save/preferences", {});
    ClientEvents.emit("usr/load/preferences", {});
    document.getElementById("fav_" + Id).setAttribute("class", ((window.Abas[Id].isFav) ? "fa fa-star" : "fa fa-star-o"))
});
ClientEvents.on("Logged", () => {
    ClientEvents.emit("SendSocket", "usr/get/preferences", Myself);
})
class favBar {
    Name;
    Event;
    EventCall;
    EventData;
    Id;
    isFav = false;
    constructor(obj) {
        Object.assign(this, obj);
    }
    getItem() {
        let si = document.createElement("td");
        let tx = document.createElement("i");
        let fav = document.createElement("i");
        tx.onclick = () => {
            if (this.EventCall && this.EventData) {
                ClientEvents.emit(this.EventCall, this.EventData);
            }
        }
        tx.innerText = this.Name + "  ";


        fav.setAttribute("class", ((this.isFav) ? "fa fa-star" : "fa fa-star-o"))
        fav.setAttribute("id", "fav_" + this.Id)
        fav.onclick = () => {
            ClientEvents.emit("fav/set", this.Id);
        };


        si.setAttribute("class", "TMI-Item")

        si.appendChild(tx);
        si.appendChild(fav);
        return si;
    }
}