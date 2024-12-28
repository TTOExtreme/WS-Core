import Module_Class from "../Modulo_Class.mjs";


export default class Module_Exemple extends Module_Class {


    /**
     * Execução de codigos para edição de dados padroes da superclasse
     */
    PreinitClass() {
        this._module_name = "Exemple";
    }

    /**
     * Calls de inicialização de modulos
     * realizar o cadastro de eventos do modulo nesse estagio
     * @param {Socket} socket_connection 
     * @param {String} client_hashsalt 
     * @param {SocketServe} SocketServe 
     */
    InitModuleEvents(socket_connection, client_hashsalt, SocketServe) {
        SocketServe.addUniqueListener('Module.' + this._module_name + '.Promisse', client_hashsalt, (resolv) => {
            this._events.emit("Log.info", "Recebido Promisse")
            resolv("Retorno de callback")
            //socket_connection.emit('Module.' + this._module_name + '.Pong');
        })
    }
}