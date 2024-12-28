var colors = require('colors')

var nmap = require('node-nmap');
nmap.nmapLocation = "nmap";

function GetPorts(Host, callback) {
    var osandports = new nmap.NmapScan(Host, "-Pn-");
    osandports.scanTimeout = 5 * 60 * 1000;

    osandports.on('complete', function (data) {
        //console.log(colors.gray(data[0]));
        var rt = [];
        if (data[0] != undefined) {
            if (data[0].openPorts != undefined) {
                rt = data[0].openPorts;
            }
        }

        callback(rt);
    });
    osandports.on('error', function (error) {
        console.log(error);
        callback(-1);
    });

    osandports.startScan();
};

module.exports = { GetPorts };