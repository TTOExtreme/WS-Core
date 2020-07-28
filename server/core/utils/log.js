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
    GUI = false;
    logLevel = 3;
    //-1 - no log
    // 0 - only Errors
    // 1 - Errors and Warnings
    // 2 - Erros, Warnings and Info
    // 3 - Verbose log

    logText = []


    constructor(logOnConsole = false, logLevel = -1) {
        this.logOnConsole = logOnConsole;
        this.logLevel = logLevel;
        this._init();
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
     * Task add 
     * Status:  0 - initializing
     *          1 - done
     *          2 - Warning
     *          3 - Error
     */
    tasksIcon = {
        0: colors.blue('ℹ'),
        1: colors.green('✔'),
        2: colors.yellow('⚠'),
        3: colors.red('✖')
    }

    /**
     * 
     *  name:{text,status}
     * 
     */
    tasks = {}

    task(name, text, status = 0) {
        if (this.GUI) {
            this.tasks[name] = { text: text, status: status }
            this._writeTasks();
        } else {
            console.log(this.tasksIcon[status] + " " + text);
        }
    }


    getErrorObject() {
        try { throw Error('') } catch (err) { return err; }
    }

    /**
     * info writer
     */
    info(msg) {
        //console.log(this.getErrorObject());
        if (this.logLevel >= 2) {
            if (this.logOnConsole) {
                if (this.GUI) {
                    (colors.gray("[" + Date.now() + "]") + colors.green("[INFO]") + colors.white(":" + msg)).split('\n').forEach(line => {
                        this.logText.push(line);
                    })
                    this._writeLog();
                } else {
                    console.log(colors.gray("[" + Date.now() + "]") + colors.green("[INFO]") + colors.white(":" + msg));
                }
            } else {
                this._checkFile(this.InfoFile);
                appendFileSync(this.InfoFile, "\n[" + Date.now() + "][INFO]:" + msg);
            }
        }
    }

    /**
     * warning writer
     */
    warning(msg) {
        if (this.logLevel >= 1) {
            if (this.logOnConsole) {
                if (this.GUI) {
                    (colors.gray("[" + Date.now() + "]") + colors.yellow("[WARN]") + colors.white(":" + msg)).split('\n').forEach(line => {
                        this.logText.push(line);
                    })
                    this._writeLog();
                } else {
                    console.log(colors.gray("[" + Date.now() + "]") + colors.yellow("[WARN]") + colors.white(":" + msg));
                }
            } else {
                this._checkFile(this.InfoFile);
                appendFileSync(this.InfoFile, "\n[" + Date.now() + "][WARN]:" + msg);
            }
        }
    }

    /**
     * ERROR writer
     */
    error(msg) {
        if (this.logLevel >= 0) {
            if (this.logOnConsole) {
                if (this.GUI) {
                    (colors.gray("[" + Date.now() + "]") + colors.red("[ERROR]") + colors.white(":" + msg)).split('\n').forEach(line => {
                        this.logText.push(line);
                    })
                    this._writeLog();
                } else {
                    console.log(colors.gray("[" + Date.now() + "]") + colors.red("[ERROR]") + colors.white(":" + msg));
                    if (msg.stack) {
                        console.log(msg.stack);
                    }
                }
            } else {
                this._checkFile(this.InfoFile);
                appendFileSync(this.InfoFile, "\n[" + Date.now() + "][ERROR]:" + msg);
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

    heigth = 30;
    width = 30;
    taskSpacer = 15;

    _init() {
        if (this.logOnConsole & this.GUI) {
            this.heigth = process.stdout.rows || 30;
            this.width = process.stdout.columns || 30;
            this.taskSpacer = Math.round(this.width / 3);
            this._splitter();
        }
    }

    /**
     * Split the screen in half using Operator ||
     */

    //process.stdout.write("\\033[<L>;<C>f") //move to Line Col
    //process.stdout.write("\\033[2J"); // Clear the screen
    //process.stdout.write("\\033[<N>A"); // move Up N lines
    //process.stdout.write("\\033[<N>B"); // move Down N lines
    //process.stdout.write("\\033[<N>C"); // move Forward N cols
    //process.stdout.write("\\033[<N>D"); // move back N cols
    //process.stdout.write("\\033[K"); // erase to end of line
    //process.stdout.write("\\033[s"); // save pos
    //process.stdout.write("\\033[u"); // restore pos

    _splitter() {
        process.stdout.write('\x1B[?25l'); //disable cursor
        console.clear()
        for (let i = 0; i < this.heigth; i++) {
            process.stdout.cursorTo(this.taskSpacer - 0, i)
            process.stdout.write('||');
        }
        process.stdout.write("\x1B[?25h")//enable corsor
    }


    /**
     *  Write the text to terminal
     */
    _writeLog() {
        if (this.logText.length > this.heigth - 2) { this.logText.pop(); }
        for (let i = 0; i < this.logText.length; i++) {
            process.stdout.cursorTo(this.taskSpacer + 2, i + 1);
            process.stdout.write((this.logText[i].length < ((this.width + 19) - this.taskSpacer)) ? this.logText[i] : this.logText[i].substr(0, ((this.width + 19) - this.taskSpacer)) + "...");
        }
    }

    /**
     *  Write Tasks
     */
    _writeTasks() {
        let i = 0;
        Object.keys(this.tasks).forEach(task => {
            process.stdout.cursorTo(1, i + 1);
            process.stdout.write(this.tasksIcon[this.tasks[task]["status"] || 0])
            process.stdout.cursorTo(3, i + 1);
            process.stdout.write(this.tasks[task]["text"] || "<>")
            i++;
        })
    }
}

module.exports = { WSLog }