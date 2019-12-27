function startLoader() {
    var svg = document.getElementById('loaderHolderBG')
    svg.style.opacity = 1;
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.backgroundColor = "#10101055";
    svg.style.width = "100vw";
    svg.style.height = "100vh";
    var svg = document.getElementById('loaderHolder')
    svg.style.opacity = 1;
}

function stopLoader() {
    var svg = document.getElementById('loaderHolderBG')
    svg.style.opacity = 0;
    svg.style.top = "-200px";
    svg.style.left = "calc(50vw - 50px)";
    svg.style.backgroundColor = "var(--loader-bg)";
    svg.style.width = "100px";
    svg.style.height = "100px";
    var svg = document.getElementById('loaderHolder')
    svg.style.opacity = 0;
}

function initLoader() {
    // create svg element
    var cx = 50;
    var cy = 50;
    var r = 40;
    var percent = 100;

    var icolor = "#808080f0";
    var fcolor = "#30303030";

    var svg = document.getElementById('loader')
    svg.classList.add("svg-circle");
    svg.setAttribute("data-percent", percent);
    svg.setAttribute("width", cx * 2);
    svg.setAttribute("height", cy * 2);
    svg.innerHTML = "";
    //svg.innerHTML += "<defs><conicalGradient id='loaderStroke' x1='0%' y1='0%' x2='100%' y2='0%'><stop offset='0%' stop-color='" + icolor + "' /> <stop offset='100%' stop-color='" + fcolor + "' /></defs>";
    svg.innerHTML += "<defs><linearGradient id='loaderStroke' x1='0%' y1='0%' x2='100%' y2='0%'><stop offset='0%' stop-color='" + icolor + "' /> <stop offset='100%' stop-color='" + fcolor + "' /></defs>";
    svg.innerHTML += "<circle cx='" + cx + "' cy='" + cy + "' r='" + r + "'/>";

    var rc = 2 * r * Math.PI;
    var rd = percent * rc / 100;

    svg.style.strokeDasharray = rd;
}

startLoader();
initLoader();


// percent returner

// Create a class for the element
function setSVGPercentGraph(id, height = 100, width = 100) {
    if (document.getElementById(id) == undefined) {
        setTimeout(() => {
            setSVGPercentGraph(id, height, width);
        }, 100);
        return;
    }
    var svg = document.getElementById(id);

    var cx = width / 2;
    var cy = height / 2;
    var r = ((cx > cy) ? cy : cx) - 8;
    var percent = svg.getAttribute('percent') || 30;

    var upcolor = svg.getAttribute('front-color') || "var(--perc-up)";//cor da barra superior
    var dwcolor = svg.getAttribute('back-color') || "var(--perc-dw)";

    svg.setAttribute('class', 'svg-circle');
    var rstring = new Date().getTime();

    svg.style.stroke = "url(#" + rstring + ")"

    var rc = 2 * r * Math.PI;
    var rd = percent * rc / 100;

    svg.innerHTML = "";
    //svg.innerHTML += "<defs><linearGradient id='" + rstring + "' x1='0%' y1='0%' x2='100%' y2='0%'><stop offset='0%' stop-color='" + upcolor + "' /> <stop offset='100%' stop-color='" + dwcolor + "' /></defs>";
    svg.innerHTML += "<circle cx='" + cx + "' cy='" + cy + "' r='" + r + "' style=\"stroke:" + dwcolor + "; stroke-dasharray:" + rc + " 999; stroke-width:5\" />";
    svg.innerHTML += "<circle cx='" + cx + "' cy='" + cy + "' r='" + r + "' style=\"stroke:" + upcolor + "; stroke-dasharray:" + rd + " 999; stroke-width:12\" />";
    svg.innerHTML += "<text x='0' y='0' dominant-baseline='middle' text-anchor='middle'>" + percent + "%</text>";


    //svg.style.strokeDasharray = rd;

}


function menuCancel() {
    var h = document.getElementById("sub_menu_over");
    if (h != undefined) {
        document.getElementById("sub_menu_over").style.opacity = 0;
        document.getElementById("sub_menu_over").style.top = "-100vh";
        setTimeout(() => {
            h.innerHTML = "";
        }, 1000)
    }
}
var systemMessageIndex = 0;
function system_mess(data, _cb) {
    if (data != undefined) {
        if (data.mess != undefined) {
            var tr = document.createElement("tr");
            var id = systemMessageIndex;
            systemMessageIndex++;
            tr.setAttribute("id", "systemmess_tr_" + id);
            var attr = "";
            if (data.status == "OK") {
                attr += "background-color:var(--message-bg-ok);";
            } else {
                if (data.status == "ERROR") {
                    console.log(data);
                    attr += "background-color:var(--message-bg-err);";
                } else {
                    attr += "background-color:var(--message-bg-info);";
                }
            }
            tr.innerHTML = "<td><div id ='systemmess_div_" + id + "' class='system_message_div' style='" + attr + "'><table class='systemmess_data_table'><tr><td>" + ((data.mess.mess != undefined) ? data.mess.mess : data.mess) + "</td><td><div id='systemmess_td_" + id + "_timer'></div></td></tr></table></div></td>";
            document.getElementById("system_message_holder").appendChild(tr);
            setTimeout(function (callback) {
                document.getElementById("systemmess_div_" + id).style.opacity = 1;
                document.getElementById("systemmess_div_" + id).style.marginTop = "3px";
                if (data.countdown != undefined) {
                    system_mess_contdown(id, data.countdown, () => {
                        callback();
                    });
                } else {
                    setTimeout(function () {
                        system_mess_out(id);
                    }, (data.time != undefined) ? data.time : 1000);
                }
            }, 10, _cb, _cb);
        }
    }
}

/*
setTimeout(() => {
    system_mess({ status: "OK", mess: "Connected", time: 2500 });
    setTimeout(() => {
        system_mess({ status: "ERROR", mess: "Connected", countdown: 100, time: 1500 });
        setTimeout(() => {
            system_mess({ status: "INFO", mess: "Connected", time: 500 });
        }, 500);
    }, 500);
}, 3000);//*/

function system_mess_contdown(id, value, callback) {
    if (value > 0) {
        document.getElementById("systemmess_td_" + id + "_timer").innerHTML = "-" + value;
        setTimeout(function () {
            system_mess_contdown(id, value - 1, callback);
        }, 1000);
    } else {
        system_mess_out(id);
        if (callback != undefined) {
            callback();
        }
    }
}
function system_mess_out(id) {
    document.getElementById("systemmess_div_" + id).style.opacity = 0;
    document.getElementById("systemmess_div_" + id).style.marginTop = "-2em";
    setTimeout(() => {
        document.getElementById("system_message_holder").removeChild(document.getElementById("systemmess_tr_" + id));
    }, 1000);
}

function formatTime(data) {
    var ret = "-"
    if (data != undefined && data != "") {
        var date = new Date(parseInt(data));
        var day = "0" + date.getDate();
        var month = "0" + (date.getMonth() + 1);
        var year = date.getFullYear();
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        ret = (day.substr(-2) + '/' + month.substr(-2) + '/' + year) + "-" + (hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2));
    }
    return ret;
}