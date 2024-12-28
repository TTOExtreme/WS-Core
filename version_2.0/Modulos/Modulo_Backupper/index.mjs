import Permissao_Group from "../../_Server-Core/Database/Manipulators/Permissions/Permissao_Group.mjs";
import Permissao_User from "../../_Server-Core/Database/Manipulators/Permissions/Permissao_User.mjs";
import Users from "../../_Server-Core/Database/Manipulators/Users/Users.mjs";
import Module_Class from "../Modulo_Class.mjs";
import BackupperConfig from "./Database/Backupper_Config.js";
import BackupperTipos from "./Database/Backupper_Tipos.js";


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
        this.Users = new Users(this._db, this._events);

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

        this.Users.Permissions_Get_Specific(client_instance.UUID, "permissao/modulos/install").then(() => {
            socket_connection.on('Modulo.Backupper.Install', (callback) => {
                this.Install().then(() => {
                    callback(null, "Instalado com sucesso");
                }).catch((err) => {
                    callback(err, "Erro na instalação do modulo");
                })
            })
        }).catch((err) => { })
        this.InitModuleEvents(socket_connection, client_instance, SocketServe);
    }

    /**
     * Calls de inicialização de modulos
     * realizar o cadastro de eventos do modulo nesse estagio
     * @param {Socket} socket_connection 
     * @param {JSOn} client_instance 
     * @param {SocketServe} SocketServe 
     */
    InitModuleEvents(socket_connection, client_instance, SocketServe) {
        this.BackupperDB = new BackupperConfig(this._db, this._events);
        this.BackupperDB.InitModuleEvents(socket_connection, client_instance, SocketServe);

        this.BackupperTipos = new BackupperTipos(this._db, this._events);
        this.BackupperTipos.InitModuleEvents(socket_connection, client_instance, SocketServe);
    }

    Install() {
        return new Promise((resolv, reject) => {
            this._events.emit('Log.system', "Instalando Modulo Backupper");
            let Backupperdb = new BackupperConfig(this._db, this._events)
            let permUser = new Permissao_User(this._db, this._events);
            let permGroup = new Permissao_Group(this._db, this._events);
            this._events.emit('Log.info', " - Modulo Backupper adicionando Permissoes");
            Backupperdb._createPermissions().then((Lista_Permissoes) => {
                Lista_Permissoes.forEach(perm => {
                    permUser.Add_Perm_Username(perm.permissao, "Admin", true, true).then().catch();
                    permGroup.Permissao_Add_Group(1, perm.permissao, "1.0.0.0", true, true).then().catch();
                })
                this._events.emit('Log.info', " - Modulo Backupper Criando Tabela Modulo_Backupper_Config");
                Backupperdb._createTable().then(() => {
                    let Backuppertipos = new BackupperTipos(this._db, this._events)
                    this._events.emit('Log.info', " - Modulo Backupper Criando Tabela Modulo_Backupper_Tipo");
                    Backuppertipos._createTable().then(() => {
                        this._events.emit('Log.info', " - Modulo Backupper instalado Com sucesso");
                        resolv(null, "instalado Com sucesso");
                    }).catch(reject);
                }).catch(reject);
            }).catch(reject);

        })
    }
}