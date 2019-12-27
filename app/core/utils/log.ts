/**
 * log handler as console handler
 */

import { appendFile, existsSync, mkdirSync, writeFileSync, appendFileSync } from 'fs';
import { join } from 'path';
import * as colors from 'colors';

class WSLog {

    private logFolder: string = join(__dirname + "/../../../logs");
    private InfoFile = join(this.logFolder + "/" + "log-" + Date.now() + ".log");
    private logOnConsole = false;
    public logLevel = 3;
    //-1 - no log
    // 0 - only Errors
    // 1 - Errors and Warnings
    // 2 - Erros, Warnings and Info
    // 3 - Verbose log


    constructor(logOnConsole: boolean, logLevel: number) {
        this.logOnConsole = logOnConsole;
        this.logLevel = logLevel;
    }

    /**
     * init
     */
    public setLogOnConsole(logOnConsole: boolean) {
        this.logOnConsole = logOnConsole;
        this.info("Change log on console to: " + this.logOnConsole);
    }
    public getLogOnConsole() {
        return this.logOnConsole;
    }

    /**
     * info writer
     */
    public info(msg: string) {
        if (this.logLevel >= 2) {
            if (this.logOnConsole) {
                console.log(colors.gray("[" + Date.now() + "]") + colors.green("[INFO]") + colors.white(":\t" + msg));
            } else {
                this.checkFile(this.InfoFile);
                appendFileSync(this.InfoFile, "\n[" + Date.now() + "][INFO]:\t" + msg);
            }
        }
    }

    /**
     * warning writer
     */
    public warning(msg: string) {
        if (this.logLevel >= 1) {
            if (this.logOnConsole) {
                console.log(colors.gray("[" + Date.now() + "]") + colors.yellow("[WARN]") + colors.white(":\t" + msg));
            } else {
                this.checkFile(this.InfoFile);
                appendFileSync(this.InfoFile, "\n[" + Date.now() + "][WARN]:\t" + msg);
            }
        }
    }

    /**
     * ERROR writer
     */
    public error(msg: string) {
        if (this.logLevel >= 0) {
            if (this.logOnConsole) {
                console.log(colors.gray("[" + Date.now() + "]") + colors.red("[ERROR]") + colors.white(":\t" + msg));
            } else {
                this.checkFile(this.InfoFile);
                appendFileSync(this.InfoFile, "\n[" + Date.now() + "][ERROR]:\t" + msg);
            }
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