
window.onload = () => {
    loadJS('/js/core/SocketHandler.js', () => {
        loadJS('/js/libs/BCypher_2.0.js', () => {
        }, document.head);
        SocketHandler_Initialization();
    }, document.head);
    document.getElementById("login-form").addEventListener('submit', Login);
}

function Login(event) {
    event.preventDefault();
    SocketEmit("Users.Login", document.getElementById('username').value, BCypher.SHA2(document.getElementById('password').value), (err, result) => {
        if (err) { console.log(err); return; }
        if (result != undefined) {
            setCookie('WS-Core_HS', result.UUID, 3);
            window.location.replace('/');
        }
    })
}

function Registrar() {

}

function EsqueciSenha() {

}