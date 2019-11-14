var scan = require('./scan');
var checker = require('./icmp-scan');
var schedule = require("node-schedule");

var times = [
    "0 0 11 * * *", //todos os dias as 11hs e 15hs
    "0 0 15 * * *",
    "0 02 11 * * *"
]

var upAlive = "0 */5 * * * *";

function exe() {
    //scan
    times.forEach((time) => {
        schedule.scheduleJob(time, () => {
            console.log("Initiate Auto Scan".green)
            scan(() => {
                console.log("Scan IPAM Done".green);
            });
        });
    });

    //checker
    schedule.scheduleJob(upAlive, () => {
        console.log("Initiate Checker".green)
        checker();
    });
}

exe();