let checker = require('./icmp-scan');
let radiosScan = require('./radios/radios_scan');
let schedule = require("node-schedule");

let upAlive = "0 * * * * *";

let upRadios = "0 */5 * * * *";

function exe() {
    //chech if radio still alive
    schedule.scheduleJob(upAlive, () => {
        console.log("Initiate Checker".green)
        //checker();
    });

    //push radios info
    schedule.scheduleJob(upRadios, () => {
        console.log("Initiate Radio Scanner".green)
        //radiosScan();
    });
}

exe();