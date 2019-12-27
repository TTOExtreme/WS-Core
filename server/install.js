/**
 * This is the server initializer / main server class
 */
const WSLog = require('./core/utils/log').WSLog;
const WSCfg = require('./core/utils/cfg').WSCfg;
const WSConfigStruct = require('./core/utils/cfgStruct').WSConfigStruct;
const WServer = require('./core/socket/webserver').WServer;
const DBConnector = require('./core/database/connector').DBConnector;
const EventEmitter = require('events');

const DatabaseCreator = require('./core/database/creator/create').DatabaseCreator;

class WSMainServerInstaller {
    config = new WSConfigStruct;

    log;
    cfg;
    wserver;
    db;
    events = new EventEmitter();

    /**
     * Init the server host
     */
    Init(logOnConsole = false, loglevel = 1) {

        this.log = new WSLog(logOnConsole, loglevel);
        this.cfg = new WSCfg(this);
        this.db = new DBConnector();

        this.log.setLogOnConsole(logOnConsole);
        this.config = this.cfg.LoadConfig();
        this.db.connect(this);

        //this.wserver = new WServer(this);//need to initialize after config loading
        //this.wserver.init();
        let DBCreator = new DatabaseCreator(this);
        DBCreator.creatDatabase();
    }
}

module.exports = { WSMainServerInstaller }