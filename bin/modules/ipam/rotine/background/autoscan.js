var scan = require('../../../rotine/background/scan');
var checker = require('../../../rotine/background/icmp-scan');
var radiosScan = require('../../../rotine/background/radios/radios_scan');
var schedule = require("node-schedule");

var times = [
    "0 0 11 * * *", //todos os dias as 11hs e 15hs
    "0 0 15 * * *"
    //"0 */2 * * * *"
]

var upAlive = "0 */5 * * * *";

var upRadios = "0 * * * * *";

function exe() {
    //scan
    times.forEach((time) => {
        schedule.scheduleJob(time, () => {
            console.log("Initiate Auto Scan".green)
            scan(() => {
                console.log("Scan Done".green);
            });
        });
    });

    //checker
    schedule.scheduleJob(upAlive, () => {
        console.log("Initiate Checker".green)
        checker();
    });

    //checker
    schedule.scheduleJob(upRadios, () => {
        console.log("Initiate Radio Scanner".green)
        //radiosScan();
    });
}

exe();