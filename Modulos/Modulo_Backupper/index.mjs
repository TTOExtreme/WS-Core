import Permissao_Group from "../../_Server-Core/Database/Manipulators/Permissions/Permissao_Group.mjs";
import Permissao_User from "../../_Server-Core/Database/Manipulators/Permissions/Permissao_User.mjs";
import Module_Class from "../Modulo_Class.mjs";
import BackupperDB from "./Database/BackupperDB.js";


export default class Module_Exemple extends Module_Class {


    /**
     * Execução de codigos para edição de dados padroes da superclasse
     */
    PreinitClass() {
        this._module_name = "Backupper";
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
            client_instance.NavBarStructure["Navbar/modulos/Backupper"] = {
                title: "Backupper",
                permissao: "Navbar/modulos/backupper",
                parent: "Módulos",
                icon: "backup",
                icon_class: "material-icons",
                onclick: { type: 'open_top_NavBar', load: '/Modulos/Backupper/js/Backupper.js' }
            }
        }

        socket_connection.on('Modulo.Backupper.Install', (callback) => {
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

            let Backupperdb = new BackupperDB(this._db, this._events)
            Backupperdb._createTable().then(() => {
                Backupperdb._createPermissions().then((Lista_Permissoes) => {

                    let permUser = new Permissao_User(this._db, this._events);
                    let permGroup = new Permissao_Group(this._db, this._events);
                    Lista_Permissoes.forEach(perm => {
                        permUser.Add_Perm_Username(perm.permissao, "Admin", true, true).then().catch();
                        permGroup.Permissao_Add_Group(1, perm.permissao, "1.0.0.0", true, true).then().catch();
                    })

                    resolv();
                }).catch(reject);
            }).catch(reject);
        })
    }
}