
const WSLog = require('./core/utils/log.js').WSLog;
const WSCfg = require('./core/utils/cfg.js').WSCfg;
const WSConfigStruct = require('./core/utils/cfgStruct.js').WSConfigStruct;
const WServer = require('./core/socket/webserver.js').WServer;
const DBConnector = require('./core/database/connector.js').DBConnector;
const EventEmitter = require("./core/utils/EventsClient").ClientEvent;

/**
 * @class WSMainServer
 */
class WSMainServer {
    /**@const {JSON} config */
    config;
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
        this.cfg.LoadConfig().then((config) => {
            this.config = config;
            this.db.connect(this);

            this.wserver = new WServer(this);//need to initialize after config loading
            this.wserver.init();
        }).catch(err => {
        })
    }
}

module.exports = { WSMainServer }