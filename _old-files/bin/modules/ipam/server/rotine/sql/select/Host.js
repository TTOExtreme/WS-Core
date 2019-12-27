var db = require('../../../../../../rotine/sql/connector');
var fs = require('fs');
var colors = require('colors');
var dbstruct = JSON.parse(fs.readFileSync(require("path").join(__dirname + "/../../../../../../configs/dbstruct.json"), 'utf8'));
var ipnormalize = require('../../../utils/ipNetmask-List').normalizeip;

const exe = (subnet, callback) => {
    var snet = (subnet.data);
    if (snet != undefined) {
        snet.ip = ipnormalize(snet.ip);
        var sql = "SELECT * FROM " + dbstruct.database + "._Hosts WHERE `ip`='" + snet.ip + "' ORDER BY `ip`;";
        db.query(sql, function (err, results, fields) {

            if (err) { callback({ status: "ERROR", mess: "[ERROR] on  {" + __filename + "}:\n", sql: sql, stack: err }); return; }
            results.forEach(element => {
                snet = (JSON.parse(JSON.stringify(element)));
            });
            callback(snet);
        });
    } else {
        console.log("[ERROR] Subnet undefined.".red + "\n\tat: /bin/rotine/sql/select/HostsIn.js\n".white);
        callback(snet);
    }
};

module.exports = exe;