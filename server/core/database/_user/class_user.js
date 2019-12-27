import { UserStruct } from '../structures/main/UserStruct.js';
import { WSMainServer } from '../../main.js';
import { DBConnector } from '../connector.js';
import { WSLog } from '../../utils/log.js';

export class User {

    db = new DBConnector();
    log = new WSLog;
    User(WSMain = new WSMainServer) {
        this.db = WSMain.db;
        this.log = WSMain.log;
    }

    myself = new UserStruct;


    /**
     * Method to find myself in database
     */
    findme(username, pass) {
        if (this.log.logLevel == 3) this.log.info("Searching user: <" + username + "> in database.");

        if (this.log.logLevel == 3) this.log.warning("Not Found user: <" + username + "> in database.");

        if (this.log.logLevel == 3) this.log.info("Found user: <" + username + "> in database.");
    }

    /**
     * Method to change my password
     */
    changePass(oldPass, newPass) {
        // TODO

    }


    /**
     * Method to find myself in database
     */
    changeName(oldPass, newPass) {
        // TODO
    }
}