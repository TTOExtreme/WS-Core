var db = require('../../../../../../rotine/sql/connector');
var fs = require('fs');
var colors = require('colors');
var dbstruct = JSON.parse(fs.readFileSync(require("path").join(__dirname + "/../../../../../../configs/dbstruct.json"), 'utf8'));
var ipList = require('../../../utils/ipNetmask-List.js');
var dropHosts = require('./HostsIn');

const exe = (subnet, callback) => {
    var ip = ipList.normalizeip(subnet.ip);
    var netmask = ipList.normalizeNetmask(subnet.netmask);

    var sql = "DELETE FROM " + dbstruct.database + "._Subnets WHERE `ip`='" + ip + "';";
    //console.log(colors.green(sql + "\n"));
    db.query(sql, function (err, results, fields) {
        if (err) { console.log(colors.red("[ERROR] on bin/rotine/sql/drop/Subnet.js:\n") + err); return; }
        dropHosts(ip, () => {
            callback({});
        })
    });
};
module.exports = exe;