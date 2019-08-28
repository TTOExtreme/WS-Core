var db = require('../../connector');
var fs = require('fs');
var colors = require('colors');
var dbstruct = JSON.parse(fs.readFileSync(__dirname + "/../../../../configs/dbstruct.json", 'utf8'));

const exe = (user, username, pass, UUID, addedBy, active, callback) => {
    var sql = "INSERT INTO " + dbstruct.database + "._Users (user,username,pass,UUID,lastLogin,addedIn,addedBy,active,isConnected)";
    sql += " VALUES ('" + user + "','" + username + "','" + pass + "','" + UUID + "',0," + new Date().getTime() + "," + addedBy + "," + active + ",0);";
    db.query(sql, function (err, results, fields) {

        if (err) { callback({ status: "ERROR", mess: "[ERROR] on  <" + __filename + ">:\n", sql: sql, stack: err }); return; }
        callback({});
    });
};

module.exports = exe;