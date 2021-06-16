ClientEvents.clearAll();

ClientEvents.emit("LeftMenuClose");
ClientEvents.emit("LMI-CloseAll");
ClientEvents.emit("close_menu");

ClientEvents.emit("LoadExternal", [
    "./module/WSOP/css/posvendas.css",
    "./module/WSOP/js/posvendas/edt.js",
    "./module/WSOP/js/posvendas/edtMultiples.js"
], () => { }, false)

if (window.UserList) { // usa a mesma interface global para todas as listas
    window.UserList = null;
    document.getElementById("MainScreen").innerHTML = "";
}

ClientEvents.on("wsop/posvendas/lst", (datain) => {
    let data = datain.data;
    if (datain.thisMonth == undefined) { return; }
    function createDay(id, day, month, year, color, bgcolor, qnt = 0, qntPendentes = 0, highlight = false, edt = true) {
        return "<div id='WSOP_day_card' class='WSOP_day_card' style='" +
            "background:" + bgcolor + ";" +
            "border: 1px solid " + color + ";" + (highlight ? "border:1px solid #ff0000;border-radius:0;" : "") + "'>" +
            "<span class='WSOP_day_num'>" + day + "</span>" +
            "<span class='WSOP_day_edt'>" +
            (qnt < 1 ?
                (edt ?
                    "<i onclick=ClientEvents.emit(\"SendSocket\",\"WSOP/posvendas/lstid\",\'" + JSON.stringify({ id: 0, start: new Date(year, month, day).getTime() + (6 * 3600 * 1000) }) + "') class='fa fa-plus' aria-hidden='true'></i>" : "")
                : (edt ?
                    "<i style='margin-right:10px' onclick=ClientEvents.emit(\"SendSocket\",\"WSOP/posvendas/lstid\",\'" + JSON.stringify({ id: 0, start: new Date(year, month, day).getTime() + (6 * 3600 * 1000) }) + "') class='fa fa-plus' aria-hidden='true'></i>" +
                    "<i onclick=ClientEvents.emit(\"SendSocket\",\"WSOP/posvendas/lstids\",\'" + JSON.stringify({ id: id, start: new Date(year, month, day).getTime() + (6 * 3600 * 1000) }) + "') class='fa fa-pencil' aria-hidden='true'></i>" : "")) +
            "</span><div style='margin-top:10px;width:10px;height:10px'></div>" +
            (qntPendentes >= 1 ? "<center><span class='WSOP_day_title' style='color:#000;background:#ff0000;margin-bottom:5px'>Pend.: " + (qntPendentes) + "</span></center>" : "") +
            (qnt >= 1 ? "<center><span class='WSOP_day_title'>Total: " + (qnt) + "</span></center>" : "") +
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

    let html = "<center><table class='WSOP_posvendas_table' id='WSOP_calendar'>"

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
    }

    html += "<tr><td colspan='3'>" +
        "<i onclick=ClientEvents.emit(\"SendSocket\",\"WSOP/posvendas/lst\",\'" + JSON.stringify({ thisMonth: thisMonthLast, thisYear: thisYearLast }) + "') class='fa fa-arrow-left' aria-hidden='true'></i></td>" +
        "<td>" + (thisMonth + 1) + "-" + (thisYear) + "</td>" +
        "<td colspan='3'>" +
        "<i onclick=ClientEvents.emit(\"SendSocket\",\"WSOP/posvendas/lst\",\'" + JSON.stringify({ thisMonth: thisMonthNext, thisYear: thisYearNext }) + "') class='fa fa-arrow-right' style='float:right' aria-hidden='true'></i></td>" +
        "</td><tr>"


    let wkd = 0;
    html += "<tr>";
    for (wkd = 0; wkd < new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay(); wkd++) {
        html += "<td></td>";
    }
    for (let d = 1; d < day; d++) {
        let dcard = getDays(d, thisMonth, thisYear);
        if (dcard[0] != undefined) {
            let qntPendentes = 0;
            dcard.forEach((item) => {
                if (item.description.pendente == 1) { qntPendentes++ };
            })
            html += "<td>" + createDay(dcard[0].id, d, thisMonth, thisYear, "#00000090", "#00000030", dcard.length, qntPendentes) + "</td>";
        } else {
            html += "<td>" + createDay(0, d, thisMonth, thisYear, "#00000090", "#00000030") + "</td>";
        }
        wkd++;
        if (wkd >= 7) {
            wkd = 0;
            html += "</tr><tr>";
        }
    }
    let dcard = getDays(day, thisMonth, thisYear);
    if (dcard[0] != undefined) {
        let qntPendentes = 0;
        dcard.forEach((item) => {
            if (item.description.pendente == 1) { qntPendentes++ };
        })
        html += "<td>" + createDay(dcard[0].id, day, thisMonth, thisYear, "#00000090", "#00000030", dcard.length, qntPendentes, ((thisMonth != undefined) ? (thisMonth == month && thisYear == year ? true : false) : true)) + "</td>";
    } else {
        html += "<td>" + createDay(0, day, thisMonth, thisYear, "#00000090", "#00000030", dcard.length, 0, ((thisMonth != undefined) ? (thisMonth == month && thisYear == year ? true : false) : true)) + "</td>";
    }
    wkd = date.getDay() + 1;
    for (let d = day + 1; d <= new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() && d <= 31; d++) {
        dcard = getDays(d, thisMonth, thisYear);
        if (dcard[0] != undefined) {
            let qntPendentes = 0;
            dcard.forEach((item) => {
                if (item.description.pendente == 1) { qntPendentes++ };
            })
            html += "<td>" + createDay(dcard[0].id, d, thisMonth, thisYear, "#00000090", "#00000030", dcard.length, qntPendentes) + "</td>";
        } else {
            html += "<td>" + createDay(0, d, thisMonth, thisYear, "#00000090", "#00000030") + "</td>";
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

ClientEvents.emit("SendSocket", "WSOP/posvendas/lst", { thisMonth: new Date().getMonth(), thisYear: new Date().getFullYear() });
//ClientEvents.emit("WSOP/posvendas/lst", []);