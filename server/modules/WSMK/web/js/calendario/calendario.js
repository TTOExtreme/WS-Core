ClientEvents.clearAll();

ClientEvents.emit("LeftMenuClose");
ClientEvents.emit("LMI-CloseAll");
ClientEvents.emit("close_menu");

ClientEvents.emit("LoadExternal", [
    "./module/WSMK/css/calendario.css",
    "./module/WSMK/js/calendario/edt.js",
    "./module/WSMK/js/calendario/view.js",
    "./module/WSMK/js/calendario/edtMultiples.js"
], () => { }, false)

if (window.UserList) { // usa a mesma interface global para todas as listas
    window.UserList = null;
    document.getElementById("MainScreen").innerHTML = "";
}

ClientEvents.on("WSMK/calendario/lst", (datain) => {
    let data = datain.data;
    if (datain.thisMonth == undefined) { return; }
    function createDay(id, img, title, description, day, month, year, color, bgcolor, qnt = 0, highlight = false, edt = true) {

        function clearDesc(desc) {
            return desc.replace(new RegExp("\"", "g"), "&qt;").replace(new RegExp("&quot;", "g"), "&qt;")
                .replace(new RegExp("=", "g"), "&eql;").replace(new RegExp("&eq;", "g"), "&eql;")
                .replace(new RegExp(">", "g"), "&get;").replace(new RegExp("&gt;", "g"), "&get;")
                .replace(new RegExp("<", "g"), "&let;").replace(new RegExp("&lt;", "g"), "&let;")
                .replace(new RegExp(" ", "g"), "&space;")
        }

        return "<div id='wsmk_day_card' onclick=ClientEvents.emit(\"WSMK/view\",{img:'" + img + "',title:'" + title + "',description:'" + clearDesc(description) + "'}) class='wsmk_day_card' style='" +
            ((img != undefined && img != "" && img != "undefined") ? "background-image:url(./module/WSMK/img/" + (img + "").replace(".", "_thumb.") + ");background-repeat: round;" : "background:" + bgcolor + ";") +
            "border: 1px solid " + color + ";" + (highlight ? "border:1px solid #ff0000;border-radius:0;" : "") + "'>" +
            "<span class='wsmk_day_num'>" + day + (qnt > 1 ? " +" + (qnt - 1) : "") + "</span>" +

            (qnt < 1 ?
                (edt && Myself.checkPermission("WSMK/menu/calendario/edt") ?
                    "<span class='wsmk_day_edt'>" + "<i style='margin-right:10px' onclick=ClientEvents.emit(\"SendSocket\",\"WSMK/calendario/lstid\",\'" + JSON.stringify({ id: 0, start: new Date(year, month, day).getTime() + (6 * 3600 * 1000) }) + "') class='fa fa-plus' aria-hidden='true'></i>" : "")
                : (edt && Myself.checkPermission("WSMK/menu/calendario/edt") ?
                    "<span class='wsmk_day_edt'>" + "<i style='margin-right:10px' onclick=ClientEvents.emit(\"SendSocket\",\"WSMK/calendario/lstid\",\'" + JSON.stringify({ id: 0, start: new Date(year, month, day).getTime() + (6 * 3600 * 1000) }) + "') class='fa fa-plus' aria-hidden='true'></i>" +
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


    let thisMonth = datain.thisMonth;
    let thisYear = datain.thisYear;

    let thisMonthLast = thisMonth - 1; thisMonthNext = thisMonth + 1; thisYearLast = thisYear; thisYearNext = thisYear;

    if (thisMonthLast < 0) { thisMonthLast = 11; thisYearLast--; }
    if (thisMonthNext > 11) { thisMonthNext = 0; thisYearNext++; }


    if (thisMonth == undefined) {
        thisMonth = month
        thisYear = year;
    } else {
        if (thisMonth != month || thisYear != year) {
            day = new Date(thisYear, thisMonth + 1, 0).getDate();
        }
    }

    html += "<tr><td colspan='3'>" +
        "<i onclick=ClientEvents.emit(\"SendSocket\",\"WSMK/calendario/lst\",\'" + JSON.stringify({ thisMonth: thisMonthLast, thisYear: thisYearLast }) + "') class='fa fa-arrow-left' aria-hidden='true' style='color:#000'></i></td>" +
        "<td><center>" + (thisMonth + 1) + "-" + (thisYear) + "</td>" +
        "<td colspan='3'>" +
        "<i onclick=ClientEvents.emit(\"SendSocket\",\"WSMK/calendario/lst\",\'" + JSON.stringify({ thisMonth: thisMonthNext, thisYear: thisYearNext }) + "') class='fa fa-arrow-right' style='float:right;color:#000' aria-hidden='true'></i></td>" +
        "</td><tr>";

    html += "<tr><td><center>Domingo</center></td><td><center>Segunda-Feira</center></td><td><center>Terça-Feira</center></td><td><center>Quarta-Feira</center></td><td><center>Quinta-Feira</center></td><td><center>Sexta-Feira</center></td><td><center>Sábado</center></td><tr>";


    let wkd = 0;
    html += "<tr>";
    for (wkd = 0; wkd < new Date(thisYear, thisMonth, 1).getDay(); wkd++) {
        html += "<td></td>";
    }
    for (let d = 1; d < day; d++) {
        let dcard = getDays(d, thisMonth, thisYear);
        if (dcard[0] != undefined) {
            html += "<td>" + createDay(dcard[0].id, dcard[0].img, dcard[0].title, dcard[0].description.description, d, thisMonth, thisYear, dcard[0].description.color, dcard[0].description.bgcolor, dcard.length) + "</td>";
        } else {
            html += "<td>" + createDay(0, "", "", "", d, thisMonth, thisYear, "#00000090", "#00000030") + "</td>";
        }
        wkd++;
        if (wkd >= 7) {
            wkd = 0;
            html += "</tr><tr>";
        }
    }
    let dcard = getDays(day, thisMonth, thisYear);
    if (dcard[0] != undefined) {
        html += "<td>" + createDay(dcard[0].id, dcard[0].img, dcard[0].title, dcard[0].description.description, day, thisMonth, thisYear, dcard[0].description.color, dcard[0].description.bgcolor, dcard.length, ((thisMonth != undefined) ? (thisMonth == month && thisYear == year ? true : false) : true)) + "</td>";
    } else {
        html += "<td>" + createDay(0, "", "", "", day, thisMonth, thisYear, "#00000090", "#00000030", 0, ((thisMonth != undefined) ? (thisMonth == month && thisYear == year ? true : false) : true)) + "</td>";
    }
    wkd = date.getDay() + 1;
    for (let d = day + 1; d <= new Date(thisYear, thisMonth + 1, 0).getDate() && d <= 31; d++) {
        dcard = getDays(d, thisMonth, thisYear);
        if (dcard[0] != undefined) {
            html += "<td>" + createDay(dcard[0].id, dcard[0].img, dcard[0].title, dcard[0].description.description, d, thisMonth, thisYear, dcard[0].description.color, dcard[0].description.bgcolor, dcard.length) + "</td>";
        } else {
            html += "<td>" + createDay(0, "", "", "", d, thisMonth, thisYear, "#00000090", "#00000030") + "</td>";
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

ClientEvents.emit("SendSocket", "WSMK/calendario/lst", { thisMonth: new Date().getMonth(), thisYear: new Date().getFullYear() })
//ClientEvents.emit("WSMK/calendario/lst", []);