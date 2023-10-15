
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

/**
 * Realiza o cadastro de listener
 * @param {String} key Chave de listener do servidor
 * @param  {Function} callback Função a ser chamada pelo Listener
 */
function SocketListener(key, callback = (...data) => { }) {
    if (ServerSocketConnection != null) {
        ServerSocketConnection.on(key, callback)
    } else {
        console.error("Conexão Socket invalida no cadastro de Listener:", key)
    }
}

function SocketHandler_Initialization() {
    loadJS('/js/libs/socketio.min.js', () => {
        console.log('Iniciando Conexão com o servidor via Socket');
        const socket = io("/");
        socket.on("connect", () => {
            socket.once('_hs', (handshake) => {
                if (handshake != undefined) {
                    ServerSocketConnection = socket;
                    //Configura o cookie para salvar por 3 dias
                    setCookie('WS-Core_HS', handshake, 3);


                    /**Teste de Carregamento e retorno do modulo */
                    SocketEmit("Module.Load", "Exemple");
                    SocketListener("Module.Exemple.Pong", () => {
                        console.log("Modulo Exemple Carregado");
                    })
                    console.log("Enviado Ping");
                    SocketEmit('Module.Exemple.Ping');
                    //*/

                    /**Teste de Promisse enviado pelo Evento */
                    console.log("Enviado Promisse");
                    SocketEmit('Module.Exemple.Promisse', (resolv) => {
                        console.log(resolv);
                    });

                }
            })

            ServerSocketHandshake = getCookie("WS-Core_HS");

            socket.emit('_hs', (ServerSocketHandshake));

        });
        socket.on("disconnect", () => {
            //console.log(socket.id); // undefined
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
