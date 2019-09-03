var db = require('../../../../../rotine/sql/connector');
var fs = require('fs');
var colors = require('colors');
var dbstruct = JSON.parse(fs.readFileSync(__dirname + "/../../../configs/dbstruct.json", 'utf8'));
var ipnormalize = require('../../utils/ipNetmask-List.js').normalizeip;

const exe = (subnet, name, ip, hostname, mac, vendor, hostnameErr, macErr, vendorErr, alive, callback) => {
    ip = ipnormalize(ip);
    subnet = ipnormalize(subnet);
    var sql = "";
    sql = "INSERT INTO " + dbstruct.database + "._Hosts (subnet,name,ip,hostname,mac,vendor,hostnameErr,macErr,vendorErr,addedIn,alive,seted)";
    sql += " VALUES ('" + subnet + "','" + name + "','" + ip + "','" + hostname + "','" + mac + "',\"" + vendor + "\",\"" + hostnameErr + "\",\"" + macErr + "\",\"" + vendorErr + "\"," + new Date().getTime() + "," + ((alive) ? 1 : 0) + ",1)";
    sql += " ON DUPLICATE KEY UPDATE ";
    sql += "`subnet`='" + subnet + "',`name`='" + name + "', `ip`='" + ip + "', `hostname`='" + hostname + "', `mac`='" + mac + "', `vendor`=\"" + vendor + "\", `hostnameErr`=\"" + hostnameErr + "\", `macErr`=\"" + macErr + "\", `vendorErr`=\"" + vendorErr + "\", `alive`=" + ((alive) ? 1 : 0) + ", `seted`=1 ";
    sql += ";";

    //console.log(colors.green(sql + "\n"));
    db.query(sql, function (err, results, fields) {

        if (err) { callback({ status: "ERROR", mess: "[ERROR] on  {" + __filename + "}:\n", sql: sql, stack: err }); return; }
        callback({});
    });
};

module.exports = exe;