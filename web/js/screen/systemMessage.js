class SystemMess {

    systemMessageIndex = 0;

    constructor() {
        this._initSystemMess();
    }

    _system_mess_out(elem) {
        let t = elem.getElementsByTagName("div")[0]
        t.style.opacity = 0;
        t.style.marginTop = "-30px";
        setTimeout(() => {
            document.getElementById("system_message_holder").removeChild(elem);
        }, 1000);
    }

    _system_mess_contdown(id, value, callback) {
        if (value >= 0) {
            document.getElementById("systemmess_td_" + id + "_timer").innerHTML = "-" + value;
            setTimeout(() => {
                this._system_mess_contdown(id, value - 1, callback);
            }, 1000);
        } else {
            this._system_mess_out(document.getElementById("systemmess_tr_" + id));
            if (callback != undefined) {
                callback();
            }
        }
    }

    _initSystemMess() {
        ClientEvents.setCoreEvent("system_mess");
        ClientEvents.on("system_mess", (data) => {
            if (data != undefined) {
                if (data.mess != undefined) {
                    let tr = document.createElement("tr");
                    let id = this.systemMessageIndex;
                    this.systemMessageIndex++;
                    tr.setAttribute("id", "systemmess_tr_" + id);
                    let attr = "";
                    if (data.status == "OK") {
                        attr += "background-color:var(--message-bg-ok);";
                    } else {
                        if (data.status == "ERROR") {
                            ClientEvents.emit("stopLoader");
                            console.log(data);
                            data.mess = "[Erro] " + ((typeof (data.mess) != "string") ? "" : data.mess);
                            attr += "background-color:var(--message-bg-err);";
                        } else {
                            console.log(data);
                            attr += "background-color:var(--message-bg-info);";
                        }
                    }
                    tr.innerHTML = "<td><div id ='systemmess_div_" + id + "' class='system_message_div' style='" + attr + "'><table class='systemmess_data_table'><tr><td>" + ((data.mess.mess != undefined) ? data.mess.mess : data.mess) + "</td><td><div id='systemmess_td_" + id + "_timer'></div></td></tr></table></div></td>";
                    document.getElementById("system_message_holder").appendChild(tr);
                    setTimeout(() => {
                        let t = tr.getElementsByTagName("div")[0]
                        t.style.marginTop = "3px";
                        t.style.opacity = 1;
                    }, 100)

                    setTimeout(() => {
                        tr.style.opacity = 1;
                        tr.style.marginTop = "3px";
                        if (data.countdown != undefined) {
                            this._system_mess_contdown(id, data.countdown, () => {
                                if (data.callback) {
                                    data.callback();
                                }
                                console.log(data);  
                                if(data.call != undefined){
                                    ClientEvents.emit(data.call,data.data)
                                }
                            });
                        } else {
                            setTimeout(() => {
                                this._system_mess_out(tr);
                                if (data.callback) {
                                    data.callback();
                                }
                                console.log(data);  
                                if(data.call != undefined){
                                    ClientEvents.emit(data.call,data.data)
                                }
                            }, (data.time != undefined) ? data.time : 1000);
                        }
                    }, 10);
                }
            }
        });

        let div = document.createElement("div");
        div.setAttribute("id", "system_message_holder");
        div.setAttribute("class", "system_message_holder");
        div.innerHTML = "<table id='system_message' class='system_message'></table>";
        document.body.appendChild(div);
    }

}

new SystemMess();

/*
setTimeout(() => {
    ClientEvents.emit("system_mess", { status: "INFO", mess: "Teste", time: 1000, countdown: 10 })
    ClientEvents.emit("system_mess", { status: "OK", mess: "Teste", time: 2000 })
    ClientEvents.emit("system_mess", { status: "ERROR", mess: "Teste", time: 3000 })
}, 3000)
//*/