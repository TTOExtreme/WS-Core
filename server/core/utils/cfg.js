
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const WSConfigStruct = require('./cfgStruct').WSConfigStruct;

class WSCfg {

    log;
    configFolder = path.join(__dirname + "/../../cfg");
    configFile = path.join(this.configFolder + "/server.json");

    config = new WSConfigStruct();

    constructor(WSMain) {
        this.log = WSMain.log;
    }

    LoadConfig() {
        this.log.task("loading-config", "Loading config ", 0);
        if (!fs.existsSync(this.configFile)) {
            this.SaveConfig();
        } else {
            let c = JSON.parse(fs.readFileSync(this.configFile, "utf-8"));
            if (this.checkConfigFileStruct(c)) {
                this.config = c;
            } else {
                this.SaveConfig();
            }
            this.log.task("loading-config", "Config Loaded ", 1);
        }
        return this.config;
    }

    SaveConfig() {
        this.log.task("loading-config", "Config Not Found ", 2);
        this.log.warning("Creating Config File");


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
                            process.exit(1);
                        });
                    });
                });
            });
        });
    }

    checkConfigFileStruct(config) {
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

module.exports = { WSCfg }