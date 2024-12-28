var db = require('../../../../../../../rotine/sql/connector');
var fs = require('fs');
var colors = require('colors');
var dbstruct = JSON.parse(fs.readFileSync(require("path").join(__dirname + "/../../../../../../../configs/dbstruct.json"), 'utf8'));

const single = (callback) => {
    var sql = "SELECT USR1.id_user,USR1.isConnected,USR1.user,USR1.username,USR1.lastLogin,USR1.lastTry,USR1.lastIp,USR1.addedIn, USR2.user AS addedByUser,USR1.deactivatedIn,USR3.user AS deactivatedByUser,USR1.active" +
        " FROM " + dbstruct.database + "._Users AS USR1" +
        " LEFT JOIN " + dbstruct.database + "._Users AS USR2 ON USR2.id_user = USR1.addedBy" +
        " LEFT JOIN " + dbstruct.database + "._Users AS USR3 ON USR3.id_user = USR1.deactivatedBy;";
    //console.log(sql)
    db.query(sql, function (err, results, fields) {

        if (err) { callback({ status: "ERROR", mess: "[ERROR] on  {" + __filename + "}:\n", sql: sql, stack: err }); return; }
        var data = [];
        results.forEach(element => {
            data.push(JSON.parse(JSON.stringify(element)));
        });
        callback(data);
    });
};
const multiple = (start, end, callback) => {
    var sql = "SELECT USR1.id_user,USR1.isConnected,USR1.user,USR1.username,USR1.lastLogin,USR1.lastTry,USR1.lastIp,USR1.addedIn, USR2.user AS addedByUser,USR1.deactivatedIn,USR3.user AS deactivatedByUser,USR1.active" +
        " FROM " + dbstruct.database + "._Users AS USR1" +
        " LEFT JOIN " + dbstruct.database + "._Users AS USR2 ON USR2.id_user = USR1.addedBy" +
        " LEFT JOIN " + dbstruct.database + "._Users AS USR3 ON USR3.id_user = USR1.deactivatedBy " +
        " LIMIT " + start + "," + end + ";";
    //console.log(sql)
    db.query(sql, function (err, results, fields) {

        if (err) { callback({ status: "ERROR", mess: "[ERROR] on  {" + __filename + "}:\n", sql: sql, stack: err }); return; }
        var data = [];
        results.forEach(element => {
            data.push(JSON.parse(JSON.stringify(element)));
        });
        callback(data);
    });
};

module.exports = { single, multiple };