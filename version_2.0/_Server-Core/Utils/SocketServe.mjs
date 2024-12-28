import { EventEmitter } from "events";
import { Server, Socket } from "socket.io";
import BCypher from "./BCypher_2.0.mjs";
import fs from "fs";
import NavBarStructure from "../Database/Manipulators/ServerConfig/NavBarStructure.mjs";
import User from "../Database/Manipulators/Users/Users.mjs";

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
                socket_connection.once("Load.Home", (client_hashsalt, callback = () => { }) => {
                    if (client_hashsalt != undefined) {
                        if (client_hashsalt.length == 64) {

                            this.Users = new User(this._db, this._events);

                            this.Users.LogInUUID(client_hashsalt).then((userdata) => {

                                this._clients[client_hashsalt] = {
                                    NavBarStructure: NavBarStructure,
                                    socket_connection: socket_connection,
                                    socket_listeners: [],
                                    username: userdata.username,
                                    UUID: userdata.UUID,
                                    connected_in: new Date().getTime(),
                                    last_heartbeat: new Date().getTime(),
                                }

                                this._events.emit("Log.info", "Nova Conexão Socket: ", client_hashsalt);
                                this._events.emit("Log.info", "N Sockets Conectados: ", Object.keys(this._clients).length);


                                this.LoadFullCoreMods(client_hashsalt);
                                socket_connection.emit('_hs', client_hashsalt);
                                if (typeof (callback) == 'function') { callback(); }
                                /**
                                 * Realiza a exclusao da conexãop instanciada
                                 */
                                socket_connection.on('disconnect', () => {
                                    delete this._clients[client_hashsalt];
                                    this._events.emit("Log.info", "Cliente Desconectado: ", client_hashsalt);
                                    this._events.emit("Log.info", "N Sockets Conectados: ", Object.keys(this._clients).length);
                                });

                            }).catch(err => {
                                this._events.emit("Log.info", "Cliente Sem UUID ou UUID Invalido: ", client_hashsalt);
                            })
                        } else {
                            this._events.emit("Log.info", "Cliente Sem UUID ou UUID Invalido: ", client_hashsalt);
                        }
                        return;
                    }
                })
                socket_connection.once("load.login", () => {
                    let client_hashsalt = new BCypher().generateString();
                    this._clients[client_hashsalt] = {
                        NavBarStructure: NavBarStructure,
                        socket_connection: socket_connection,
                        socket_listeners: [],
                        username: "",
                        UUID: "",
                        connected_in: new Date().getTime(),
                        last_heartbeat: new Date().getTime(),
                    }
                    this.LoadBasicCoreMods(client_hashsalt);
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
        //this._events.emit("Log.info", "Inicializando Core Users:", client_hashsalt);
        if (fs.existsSync('./_Server-Core/Database/Manipulators/Users/_Socket.mjs')) {
            import('../Database/Manipulators/Users/_Socket.mjs').then(moduleclass => {
                //this._events.emit("Log.info", "Core Users importado");
                const moduleinstance = new moduleclass.default(this._db, this._events);
                moduleinstance.SocketBasic(this._clients[client_hashsalt]["socket_connection"]);
                //this._events.emit("Log.info", "Core Users inicializado:", client_hashsalt);
                //this._events.emit("Log.info", "N Listenters: ", this._clients[client_hashsalt]["socket_connection"].eventNames().length);
                //this._events.emit("Log.info", "Listenters: ", this._clients[client_hashsalt]["socket_connection"].eventNames());
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
        //console.log(client_hashsalt);
        //let listcore = fs.readdirSync('./_Server-Core/Database/Manipulators/');
        let listcore = ['Users', 'Groups', 'Permissions']

        /**
         * pre inicializa os modulos
         */
        this.PreloadModulos(client_hashsalt);

        listcore.forEach(coremodule => {

            //this._events.emit("Log.info", "Inicializando Core Users:", client_hashsalt);
            if (fs.existsSync('./_Server-Core/Database/Manipulators/' + coremodule + '/_Socket.mjs')) {
                import('../Database/Manipulators/' + coremodule + '/_Socket.mjs').then(moduleclass => {
                    //this._events.emit("Log.info", "Core Users importado");
                    const moduleinstance = new moduleclass.default(this._db, this._events);
                    moduleinstance.SocketFull(this._clients[client_hashsalt]["socket_connection"], this._clients[client_hashsalt]);
                    //this._events.emit("Log.info", "Core Users inicializado:", client_hashsalt);
                    //this._events.emit("Log.info", "N Listenters: ", this._clients[client_hashsalt]["socket_connection"].eventNames().length);
                    //this._events.emit("Log.info", "Listenters: ", this._clients[client_hashsalt]["socket_connection"].eventNames());
                }).catch(err => {
                    this._events.emit("Log.erros", "Erro no import do instalador", err);
                    throw err;
                });
            } else {
                this._events.emit("Log.erros", "Core Users Nao Encontrado:", './_Server-Core/Database/Manipulators/Users/Users.mjs', client_hashsalt);
            }
        })
        /**
         * Inicializa somente se o login estiver valido
         */
        this.addUniqueListener("Module.Load", client_hashsalt, (Modulename) => {
            this.LoadModule(Modulename, client_hashsalt);
        })

        this.Users.Permissions_Get_Specific(client_hashsalt, "permissao/modulos/list").then(() => {
            this.addUniqueListener("Modulos.List", client_hashsalt, (callback) => {
                let modulos = fs.readdirSync('./Modulos/');
                let ret = [];
                modulos = modulos.filter((value) => { return (value.indexOf("Exemple") == -1 && value.indexOf(".mjs") == -1); })
                modulos.forEach(mod => {

                    ret.push({ nome: mod, instalado: 0 });
                })
                callback(null, ret);
            })
        }).catch(err => {
            this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Groups_Active UUID: " + (client_hashsalt), err)
            //callback("Acesso Negado", null);
        })
    }


    /**
     * Realiza o carregamento do Modulo na instancia do cliente
     * @param {String} Modulename 
     * @param {String} client_hashsalt
     */
    LoadModule(Modulename, client_hashsalt) {
        //this._events.emit("Log.info", "Inicializando Modulo:", Modulename, client_hashsalt);
        if (this._clients[client_hashsalt] != undefined) {
            if (fs.existsSync('./Modulos/Modulo_' + Modulename + "/index.mjs")) {
                //this._events.emit("Log.info", "Modulo importado:", Modulename);
                import('../../Modulos/Modulo_' + Modulename + "/index.mjs").then(moduleclass => {
                    //this._events.emit("Log.info", "Modulo importado:", Modulename);
                    const moduleinstance = new moduleclass.default(this._db, this._events);
                    moduleinstance.PostInit(this._clients[client_hashsalt]["socket_connection"], this._clients[client_hashsalt], this);
                    this._events.emit("Log.info", "Modulo inicializado:", Modulename, client_hashsalt);
                    //this._events.emit("Log.info", "N Listenters: ", this._clients[client_hashsalt]["socket_connection"].eventNames().length);
                    //this._events.emit("Log.info", "Listenters: ", this._clients[client_hashsalt]["socket_connection"].eventNames());
                }).catch(err => {
                    this._events.emit("Log.erros", "Erro no import do instalador", err);
                    throw err;
                });
            } else {
                this._events.emit("Log.erros", "Modulo Nao Encontrado:", './Modulos/Modulo_' + Modulename + "/index.mjs", client_hashsalt);
            }
        }
    }

    /**
     * Realiza o carregamento do Modulo na instancia do cliente
     * @param {String} Modulename 
     * @param {String} client_hashsalt
     */
    PreloadModulos(client_hashsalt) {
        //this._events.emit("Log.info", "Inicializando Modulo:", Modulename, client_hashsalt);
        let modulos = fs.readdirSync('./Modulos/');
        modulos.forEach(Modulename => {
            if (fs.existsSync("./Modulos/" + Modulename + "/index.mjs")) {
                //this._events.emit("Log.info", "Modulo importado:", Modulename);
                import("../../Modulos/" + Modulename + "/index.mjs").then(moduleclass => {
                    //this._events.emit("Log.info", "Modulo importado:", Modulename);
                    const moduleinstance = new moduleclass.default(this._db, this._events);
                    moduleinstance.PreInit(this._clients[client_hashsalt]["socket_connection"], this._clients[client_hashsalt], this);
                    this._events.emit("Log.info", "Modulo inicializado:", Modulename, client_hashsalt);
                    //this._events.emit("Log.info", "N Listenters: ", this._clients[client_hashsalt]["socket_connection"].eventNames().length);
                    //this._events.emit("Log.info", "Listenters: ", this._clients[client_hashsalt]["socket_connection"].eventNames());
                }).catch(err => {
                    this._events.emit("Log.erros", "Erro no import do instalador", err);
                    throw err;
                });
            } else {
                this._events.emit("Log.erros", "Modulo Nao Encontrado:", './Modulos/Modulo_' + Modulename + "/index.mjs", client_hashsalt);
            }
        })
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