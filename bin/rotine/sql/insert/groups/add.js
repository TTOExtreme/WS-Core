var db = require('../../connector');
var fs = require('fs');
var colors = require('colors');
var dbstruct = JSON.parse(fs.readFileSync(__dirname + "/../../../../configs/dbstruct.json", 'utf8'));

const exe = (group, groupname, GID, addedBy, active, callback) => {
    var sql = "INSERT INTO " + dbstruct.database + "._Groups (grp,groupname,GID,addedIn,addedBy,active)";
    sql += " VALUES ('" + group + "','" + groupname + "','" + GID + "'," + new Date().getTime() + "," + addedBy + "," + active + ");";
    db.query(sql, function (err, results, fields) {

        if (err) { callback({ status: "ERROR", mess: "[ERROR] on  {" + __filename + "}:\n", sql: sql, stack: err }); return; }
        callback({});
    });
};

module.exports = exe;