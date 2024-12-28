/**
 * This is the server initializer / main server class
 */
import * as fs from 'fs';
import { join } from 'path';
import { WSLog } from './utils/log';
import { WSCfg } from './utils/cfg';
import { WServer } from './webserver';

class WSMainServer {
    private version = "1.3.1";

    public config: WSConfig;


    constructor() {
    }

    public log: WSLog;
    public cfg: WSCfg;
    public wserver: WServer;

    /**
     * Init the server host
     */
    public Init(logOnConsole: boolean) {

        this.log = new WSLog(logOnConsole);
        this.cfg = new WSCfg(this);

        this.log.setLogOnConsole(logOnConsole);
        this.config = this.cfg.LoadConfig();

        this.wserver = new WServer(this);//need to initialize after config loading
    }
}

export interface WSConfig {
    webPort: number,
    DB: {
        host: string,
        user: string,
        password: string,
        database_name: string
    }
}

export { WSMainServer }