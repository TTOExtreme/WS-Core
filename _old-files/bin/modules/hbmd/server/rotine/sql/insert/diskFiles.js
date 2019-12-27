let db = require('../../../../../../rotine/sql/connector');
let bcypher = require('../../../../../../lib/bcypher');
let fs = require('fs');
let colors = require('colors');
let dbstruct = JSON.parse(fs.readFileSync(require("path").join(__dirname + "/../../../../../../configs/dbstruct.json"), 'utf8'));

function exe(data) {

    let sql = "";
    sql = "INSERT INTO " + dbstruct.database + "._HBMD_Disk_Files";
    sql += " (pcid,timestamp,data)";
    sql += " VALUES ('" + bcypher.sha512(data.hostname + data.mac) + "','" + data.timestamp + "','" + JSON.stringify(data.data) + "')";
    sql += " ON DUPLICATE KEY UPDATE"
    sql += " timestamp='" + data.timestamp + "', data='" + JSON.stringify(data.data) + "'"
    sql += " ;";

    //console.log(colors.green(sql + "\n"));
    db.query(sql, function (err, results, fields) {
        if (err) { console.error({ status: "ERROR", mess: "[ERROR] on  {" + __filename + "}:\n", sql: sql, stack: err }); return; }
    });
};

module.exports = exe;