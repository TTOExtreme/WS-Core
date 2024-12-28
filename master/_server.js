const WSMainServer = require('./server/main.js').WSMainServer;
const CronJob = require('cron').CronJob;

let WSMain = new WSMainServer();

function Restart() {
    WSMain = new WSMainServer();
    WSMain.Init(true, 3);
}

//Auto restart
let job = new CronJob({
    cronTime: '00 50 23 * * *',// todo dia as 23:50 o servidor será reiniciado
    onTick: function () {
        console.log("Stopping All Process")
        WSMain.stop().then(() => {
            console.log("Process Stopped")
            console.log("Restarting")
            setTimeout(() => {
                Restart();
            }, 10 * 1000)//espera 10 seg para reiniciar o servidor
        }).catch(err => {
            console.log("Error on stoping server try to restart");
            console.log(err);
        });
    },
    start: false,
    timeZone: 'America/Sao_Paulo'
});
job.start();

Restart();