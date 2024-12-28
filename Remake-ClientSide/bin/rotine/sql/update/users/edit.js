var db = require('../../connector');
var fs = require('fs');
var colors = require('colors');
var dbstruct = JSON.parse(fs.readFileSync(__dirname + "/../../../../configs/dbstruct.json", 'utf8'));

const exe = (id_user, user, username, pass, callback) => {
    var sql = "UPDATE " + dbstruct.database + "._Users ";

    sql += "SET `user`='" + user + "' ";
    sql += "SET `username`='" + username + "' ";
    if (pass != "") sql += "SET `pass`='" + pass + "' ";
    sql += " WHERE `id_user`='" + id_user + "';";

    db.query(sql, function (err, results, fields) {
        if (err) { callback({ status: "ERROR", mess: "[ERROR] on  {" + __filename + "}:\n", sql: sql, stack: err }); return; }
        callback({});
    });
};

module.exports = exe;