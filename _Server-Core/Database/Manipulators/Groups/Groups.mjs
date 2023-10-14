//import ErrorMessages from "../../../utils/ErrorMessages.mjs";

import ErrorMessages from "../../../utils/ErrorMessages.mjs";

/**
 * Modulo de gerencia de grupos
 */
export default class Group {

    // instancia do conector do banco de dados
    db = null;

    //instancia da collection groups
    groups = null;

    //instancia de Log
    log = null;

    //instancia do usuario connectado
    group = {
        name: null,
        preferences: null,
        permissions: null,
        GUID: null,
        active: false
    }

    /**
     * Inicializa a instancia do Usuario
     * @param {Class} WSCore instancia do WSCore
     * @description Usado para cada conexão com o banco pelo usuario
     */
    constructor(WSCore) {
        if (WSCore._db == null) {
            throw "Banco de dados não conectado";
        }
        this.db = WSCore._db;
        this.log = WSCore._log;

        //inicializa a collection
        this.groups = this.db.collection('_Groups');
    }

    /**
     * Cria um usuario para acesso ao sistema
     * @param {String} name 
     * @param {Array} permissions
     * @param {JSON} preferences 
     * @param {HASH} GUID 
     * @param {Boolean} active 
     * @returns {Promise}
     */
    AddGroup(name = "",
        permissions = "",
        preferences = "",
        GUID = "",
        createdBy = "",
        active = true) {
        return new Promise((res, rej) => {
            this.groups.insertOne({
                name: name,
                permissions: permissions,
                preferences: preferences,
                GUID: GUID,
                active: active,
                createdIn: new Date().getTime(),
                createdBy: createdBy
            }).then((grp) => {
                if (grp != undefined) {
                    this.groups.findOne({ GUID: GUID })
                        .then(result => {
                            res(result);
                        }).catch(err => {
                            rej(err);
                        })
                } else {
                    rej(ErrorMessages.add_to_db);
                }
            }).catch(err => {
                rej(err);
            })
        })
        return
    }
}