var db = require('../../../../../../rotine/sql/connector');
var fs = require('fs');
var colors = require('colors');
var dbstruct = JSON.parse(fs.readFileSync(require("path").join(__dirname + "/../../../../../../configs/dbstruct.json"), 'utf8'));
var ipnormalize = require('../../../utils/ipNetmask-List').normalizeip;

const exe = (ip, alive, callback) => {
    ip = ipnormalize(ip);
    var sql = "";
    sql = "UPDATE " + dbstruct.database + "._Hosts ";
    sql += "SET `alive`= " + alive + " ";
    sql += " WHERE `ip`='" + ip + "';";

    //console.log(colors.green(sql + "\n"));
    db.query(sql, function (err, results, fields) {

        if (callback) {
            if (err) { callback({ status: "ERROR", mess: "[ERROR] on  {" + __filename + "}:\n", sql: sql, stack: err }); return; }
            callback({});
        }
    });
};

module.exports = exe;