import Module_Class from "../Modulo_Class.mjs";
import ScripterDB from "./Database/ScripterDB.js";


export default class Module_Exemple extends Module_Class {


    /**
     * Execução de codigos para edição de dados padroes da superclasse
     */
    PreinitClass() {
        this._module_name = "Scripter";
    }
    /**
     * Calls de pre inicialização de modulos
     * realizar a call para cadastro dos dados
     * @param {Socket} socket_connection 
     * @param {JSON} client_instance 
     * @param {SocketServe} SocketServe 
     */
    PreInit(socket_connection, client_instance, SocketServe) {

        /**
         * Adiciona modulo na lista de modulos
         */
        if (client_instance.NavBarStructure != undefined) {
            client_instance.NavBarStructure["Navbar/modulos/Scripter"] = {
                title: "Scripter",
                permissao: "Navbar/modulos/Scripter",
                parent: "Módulos",
                icon: "group",
                icon_class: "material-icons",
                onclick: { type: 'open_top_NavBar', load: '/Modulos/Scripts/js/scripter.js' }
            }
        }

        socket_connection.on('Modulo.Scripter.Install', (callback) => {
            this.Install().then(() => {
                callback(null, "Instalado com sucesso");
            }).catch((err) => {
                callback(err, "Erro na instalação do modulo");
            })
        })
    }

    /**
     * Calls de inicialização de modulos
     * realizar o cadastro de eventos do modulo nesse estagio
     * @param {Socket} socket_connection 
     * @param {JSOn} client_instance 
     * @param {SocketServe} SocketServe 
     */
    InitModuleEvents(socket_connection, client_instance, SocketServe) {
        /**
         * Inicializa socket listener
         */
        socket_connection.on('Users.Validar', (UUID = null, callback = (err, result) => { }) => {

        });

        /*
        SocketServe.addUniqueListener('Module.' + this._module_name + '.Promisse', client_instance, (resolv) => {
            this._events.emit("Log.info", "Recebido Promisse")
            resolv("Retorno de callback")
            //socket_connection.emit('Module.' + this._module_name + '.Pong');
        })//*/

    }

    Install() {
        return new Promise((resolv, reject) => {

            let Scripterdb = new ScripterDB(this._db, this._events)
            Scripterdb._createTable().then(() => {
                Scripterdb._createPermissions().then(() => {
                    resolv();
                }).catch(reject);
            }).catch(reject);
        })
    }
}