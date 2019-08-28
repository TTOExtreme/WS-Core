
const createServer = require('./bin/core/server.js')
const cluster = require('cluster');
const fs = require('fs');
var id = 1;

var c = JSON.parse(fs.readFileSync(__dirname + "/bin/configs/server.json", 'utf8'));

const os = require('os');

if (cluster.isMaster) {
    //const numCPUs = os.cpus().length;
    const numCPUs = 4;
    //console.log("This machine has " + numCPUs + " CPUs.");
    for (let i = 0; i < numCPUs * 1; i++) {
        var new_worker_env = {};
        new_worker_env["WORKER_ID"] = i;
        cluster.fork(new_worker_env);
        id++;
    }

    cluster.on("online", (worker) => {
        console.log(`Worker ${worker.process.pid} is online`);
    });

    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`);
        console.log("Starting a new worker...");
        cluster.fork();
    });

} else {
    createServer(process.env['WORKER_ID'], c.webPort);
}
