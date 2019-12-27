/**
 * This is the server initializer / main server class
 */
const WSLog = require('./core/utils/log.js').WSLog;
const WSCfg = require('./core/utils/cfg.js').WSCfg;
const WSConfigStruct = require('./core/utils/cfgStruct.js').WSConfigStruct;
const WServer = require('./core/socket/webserver.js').WServer;
const DBConnector = require('./core/database/connector.js').DBConnector;
const EventEmitter = require('events');

class WSMainServer {
    config;

    log;
    cfg;
    wserver;
    db;
    events;

    /**
     * Init the server host
     */
    Init(logOnConsole = false, loglevel = 1) {
        config = new WSConfigStruct();
        events = new EventEmitter();

        this.log = new WSLog(logOnConsole, loglevel);
        this.cfg = new WSCfg(this);
        this.db = new DBConnector();

        this.log.setLogOnConsole(logOnConsole);
        this.config = this.cfg.LoadConfig();
        this.db.connect(this);

        this.wserver = new WServer(this);//need to initialize after config loading
        this.wserver.init();
    }
}

module.exports = { WSMainServer }