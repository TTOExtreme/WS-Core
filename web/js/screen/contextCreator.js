ClientEvents.setCoreEvent("CreateContext");
let ContextScreens = [];
ClientEvents.on("CreateContext", (data) => {
    if (ContextScreens.length > 5) {
        ClientEvents.emit("RemoveContext", ContextScreens[0]);
    }
    if (data.data[0].x && data.data[0].y && data.items) {
        let ctxDiv = document.createElement("div");
        let id = Date.now();
        ContextScreens.push(id);

        ctxDiv.setAttribute("id", id);
        ctxDiv.setAttribute("class", "contextMenu");
        ctxDiv.setAttribute("style", "top:" + data.data[0].y + "px;left:" + data.data[0].x + "px;");
        let table = document.createElement("table");
        ctxDiv.appendChild(table);
        //include a close button

        let tr = document.createElement("tr");
        tr.innerHTML = "<th><p>X</p></th>";
        tr.onclick = () => {
            ClientEvents.emit("RemoveContext", id);
        };
        table.appendChild(tr);

        data.items.forEach(item => {
            let tr = document.createElement("tr");
            tr.innerHTML = "<td><p>" + item.name + "</p></td>";
            tr.onclick = () => {
                ClientEvents.emit("RemoveContext", id);
                if (typeof (item.event) === "function") {
                    item.event();
                }
            }
            table.appendChild(tr);
        });
        document.body.appendChild(ctxDiv);
    }
})

ClientEvents.setCoreEvent("RemoveContext");
ClientEvents.on("RemoveContext", (id) => {
    if (id) {
        if (ContextScreens.indexOf(id) > -1) {
            document.body.removeChild(
                document.getElementById(id)
            )
            ContextScreens.splice(ContextScreens.indexOf(id), 1);
        }
    } else {
        ContextScreens.forEach(item => {
            document.body.removeChild(
                document.getElementById(item)
            )
            ContextScreens.splice(ContextScreens.indexOf(item), 1);
        })
    }
})