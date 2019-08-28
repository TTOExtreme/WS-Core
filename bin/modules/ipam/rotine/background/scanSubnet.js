var fs = require('fs');
var colors = require('colors');
const netList = require('../../lib/netscan.js');
var ipList = require('../utils/ipNetmask-List');
const nmap = require('./nmap');

var newHost = require('../sql/insert/newHost');

var hostsScaned = [];
var ended = false;

var opt = {
    ip: '192.168.0',
    netmask: 24,
    timeout: 15,
    vendor: true
}

function scanNet(subnet, done) {
    opt.ip = ipList.normalizeIP4(subnet.ip);
    opt.netmask = subnet.netmask;
    //console.log("Scanning: " + opt.ip)
    netList.NetScan(opt, (err, obj) => {
        if (err) { console.log(err); return; }
        //console.log("Returned: " + obj.ip)
        newHost.server(subnet.ip, "-", obj.ip, obj.hostname, obj.mac, obj.vendor, obj.hostnameError, obj.macError, obj.vendorError, obj.alive, () => {
            if (obj.alive) hostsScaned.push({ subnet: subnet.ip, ip: obj.ip });
        });
    }, () => {
        done(subnet);
    });
}

function fullScanNet(subnet, done) {
    opt.ip = ipList.normalizeIP4(subnet.ip);
    opt.netmask = subnet.netmask;
    //console.log("Scanning: " + opt.ip)
    netList.NetScan(opt, (err, obj) => {
        if (err) { console.log(err); return; }
        //console.log("Returned: " + obj.ip)
        newHost.server(subnet.ip, "-", obj.ip, obj.hostname, obj.mac, obj.vendor, obj.hostnameError, obj.macError, obj.vendorError, obj.alive, () => {
            if (obj.alive) hostsScaned.push({ subnet: subnet.ip, ip: obj.ip });
        });
    }, () => {
        nmapHosts(() => {
            done(subnet);
        });
    });
}

function nmapHosts(callback) {
    let dt = hostsScaned.pop();
    if (dt != null && dt != undefined) {
        nmap.GetPorts(dt.ip, (ports) => {
            if (ports != -1) {
                var po = "";
                ports.forEach(e => {
                    po += e.port + ";";
                });
                newHost.portsOpen(dt.subnet, dt.ip, po, () => { });
            }

            nmapHosts(callback);
        });
    } else {
        callback();
    }
}

module.exports = { scanNet, fullScanNet };