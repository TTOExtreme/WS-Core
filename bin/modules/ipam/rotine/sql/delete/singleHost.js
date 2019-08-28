var db = require('../../../../../rotine/sql/connector');
var fs = require('fs');
var colors = require('colors');
var dbstruct = JSON.parse(fs.readFileSync(__dirname + "/../../../configs/dbstruct.json", 'utf8'));
var ipnormalize = require('../../../../../rotine/utils/ipNetmask-List.js').normalizeip;

const exe = (data, callback) => {
    var ip = ipnormalize(data.ip);
    ip = ipnormalize(ip);

    sql = "UPDATE " + dbstruct.database + "._Hosts ";
    sql += " SET `hostname`='-', `name`='-', `mac`='-', `vendor`=\"-\", `hostnameErr`=\"-\", `macErr`=\"-\", `vendorErr`=\"-\", `alive`=0, `seted`=0 ";
    sql += "WHERE `ip`='" + ip + "' ;";
    sql += ";";

    //console.log(colors.green(sql + "\n"));
    db.query(sql, function (err, results, fields) {
        if (err) { console.log(colors.red("[ERROR] on bin/rotine/sql/create/database.js:\n") + err); return; }
        callback({});
    });
};

/*

const exe = (data, callback) => {
    ip = ipnormalize(data.ip);
    var sql = "";
    sql = "DELETE FROM " + dbstruct.database + "._Hosts ";
    sql += "WHERE `ip` = '" + ip + "';";
    sql += ";";

    console.log(colors.green(sql + "\n"));
    db.query(sql, function (err, results, fields) {
        if (err) { console.log(colors.red("[ERROR] on bin/rotine/sql/create/database.js:\n") + err); return; }
        
        callback(data);
    });
};

//*/


module.exports = exe;