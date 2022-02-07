import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

export default class Logger {

    logpath = "";
    logfile = "";
    logerror = true;
    loginfo = true;
    logsystem = true;

    /**
     * Inicializa o sistema de logger
     * @param {Class} WSCore instancia do WSCore
     * @description Usado somente para a instancia principal do sistema, não deve ser reinstanciado por outras classes
     */
    constructor(WSCore) {
        if (WSCore._config == null) {
            WSCore.LoadConfig();
        }
        //verifica se o caminho é relativo ou absoluto
        if (WSCore._config.LOG.path[0] == ".") {
            this.logpath = __dirname + "/../../";
        }
        this.logpath += WSCore._config.LOG.path;
        this.logfile = new Date().getTime() + ".log";
        this.loginfo = WSCore._config.LOG.loginfo;
        this.logsystem = WSCore._config.LOG.logsystem;
        this.logerror = WSCore._config.LOG.logerror;
        if (!fs.existsSync(join(this.logpath))) {
            fs.mkdirSync(join(this.logpath))
        }
        if (!fs.existsSync(join(this.logpath + this.logfile))) {
            fs.writeFileSync(join(this.logpath + this.logfile), "Inicio do log: " + new Date().getTime() + "\n")
        }
    }

    /**
     * Mensagem de informação
     * @param {string} message 
     */
    info(message) {
        if (this.loginfo) {
            console.log("[INFO] " + message);
            fs.appendFileSync(join(this.logpath + this.logfile), "[INFO] " + message)
        }
    }

    /**
     * Mensagem de sistema
     * @param {string} message 
     */
    system(message) {
        if (this.logsystem) {
            console.log("[SYSTEM] " + message);
            fs.appendFileSync(join(this.logpath + this.logfile), "[SYSTEM] " + message)
        }
    }

    /**
     * Mensagem de erro com stacktrace
     * @param {String} message 
     * @param {Exception} stacktrace 
     */
    error(message, stacktrace) {
        if (this.logerror) {
            console.error("[ERROR] " + message + "\n");
            console.error(stacktrace);
            fs.appendFileSync(join(this.logpath + this.logfile), "[ERROR] " + message)
            if (stacktrace != undefined)
                fs.appendFileSync(join(this.logpath + this.logfile), stacktrace.message + "\n" + stacktrace.name + "\n" + stacktrace.stack)
        }
    }
}