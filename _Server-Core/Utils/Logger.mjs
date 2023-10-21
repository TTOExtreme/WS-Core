import EventEmitter from 'events';
import fs from 'fs';

export default class Logger {
    /**
     * Caminho de pasta para salvar os arquivos de LOG
     */
    logpath = "";
    /**
     * Arquivo para salvar o log
     */
    logfile = "";

    /**
     * Error,Info,System ativa ou desativa niveis de log terminal + arquivo
     */
    logerror = true;
    loginfo = true;
    logsystem = true;

    /**
     * Limite de historico de logs para manter salvo
     */
    limitlogfiles = 10;
    /**
     * Limite do tamanho do arquivo
     */
    limitlogsize = 100 * 1000 * 1000;


    /**
     * Inicializa o sistema de logger
     * @param {JSON} config JSON contendo predefinições do sistema de LOG
     * @param {EventEmitter} event
     * @description Usado somente para a instancia principal do sistema, não deve ser reinstanciado por outras classes
     */
    constructor(config, event = null) {
        try {
            // Caminhos de gravação de log
            this.logpath += config.path || "./log/";
            this.logfile = new Date().getTime() + ".log";

            //configs do nivel de log para gravação + console
            this.loginfo = config.loginfo || true;
            this.logsystem = config.logsystem || true;
            this.logerror = config.logerror || true;

            this.limitlogfiles = config.limitlogfiles || 10;
            this.limitlogsize = config.limitlogsize || 100 * 1000 * 1000;


            //definição se adiciona as funções para EventViewer

            if (event != null) {
                this.info("Iniciando Event Log");
                event.on("Log.info", (...data) => this.info(...data));
                event.on("Log.system", (...data) => this.system(...data));
                event.on("Log.error", (data, stacktrace) => this.error(data, stacktrace));
            }
            this.checklogfile();
            setInterval(() => {
                this.checklogfile();
            }, 10 * 10);
        } catch (err) {
            throw err;
        }
    }

    /**
     * Mensagem de informação
     * @param {string} message 
     */
    info(...message) {
        if (this.loginfo) {
            let mstr = "";
            if (message.length > 1) {
                message.forEach(m => {
                    if (typeof (m) == 'string' || typeof (m) == 'number') {
                        mstr += "<" + m + "> ";
                    }
                });
            } else {
                if (message.length == 1) mstr = message[0];
            }
            console.log(this.dateformat() + "[INFO] ", ...message);
            fs.appendFileSync(this.logpath + this.logfile, this.dateformat() + "[INFO] " + mstr + "\n")
        }
    }

    /**
     * Mensagem de sistema
     * @param {string} message 
     */
    system(...message) {
        if (this.logsystem) {
            let mstr = "";
            if (message.length > 1) {
                message.forEach(m => {
                    if (typeof (m) == 'string' || typeof (m) == 'number') {
                        mstr += "<" + m + "> ";
                    }
                });
            } else {
                if (message.length == 1) mstr = message[0];
            }
            console.log(this.dateformat() + "[SYSTEM] ", ...message);
            fs.appendFileSync(this.logpath + this.logfile, this.dateformat() + "[SYSTEM] " + mstr + "\n")
        }
    }

    /**
     * Mensagem de erro com stacktrace
     * @param {String} message 
     * @param {Exception} stacktrace 
     */
    error(message, stacktrace = null) {
        if (this.logerror) {
            console.error(this.dateformat() + "[ERROR] " + message + "\n");
            if (stacktrace != undefined && stacktrace != null)
                console.error(stacktrace);
            fs.appendFileSync(this.logpath + this.logfile, this.dateformat() + "[ERROR] " + message + "\n")
            if (stacktrace != undefined && stacktrace != null)
                fs.appendFileSync(this.logpath + this.logfile, stacktrace.message + "\n" + stacktrace.name + "\n" + stacktrace.stack + "\n")
        }
    }

    /**
     * Retorna o timestamp com formato para adicionar antes da mensagem
     */
    dateformat() {
        return "{" + new Date().getTime() + "}"
    }

    /**
     * checa tamanho do arquivo de log e abre um novo para 
     */
    checklogfile() {
        //this.info(" Check LogFile ==========================================================================")
        //Garante existencia da pasta e inicia o log
        if (!fs.existsSync(this.logpath)) {
            fs.mkdirSync(this.logpath)
        }
        if (!fs.existsSync(this.logpath + this.logfile)) {
            fs.writeFileSync(this.logpath + this.logfile, "Inicio do log: " + new Date().getTime() + "\n")
        } else {
            const fsize = ((fs.statSync(this.logpath + this.logfile).size));
            if (fsize > this.limitlogsize) {
                let nlogname = new Date().getTime() + ".log";
                this.system("Estouro de tamanho do LOG", fsize)
                fs.appendFileSync(this.logpath + this.logfile, "Estouro de tamanho do LOG continuando no arquivo: " + nlogname);
                this.logfile = nlogname;
                fs.writeFileSync(this.logpath + this.logfile, "Inicio do log: " + new Date().getTime() + "\n")
            }
        }
        //Limpa logs antigos deixando os ultimos limitlogfiles;
        let logfiles = fs.readdirSync(this.logpath)
        logfiles.sort();
        if (logfiles.length > this.limitlogfiles) {
            for (let i = 0; i < logfiles.length - this.limitlogfiles; i++) {
                this.system("Excluindo log antigo: " + this.logpath + logfiles[i])
                fs.unlinkSync(this.logpath + logfiles[i]);
            }
        }
    }
}