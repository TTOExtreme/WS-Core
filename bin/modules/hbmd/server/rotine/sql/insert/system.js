var db = require('../../../../../../rotine/sql/connector');
var fs = require('fs');
var colors = require('colors');
var dbstruct = JSON.parse(fs.readFileSync(require("path").join(__dirname + "/../../../../../../configs/dbstruct.json"), 'utf8'));

function exe(data) {

    var sql = "";
    sql = "INSERT INTO " + dbstruct.database + "._HBMD_System_Stats";
    sql += " (hostname,timestamp,data,info)";
    sql += " VALUES ('" + data.hostname + "','" + data.timestamp + "','" + JSON.stringify(data.data) + "','" + JSON.stringify(data.info) + "')";
    sql += ";";

    console.log(colors.green(sql + "\n"));
    db.query(sql, function (err, results, fields) {
        if (err) { console.error({ status: "ERROR", mess: "[ERROR] on  {" + __filename + "}:\n", sql: sql, stack: err }); return; }
    });
};

module.exports = exe;