import { UserStruct } from '../structures/main/UserStruct';
import { WSMainServer } from '../../main';
import { DBConnector } from '../connector';
import { WSLog } from '../../utils/log';

class User {

    private db: DBConnector;
    private log: WSLog;
    User(WSMain: WSMainServer) {
        this.db = WSMain.db;
        this.log = WSMain.log;
    }

    public myself: UserStruct;


    /**
     * Method to find myself in database
     */
    public findme(username: string, pass: string) {
        if (this.log.logLevel == 3) this.log.info("Searching user: <" + username + "> in database.");

        if (this.log.logLevel == 3) this.log.warning("Not Found user: <" + username + "> in database.");

        if (this.log.logLevel == 3) this.log.info("Found user: <" + username + "> in database.");
    }

    /**
     * Method to change my password
     */
    public changePass(oldPass: string, newPass: string) {
        // TODO

    }


    /**
     * Method to find myself in database
     */
    public changeName(oldPass: string, newPass: string) {
        // TODO
    }
}