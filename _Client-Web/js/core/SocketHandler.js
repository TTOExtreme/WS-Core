
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
            if (ServerSocketConnection == null) {

                //console.log('Iniciando Conexão com o servidor via Socket', ServerSocketHandshake);
                let socket = io("/");
                socket.on("connect", () => {
                    socket.emit('load.login');
                    ServerSocketConnection = socket;
                    resolv();
                });

                socket.on("disconnect", () => {
                    SocketHandler_Initialization().then().catch();
                });
            } else {
                ServerSocketConnection.emit('load.login');
                resolv();
            }
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
