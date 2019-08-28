var db = require('../../../../../rotine/sql/connector');
var fs = require('fs');
var colors = require('colors');
var dbstruct = JSON.parse(fs.readFileSync(__dirname + "/../../../configs/dbstruct.json", 'utf8'));
var dropHosts = require('./HostsIn');
var ipList = require('../../../../../rotine/utils/ipNetmask-List.js');

const exe = (subnet, callback) => {
    var ip = ipList.normalizeip(subnet.ip);

    var sql = "DELETE FROM " + dbstruct.database + "._Radios WHERE `ip`='" + ip + "';";
    console.log(colors.green(sql + "\n"));
    db.query(sql, function (err, results, fields) {
        if (err) { console.log(colors.red("[ERROR] on bin/rotine/sql/drop/Subnet.js:\n") + err); return; }

        callback({});
    });
};
module.exports = exe;