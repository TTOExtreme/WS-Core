import { Socket } from "socket.io";
import DatabaseStructure from "../../../_Server-Core/Database/Manipulators/DatabaseStructure.mjs";
import LogAudit from "../../../_Server-Core/Database/Manipulators/LogAudit/LogAudit.mjs";
import Users from "../../../_Server-Core/Database/Manipulators/Users/Users.mjs";
import Permissoes from "./Permissoes.js";
import Backupper_SQLs from "./Backupper_SQLs.mjs";

export default class BackupperConfig extends DatabaseStructure {
    LogDatabase = null;

    /**
     * Chamada para alteração de predefiniçoes da classe mae
     */
    PreinitClass() {
        this._tablename = "Modulo_Backupper_Config"
        this._tablestruct.email = {
            create: " VARCHAR(512)",
            descricao: "Email a ser usado para envio de relatório",
            viewInLog: true
        }
        this._tablestruct.nome = {
            create: " VARCHAR(512)",
            descricao: "Nome visual do Backup",
            viewInLog: true
        }
        this._tablestruct.descricao = {
            create: " TEXT",
            descricao: "Descrição do Backup a ser usado",
            viewInLog: false
        }
        this._tablestruct.preferences = {
            create: " MEDIUMTEXT",
            descricao: "JSON contendo todas as preferencias do Backup/Configs",
            viewInLog: true
        }
        this._tablestruct.salvar_log = {
            create: " INT(1) DEFAULT 0",
            descricao: "",
            viewInLog: true
        }
        this._tablestruct.ultima_execução = {
            create: " TIMESTAMP",
            descricao: "Data do ultimo login",
            viewInLog: true
        }
        this._tablestruct.qnt_execucoes = {
            create: " BIGINT",
            descricao: "Quantidade de execuções",
            viewInLog: true
        }
        this._tablestruct.proximo_restart = {
            create: " TIMESTAMP",
            descricao: "Data do proximo restart",
            viewInLog: true
        }
        this._tablestruct.tempo_restart = {
            create: " BIGINT",
            descricao: "Tempo entre restarts",
            viewInLog: true
        }
        this._tablestruct.crontab = {
            create: " TEXT",
            descricao: "Configuração do Cron",
            viewInLog: true
        }

        this._table_permisao = Permissoes.PermissionsList;
        this.LogDatabase = new LogAudit(this._db, this._events);
    }

    /**
     * Calls de inicialização de modulos
     * realizar o cadastro de eventos do modulo nesse estagio
     * @param {Socket} socket_connection 
     * @param {JSOn} client_instance 
     * @param {SocketServe} SocketServe 
     */
    InitModuleEvents(socket_connection, client_instance, SocketServe) {
        this._events.emit("Log.info", "Inicializando Socket Modulo_Backupper_Config");
        this.User = new Users(this._db, this._events);

        this.User.Permissions_Get_Specific(client_instance.UUID, "modulo/backupper/list").then(() => {
            socket_connection.on('Backupper.List', (...args) => { this.List(client_instance, ...args) });
        }).catch((err) => { })
        this.User.Permissions_Get_Specific(client_instance.UUID, "modulo/backupper/add").then(() => {
            socket_connection.on('Backupper.Add', (...args) => { this.Add(client_instance, ...args) });
        }).catch((err) => { })
        this.User.Permissions_Get_Specific(client_instance.UUID, "modulo/backupper/edit").then(() => {

        }).catch((err) => { })
        this.User.Permissions_Get_Specific(client_instance.UUID, "modulo/backupper/delete").then(() => {

        }).catch((err) => { })
        this.User.Permissions_Get_Specific(client_instance.UUID, "modulo/backupper/active").then(() => {

        }).catch((err) => { })
    }

    /**
     * Realiza a listagem de Backups a ser realizado
     * @param {JSON} client_instance 
     * @param {Function} callback 
     */
    List(client_instance, callback) {
        if (client_instance.UUID != undefined) {
            this.User.Permissions_Get_Specific(client_instance.UUID, "modulo/backupper/list").then(() => {
                if (this.LogDatabase == null) { this.LogDatabase = new LogAudit(this._db, this._events); }
                this._db.Query(Backupper_SQLs.sql_list_backupper_config).then((results, err) => {
                    if (err) {
                        this._events.emit("Log.erros", "Erros encontrados no List_Backupper_Config: " + UUID, err);
                        throw "Erros encontrados ao tentar executar Select do List_Backupper_Config: " + UUID;
                    }
                    if (results[0] != undefined) {
                        this.LogDatabase.LogDatabase(client_instance.ID, "Backupper.List", { UUID: client_instance.UUID, ID_Responsavel: client_instance.ID }, this.LogDatabase.EstadoLog.SUCESSO).then().catch();
                        callback(null, results[0]);
                    }
                }).catch(err => {
                    callback(err, null)
                })
            }).catch(err => {
                this._events.emit('Log.error', "Tentativa de acesso Invalida: Backupper_List UUID: " + (client_instance.UUID).toString(), err)
                callback("Acesso Negado", null);
            })
        } else {
            this._events.emit('Log.error', 'UUID Invalido: UUID: ' + (client_instance.UUID).toString())
            callback("Erro UUID Invalido", null);
        }
    }
    /**
     * Realiza a listagem de Backups a ser realizado
     * @param {JSON} client_instance 
     * @param {Function} callback 
     */
    Add(client_instance, dados, callback) {
        if (client_instance.UUID != undefined) {
            if (dados.nome != undefined &&
                dados.descricao != undefined &&
                dados.preferences != undefined &&
                dados.tempo_restart != undefined &&
                dados.crontab != undefined &&
                dados.ativo != undefined &&
                dados.salvar_log != undefined
            ) {
                this.User.Permissions_Get_Specific(client_instance.UUID, "modulo/backupper/add").then(() => {
                    if (this.LogDatabase == null) { this.LogDatabase = new LogAudit(this._db, this._events); }
                    this._db.Query(Backupper_SQLs.sql_add_backupper_config, [
                        client_instance.ID,
                        dados.nome,
                        dados.email,
                        dados.descricao,
                        dados.preferences,
                        dados.tempo_restart,
                        dados.crontab,
                        dados.salvar_log,
                        dados.ativo
                    ]).then((results, err) => {
                        if (err) {
                            this._events.emit("Log.erros", "Erros encontrados no Add_Backupper_Config: " + UUID, err);
                            throw "Erros encontrados ao tentar executar Select do Add_Backupper_Config: " + UUID;
                        }
                        if (results[0] != undefined) {
                            this.LogDatabase.LogDatabase(client_instance.ID, "Backupper.Add", { UUID: client_instance.UUID, ID_Responsavel: client_instance.ID }, this.LogDatabase.EstadoLog.SUCESSO).then().catch();
                            callback(null, results[0]);
                        }
                    }).catch(err => {
                        callback(err, null)
                    })
                }).catch(err => {
                    this._events.emit('Log.error', "Tentativa de acesso Invalida: Backupper_List UUID: " + (client_instance.UUID).toString(), err)
                    callback("Acesso Negado", null);
                })
            } else {
                this._events.emit('Log.error', 'Dados Invalidos: Backupper Add', dados);
                callback("Erro Dados Invalidos", null);
            }
        } else {
            this._events.emit('Log.error', 'UUID Invalido: UUID: ' + (client_instance.UUID).toString())
            callback("Erro UUID Invalido", null);
        }
    }
}
