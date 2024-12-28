document.addEventListener("DOMContentLoaded", function (event) {
    loadExternalFiles([
        "./js/libs/EventEmitter.min.js",
        "./js/utils/eventHandler.js",
        "./css/index.css",
        "./css/login.css",
        "./css/screen/loading.css",
        "./js/screen/loading.js",
        "./js/libs/crypto-js.js",
        "./js/libs/bcypher.js",
    ]).then(() => {
        console.log("Finished Loading");
        ClientEvents.emit("Page_Loaded");
        document.getElementById("password").addEventListener("keyup", loginEnter);
        document.getElementById("submit").onclick = function (ev) {
            //ClientEvents.emit("startLoader");
            fetch('./login/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: document.getElementById("username").value,
                    password: sha512(document.getElementById("password").value)
                }),
                credentials: 'same-origin',
            }).then(res => {
                ClientEvents.emit("stopLoader");
                if (res.redirected) {
                    window.location.href = res.url
                } else {
                    res.text().then(data => {
                        try {
                            if (!document.getElementById("login-msgbox").classList.contains("show"))
                                document.getElementById("login-msgbox").classList.toggle('show');
                            document.getElementById("login-msgbox").innerText = data;
                        } catch (err) {}
                        setTimeout(() => {
                            try {
                                if (document.getElementById("login-msgbox").classList.contains("show"))
                                    document.getElementById("login-msgbox").classList.toggle('show');
                            } catch (err) {}
                        }, 800)
                    })
                }
            }).catch(err => {})

        }

    }).catch((err) => {
        console.log("An error ocurred when loading external files\nAre you disconnected from internet?\n" + err.toString())
        setTimeout(() => {
            window.location.reload(true)
        }, 1000);
    })
})

function loginEnter(e) {
    var key = e.which || e.keyCode;
    if (key == 13) {
        document.getElementById("submit").click();
    }
}