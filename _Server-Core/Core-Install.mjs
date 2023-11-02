//import Group from "./database/Manipulators/Groups/Groups.mjs";
//import User from "./database/Manipulators/Users/Users.mjs";
//import BCypher from "./utils/BCypher_2.0.mjs";

/**
 * Modulo de instalação do sistema no banco de dados
 */
export default class Installer {

    list_tablesModules = [
        './Database/Manipulators/ServerConfig/ServerConfigs.mjs',
        './Database/Manipulators/Users/Users.mjs',
        './Database/Manipulators/Groups/Groups.mjs',
        './Database/Manipulators/Groups/Group_User.mjs',
        './Database/Manipulators/Permissions/Permissoes.mjs',
        './Database/Manipulators/Permissions/Permissao_Group.mjs',
        './Database/Manipulators/Permissions/Permissao_User.mjs',
        './Database/Manipulators/LogAudit/LogAudit.mjs'
    ]


    // instancia do conector do banco de dados

    /**
     * Inicializa o sistema de instalação
     * @param {Class} WSCore instancia do WSCore
     * @description Usado somente para a instancia principal do sistema, não deve ser reinstanciado por outras classes
     */
    constructor(db, events) {
        this._db = db;
        this._events = events;

    }

    Install() {
        return new Promise((resolv, reject) => {
            if (this.list_tablesModules.length > 0) {
                this.runNextTableInstall().then(() => {
                    this.runNextTablePostInstall().then(() => {
                        resolv()

                    }).catch(reject)
                }).catch(reject)
            }
        });
    }

    runNextTableInstall(index = 0) {
        return new Promise((resolv, reject) => {
            if (index < this.list_tablesModules.length) {
                import(this.list_tablesModules[index]).then(servercore => {
                    this._events.emit("Log.system", "Executando instalador", this.list_tablesModules[index]);
                    const servercoreinstance = new servercore.default(this._db, this._events);
                    servercoreinstance._createTable()
                        .then(() => {
                            this.runNextTableInstall(index + 1).then(resolv).catch(reject)
                        })
                        .catch(reject); // desnecessario, o instalador inicia apos a instancia ser criada

                }).catch(err => {
                    this._events.emit("Log.erros", "Erro no import do instalador", err);
                    throw err;
                });
            } else { resolv(); }
        });
    }
    runNextTablePostInstall(index = 0) {
        return new Promise((resolv, reject) => {
            if (index < this.list_tablesModules.length) {
                import(this.list_tablesModules[index]).then(servercore => {
                    this._events.emit("Log.system", "Executando Pós Instalador", this.list_tablesModules[index]);
                    const servercoreinstance = new servercore.default(this._db, this._events);
                    servercoreinstance._Pos_CreateData()
                        .then(() => {
                            this.runNextTablePostInstall(index + 1).then(resolv).catch(reject)
                        })
                        .catch(reject); // desnecessario, o instalador inicia apos a instancia ser criada

                }).catch(err => {
                    this._events.emit("Log.erros", "Erro no import do instalador", err);
                    throw err;
                });
            } else { resolv(); }
        });
    }


}