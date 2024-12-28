var fs = require('fs');
var colors = require('colors');
const netList = require('network-list');

var subnets = require('../sql/select/SubnetScanner');
var scanNet = require('./scanSubnet.js').fullScanNet;

const exe = (callback) => {
    subnets((data) => {
        nextItem(data, () => { callback(); });
    });
};

function nextItem(list, callback) {
    if (list[0] != undefined) {
        var e = list.pop();
        // console.log("Scanning: ".green + colors.gray(e.ip));
        scanNet(e, () => {
            setTimeout(() => {
                nextItem(list, callback);
            }, 3000);
        });

    } else {
        callback();
    }
}


module.exports = exe;