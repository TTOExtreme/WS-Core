import { EventEmitter } from "events";
import { Server, Socket } from "socket.io";
import BCypher from "./BCypher_2.0.mjs";
import fs from "fs";

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
    constructor(SocketIO, config, events, db) {
        this._socketIO = SocketIO;
        this._events = events;
        this._config = config;
        this._db = db;
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
                socket_connection.once("_hs", (client_hs) => {
                    let client_hashsalt = client_hs || new BCypher().generateString();
                    this._clients[client_hashsalt] = {
                        socket_connection: socket_connection,
                        socket_listeners: [],
                        username: "",
                        connected_in: new Date().getTime(),
                        last_heartbeat: new Date().getTime(),
                    }
                    this._events.emit("Log.info", "Nova Conexão Socket: ", client_hashsalt);
                    this._events.emit("Log.info", "N Sockets Conectados: ", Object.keys(this._clients).length);

                    this.LoadBasicCoreMods(client_hashsalt);

                    socket_connection.emit('_hs', client_hashsalt);
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
     * Carrega o minimo para autenticação e validação de acesso
     * @param {String} client_hashsalt
     */
    LoadBasicCoreMods(client_hashsalt) {
        this._events.emit("Log.info", "Inicializando Core Users:", client_hashsalt);
        if (fs.existsSync('./_Server-Core/Database/Manipulators/Users/Users.mjs')) {
            import('../Database/Manipulators/Users/Users.mjs').then(moduleclass => {
                this._events.emit("Log.info", "Core Users importado");
                const moduleinstance = new moduleclass.default(this._db, this._events);
                moduleinstance.SocketBasic(this._clients[client_hashsalt]["socket_connection"]);
                this._events.emit("Log.info", "Core Users inicializado:", client_hashsalt);
                this._events.emit("Log.info", "N Listenters: ", this._clients[client_hashsalt]["socket_connection"].eventNames().length);
                this._events.emit("Log.info", "Listenters: ", this._clients[client_hashsalt]["socket_connection"].eventNames());
            }).catch(err => {
                this._events.emit("Log.erros", "Erro no import do instalador", err);
                throw err;
            });
        } else {
            this._events.emit("Log.erros", "Core Users Nao Encontrado:", './_Server-Core/Database/Manipulators/Users/Users.mjs', client_hashsalt);
        }
    }

    /**
     * Carrega o minimo para autenticação e validação de acesso
     * @param {String} client_hashsalt
     */
    LoadFullCoreMods(client_hashsalt) {

        /**
         * Inicializa somente se o login estiver valido
         */
        this.addUniqueListener("Module.Load", client_hashsalt, (Modulename) => {
            this.LoadModule(Modulename, client_hashsalt);
        })
    }


    /**
     * Realiza o carregamento do Modulo na instancia do cliente
     * @param {String} Modulename 
     * @param {String} client_hashsalt
     */
    LoadModule(Modulename, client_hashsalt) {
        this._events.emit("Log.info", "Inicializando Modulo:", Modulename, client_hashsalt);
        if (fs.existsSync('./_Server-Core/Modules/Module_' + Modulename + "/index.mjs")) {
            this._events.emit("Log.info", "Modulo importado:", Modulename);
            import('../Modules/Module_' + Modulename + "/index.mjs").then(moduleclass => {
                this._events.emit("Log.info", "Modulo importado:", Modulename);
                const moduleinstance = new moduleclass.default(this._db, this._events);
                moduleinstance.PostInit(this._clients[client_hashsalt]["socket_connection"], client_hashsalt, this);
                this._events.emit("Log.info", "Modulo inicializado:", Modulename, client_hashsalt);
                this._events.emit("Log.info", "N Listenters: ", this._clients[client_hashsalt]["socket_connection"].eventNames().length);
                this._events.emit("Log.info", "Listenters: ", this._clients[client_hashsalt]["socket_connection"].eventNames());
            }).catch(err => {
                this._events.emit("Log.erros", "Erro no import do instalador", err);
                throw err;
            });
        } else {
            this._events.emit("Log.erros", "Modulo Nao Encontrado:", './_Server-Core/Modules/Module_' + Modulename + "/index.mjs", client_hashsalt);
        }
    }

    /**
     * Retorna se o socket ja tem o listener adicionado
     * @param {String} listener_name 
     * @param {String} client_hashsalt 
     * @returns {Boolean} 
     */
    hasListeners(listener_name, client_hashsalt) {
        if (this._clients[client_hashsalt]["socket_listeners"] != undefined) {
            return (this._clients[client_hashsalt]["socket_listeners"].find((v) => { return v == listener_name; }) != undefined);
        } else {
            this._events.emit("Log.erros", "Erro ao procurar Listeners da conexão:", this._clients[client_hashsalt])
            return false;
        }
    }

    /**
     * Adiciona um listener a conexão socket
     * @param {String} listener_name 
     * @param {String} client_hashsalt 
     * @param {Function} callback 
     */
    addListener(listener_name, client_hashsalt, callback = (...args) => { }) {
        this._clients[client_hashsalt]["socket_listeners"].push(listener_name);
        this._clients[client_hashsalt]["socket_connection"].on(listener_name, callback);
    }

    /**
     * Adiciona um listener a conexão socket
     * @param {String} listener_name 
     * @param {String} client_hashsalt 
     * @param {Function} callback 
     */
    addUniqueListener(listener_name, client_hashsalt, callback = (...args) => { }) {
        this.removeListener(listener_name, client_hashsalt);
        this._clients[client_hashsalt]["socket_listeners"].push(listener_name);
        this._clients[client_hashsalt]["socket_connection"].on(listener_name, callback);
    }

    /**
     * Remove todos os listeners da conexão socket
     * @param {String} listener_name 
     * @param {String} client_hashsalt 
     */
    removeListener(listener_name, client_hashsalt) {
        if (this.hasListeners(listener_name, client_hashsalt)) {
            this._clients[client_hashsalt]["socket_listeners"] = this._clients[client_hashsalt]["socket_listeners"].filter((v) => { return v != listener_name; })
            this._clients[client_hashsalt]["socket_connection"].off(listener_name);
        }
    }

}