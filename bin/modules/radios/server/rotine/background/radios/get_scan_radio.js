var colors = require('colors');

var ipnormalize = require('../../../utils/ipNetmask-List.js');
var scanRadio = require('./snmp_get_radio_info');

const exe = (e, callback) => {
    var ip = ipnormalize.normalizeIP4(e.ip);
    scanRadio(ip, e.community, () => { callback({ status: "OK" }); });
};

module.exports = exe;