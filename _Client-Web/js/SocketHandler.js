
/**
 * Instancia da conexão socket
 */
let ServerSocketConnection = null;

/**
 * Chave de Handshake para acesso ao servidor
 */
let ServerSocketHandshake = null;

/**
 * Realiza o envio de dados via Socket 
 * @param {String} key Chave de listener do servidor
 * @param  {...any} message Conjunto de Variaveis para envio por emit
 */
function SocketEmit(key, ...message) {
    if (ServerSocketConnection != null) {
        ServerSocketConnection.emit(key, ...message);
    } else {
        console.error("Conexão Socket invalida no Emit:", key);
    }
}

function SocketHandler_Initialization() {
    return new Promise((resolv, reject) => {
        loadJS('/js/libs/socketio.min.js', () => {

            //console.log('Iniciando Conexão com o servidor via Socket', ServerSocketHandshake);
            const socket = io("/");
            socket.on("connect", () => {
                resolv();
                socket.emit('load.login');
                ServerSocketConnection = socket;
            });

            socket.on("disconnect", () => {
                //console.log(socket.id); // undefined
                ServerSocketConnection = null;
                //Tenta reconectar em caso de desconexão

                SocketHandler_Initialization().then().catch();
            });
        }, document.head);
    })
}


/**
 * Seta o Cookie na pagina
 * @param {String} cname Nome do Cookie
 * @param {String} cvalue Valor do cookie
 * @param {Integer} exdays Tempo para expirar em dias
 */
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
