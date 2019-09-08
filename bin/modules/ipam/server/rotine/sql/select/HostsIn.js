var db = require('../../../../../../rotine/sql/connector');
var fs = require('fs');
var colors = require('colors');
var dbstruct = JSON.parse(fs.readFileSync(require("path").join(__dirname + "/../../../../../../configs/dbstruct.json"), 'utf8'));
var ipnormalize = require('../../utils/ipNetmask-List.js').normalizeip;

const exe = (subnet, callback) => {
    var snet = JSON.parse(subnet);
    if (snet != undefined) {
        snet.ip = ipnormalize(snet.ip);
        var sql = "SELECT * FROM " + dbstruct.database + "._Hosts WHERE `subnet`='" + snet.ip + "' ORDER BY `ip`;";
        db.query(sql, function (err, results, fields) {

            if (err) { callback({ status: "ERROR", mess: "[ERROR] on  {" + __filename + "}:\n", sql: sql, stack: err }); return; }
            var data = [];
            results.forEach(element => {
                data.push(JSON.parse(JSON.stringify(element)));
            });
            snet.hosts = data;
            callback(snet);
        });
    } else {
        console.log("[ERROR] Subnet undefined.".red + "\n\tat: /bin/rotine/sql/select/HostsIn.js\n".white);
        callback(snet);
    }
};

module.exports = exe;