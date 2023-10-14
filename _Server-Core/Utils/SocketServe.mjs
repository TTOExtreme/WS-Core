import { EventEmitter } from "events";
import { Server, Socket } from "socket.io";
import BCypher from "./BCypher_2.0.mjs";

/**
 * Classe referente ao controlde de todas as conexões instanciadas do Socket
 */
export default class SocketServe {

    /**
     * Instancia do servidor Socket
     */
    _socketIO = null;

    /**
     * Instancia de eventos Globais do Servidor 
     */
    _events = null;


    /**
     * Configuraçoes sobre o servidor 
     */
    _config = null;


    /**
     * Lista de instancias de socket Conectadas / Online
     */
    _clients = {}

    /**
     * Construtor iniciando a instancia na inicialização do Servidor
     * @param {Server} SocketIO
     * @param {JSON} config  
     * @param {EventEmitter} events  
     */
    constructor(SocketIO, config, events) {
        this._socketIO = SocketIO;
        this._events = events;
        this._config = config;
    }

    /**
     * Chamada de inicialização para tratativa de conexões sockets
     */
    PostInit() {
        if (this._socketIO != null) {
            this._events.emit("Log.info", "Iniciando SocketServe")
            this._socketIO.on("connection", (socket_connection) => {

                /**
                 * Listener do inicio da troca de chaves em caso de nova conexão
                 */
                socket_connection.on("_hs", (client_hs) => {
                    let client_hashsalt = client_hs || new BCypher().generateString();
                    this._clients[client_hashsalt] = {
                        socket_connection: socket_connection,
                        username: "",
                        connected_in: new Date().getTime(),
                        last_heartbeat: new Date().getTime(),
                    }
                    this._events.emit("Log.info", "Nova Conexão Socket: ", client_hashsalt);
                    this._events.emit("Log.info", "N Sockets Conectados: ", Object.keys(this._clients).length);

                    socket_connection.emit('_hs', client_hashsalt);


                    /**
                     * TODO
                     * Instanciamento de modulos dinamico ..assim que realizado a chamada pelo cliente ao Mo
                     */
                    socket_connection.on("Module.Load", (Modulename) => {
                        this.LoadModule(Modulename, client_hashsalt);
                    })



                    /**
                     * Realiza a exclusao da conexãop instanciada
                     */
                    socket_connection.on('disconnect', () => {
                        delete this._clients[client_hashsalt];
                        this._events.emit("Log.info", "Cliente Desconectado: ", client_hashsalt);
                        this._events.emit("Log.info", "N Sockets Conectados: ", Object.keys(this._clients).length);
                    });
                })


            })
            this._socketIO.on("connectionError", (origin, targets, error) => {
                this._events.emit("Log.erros", "Erro de conexão com o Socket", origin);
                this._events.emit("Log.erros", "  -- targets", targets);
                this._events.emit("Log.erros", "  -- error", error);
            })
            this._socketIO.on("drain", (origin) => {
                this._events.emit("Log.erros", "drain Socket", origin);
            })


        } else {
            throw "Erro Servidor Socket Não Instanciado"
        }
    }

    /**
     * Realiza o carregamento do Modulo na instancia do cliente
     * @param {String} Modulename 
     * @param {String} client_hashsalt
     */
    LoadModule(Modulename, client_hashsalt) {

    }
}