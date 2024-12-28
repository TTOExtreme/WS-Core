let checker = require('./icmp-scan');
let radiosScan = require('./radios/radios_scan');
let schedule = require("node-schedule");

let upAlive = "0 */1 * * * *";

let upRadios = "0 */10 * * * *";

function exe() {
    //chech if radio still alive
    schedule.scheduleJob(upAlive, () => {
        console.log("Initiate Radio Checker".green)
        checker(() => { console.log("Done Radio Checker".green) });
    });

    //push radios info
    schedule.scheduleJob(upRadios, () => {
        console.log("Initiate Radio SNMP Scanner".green)
        radiosScan(() => { console.log("Done Radio SNMP Scanner".green) });
    });
}

exe();