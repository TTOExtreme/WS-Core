
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

    /**@var {JSON} AdmMenus used to store all menus layout for the adm page */
    AdmMenus = [];

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

        if (!fs.existsSync(path(__dirname + "/modules/"))) { //Create modules folder if not exists
            fs.mkdirSync(path(__dirname + "/modules/"));
        }

        this.log.setLogOnConsole(logOnConsole);
        this.cfg.LoadConfig().then((config) => {
            this.config = config;
            this.db.connect(this);

            this.wserver = new WServer(this);//need to initialize after config loading
            this.wserver.init();

            this.log.task("all-modules", "Loading all modules", 0);
            this._startupModules().then(() => {
                this._hostModules().then(() => {
                    this._runningModules().then(() => {
                        this.log.task("all-modules", "Done Loading all modules", 1);
                        this.wserver.postInit();
                    }).catch(err => {
                        this.log.error("On loading Running Modules");
                        this.log.error(err);
                    });
                }).catch(err => {
                    this.log.error("On loading Host Modules");
                    this.log.error(err);
                });
            }).catch(err => {
                this.log.error("On loading Startup Modules");
                this.log.error(err);
            });
        }).catch(err => {
            this.log.error("in: Loading Main Server");
            this.log.error(err);
        })
    }

    _startupModules() {
        let modulesList = fs.readdirSync(path(__dirname + "/modules/"));
        let listPromisses = [];

        modulesList.forEach(mod => {

            this.modules[mod] = { cfg: {}, host: null, startup: null, running: null };

            //check if exist Startup.js in module (differ Startup structure)
            if (fs.existsSync(path(__dirname + "/modules/" + mod + "/server/Startup.js"))) {
                this.log.task("loading-startup_" + mod, "Loading Startup Structure from Module: " + mod + " in: /module/" + mod + "/server/", 0);
                try {
                    let host = require(path(__dirname + "/modules/" + mod + "/server/Startup.js")).Startup;
                    this.modules[mod]["startup"] = new host(this);
                    listPromisses.push(this.modules[mod]["startup"].Init());
                } catch (err) {
                    this.log.error("Loading Startup Structure from Module: " + mod + " in: /module/" + mod + "/");
                    this.log.error(err);
                }
                this.log.task("loading-startup_" + mod, "Loaded Startup Structure from Module: " + mod + " in: /module/" + mod + "/server/", 1);

            } else {
                this.log.info("Skipping Startup from module: " + mod);
            }
        })

        return Promise.all(listPromisses);
    }
    _hostModules() {
        let modulesList = fs.readdirSync(path(__dirname + "/modules/"));
        let listPromisses = [];

        modulesList.forEach(mod => {
            //check if exist Hosts.js in module (differ hosting structure)
            if (fs.existsSync(path(__dirname + "/modules/" + mod + "/server/Hosts.js"))) {
                this.log.task("loading-host_" + mod, "Loading Hosting Structure from Module: " + mod + " in: /module/" + mod + "/server/", 0);
                try {
                    let host = require(path(__dirname + "/modules/" + mod + "/server/Hosts.js")).Hosts;
                    this.modules[mod]["host"] = new host(this);
                    listPromisses.push(this.modules[mod]["host"].Init());
                } catch (err) {
                    this.log.error("Loading Hosting Structure from Module: " + mod + " in: /module/" + mod + "/");
                    this.log.error(err);
                }
                this.log.task("loading-host_" + mod, "Loaded Hosting Structure from Module: " + mod + " in: /module/" + mod + "/server/", 1);

            } else {
                this.log.info("Skipping Hosts from module: " + mod);
            }
        })

        return Promise.all(listPromisses);
    }
    _runningModules() {
        let modulesList = fs.readdirSync(path(__dirname + "/modules/"));
        let listPromisses = [];

        modulesList.forEach(mod => {
            //check if exist Running.js in module (differ Running structure)
            if (fs.existsSync(path(__dirname + "/modules/" + mod + "/server/Running.js"))) {
                this.log.task("loading-running_" + mod, "Loading Running Structure from Module: " + mod + " in: /module/" + mod + "/server/", 0);
                try {
                    let host = require(path(__dirname + "/modules/" + mod + "/server/Running.js")).Running;
                    this.modules[mod]["running"] = new host(this);
                    listPromisses.push(this.modules[mod]["running"].Init());
                } catch (err) {
                    this.log.error("Loading Running Structure from Module: " + mod + " in: /module/" + mod + "/");
                    this.log.error(err);
                }
                this.log.task("loading-running_" + mod, "Loaded Running Structure from Module: " + mod + " in: /module/" + mod + "/server/", 1);

            } else {
                this.log.info("Skipping Running from module: " + mod);
            }
        })

        return Promise.all(listPromisses);
    }
}

module.exports = { WSMainServer }