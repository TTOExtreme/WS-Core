
ClientEvents.on("WSOP/site/qrcode", (data) => {
    window.html5QrcodeScanner = null;
    ClientEvents.emit("WSOP/site/qrcode/close");
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "opli_edt_div");
    div.setAttribute("id", "wsop_qr_view_div");


    div.innerHTML = "<table style='width:100%;'>" +
        "<tr class='menu_header'><td id='move_menu_wsop_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsop_qr_view_div')>&#9776;</td><td class='opli_edt_label'><p class='wsop_add_closeButton' onclick='ClientEvents.emit(\"WSOP/site/qrcode/close\")'>X</p></td></tr></table>" +
        "<div id='wsop_edt' class='opli_edt'>" +
        "<div id='qr-reader' style='width: 300px'></div><div id='qr-reader-results'></div>";

    document.body.appendChild(div);
    setTimeout(() => {

        let resultContainer = document.getElementById('qr-reader-results');
        let lastResult, countResults = 0;

        function onScanSuccess(qrCodeMessage) {

            if (qrCodeMessage !== lastResult) {
                ++countResults;
                lastResult = qrCodeMessage;
                resultContainer.innerHTML
                    += `<div>[${countResults}] - ${qrCodeMessage}</div>`;
            }
            if (qrCodeMessage.indexOf(data.data) > -1) {
                document.getElementById(data.id).checked = true;
                document.getElementById(data.id).onchange();
                try {
                    document.getElementsByTagName('video')[0].pause();
                    document.getElementsByTagName('video')[0].srcObject = null;
                    window.html5QrcodeScanner.html5Qrcode.stop().then(() => {
                        setTimeout(() => { ClientEvents.emit("WSOP/site/qrcode/close") }, 100);
                    }).catch((err) => {
                        console.log("error on stoping qrcode scanner")
                        console.log(err)
                    });
                    //*/
                } catch (err) {
                    console.log(err)
                }
            }
        }

        window.html5QrcodeScanner = new Html5QrcodeScanner(
            "qr-reader", { fps: 10, qrbox: 250 });
        html5QrcodeScanner.render(onScanSuccess);
    }, 500)

});

ClientEvents.on("WSOP/site/qrcode/close", () => {
    if (document.getElementById("wsop_qr_view_div")) {
        document.body.removeChild(document.getElementById("wsop_qr_view_div"));
    }
});
