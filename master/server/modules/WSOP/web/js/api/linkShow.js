
ClientEvents.on("wsop/api/pagarme/linkgerado", (link) => {

    /**
     * create Show Page for link of pagarme
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsop_add_div menu_dragger");
    div.setAttribute("id", "WSOP_pagarme_link");

    console.log(link)

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_WSOP_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'WSOP_pagarme_link')>&#9776;</td><td class='wsop_edt_closebtn'><p class='wsop_add_closeButton' onclick=ClientEvents.emit(\"close_menu\",'WSOP_pagarme_link')>X</p></td></tr>" +

        "<tr><td class='wsop_edt_label'>Link Gerado:</td><td><input type='text' value='" + link.url + "'></td></tr>" +

        "</table>";

    document.body.appendChild(div);
});


ClientEvents.on("wsop/api/pagarme/list", (data) => {
    ClientEvents.emit("close_menu", 'wsop_history_payment_div')

    function GetTypeName(type) {
        let types = {
            newLinkPayment: "Novo Link",
            recivedPayment: "Ordem de pagamento",
        }
        return types[type] || type
    }

    function getInfo(status) {
        if (status.type == "newLinkPayment") {
            return status.data.url
        }
        if (status.type == "recivedPayment") {
            return (status.data.status == "paid" ? "Pago" : "Pendente")
        }
        return "-"
    }

    function getColor(status) {
        if (status.type == "newLinkPayment") {
            return "#000080"
        }
        if (status.type == "recivedPayment") {
            return (status.data.status == "paid" ? "#008000" : "#ff6000")
        }
        return "-"
    }

    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsop_add_div menu_dragger");
    div.setAttribute("id", "wsop_history_payment_div");

    let htm = "";
    try {
        data.payment = JSON.parse(data.payment);
    } catch (err) {
        console.log(err);
    }
    console.log(data);
    if (data.payment != undefined) {
        if (data.payment.length >= 0) {
            data.payment.forEach((status, index) => {
                htm += "<tr class='wsop_hist_data'><td>" + GetTypeName(status.type) + "</td>" +
                    "<td><center>" + formatTime(status.timestamp) + "</td>" +
                    "<td><center>" + getInfo(status) + "</td>" +
                    "<td><center> R$ " + (parseFloat(status.data.amount) / 100).toFixed(2) + "</td></tr>";

                if (status.payment != undefined) {
                    if (status.payment.length >= 0) {
                        htm += "<tr class='wsop_hist_data'><td colspan=4><table style='width:100%;margin-bottom: 20px;' class='wsop_hist_table'>";
                        status.payment.forEach((order, index) => {
                            htm += "<tr class='wsop_hist_data'><td style='Background:#000080'>" + GetTypeName(order.type) + "</td>" +
                                "<td><center>" + formatTime(order.timestamp) + "</td>" +
                                "<td style='background:" + getColor(order) + "'><center>" + getInfo(order) + "</td>" +
                                "<td><center> R$ " + (parseFloat(order.data.amount) / 100).toFixed(2) + "</td></tr>";
                        });
                        htm += "</table></td></tr>";
                    }
                }
            });
        }
    }

    ClientEvents.clear("wsop/api/pagarme/refreshpayment")
    ClientEvents.on("wsop/api/pagarme/refreshpayment", () => {
        ClientEvents.emit("SendSocket", "WSOP/api/pagarme/refreshpayment", data);
    })

    ClientEvents.on("system/reloaded/os", () => {
        ClientEvents.emit("system_mess", { status: "OK", mess: "Recarregado com Exito", time: 1000 });
        ClientEvents.emit("SendSocket", "wsop/os/lst");
        ClientEvents.emit("close_menu")
    });

    div.innerHTML = "" +
        "<table>" +
        "<tr class='menu_header'><td id='move_menu_wsop_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsop_history_payment_div')>&#9776;</td><td class='wsop_edt_label'><p class='wsop_add_closeButton' onclick=ClientEvents.emit(\"close_menu\",'wsop_history_payment_div')>X</p></td></tr>" +
        "<tr><td class='wsop_edt_label'>ID OS:</td><td><input type='text' disabled value='" + data.id + "'></td></tr>" +
        "<tr><td colspan=3></br></td></tr>" +
        "<tr><td colspan =2><table  class='wsop_hist_table'>" +
        "<tr class='wsop_hist_label'>" +
        "<td>Tipo</td>" +
        "<td>Data</td>" +
        "<td>Info</td>" +
        "<td>Valor</td>" +
        htm +
        "</table></td></tr>" +

        "<tr><td><input id='WSOP_submit' value='Recarregar' type='button' onclick=ClientEvents.emit(\"wsop/api/pagarme/refreshpayment\")></td></tr>" +
        "</table>";
    document.body.appendChild(div);
});

