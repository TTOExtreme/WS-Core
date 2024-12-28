
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

/**
 * Realiza a inicialização do Socket com o servidor
 * @returns {Promise}
 */
function SocketHandler_Initialization() {
    return new Promise((resolv, reject) => {
        loadJS('/js/core/EventEmitter.js', () => {
            loadJS('/js/libs/socketio.min.js', () => {

                ServerSocketHandshake = getCookie("WS-Core_HS");
                if (ServerSocketHandshake != "") {
                    //console.log('Iniciando Conexão com o servidor via Socket', ServerSocketHandshake);
                    if (ServerSocketConnection == null) {
                        let socket = io("/");
                        socket.on("connect", () => {
                            socket.once('_hs', (handshake) => {
                                if (handshake != undefined) {
                                    ServerSocketConnection = socket;
                                    _events.emit("Info.Ok", { text: "Conectado ao servidor novamente.", payload: "" })
                                }
                                setTimeout(() => {
                                    ValidSession().then(() => {
                                        resolv();
                                    });
                                }, 300);
                            })

                            socket.emit('Load.Home', (ServerSocketHandshake), () => { });
                        });

                        socket.on("disconnect", () => {
                            _events.emit("Info.Warn", { text: "Realizando reconexão com o servidor.", payload: "" })
                        });
                    } else {
                        ServerSocketConnection.once('_hs', (handshake) => {
                            setTimeout(() => {
                                ValidSession().then(() => {
                                    resolv();
                                });
                            }, 300);
                        })

                        ServerSocketConnection.emit('Load.Home', (ServerSocketHandshake), () => { });
                    }
                } else {
                    window.location.replace('/Login')
                }
            }, document.head);
        }, document.head);
    })
}

/**
 * Checa a Validade da sessão e retorna a tela de login
 */
function ValidSession() {
    return new Promise((resolv, reject) => {
        //console.log("Users.validar")
        SocketEmit("Users.Validar", getCookie("WS-Core_HS"), (err, result) => {
            if (err) {
                window.location.replace('/Login');
                console.log(err, result);
                return;
            }
            resolv();
        });
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
