ClientEvents.clearAll();

ClientEvents.emit("LeftMenuClose");
ClientEvents.emit("LMI-CloseAll");
ClientEvents.emit("close_menu");

ClientEvents.emit("LoadExternal", [
    "./module/WSMK/css/calendario.css",
    "./module/WSMK/js/calendario/edt.js",
    "./module/WSMK/js/calendario/edtMultiples.js"
], () => { }, false)

if (window.UserList) { // usa a mesma interface global para todas as listas
    window.UserList = null;
    document.getElementById("MainScreen").innerHTML = "";
}

ClientEvents.on("WSMK/calendario/lst", (data) => {
    function createDay(id, img, title, day, month, year, color, bgcolor, qnt = 0, highlight = false, edt = true) {
        return "<div id='wsmk_day_card' class='wsmk_day_card' style='" +
            ((img != undefined && img != "" && img != "undefined") ? "background-image:url(./module/WSMK/img/" + (img + "").replace(".jpg", "_thumb.jpg") + ");background-repeat: round;" : "background:" + bgcolor + ";") +
            "border: 1px solid " + color + ";" + (highlight ? "border:1px solid #ff0000;border-radius:0;" : "") + "'>" +
            "<span class='wsmk_day_num'>" + day + (qnt > 1 ? " +" + (qnt - 1) : "") + "</span>" +
            "<span class='wsmk_day_edt'>" +
            (qnt <= 1 ?
                (edt ?
                    "<i style='margin-right:10px' onclick=ClientEvents.emit(\"SendSocket\",\"WSMK/calendario/lstid\",\'" + JSON.stringify({ id: 0, start: new Date(year, month, day).getTime() + (6 * 3600 * 1000) }) + "') class='fa fa-plus' aria-hidden='true'></i>" +
                    "<i onclick=ClientEvents.emit(\"SendSocket\",\"WSMK/calendario/lstid\",\'" + JSON.stringify({ id: id }) + "') class='fa fa-pencil' aria-hidden='true'></i>" : "")
                : (edt ?
                    "<i style='margin-right:10px' onclick=ClientEvents.emit(\"SendSocket\",\"WSMK/calendario/lstid\",\'" + JSON.stringify({ id: 0, start: new Date(year, month, day).getTime() + (6 * 3600 * 1000) }) + "') class='fa fa-plus' aria-hidden='true'></i>" +
                    "<i onclick=ClientEvents.emit(\"SendSocket\",\"WSMK/calendario/lstids\",\'" + JSON.stringify({ id: id, start: new Date(year, month, day).getTime() + (6 * 3600 * 1000) }) + "') class='fa fa-pencil' aria-hidden='true'></i>" : "")) +
            "</span>" +
            (title != "" ? "<center style='margin-top:22px'><span class='wsmk_day_title'>" + title + "</span></center>" : "") +
            "</div>";
    }

    function getDays(day, month, year) {
        return data.filter((val) => {
            let date = new Date(val.description.start);
            if (date.getDate() == day && date.getMonth() == month && date.getFullYear() == year) {
                return val;
            }
        })
    }
    data.forEach(element => {
        try {
            element.description = JSON.parse(element.description);
        } catch (err) {

        }
    });

    //console.log(data);

    /**
     * create Show Page for user info
     */
    let div = document.getElementById("MainScreen");

    div.innerHTML = "";

    let html = "<center><table class='wsmk_calendar_table' id='wsmk_calendar'>"

    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();



    let wkd = 0;
    html += "<tr>";
    for (wkd = 0; wkd < new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay(); wkd++) {
        html += "<td></td>";
    }
    for (let d = 1; d < day; d++) {
        let dcard = getDays(d, month, year);
        if (dcard[0] != undefined) {
            html += "<td>" + createDay(dcard[0].id, dcard[0].img, dcard[0].title, d, month, year, dcard[0].description.color, dcard[0].description.bgcolor, dcard.length) + "</td>";
        } else {
            html += "<td>" + createDay(0, "", "", d, month, year, "#00000090", "#00000030") + "</td>";
        }
        wkd++;
        if (wkd >= 7) {
            wkd = 0;
            html += "</tr><tr>";
        }
    }
    let dcard = getDays(day, month, year);
    if (dcard[0] != undefined) {
        html += "<td>" + createDay(dcard[0].id, dcard[0].img, dcard[0].title, day, month, year, dcard[0].description.color, dcard[0].description.bgcolor, dcard.length, true) + "</td>";
    } else {
        html += "<td>" + createDay(0, "", "", day, month, year, "#00000090", "#00000030", 0, true) + "</td>";
    }
    wkd = date.getDay() + 1;
    for (let d = day + 1; d <= new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() && d <= 31; d++) {
        dcard = getDays(d, month, year);
        if (dcard[0] != undefined) {
            html += "<td>" + createDay(dcard[0].id, dcard[0].img, dcard[0].title, d, month, year, dcard[0].description.color, dcard[0].description.bgcolor, dcard.length) + "</td>";
        } else {
            html += "<td>" + createDay(0, "", "", d, month, year, "#00000090", "#00000030") + "</td>";
        }
        wkd++;
        if (wkd >= 7) {
            wkd = 0;
            html += "</tr><tr>";
        }
    }
    html += "</tr><tr>";
    wkd = 0;
    for (wkd = date.getDay(); wkd <= 6; wkd++) {
        html += "<td></td>";
    }

    div.innerHTML += html + "</tr></table>";

    //document.body.appendChild(div);
});

ClientEvents.emit("SendSocket", "WSMK/calendario/lst")
//ClientEvents.emit("WSMK/calendario/lst", []);