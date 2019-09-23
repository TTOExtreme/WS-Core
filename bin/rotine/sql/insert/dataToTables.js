var db = require('../connector');
var fs = require('fs');
var colors = require('colors');
var dbstruct = JSON.parse(fs.readFileSync(__dirname + "/../../../configs/dbstruct.json", 'utf8'));

const exe = (tableName, tableStruct, tableData, callback) => {
    var sql = "INSERT INTO " + dbstruct.database + "." + tableName + " (" + tableStruct + ")";
    sql += " VALUES  (" + tableData + ");";
    console.log(colors.green(sql + "\n"));
    db.query(sql, function (err, results, fields) {

        if (err) { callback({ status: "ERROR", mess: "[ERROR] on  {" + __filename + "}:\n", sql: sql, stack: err }); return; }
        callback();
    });
};

module.exports = exe;