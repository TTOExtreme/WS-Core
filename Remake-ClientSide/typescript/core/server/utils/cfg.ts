
import { WSMainServer, WSConfig } from '../main';
import { WSLog } from './log';
import * as fs from 'fs';
import { join } from 'path';
import * as readline from 'readline';

class WSCfg {

    private log: WSLog;
    private configFolder = join(__dirname + "/../../../cfg");
    private configFile = join(this.configFolder + "/server.json");

    config: WSConfig = {
        webPort: 8080,
        DB: {
            host: "localhost",
            user: "WSCore",
            password: "TTO@WS2019",
            database_name: "WS_1_3_1"
        }
    };

    constructor(WSMainServer: WSMainServer) {
        this.log = WSMainServer.log;
    }

    public LoadConfig() {
        this.log.info("Loading config ")
        if (!fs.existsSync(this.configFile)) {
            this.SaveConfig();
        } else {
            this.config = JSON.parse(fs.readFileSync(this.configFile, "utf-8"));
            this.log.info("Config Loaded: " + JSON.stringify(this.config))
        }
        return this.config;
    }

    public SaveConfig() {
        this.log.warning("Config not Found on folder: " + this.configFile);
        this.log.warning("Creating new One");


        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('\nPlease insert the port for the server [8000]: ', (answer) => {
            try {
                this.config.webPort = parseInt(answer) || 8000;
            } catch (err) {
                this.config.webPort = 8000;
            }
            rl.question('Please insert the location of database [localhost]: ', (answer) => {
                this.config.DB.host = answer || "localhost";
                rl.question('Please insert the user to connect on DB [WS]: ', (answer) => {
                    this.config.DB.user = answer || "localhost";
                    rl.question('Please insert the password of the DB [TTO@WS2019]: ', (answer) => {
                        this.config.DB.password = answer || "localhost";
                        rl.close();
                        console.log("");
                        this.log.info("Configuration seted: " + JSON.stringify(this.config));
                        if (!fs.existsSync(this.configFolder))
                            fs.mkdirSync(this.configFolder);
                        fs.writeFileSync(this.configFile, JSON.stringify(this.config))
                    });
                });
            });
        });

    }

}

export { WSCfg };