var fs = require('fs');
var colors = require('colors');

var upHost = require('../sql/update/AliveRadio')
var subnets = require('../sql/select/RadiosScanner');
var ipnormalize = require('../../utils/ipNetmask-List');

const exe = (callback) => {
    subnets((data) => {
        nextItem(data, callback);
    });
};

function nextItem(list, callback) {
    if (list[0] != undefined) {
        var e = list.pop();
        HostIsAlive(ipnormalize.normalizeIP4(e.ip), (host) => {
            upHost(e.ip, 1);
            nextItem(list, callback);
        }, (host) => {
            upHost(e.ip, 0);
            nextItem(list, callback);
        });
    } else {
        callback();
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
        retries: 1,
        sessionId: (process.pid % 65535),
        timeout: 2000,
        ttl: 128
    };
    var session = ping.createSession(options);
    session.pingHost(host, function (error, target) {
        //console.log("Scanning Host: ".green + (host).white)
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