var db = require('../../../../../../rotine/sql/connector');
var fs = require('fs');
var colors = require('colors');
var dbstruct = JSON.parse(fs.readFileSync(require("path").join(__dirname + "/../../../../../../configs/dbstruct.json"), 'utf8'));
var ipList = require('../../../utils/ipNetmask-List');

function dropHosts(ip, callback) {
    ip = ipList.normalizeip(ip);
    var sql = "DELETE FROM " + dbstruct.database + "._Hosts WHERE `subnet`='" + ip + "';";
    //console.log(colors.green(sql + "\n"));
    db.query(sql, function (err, results, fields) {
        if (err) { console.log(colors.red("[ERROR] on bin/rotine/sql/drop/Subnet.js:\n") + err); return; }
        callback({});
    });
}

module.exports = dropHosts