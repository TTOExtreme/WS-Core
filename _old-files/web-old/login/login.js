function login_init() {
    let htm = "<table id='loginholder' class='login'>";
    htm += "<tr><td><center><div class='input_holder'><input class='input_' id='login_user' placeholder='Usuário'></td></tr>";
    htm += "<tr><td><center><div class='input_holder'><input class='input_' id='login_pass' type='password' placeholder='Senha'></td></tr>";
    htm += "<tr><td><center><input type='button' onclick='Login()' value='Entrar'></td></tr>";
    htm += "<tr><td><center><p id='loginInfo' class='loginInfo'></p></td></tr>";
    htm += "</table></td></tr><tr>";

    let loginDiv = document.createElement("div")
    loginDiv.setAttribute("class", "login_holder");
    loginDiv.setAttribute("id", "login_holder");
    loginDiv.innerHTML = htm;
    loginDiv.addEventListener("keyup", loginEnter);

    document.getElementById("body").appendChild(loginDiv);
}

function Login() {
    if (document.getElementById("login_user") != undefined &&
        document.getElementById("login_pass") != undefined) {

        if (document.getElementById("login_user").value != "" &&
            document.getElementById("login_pass").value != "") {
            indb.login.user = document.getElementById("login_user").value;
            indb.login.pass = sha512(document.getElementById("login_pass").value);

            connectSocket();
        }
    }
}

function loginEnter(e) {
    var key = e.which || e.keyCode;
    if (key == 13) {
        Login();
    }
}

function loginMess(data) {
    if (document.getElementById("loginInfo") != undefined) {
        document.getElementById("loginInfo").innerHTML = data;
        document.getElementById("loginInfo").style.opacity = 1;
        setTimeout(() => {
            if (document.getElementById("loginInfo") != undefined) {
                document.getElementById("loginInfo").style.opacity = 0;
            }
        }, 2000);
    }
}

function login_out() {
    var loginDiv = document.getElementById("login_holder")
    loginDiv.style.opacity = 0;
    loginDiv.style.top = "-100vh";
}

function login_in() {
    setTimeout(() => {
        var loginDiv = document.getElementById("login_holder")
        loginDiv.style.opacity = 1;
        loginDiv.style.top = "30vh";
        stopLoader();
    }, 300);
}

function logout() {
    ck_kill();
    window.location.reload();
}