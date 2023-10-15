import EventEmitter from 'events';
import { Socket } from 'socket.io';
import SocketServe from '../Utils/SocketServe.mjs';



export default class Module_Class {

    /**
     * Nome do Modulo
     */
    _module_name = "Class"

    /**
     * instancia de acesso ao Banco de dados
     */
    _db = null;

    /**
     * Instancia de acesso ao EventEmitter
     */
    _events = null;

    /**
     * Inicialização da base da estrutura do banco de dados
     * @param {mysqlPromise.Connection} db 
     * @param {EventEmitter} events 
     */
    constructor(db, events) {
        this._db = db;
        this._events = events;
        this.PreinitClass();
        this._events.emit('Log.info', "Precarregado Modulo:", this._module_name)
    }


    /**
     * Execução de codigos para edição de dados padroes da superclasse
     */
    PreinitClass() {
    }

    /**
     * Calls de inicialização de modulos
     * realizar a call para cadastro dos eventos
     * @param {Socket} socket_connection 
     * @param {String} client_hashsalt 
     * @param {SocketServe} SocketServe 
     */
    PostInit(socket_connection, client_hashsalt, SocketServe) {

        this._events.emit("Log.info", "Iniciado Modulo:", this._module_name)
        SocketServe.addUniqueListener("Module." + this._module_name, client_hashsalt, () => {
            this.InitModuleEvents(socket_connection);
        })
        SocketServe.addUniqueListener('Module.' + this._module_name + '.Ping', client_hashsalt, () => {
            this._events.emit("Log.info", "Recebido Ping")
            socket_connection.emit('Module.' + this._module_name + '.Pong');
        })
        this.InitModuleEvents(socket_connection, client_hashsalt, SocketServe);
    }

    /**
     * Calls de inicialização de modulos
     * realizar o cadastro de eventos do modulo nesse estagio
     * @param {Socket} socket_connection 
     * @param {String} client_hashsalt 
     * @param {SocketServe} SocketServe 
     */
    InitModuleEvents(socket_connection, client_hashsalt, SocketServe) {
    }
}