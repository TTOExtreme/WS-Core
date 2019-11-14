var fs = require('fs');
var colors = require('colors');

var upHost = require('../../sql/update/AliveRadio')
var subnets = require('../../sql/select/RadiosScanner');
var ipnormalize = require('../../../utils/ipNetmask-List');
var scanRadio = require('./snmp_get_radio_info');

const exe = (callback) => {
    subnets((data) => {
        nextItem(data, callback);
    });
};

function nextItem(list, callback) {
    if (list[0] != undefined) {
        var e = list.pop();
        scanRadio(e.ip, e.community, () => {
            nextItem(list, callback);
        }, (error) => { });

    } else {
        callback();
    }
}

module.exports = exe;