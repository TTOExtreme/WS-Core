
const WSLog = require('./core/utils/log.js').WSLog;
const WSCfg = require('./core/utils/cfg.js').WSCfg;
const WSConfigStruct = require('./core/utils/cfgStruct.js').WSConfigStruct;
const WServer = require('./core/socket/webserver.js').WServer;
const DBConnector = require('./core/database/connector.js').DBConnector;
const EventEmitter = require("./core/utils/EventsClient").ClientEvent;
const fs = require("fs");
const path = require("path").join

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
     * @const {JSON} modules
     * Structure to load each module instance (startup,running,stop,hosts)
     */
    modules;

    /**
     * Init the server host
     */
    Init(logOnConsole = false, loglevel = 1) {
        this.config = new WSConfigStruct();
        this.events = new EventEmitter();

        this.log = new WSLog(logOnConsole, loglevel);
        this.cfg = new WSCfg(this);
        this.db = new DBConnector();

        this.modules = {};

        this.log.setLogOnConsole(logOnConsole);
        this.cfg.LoadConfig().then((config) => {
            this.config = config;
            this.db.connect(this);

            this.wserver = new WServer(this);//need to initialize after config loading
            this.wserver.init();

            this._loadModules();
        }).catch(err => {
            this.log.error("in: Loading Main Server");
            this.log.error(err);
        })
    }

    _loadModules() {
        let modulesList = fs.readdirSync(path(__dirname + "/modules/"));
        modulesList.forEach(mod => {
            //check if exist host.js in module (differ hosting structure)
            if (fs.existsSync(path(__dirname + "/modules/" + mod + "/server/Hosts.js"))) {
                this.modules[mod] = {};
                this.log.task("loading-host_" + mod, "Loading Hosting Structure from Module: " + mod + " in: /module/" + mod + "/server/", 0);
                try {
                    let host = require(path(__dirname + "/modules/" + mod + "/server/Hosts.js")).Hosts;
                    this.modules[mod].host = new host(this);
                } catch (err) {
                    this.log.error("Loading Hosting Structure from Module: " + mod + " in: /module/" + mod + "/");
                    this.log.error(err);
                }
                this.log.task("loading-host_" + mod, "Loaded Hosting Structure from Module: " + mod + " in: /module/" + mod + "/", 1);

            } else {
                this.log.info("Skipping Hosts from module: " + mod);
            }
        })
    }
}

module.exports = { WSMainServer }