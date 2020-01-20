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
    /**
     * Constructor for User Class
     * @param {WSMainServer} WSMain
     */
    User(WSMain) {
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
     */
    findme(username, pass) {
        this.log.info("Searching user: <" + username + "> in database.");
        this.db.query("SELECT * FROM " + this.db.DatabaseName + "._User WHERE 'username'='" + username + ";").then((result) => {

            return this.db.query("SELECT * FROM " + this.db.DatabaseName + "._User WHERE 'username'='" + username + "' AND 'password'='" + this.bcypher.crypt(key, pass) + "'")
                .catch((err) => {
                    this.log.warning("Wrong Password: <" + username + ">.");
                })

        }).catch((err) => {
            this.log.warning("Not Found user: <" + username + "> in database.");

        }).then((result) => {
            this.log.info("Found user: <" + username + "> in database.");
            this.log.info(result)
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

    }

}

module.exports = { User };