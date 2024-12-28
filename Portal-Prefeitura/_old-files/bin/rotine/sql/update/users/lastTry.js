var db = require('../../connector');
var colors = require('colors');
var fs = require('fs');
var dbstruct = JSON.parse(fs.readFileSync(__dirname + "/../../../../configs/dbstruct.json", 'utf8'));

const exe = (user, data, callback) => {
    var sql = "";
    sql = "UPDATE " + dbstruct.database + "._Users ";
    sql += "SET `lastTry`='" + data + "' ";
    sql += " WHERE `user`='" + user + "';";

    //console.log(colors.green(sql + "\n"));
    db.query(sql, function (err, results, fields) {

        if (err) { callback({ status: "ERROR", mess: "[ERROR] on  {" + __filename + "}:\n", sql: sql, stack: err }); return; }
        callback({});
    });
};

module.exports = exe;