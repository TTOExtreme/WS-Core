var fs = require('fs');
var colors = require('colors');

var upHost = require('../../sql/update/AliveHost')
var subnets = require('../../sql/select/RadiosScanner');
var ipnormalize = require('../../../utils/ipNetmask-List');
var scanRadio = require('./snmp_get_radio_info');

const exe = () => {
    subnets((data) => {
        nextItem(data);
    });
};

function nextItem(list) {
    if (list[0] != undefined) {
        var e = list.pop();
        scanRadio(e.ip, e.community, () => {
            nextItem(list);
        });

    }
}

module.exports = exe;