/**
 * log handler as console handler
 */

const fs = require('fs');
const path = require('path');
const colors = require('colors');

class WSLog {

    logFolder = path.join("./../../../logs");
    InfoFile = path.join(this.logFolder + "/" + "log-" + Date.now() + ".log");
    logOnConsole = false;
    logLevel = 3;
    //-1 - no log
    // 0 - only Errors
    // 1 - Errors and Warnings
    // 2 - Erros, Warnings and Info
    // 3 - Verbose log


    constructor(logOnConsole = false, logLevel = -1) {
        this.logOnConsole = logOnConsole;
        this.logLevel = logLevel;
    }

    /**
     * init
     */
    setLogOnConsole(logOnConsole) {
        this.logOnConsole = logOnConsole;
        this.info("Change log on console to: " + this.logOnConsole);
    }
    getLogOnConsole() {
        return this.logOnConsole;
    }

    /**
     * info writer
     */
    info(msg) {
        if (this.logLevel >= 2) {
            if (this.logOnConsole) {
                console.log(colors.gray("[" + Date.now() + "]") + colors.green("[INFO]") + colors.white(":\t" + msg));
            } else {
                this._checkFile(this.InfoFile);
                appendFileSync(this.InfoFile, "\n[" + Date.now() + "][INFO]:\t" + msg);
            }
        }
    }

    /**
     * warning writer
     */
    warning(msg) {
        if (this.logLevel >= 1) {
            if (this.logOnConsole) {
                console.log(colors.gray("[" + Date.now() + "]") + colors.yellow("[WARN]") + colors.white(":\t" + msg));
            } else {
                this._checkFile(this.InfoFile);
                appendFileSync(this.InfoFile, "\n[" + Date.now() + "][WARN]:\t" + msg);
            }
        }
    }

    /**
     * ERROR writer
     */
    error(msg) {
        if (this.logLevel >= 0) {
            if (this.logOnConsole) {
                console.log(colors.gray("[" + Date.now() + "]") + colors.red("[ERROR]") + colors.white(":\t" + msg));
            } else {
                this._checkFile(this.InfoFile);
                appendFileSync(this.InfoFile, "\n[" + Date.now() + "][ERROR]:\t" + msg);
            }
        }
    }

    _checkFile(filePath) {
        if (!existsSync(this.logFolder)) {
            mkdirSync(this.logFolder);
        }
        if (!existsSync(filePath))
            writeFileSync(filePath, "");
    }
}

module.exports = { WSLog }