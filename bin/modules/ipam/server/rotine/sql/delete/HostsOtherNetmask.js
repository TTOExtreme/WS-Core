var db = require('../../../../../../rotine/sql/connector');
var fs = require('fs');
var colors = require('colors');
var dbstruct = JSON.parse(fs.readFileSync(require("path").join(__dirname + "/../../../../../../configs/dbstruct.json"), 'utf8'));
var ipList = require('../../../utils/ipNetmask-List.js');

function dropHosts(ip, netmask, callback) {
    ip = ipList.normalizeip(ip);
    ipList.GetList(ip, netmask, ips => {
        var sql = "DELETE FROM " + dbstruct.database + "._Hosts WHERE `subnet`='" + ip + "' AND `ip` NOT IN (" + JSON.stringify(ips).replace("[", "").replace("]", "") + ");";
        db.query(sql, function (err, results, fields) {
            if (err) { console.log(colors.red("[ERROR] on bin/rotine/sql/drop/Subnet.js:\n") + err); return; }
            callback({});
        });
    });
}

module.exports = dropHosts