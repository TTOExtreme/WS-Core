
window.onload = () => {
    //console.log("loaded");
    loadJS('/js/SocketHandler.js', () => {
        loadJS('/js/libs/BCypher_2.0.js', () => {
            //console.log("Loaded Bcypher");
        }, document.head);
        SocketHandler_Initialization();
    }, document.head);
    document.getElementById("login-form").addEventListener('submit', Login);
}

function Login(event) {
    event.preventDefault();
    SocketEmit("Users.Login", document.getElementById('username').value, BCypher.SHA2(document.getElementById('password').value), (err, result) => {
        if (err) { console.log(err); return; }
        console.log(result);
    })
}

function Registrar() {

}

function EsqueciSenha() {

}