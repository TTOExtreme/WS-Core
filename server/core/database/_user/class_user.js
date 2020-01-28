/**
 * User Data Instance
 */
const UserStruct = require('../structures/main/UserStruct').UserStruct;
const WSMainServer = require('../../../main');
const Bcypher = require("../../utils/bcypher").Bcypher;

/**
 * @class User
 */
class User {

    /**@const {WSLog} log */
    log;
    /**@const {WSCfg} cfg */
    cfg;
    /**@const {DBConnector} db */
    db;


    /**
     * Constructor for User Class
     * @param {WSMainServer} WSMain
     */
    constructor(WSMain) {
        this.db = WSMain.db;
        this.log = WSMain.log;
        this.cfg = WSMain.cfg;
        this.bcypher = new Bcypher();
    }

    myself = new UserStruct();

    /**
     * Function for finding user in database
     * @param {string} username 
     * @param {string} pass 
     * @returns {Promise}
     */
    findme(username, pass) {
        if (!username || !pass) {
            this.log.warning("User Or Password is Null");
            return Promise.reject("Usuário ou Senha esta em branco")
        }
        this.log.info("Searching user: <" + username + "> in database.");
        return this.db.query("SELECT * FROM " + this.db.DatabaseName + "._User WHERE username='" + username + "';").then((result) => {
            const salt = result[0].salt;
            return this.db.query("SELECT * FROM " + this.db.DatabaseName + "._User WHERE username='" + username + "' AND password='" + this.bcypher.sha512(salt + pass) + "';")
                .catch((err) => {
                    return Promise.reject("Wrong Password: <" + username + ">.");
                }).then((result) => {
                    if (result[0]) {
                        this.myself.construct(result[0]);
                        return this.resetUUID()
                            .then(() => {
                                return Promise.resolve(this.myself)
                            }).catch((err) => {
                                this.log.error(err);
                                return Promise.reject("Not Able to reset UUID for user: <" + username + "> in database.");
                            })
                    } else {
                        return Promise.reject();
                    }
                })
        }).catch((err) => {
            if (!err) this.log.warning("Not Found user: <" + username + "> in database.");
            if (err) this.log.error(err);
            return Promise.reject("Not Found user: <" + username + "> in database.");
        }).then((result) => {
            this.log.info("Found user: <" + username + "> in database.");
            return Promise.resolve(result)
        })
    }


    /**
     * Function for finding user in database from uuid
     * @param {string} uuid 
     * @returns {Promise}
     */
    findmeuuid(uuid) {
        if (!uuid) {
            this.log.warning("User not has an uuid");
            return Promise.reject("Usuário UUID esta em branco")
        }
        this.log.info("Searching user by uuid: <" + uuid + "> in database.");
        return this.db.query("SELECT * FROM " + this.db.DatabaseName + "._User WHERE uuid='" + uuid + "';")
            .catch((err) => {
                this.log.warning("Not Found user uuid: <" + uuid + "> in database.");
                if (err) this.log.error(err);
                return Promise.reject("Not Found user uuid: <" + uuid + "> in database.");
            }).then((result) => {
                if (!result[0]) {
                    this.myself.construct(result[0])
                    return this.resetUUID()
                        .then(() => {
                            return Promise.resolve(this.myself)
                        })
                } else {
                    return Promise.reject("")
                }
            }).then((result) => {
                this.log.info("Found user uuid: <" + uuid + "> in database.");
                this.log.info(result)
                return Promise.resolve();
            })
    }

    /**
     * Function for changing the user pass
     * @param {string} oldPass 
     * @param {string} newPass 
     */
    changePass(oldPass, newPass) {
        // TODO

        this.log.info("User change Password User: <" + username + ">.");
    }

    /**
     * Function to save preferences on database
     * @param {JSON} preferences 
     */
    savePreferences(preferences) {
        //TODO
    }

    /**
     * Function to load preferences from database
     * @param {JSON} preferences 
     */
    loadPreferences() {
        //TODO
    }

    /**
     * Function to Reset UUID on database
     * @returns {Promise}
     */
    resetUUID() {
        if (this.myself.id) {
            const nUUID = this.bcypher.generate_crypt()
            return new Promise((resolve, reject) => {
                this.db.query("UPDATE " + this.db.DatabaseName + "._User" +
                    " SET UUID='" + nUUID + "'" +
                    " WHERE id=" + this.myself.id + ";").then(() => {
                        this.myself.uuid = nUUID;
                        resolve(nUUID);
                    }).catch(err => {
                        this.log.error("Cannot Set UUID:\n" + (err).toString());
                    })
            })
        } else {
            this.log.error("User not defined to Reset UUID\n" + this.myself.toString())
            return Promise.reject("User not defined to Reset UUID")
        }
    }

}

module.exports = { User };