import NavBarStructure from "../ServerConfig/NavBarStructure.mjs";
import Users_SQLs from "../Users/Users_SQLs.mjs";
import Groups from './Groups.mjs'

export default class Users_Socket extends Groups {

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
        this._events.on("Users.Validado", (client_instance_valido) => {
            client_instance = client_instance_valido;
            this._events.emit('Log.info', 'Loading Groups:', client_instance.UUID);
            this.Permissions_Get_Specific(client_instance.UUID, "group/list").then(() => {
                socket_connection.on('Groups.List', (...args) => { this.Socket_Groups_List(socket_connection, client_instance, ...args) });
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Groups_List UUID: " + (client_instance.UUID), err)
                callback("Acesso Negado", null);
            })
            this.Permissions_Get_Specific(client_instance.UUID, "group/edit").then(() => {
                socket_connection.on('Groups.Edit', (...args) => { this.Socket_Groups_Edit(socket_connection, client_instance, ...args) });
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Groups_Edit UUID: " + (client_instance.UUID), err)
                callback("Acesso Negado", null);
            })
            this.Permissions_Get_Specific(client_instance.UUID, "group/add").then(() => {
                socket_connection.on('Groups.Add', (...args) => { this.Socket_Groups_Add(socket_connection, client_instance, ...args) });
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Groups_Add UUID: " + (client_instance.UUID), err)
                callback("Acesso Negado", null);
            })
            this.Permissions_Get_Specific(client_instance.UUID, "group/delete").then(() => {
                socket_connection.on('Groups.Delete', (...args) => { this.Socket_Groups_Delete(socket_connection, client_instance, ...args) });
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Groups_Delete UUID: " + (client_instance.UUID), err)
                callback("Acesso Negado", null);
            })
            this.Permissions_Get_Specific(client_instance.UUID, "group/active").then(() => {
                socket_connection.on('Groups.Active', (...args) => { this.Socket_Groups_Active(socket_connection, client_instance, ...args) });
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Groups_Active UUID: " + (client_instance.UUID), err)
                callback("Acesso Negado", null);
            })
        })
    }


    /**
     * Retorna as preferencias do Usuário
     * @param {Function} callback 
     */
    Socket_Groups_List(socket_connection, client_instance, callback = (err, result) => { }) {
        if (client_instance.UUID != undefined) {
            this.Permissions_Get_Specific(client_instance.UUID, "group/list").then(() => {
                this.Groups_List(client_instance.ID).then((Groups) => {
                    callback(null, Groups[0]);
                }).catch(err => {
                    this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Groups_List UUID: " + (client_instance.UUID).toString(), err)
                    callback("Acesso Negado", null);
                })
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Groups_List UUID: " + (client_instance.UUID).toString(), err)
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
    Socket_Groups_Delete(socket_connection, client_instance, UserData, callback = (err, result) => { }) {
        if (client_instance.UUID != undefined) {
            this.Permissions_Get_Specific(client_instance.UUID, "group/delete").then(() => {
                this.Groups_Delete(client_instance.ID, UserData.id).then(() => {
                    callback(null, "Excluido");
                }).catch(err => {
                    this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Groups_Delete UUID: " + client_instance.UUID, err)
                    callback("Acesso Negado", null);
                })
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Groups_Delete UUID: " + client_instance.UUID, err)
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
    Socket_Groups_Active(socket_connection, client_instance, UserData, callback = (err, result) => { }) {
        if (client_instance.UUID != undefined) {
            this.Permissions_Get_Specific(client_instance.UUID, "group/active").then(() => {
                this.Groups_Disable(client_instance.ID, UserData.id, UserData.ativo).then((Users) => {
                    callback(null, "Alterado estado do Usuário");
                }).catch(err => {
                    this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Groups_Delete UUID: " + client_instance.UUID, err)
                    callback("Acesso Negado", null);
                })
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Groups_Delete UUID: " + client_instance.UUID, err)
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
    Socket_Groups_Edit(socket_connection, client_instance, GroupData, callback = (err, result) => { }) {
        if (client_instance.UUID != undefined) {
            this.Permissions_Get_Specific(client_instance.UUID, "group/edit").then(() => {
                this.Groups_Edit(client_instance.ID, GroupData.id, GroupData.nome, GroupData.code, GroupData.descricao, GroupData.ativo).then(() => {
                    callback(null, "Editado");
                }).catch(err => {
                    this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Groups_Edit UUID: " + (client_instance.UUID).toString(), err)
                    callback("Acesso Negado", null);
                })
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Groups_Edit UUID: " + (client_instance.UUID).toString(), err)
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
    Socket_Groups_Add(socket_connection, client_instance, UserData, callback = (err, result) => { }) {
        if (client_instance.UUID != undefined) {
            this.Permissions_Get_Specific(client_instance.UUID, "group/add").then(() => {
                this.Groups_Add(client_instance.ID, UserData.nome, UserData.code, UserData.descricao, UserData.ativo).then(() => {
                    callback(null, "Criado com sucesso");
                }).catch(err => {
                    this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Groups_Add UUID: " + (client_instance.UUID).toString(), err)
                    callback("Acesso Negado", null);
                })
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Socket_Groups_Add UUID: " + (client_instance.UUID).toString(), err)
                callback("Acesso Negado", null);
            })
        } else {
            this._events.emit('Log.error', 'UUID Invalido: UUID: ' + (client_instance.UUID).toString())
            callback("Erro UUID Invalido", null);
        }
    }
}
