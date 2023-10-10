//import Group from "./database/Manipulators/Groups/Groups.mjs";
//import User from "./database/Manipulators/Users/Users.mjs";
//import BCypher from "./utils/BCypher_2.0.mjs";

/**
 * Modulo de instalação do sistema no banco de dados
 */
export default class Installer {

    list_tablesModules = [
        './database/Manipulators/ServerConfig/ServerConfigs.mjs'
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
                this.runNextTableInstall().then(resolv).catch(reject)
            }
        });
    }

    runNextTableInstall(index = 0) {
        return new Promise((resolv, reject) => {
            if (index < this.list_tablesModules.length) {
                import(this.list_tablesModules[index]).then(servercore => {
                    const servercoreinstance = new servercore.default(this._db, this._events);
                    servercoreinstance._createTable()
                        .then(() => {
                            this.runNextTableInstall(index + 1).then(resolv).catch(reject)
                        })
                        .catch(reject); // desnecessario, o instalador inicia apos a instancia ser criada

                }).catch(err => {
                    this._log.error("Erro no import do instalador", err);
                    throw err;
                });
            } else { resolv(); }
        });
    }


}