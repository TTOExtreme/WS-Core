/**
 * This is the server initializer / main server class
 */
import * as fs from 'fs';
import { join } from 'path';
import { WSLog } from './utils/log';
import { WSCfg } from './utils/cfg';
import { WServer } from './webserver';
import { DBConnector } from './database/connector';
import { EventEmitter } from 'events';

class WSMainServer {
    public config: WSConfig;

    public log: WSLog;
    public cfg: WSCfg;
    public wserver: WServer;
    public db: DBConnector;
    public events: EventEmitter;

    /**
     * Init the server host
     */
    public Init(logOnConsole: boolean = false, loglevel: number = 1) {

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

export interface WSConfig {
    webPort: number,
    webpageFolder: string,
    version: string,
    DB: {
        host: string,
        user: string,
        password: string,
        database_name: string
    }
}

export { WSMainServer }