var fs = require('fs');
var colors = require('colors');

var upHost = require('../sql/update/AliveHost')
var subnets = require('../sql/select/Alive-Hosts');
var ipnormalize = require('../../utils/ipNetmask-List');

const exe = () => {
    subnets((data) => {
        console.log("ICMP-Scan");
        //console.log(data)
        nextItem(data);
    });
};

function nextItem(list) {
    if (list[0] != undefined) {
        var e = list.pop();
        HostIsAlive(ipnormalize.normalizeIP4(e), (host) => {
            upHost(e, 1);
            nextItem(list);
        }, (host) => {
            upHost(e, 0);
            nextItem(list);
        });
    }
}
/*
var ping = require('ping');
function HostIsAlive(host, alive, dead) {
    var cfg = {
        timeout: 10,
        // WARNING: -i 2 may not work in other platform like window
        extra: ["-i 2"],
    };

    ping.sys.probe(host, function (isAlive) {
        if (isAlive) {
            alive(host);
        } else {
            dead(host);
        }
    }, cfg);
}
//*/

var ping = require('net-ping');
function HostIsAlive(host, alive, dead) {
    var options = {
        networkProtocol: ping.NetworkProtocol.IPv4,
        packetSize: 1,
        retries: 5,
        sessionId: (process.pid % 65535),
        timeout: 2000,
        ttl: 128
    };
    var session = ping.createSession(options);
    session.pingHost(host, function (error, target) {
        if (error)
            if (error instanceof ping.RequestTimedOutError)
                dead(host)
            else
                console.log(target + ": " + error.toString());
        else
            alive(host)
    });
}


//*/
module.exports = exe;