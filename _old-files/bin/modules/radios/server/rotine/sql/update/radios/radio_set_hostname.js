const db = require('../../../../../../../rotine/sql/connector');
const fs = require('fs');
const colors = require('colors');
const dbstruct = JSON.parse(fs.readFileSync(require("path").join(__dirname + "/../../../../../../../configs/dbstruct.json"), 'utf8'));
const ipnormalize = require('../../../../utils/ipNetmask-List').normalizeip;

const exe = (ip, name) => {
    ip = ipnormalize(ip);
    var sql = "";
    sql = "UPDATE " + dbstruct.database + "._Radios ";
    sql += "SET `hostname`= '" + name + "' ";
    sql += " WHERE `ip`='" + ip + "';";

    //console.log(colors.green(sql + "\n"));
    db.query(sql, function (err, results, fields) {
        if (err) { console.log(colors.red("[ERROR] on " + __dirname + __filename + ":\n") + err); return; }
    });
};

module.exports = exe;