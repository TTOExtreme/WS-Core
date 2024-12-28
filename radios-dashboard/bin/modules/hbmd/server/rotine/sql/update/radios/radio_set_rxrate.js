var db = require('../../connector');
var fs = require('fs');
var colors = require('colors');
var dbstruct = JSON.parse(fs.readFileSync(__dirname + "/../../../configs/dbstruct.json", 'utf8'));
var ipnormalize = require('../../../utils/ipNetmask-List.js').normalizeip;

const exe = (ip, value) => {
    ip = ipnormalize(ip);
    var sql = "";
    sql = "UPDATE " + dbstruct.database + "._Radios ";
    sql += "SET `RXrate`= " + value + " , `alive`=1";
    sql += " WHERE `ip`='" + ip + "';";

    //console.log(colors.green(sql + "\n"));
    db.query(sql, function (err, results, fields) {
        if (err) { console.log(colors.red("[ERROR] on " + __dirname + __filename + ":\n") + err); return; }
    });
};

module.exports = exe;