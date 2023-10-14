
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
        ServerSocketConnection.emit(key, message);
    } else {
        console.error("Conexão Socket Invalida")
    }
}

function SocketHandler_Initialization() {
    loadJS('/js/libs/socketio.min.js', () => {
        console.log('Iniciando Conexão com o servidor via Socket');
        const socket = io("/");
        socket.on("connect", () => {
            socket.on('_hs', (handshake) => {
                if (handshake != undefined) {
                    //Configura o cookie para salvar por 3 dias
                    console.log("seta cookie", handshake)
                    setCookie('WS-Core_HS', handshake, 3);
                }
            })

            ServerSocketHandshake = getCookie("WS-Core_HS");

            socket.emit('_hs', (ServerSocketHandshake));

        });
        socket.on("disconnect", () => {
            console.log(socket.id); // undefined
            ServerSocketConnection = null;
            //Tenta reconectar em caso de desconexão

            SocketHandler_Initialization();
        });
    }, document.head);
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

/**
 * Retorna o Valor de um cookie setado
 * @param {String} cname Nome do Cookie
 * @returns Valor do cookie
 */
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
