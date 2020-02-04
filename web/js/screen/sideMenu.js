ClientEvents.on("LeftMenuOpen", () => {

    let lm = document.getElementById("leftMenuHolder")
    if (lm) {
        if (!lm.classList.contains("LeftMenuOpen")) {
            lm.classList.toggle("LeftMenuOpen")
        }
    }
})
ClientEvents.on("LeftMenuClose", () => {
    let lm = document.getElementById("leftMenuHolder")
    if (lm) {
        if (lm.classList.contains("LeftMenuOpen")) {
            lm.classList.toggle("LeftMenuOpen")
        }
    }
    ClientEvents.emit("LeftMenu-ToggleUserMenu", false);
})

ClientEvents.on("Page_Loaded", new Promise((resolve, reject) => {
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

ClientEvents.on("LeftMenu-SetItems", (items) => {
    if (items) {
        let LeftMenuTable = document.getElementById("LeftMenuTable");
        LeftMenuTable.innerHTML = "";
        items.forEach(item => {
            let mitem = new LeftMenuItem(item)
            if (mitem) {
                LeftMenuTable.appendChild(mitem.getItem());
                LeftMenuTable.appendChild(mitem.getSubitems());
            }
        });
    }
})


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

ClientEvents.on("LMU-SetInfo", (info) => {
    console.log(info);
    if (info.username) document.getElementById("LMU-Name").innerText = info.username;
    if (info.name) document.getElementById("LMU-Username").innerText = info.name;
    if (info.ip) document.getElementById("LMU-Ip").innerText = info.ip;
    if (info.lastLogin) document.getElementById("LMU-LastLogin").innerText = info.lastLogin;
})

ClientEvents.on("Logged", (myself) => {
    ClientEvents.emit("LMU-SetInfo", myself);
})

function ToggleLeftMenuItem(obj) {
    let item = new LeftMenuItem(obj);
    if (item.SubItems) {
        console.log("sub_" + item.Id);
        document.getElementById("sub_" + item.Id).classList.toggle("LMIHidden");
        return;
    } else {
        item.Event(item);
    }
}

class LeftMenuItem {
    Name;
    Icon;
    Event;
    SubItems;
    Id;
    constructor(obj) {
        Object.assign(this, obj);
    }
    getItem() {
        let si = document.createElement("tr");
        si.onclick = () => { ToggleLeftMenuItem(this) };
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

setTimeout(() => {
    let m = new LeftMenuItem();
    m.Name = "Menu 1";
    m.Id = "menu1-0";
    m.Event = (obj) => {
        console.log(obj);
    }
    m.SubItems = [];
    let n = new LeftMenuItem();
    n.Name = "Menu 1-1";
    n.Id = "menu1-1";
    n.Event = (obj) => {
        console.log(obj);
    }
    m.SubItems.push(n)
    m.SubItems.push(n)
    m.SubItems.push(n)


    let o = new LeftMenuItem();
    o.Name = "Menu 2";
    o.Id = "menu2-0";
    o.Event = (obj) => {
        console.log(obj);
    }
    o.SubItems = [];
    n = new LeftMenuItem();
    n.Name = "Menu 2-1";
    n.Id = "menu2-1";
    n.Event = (obj) => {
        console.log(obj);
    }
    o.SubItems.push(n)
    o.SubItems.push(n)
    o.SubItems.push(n)


    let p = new LeftMenuItem();
    p.Name = "Menu 3";
    p.Id = "menu3-0";
    p.Event = (obj) => {
        console.log(obj);
    }
    p.SubItems = [];
    n = new LeftMenuItem();
    n.Name = "Menu 3-1";
    n.Id = "menu3-1";
    n.Event = (obj) => {
        console.log(obj);
    }
    p.SubItems.push(n)
    p.SubItems.push(n)
    p.SubItems.push(n)

    ClientEvents.emit("LeftMenu-SetItems", [m, o, p]);
}, 1000)