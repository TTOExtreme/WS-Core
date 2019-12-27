/**
 * This is the server initializer / main server class
 */
import * as fs from 'fs';
import { join } from 'path';
import { WSLog } from './utils/log';
import { WSCfg } from './utils/cfg';
import { WServer } from './webserver';
import { DBConnector } from './database/connector';
import { WSConfig } from './main';
import { DatabaseCreator } from './database/creator/create';
import { EventEmitter } from 'events';


class WSMainServerInstaller {
    public config: WSConfig;

    public log: WSLog;
    public cfg: WSCfg;
    public wserver: WServer;
    public db: DBConnector;

    public events: EventEmitter;

    private Dbcreator: DatabaseCreator;

    /**
     * Init the server host
     */
    public Init(logOnConsole: boolean) {

        this.log = new WSLog(logOnConsole, 3);
        this.cfg = new WSCfg(this);
        this.db = new DBConnector();

        this.log.setLogOnConsole(logOnConsole);
        this.config = this.cfg.LoadConfig();
        this.db.connect(this);

        this.Dbcreator = new DatabaseCreator(this);
        this.Dbcreator.creatDatabase()
    }
}

export { WSMainServerInstaller }