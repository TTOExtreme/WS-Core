ClientEvents.setCoreEvent("LeftMenuOpen")
ClientEvents.on("LeftMenuOpen", () => {

    let lm = document.getElementById("leftMenuHolder")
    if (lm) {
        if (!lm.classList.contains("LeftMenuOpen")) {
            lm.classList.toggle("LeftMenuOpen")
        }
    }
})

ClientEvents.setCoreEvent("LeftMenuClose")
ClientEvents.on("LeftMenuClose", () => {
    let lm = document.getElementById("leftMenuHolder")
    if (lm) {
        if (lm.classList.contains("LeftMenuOpen")) {
            lm.classList.toggle("LeftMenuOpen")
        }
    }
    ClientEvents.emit("LeftMenu-ToggleUserMenu", false);
})

ClientEvents.setCoreEvent("Page_Loaded")
ClientEvents.on("Page_Loaded", new Promise((resolve, reject) => {

    document.getElementById("LMI-LogoutButton").onclick = () => {
        ClientEvents.emit("Logout");
    }
    document.getElementById("openLeftMenu").onclick = () => {
        ClientEvents.emit("LeftMenuOpen");
    }
    document.getElementById("closeLeftMenu").onclick = () => {
        ClientEvents.emit("LeftMenuClose");
    }
    document.getElementById("LMI-UserButton").onclick = () => {
        ClientEvents.emit("LeftMenu-ToggleUserMenu");
    }
    resolve();
}));

let MenuItems = [];

ClientEvents.setCoreEvent("LeftMenu-SetItems")
ClientEvents.on("LeftMenu-SetItems", (items) => {
    if (items) {
        MenuItems = items;
        let LeftMenuTable = document.getElementById("LeftMenuTable");
        LeftMenuTable.innerHTML = "";
        MenuItems.forEach(item => {
            let mitem = new LeftMenuItem(item)
            if (mitem) {
                LeftMenuTable.appendChild(mitem.getItem());
                LeftMenuTable.appendChild(mitem.getSubitems());
            }
        });
    }
})

ClientEvents.setCoreEvent("LeftMenu-ToggleUserMenu");
ClientEvents.on("LeftMenu-ToggleUserMenu", (state) => {
    let lm = document.getElementById("LeftMenu-UserMenu");
    if (state != undefined) {
        if (state) {
            if (lm.classList.contains("LMUserMenuShow")) {
                lm.classList.toggle("LMUserMenuShow")
            }
        } else {
            if (!lm.classList.contains("LMUserMenuShow")) {
                lm.classList.toggle("LMUserMenuShow")
            }
        }
    }
    lm.classList.toggle("LMUserMenuShow");
})

ClientEvents.setCoreEvent("LMU-SetInfo")
ClientEvents.on("LMU-SetInfo", (info) => {
    if (info.username) document.getElementById("LMU-Name").innerText = info.name;
    if (info.name) document.getElementById("LMU-Username").innerText = info.username;
    if (info.lastIp) document.getElementById("LMU-Ip").innerText = info.lastIp;
    if (info.lastConnection) document.getElementById("LMU-LastLogin").innerText = formatTime(info.lastConnection);
    if (Myself.checkPermission("def/usr/chgpass")) {
        document.getElementById("LMI-ChangePassButton").style.display = "block";
    }
    if (Myself.checkPermission("def/usr/preferences")) {
        document.getElementById("LMI-PreferencesButton").style.display = "block";
    }
})

ClientEvents.setCoreEvent("Logged")
ClientEvents.on("Logged", (myself) => {
    ClientEvents.emit("LMU-SetInfo", myself);
    ClientEvents.emit("SendSocket", "usr/lst/menu", {});
})

ClientEvents.setCoreEvent("LMI-CloseAll")
ClientEvents.on("LMI-CloseAll", () => {
    MenuItems.forEach(item => {
        if (item.SubItems) {
            if (!document.getElementById("sub_" + item.Id).classList.contains("LMIHidden"))
                document.getElementById("sub_" + item.Id).classList.toggle("LMIHidden");
        }
    })
})

function ToggleLeftMenuItem(obj) {
    let item = new LeftMenuItem(obj);
    if (item.SubItems) {

        if (document.getElementById("sub_" + item.Id).classList.contains("LMIHidden")) {
            ClientEvents.emit("LMI-CloseAll");
        }
        document.getElementById("sub_" + item.Id).classList.toggle("LMIHidden");
        return;
    } else {
        if (typeof (item.Event) === "function") {
            item.Event(item);
        } else {
            if (item.EventCall && item.EventData) {
                ClientEvents.emit(item.EventCall, item.EventData);
            }
        }
        if (item.TopItems.length > 0) {
            ClientEvents.emit("TopMenu-SetItems", item.TopItems);
        }
    }
}

class LeftMenuItem {

    /**@const {string} Name Name to show */
    Name;
    /**@const {string} Id  Id for the item */
    Id;
    /**@const {string} Icon  Path o icon */
    Icon;
    /**@const {string} EventCall Event name to call on Client events */
    EventCall;
    /**@const {string} EventData Event data to call */
    EventData;
    /**@const {Function} Event Event on Click */
    Event;
    /**@const {ClientMenus} SubItems Child Items */
    SubItems;
    /**@const {ClientMenus} TopItems */
    TopItems;

    constructor(obj) {
        Object.assign(this, obj);
    }
    getItem() {
        let si = document.createElement("tr");
        si.onclick = () => {
            if (typeof (this.Event) === "function") {
                this.Event();
            } else {
                ToggleLeftMenuItem(this);
            }
        };
        si.setAttribute("class", "LMI-Item")
        si.innerHTML =
            ((this.Icon) ? "<td class='LMI-img-td'><img class='LMI-img' src='" + this.Icon + "'></td>" : "") + "" +
            "<td " + ((!this.Icon) ? " colspan=2" : "") + "><p>" + this.Name + "</p></td>";
        return si;
    }
    getSubitems() {
        let si2 = document.createElement("tr");
        if (this.SubItems) {
            let td = document.createElement("td");
            td.setAttribute("colspan", 2)
            let tab = document.createElement("table");
            tab.setAttribute("class", "LMI LMIHidden")
            tab.id = "sub_" + this.Id;
            this.SubItems.forEach(subitem => {
                let subi = new LeftMenuItem(subitem);
                tab.appendChild(subi.getItem());
                tab.appendChild(subi.getSubitems());
            });
            td.appendChild(tab);
            si2.appendChild(td);
        }
        return si2
    }
}