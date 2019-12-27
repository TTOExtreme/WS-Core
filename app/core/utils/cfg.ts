
import { WSMainServer, WSConfig } from '../main';
import { WSLog } from './log';
import * as fs from 'fs';
import { join } from 'path';
import * as readline from 'readline';

class WSCfg {

    private log: WSLog;
    private configFolder = join(__dirname + "/../../cfg");
    private configFile = join(this.configFolder + "/server.json");

    config: WSConfig = {
        webPort: 8080,
        webpageFolder: "/opt/WS-Core/web",
        version: "1.3.1",
        DB: {
            host: "localhost",
            user: "WSCore",
            password: "TTO@ws2019",
            database_name: "WS_Core"
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
            let c = JSON.parse(fs.readFileSync(this.configFile, "utf-8"));
            if (this.checkConfigFileStruct(c)) {
                this.config = c;
            } else {
                this.SaveConfig();
            }
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
            rl.question('Please insert the location of webpageFolder [' + this.config.webpageFolder + ']: ', (answer) => {
                this.config.webpageFolder = answer || this.config.webpageFolder;
                rl.question('Please insert the location of database [' + this.config.DB.host + ']: ', (answer) => {
                    this.config.DB.host = answer || this.config.DB.host;
                    rl.question('Please insert the user to connect on DB [' + this.config.DB.user + ']: ', (answer) => {
                        this.config.DB.user = answer || this.config.DB.user;
                        rl.question('Please insert the password of the DB [' + this.config.DB.password + ']: ', (answer) => {
                            this.config.DB.password = answer || this.config.DB.password;
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
        });
    }

    private checkConfigFileStruct(config) {
        let retrieved = Object.keys(config);
        Object.keys(this.config).forEach(item => {
            retrieved.forEach(item2 => {
                if (item == item2) { item = "" }
            })
            if (item != "") { return false }
        })
        return true;
    }

}

export { WSCfg };