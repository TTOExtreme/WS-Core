/**
 * log handler as console handler
 */

import { appendFile, existsSync, mkdirSync, writeFileSync, appendFileSync } from 'fs';
import { join } from 'path';
import * as colors from 'colors';

class WSLog {

    private logFolder: string = join(__dirname + "/../../../../logs");
    private InfoFile = join(this.logFolder + "/" + "log-" + Date.now() + ".log");
    private logOnConsole = false;


    constructor(logOnConsole: boolean) {
        this.logOnConsole = logOnConsole;
    }

    /**
     * init
     */
    public setLogOnConsole(logOnConsole: boolean) {
        this.logOnConsole = logOnConsole;
        this.info("Change log on console to: " + this.logOnConsole);
    }

    /**
     * info writer
     */
    public info(msg: string) {
        this.checkFile(this.InfoFile);
        if (this.logOnConsole) {
            console.log(colors.gray("[" + Date.now() + "]") + colors.green("[INFO]") + colors.white(":\t" + msg));
        } else {
            appendFileSync(this.InfoFile, "\n[" + Date.now() + "][INFO]:\t" + msg);
        }
    }

    /**
     * warning writer
     */
    public warning(msg: string) {
        this.checkFile(this.InfoFile);
        if (this.logOnConsole) {
            console.log(colors.gray("[" + Date.now() + "]") + colors.yellow("[WARN]") + colors.white(":\t" + msg));
        } else {
            appendFileSync(this.InfoFile, "\n[" + Date.now() + "][INFO]:\t" + msg);
        }
    }

    /**
     * ERROR writer
     */
    public error(msg: string) {
        this.checkFile(this.InfoFile);
        if (this.logOnConsole) {
            console.log(colors.gray("[" + Date.now() + "]") + colors.red("[ERROR]") + colors.white(":\t" + msg));
        } else {
            appendFileSync(this.InfoFile, "\n[" + Date.now() + "][INFO]:\t" + msg);
        }
    }

    private checkFile(filePath: string) {
        if (!existsSync(this.logFolder)) {
            mkdirSync(this.logFolder);
        }
        if (!existsSync(filePath))
            writeFileSync(filePath, "");
    }
}

export { WSLog };