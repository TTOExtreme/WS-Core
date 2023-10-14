
window.onload = () => {
    console.log("loaded");
    loadJS('/js/SocketHandler.js', () => {

        /**
         * Realiza a inicialização apos Carregamento do SocketHandler
         */
        SocketHandler_Initialization();
    }, document.head);
}

function Login() {

}

function Registrar() {

}

function EsqueciSenha() {

}