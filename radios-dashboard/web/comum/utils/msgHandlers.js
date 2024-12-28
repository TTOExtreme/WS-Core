
let systemMessageIndex = 0;
function system_mess(data, _cb) {
    if (data != undefined) {
        if (data.mess != undefined) {
            let tr = document.createElement("tr");
            let id = systemMessageIndex;
            systemMessageIndex++;
            tr.setAttribute("id", "systemmess_tr_" + id);
            let attr = "";
            if (data.status == "OK") {
                attr += "background-color:var(--message-bg-ok);";
            } else {
                if (data.status == "ERROR") {
                    stopLoader();
                    console.log(data);
                    data.mess = "[Erro]";
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