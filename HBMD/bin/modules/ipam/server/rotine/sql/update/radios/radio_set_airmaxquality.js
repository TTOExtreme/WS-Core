const db = require('../../../../../../../rotine/sql/connector');
const fs = require('fs');
const colors = require('colors');
const path = require("path")
const dbstruct = JSON.parse(fs.readFileSync(path.join(__dirname + "/../../../../configs/dbstruct.json"), 'utf8'));

const ipnormalize = require('../../../../utils/ipNetmask-List').normalizeip;

const exe = (ip, value) => {
    ip = ipnormalize(ip);
    var sql = "";
    sql = "UPDATE " + dbstruct.database + "._Radios ";
    sql += "SET `AirmaxQuality`= " + value + " ";
    sql += " WHERE `ip`='" + ip + "';";

    //console.log(colors.green(sql + "\n"));
    db.query(sql, function (err, results, fields) {
        if (err) { console.log(colors.red("[ERROR] on " + __dirname + __filename + ":\n") + err); return; }
    });
};

module.exports = exe;