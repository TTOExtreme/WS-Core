/**
 * This is the server initializer / main server class
 */
const WSLog = require("./core/utils/log").WSLog;
const WSCfg = require("./core/utils/cfg").WSCfg;
const WSConfigStruct = require("./core/utils/cfgStruct").WSConfigStruct;
const DBConnector = require("./core/database/connector").DBConnector;
const EventEmitter = require("events");

const DatabaseCreator = require("./core/database/creator/create").DatabaseCreator;
const DatabaseCreatorModules = require("./core/database/creator/createModules").DatabaseCreator;

/**
 * @class WSMainServerInstaller
 */
class WSMainServerInstaller {
    /**@const {JSON} config */
    config
    /**@const {WSLog} log */
    log;
    /**@const {WSCfg} cfg */
    cfg;
    /**@const {WServer} wserver */
    wserver;
    /**@const {DBConnector} db */
    db;
    /**@const {EventEmitter} events */
    events;

    /**
     * Init the server host
     */
    Init(logOnConsole = false, loglevel = 1) {

        this.config = new WSConfigStruct();
        this.events = new EventEmitter();

        this.log = new WSLog(logOnConsole, loglevel);
        this.cfg = new WSCfg(this);
        this.db = new DBConnector();

        this.log.setLogOnConsole(logOnConsole);
        this.config = this.cfg.LoadConfig();
        this.db.connect(this);
        let DBCreator = new DatabaseCreator(this);
        let DBCreatorModules = new DatabaseCreatorModules(this);
        DBCreator.creatDatabase().then(() => {
            this.log.info("Core Creation Done!")
            return DBCreatorModules.creatDatabase().then(() => {
                process.exit(0);
            })
        }).catch(() => {
            process.exit(1);
        });
    }
}

module.exports = { WSMainServerInstaller }