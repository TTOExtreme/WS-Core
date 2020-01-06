/**
 * User Data Instance
 */
const UserStruct = require('../structures/main/UserStruct').UserStruct;
const WSMainServer = require('../../../main');

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
    }

    myself = new UserStruct();

    /**
     * Function for finding user in database
     * @param {string} username 
     * @param {string} pass 
     */
    findme(username, pass) {
        if (this.log.logLevel == 3) this.log.info("Searching user: <" + username + "> in database.");

        //this.db.query()

        if (this.log.logLevel == 3) this.log.warning("Not Found user: <" + username + "> in database.");

        if (this.log.logLevel == 3) this.log.info("Found user: <" + username + "> in database.");
    }

    /**
     * Function for changing the user pass
     * @param {string} oldPass 
     * @param {string} newPass 
     */
    changePass(oldPass, newPass) {
        // TODO

        if (this.log.logLevel == 3) this.log.info("User change Password User: <" + username + ">.");
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
    loadPreferences(preferences) {

    }

}

module.exports = { User };