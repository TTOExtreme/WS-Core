import LogAudit from "../LogAudit/LogAudit.mjs";
import NavBarStructure from "../ServerConfig/NavBarStructure.mjs";
import Permissao_Group from "./Permissao_Group.mjs";
import Permissao_User from "./Permissao_User.mjs";
import Permissao from "./Permissoes.mjs";

export default class Permissao_Socket extends Permissao {


    /**
     * Instancia de classe Permissao User
     */
    Permissao_User = null;

    /**
     * Instancia de classe Permissao Group
     */
    Permissao_Group = null;

    /**
     * Inicializa o basico de funções para login
     * @param {Socket} socket_connection 
     * @override
     */
    SocketBasic(socket_connection) {

    }

    /**
     * Inicializa o todas as funçoes de acordo com as permissoes do servidor
     * @param {Socket} socket_connection 
     * @param {JSON} client_instance Instancia dos dados do Usuário com a Conexão
     * @override
     */
    SocketFull(socket_connection, client_instance) {
        if (this.Permissao_User == null) { this.Permissao_User = new Permissao_User(this._db, this, this._events); }
        if (this.Permissao_Group == null) { this.Permissao_Group = new Permissao_Group(this._db, this, this._events); }


        this._events.on("Users.Validado", (client_instance_valido) => {
            client_instance = client_instance_valido;
            this._events.emit('Log.info', 'Loading Permissoes:', client_instance.UUID);
            /**
             * Usuário
             */
            this.Permissions_Get_Specific(client_instance.UUID, "permissao/user/list").then(() => {
                socket_connection.on('Permissao.Users.List', (...args) => { this.Socket_Permissao_Users_List(socket_connection, client_instance, ...args) });
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Permissao_Users_List UUID: " + (client_instance.UUID), err)
            })
            this.Permissions_Get_Specific(client_instance.UUID, "permissao/user/edit").then(() => {
                socket_connection.on('Permissao.Users.Edit', (...args) => { this.Socket_Permissao_Users_Edit(socket_connection, client_instance, ...args) });
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Permissao_Users_Edit UUID: " + (client_instance.UUID), err)
            })
            this.Permissions_Get_Specific(client_instance.UUID, "permissao/user/add").then(() => {
                socket_connection.on('Permissao.Users.Add', (...args) => { this.Socket_Permissao_Users_Add(socket_connection, client_instance, ...args) });
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Permissao_Users_Add UUID: " + (client_instance.UUID), err)
            })
            this.Permissions_Get_Specific(client_instance.UUID, "permissao/user/delete").then(() => {
                socket_connection.on('Permissao.Users.Delete', (...args) => { this.Socket_Permissao_Users_Delete(socket_connection, client_instance, ...args) });
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Permissao_Users_Delete UUID: " + (client_instance.UUID), err)
            })
            this.Permissions_Get_Specific(client_instance.UUID, "permissao/user/active").then(() => {
                socket_connection.on('Permissao.Users.Active', (...args) => { this.Socket_Permissao_Users_Active(socket_connection, client_instance, ...args) });
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Permissao_Users_Active UUID: " + (client_instance.UUID), err)
            })
            /**
             * Grupo
             */

            this.Permissions_Get_Specific(client_instance.UUID, "permissao/group/list").then(() => {
                socket_connection.on('Permissao.Grupo.List', (...args) => { this.Socket_Permissao_Group_List(socket_connection, client_instance, ...args) });
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Permissao_Group_List UUID: " + (client_instance.UUID), err)
                callback("Acesso Negado", null);
            })
            this.Permissions_Get_Specific(client_instance.UUID, "permissao/group/edit").then(() => {
                socket_connection.on('Permissao.Grupo.Edit', (...args) => { this.Socket_Permissao_Group_Edit(socket_connection, client_instance, ...args) });
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Permissao_Group_Edit UUID: " + (client_instance.UUID), err)
                callback("Acesso Negado", null);
            })
            this.Permissions_Get_Specific(client_instance.UUID, "permissao/group/add").then(() => {
                socket_connection.on('Permissao.Grupo.Add', (...args) => { this.Socket_Permissao_Group_Add(socket_connection, client_instance, ...args) });
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Permissao_Group_Add UUID: " + (client_instance.UUID), err)
                callback("Acesso Negado", null);
            })
            this.Permissions_Get_Specific(client_instance.UUID, "permissao/group/delete").then(() => {
                socket_connection.on('Permissao.Grupo.Delete', (...args) => { this.Socket_Permissao_Group_Delete(socket_connection, client_instance, ...args) });
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Permissao_Group_Delete UUID: " + (client_instance.UUID), err)
                callback("Acesso Negado", null);
            })
            this.Permissions_Get_Specific(client_instance.UUID, "permissao/group/active").then(() => {
                socket_connection.on('Permissao.Grupo.Active', (...args) => { this.Socket_Permissao_Group_Active(socket_connection, client_instance, ...args) });
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Permissao_Group_Active UUID: " + (client_instance.UUID), err)
                callback("Acesso Negado", null);
            })//*/

        });
    }




    /**
     * Retorna as preferencias do Usuário
     * @param {Function} callback 
     */
    Socket_Permissao_Users_List(socket_connection, client_instance, UserID, callback = (err, result) => { }) {
        if (client_instance.UUID != undefined) {
            this.Permissions_Get_Specific(client_instance.UUID, "permissao/user/list").then(() => {
                this.Permissions_User_List(client_instance.ID, UserID).then((Users) => {
                    callback(null, Users[0]);
                }).catch(err => {
                    this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Permissao_Users_List UUID: " + (client_instance.UUID).toString(), err)
                    callback("Acesso Negado", null);
                })
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Permissao_Users_List UUID: " + (client_instance.UUID).toString(), err)
                callback("Acesso Negado", null);
            })
        } else {
            this._events.emit('Log.error', 'UUID Invalido: UUID: ' + (client_instance.UUID).toString())
            callback("Erro UUID Invalido", null);
        }
    }

    /**
     * Retorna as preferencias do Usuário
     * @param {Function} callback 
     * @param {JSON} UserData Dados do Usuario a ser realizado a operação
     */
    Socket_Permissao_Users_Delete(socket_connection, client_instance, UserData, callback = (err, result) => { }) {
        if (client_instance.UUID != undefined) {
            this.Permissions_Get_Specific(client_instance.UUID, "permissao/user/delete").then(() => {
                this.Permissao_User.Delete_Perm_User(client_instance.ID, UserData.id, UserData.user_id, UserData.excluido).then(() => {
                    callback(null, "Excluido");
                }).catch(err => {
                    this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Permissao_Users_Delete UUID: " + client_instance.UUID, err)
                    callback("Acesso Negado", null);
                })
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Permissao_Users_Delete UUID: " + client_instance.UUID, err)
                callback("Acesso Negado", null);
            })
        } else {
            this._events.emit('Log.error', 'UUID Invalido: UUID: ' + (client_instance.UUID).toString())
            callback("Erro UUID Invalido", null);
        }
    }

    /**
     * Retorna as preferencias do Usuário
     * @param {Function} callback 
     * @param {JSON} UserData Dados do Usuario a ser realizado a operação
     */
    Socket_Permissao_Users_Active(socket_connection, client_instance, UserData, callback = (err, result) => { }) {
        if (client_instance.UUID != undefined) {
            this.Permissions_Get_Specific(client_instance.UUID, "permissao/user/active").then(() => {
                this.Permissao_User.Active_Perm_User(client_instance.ID, UserData.id, UserData.user_id, UserData.ativo).then((Users) => {
                    callback(null, "Alterado estado do Usuário");
                }).catch(err => {
                    this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Permissao_Users_Delete UUID: " + client_instance.UUID, err)
                    callback("Acesso Negado", null);
                })
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Permissao_Users_Delete UUID: " + client_instance.UUID, err)
                callback("Acesso Negado", null);
            })
        } else {
            this._events.emit('Log.error', 'UUID Invalido: UUID: ' + (client_instance.UUID).toString())
            callback("Erro UUID Invalido", null);
        }
    }

    /**
     * 
     * @param {Socket} socket_connection 
     * @param {JSON} client_instance 
     * @param {JSON} UserData Dados do Usuario a ser realizado a operação
     * @param {Function} callback 
     */
    Socket_Permissao_Users_Edit(socket_connection, client_instance, UserData, callback = (err, result) => { }) {
        if (client_instance.UUID != undefined) {
            this.Permissions_Get_Specific(client_instance.UUID, "permissao/user/edit").then(() => {
                this.Permissao_User.Edit_Perm_User(client_instance.ID, UserData.perm_id, UserData.user_id, UserData.ativo, UserData.tipo).then(() => {
                    callback(null, 'OK');
                }).catch(err => {
                    this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Permissao_Users_Edit UUID: " + (client_instance.UUID).toString(), err)
                    callback("Acesso Negado", null);
                })
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Permissao_Users_Edit UUID: " + (client_instance.UUID).toString(), err)
                callback("Acesso Negado", null);
            })
        } else {
            this._events.emit('Log.error', 'UUID Invalido: UUID: ' + (client_instance.UUID).toString())
            callback("Erro UUID Invalido", null);
        }
    }


    /**
     * Realiza a criação de um novo usuário
     * @param {Socket} socket_connection 
     * @param {JSON} client_instance 
     * @param {JSON} UserData Dados do Usuario a ser realizado a operação
     * @param {Function} callback 
     */
    Socket_Permissao_Users_Add(socket_connection, client_instance, UserData, callback = (err, result) => { }) {
        if (client_instance.UUID != undefined) {
            this.Permissions_Get_Specific(client_instance.UUID, "permissao/user/add").then(() => {

                this.Permissao_User.Add_Perm_User(client_instance.ID, UserData.perm_id, UserData.user_id, UserData.ativo, UserData.tipo).then((Users) => {
                    callback(null, Users);
                }).catch(err => {
                    this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Permissao_Users_Add UUID: " + (client_instance.UUID).toString(), err)
                    callback("Acesso Negado", null);
                })
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Permissao_Users_Add UUID: " + (client_instance.UUID).toString(), err)
                callback("Acesso Negado", null);
            })
        } else {
            this._events.emit('Log.error', 'UUID Invalido: UUID: ' + (client_instance.UUID).toString())
            callback("Erro UUID Invalido", null);
        }
    }


    /**
     * Retorna as preferencias do Usuário
     * @param {Function} callback 
     */
    Socket_Permissao_Group_List(socket_connection, client_instance, GroupID, callback = (err, result) => { }) {
        if (client_instance.UUID != undefined) {
            this.Permissions_Get_Specific(client_instance.UUID, "permissao/user/list").then(() => {
                this.Permissao_Group.List_Perm_Group(client_instance.ID, GroupID).then((Group) => {
                    callback(null, Group);
                }).catch(err => {
                    this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Permissao_Group_List UUID: " + (client_instance.UUID).toString(), err)
                    callback("Acesso Negado", null);
                })
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Permissao_Group_List UUID: " + (client_instance.UUID).toString(), err)
                callback("Acesso Negado", null);
            })
        } else {
            this._events.emit('Log.error', 'UUID Invalido: UUID: ' + (client_instance.UUID).toString())
            callback("Erro UUID Invalido", null);
        }
    }

    /**
     * Retorna as preferencias do Usuário
     * @param {Function} callback 
     * @param {JSON} UserData Dados do Usuario a ser realizado a operação
     */
    Socket_Permissao_Group_Delete(socket_connection, client_instance, UserData, callback = (err, result) => { }) {
        if (client_instance.UUID != undefined) {
            this.Permissions_Get_Specific(client_instance.UUID, "permissao/user/delete").then(() => {
                this.Permissao_Group.Delete_Perm_Group(client_instance.ID, UserData.id, UserData.group_id, UserData.excluido).then(() => {
                    callback(null, "Excluido");
                }).catch(err => {
                    this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Permissao_Group_Delete UUID: " + client_instance.UUID, err)
                    callback("Acesso Negado", null);
                })
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Permissao_Group_Delete UUID: " + client_instance.UUID, err)
                callback("Acesso Negado", null);
            })
        } else {
            this._events.emit('Log.error', 'UUID Invalido: UUID: ' + (client_instance.UUID).toString())
            callback("Erro UUID Invalido", null);
        }
    }

    /**
     * Retorna as preferencias do Usuário
     * @param {Function} callback 
     * @param {JSON} UserData Dados do Usuario a ser realizado a operação
     */
    Socket_Permissao_Group_Active(socket_connection, client_instance, UserData, callback = (err, result) => { }) {
        if (client_instance.UUID != undefined) {
            this.Permissions_Get_Specific(client_instance.UUID, "permissao/user/active").then(() => {
                this.Permissao_Group.Active_Perm_Group(client_instance.ID, UserData.id, UserData.group_id, UserData.ativo).then((Group) => {
                    callback(null, "Alterado estado do Usuário");
                }).catch(err => {
                    this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Permissao_Group_Delete UUID: " + client_instance.UUID, err)
                    callback("Acesso Negado", null);
                })
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Permissao_Group_Delete UUID: " + client_instance.UUID, err)
                callback("Acesso Negado", null);
            })
        } else {
            this._events.emit('Log.error', 'UUID Invalido: UUID: ' + (client_instance.UUID).toString())
            callback("Erro UUID Invalido", null);
        }
    }

    /**
     * 
     * @param {Socket} socket_connection 
     * @param {JSON} client_instance 
     * @param {JSON} UserData Dados do Usuario a ser realizado a operação
     * @param {Function} callback 
     */
    Socket_Permissao_Group_Edit(socket_connection, client_instance, UserData, callback = (err, result) => { }) {
        if (client_instance.UUID != undefined) {
            this.Permissions_Get_Specific(client_instance.UUID, "permissao/user/edit").then(() => {
                this.Permissao_Group.Edit_Perm_Group(client_instance.ID, UserData.perm_id, UserData.group_id, UserData.ativo, UserData.tipo).then(() => {
                    callback(null, 'OK');
                }).catch(err => {
                    this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Permissao_Group_Edit UUID: " + (client_instance.UUID).toString(), err)
                    callback("Acesso Negado", null);
                })
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Permissao_Group_Edit UUID: " + (client_instance.UUID).toString(), err)
                callback("Acesso Negado", null);
            })
        } else {
            this._events.emit('Log.error', 'UUID Invalido: UUID: ' + (client_instance.UUID).toString())
            callback("Erro UUID Invalido", null);
        }
    }


    /**
     * Realiza a criação de um novo usuário
     * @param {Socket} socket_connection 
     * @param {JSON} client_instance 
     * @param {JSON} UserData Dados do Usuario a ser realizado a operação
     * @param {Function} callback 
     */
    Socket_Permissao_Group_Add(socket_connection, client_instance, UserData, callback = (err, result) => { }) {
        if (client_instance.UUID != undefined) {
            this.Permissions_Get_Specific(client_instance.UUID, "permissao/user/add").then(() => {

                this.Permissao_Group.Add_Perm_Group(client_instance.ID, UserData.perm_id, UserData.user_id, UserData.ativo, UserData.tipo).then((Group) => {
                    callback(null, Group);
                }).catch(err => {
                    this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Permissao_Group_Add UUID: " + (client_instance.UUID).toString(), err)
                    callback("Acesso Negado", null);
                })
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Permissao_Group_Add UUID: " + (client_instance.UUID).toString(), err)
                callback("Acesso Negado", null);
            })
        } else {
            this._events.emit('Log.error', 'UUID Invalido: UUID: ' + (client_instance.UUID).toString())
            callback("Erro UUID Invalido", null);
        }
    }

}
