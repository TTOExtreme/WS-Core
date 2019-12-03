var db = require('../../../../../../rotine/sql/connector');
let bcypher = require('../../../../../../lib/bcypher');
var fs = require('fs');
var colors = require('colors');
var dbstruct = JSON.parse(fs.readFileSync(require("path").join(__dirname + "/../../../../../../configs/dbstruct.json"), 'utf8'));

function exe(data) {


    var sql = "";
    sql = "INSERT INTO " + dbstruct.database + "._HBMD_CPU_Stats";
    sql += " (pcid,hostname, timestamp, data, info, min, max, med) ";
    sql += " VALUES ('" + bcypher.sha512(data.hostname + data.mac) + "','" + data.hostname + "','" + data.timestamp + "','" + JSON.stringify(data.data) + "','" + JSON.stringify(data.info) + "','" + JSON.stringify(data.min) + "','" + JSON.stringify(data.max) + "','" + JSON.stringify(data.med) + "')";
    sql += ";";

    //console.log(colors.green(sql + "\n"));
    db.query(sql, function (err, results, fields) {
        if (err) { console.error({ status: "ERROR", mess: "[ERROR] on  {" + __filename + "}:\n", sql: sql, stack: err }); return; }
    });
};

module.exports = exe;