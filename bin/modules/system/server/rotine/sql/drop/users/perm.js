var db = require('../../../../../../../rotine/sql/connector');
var fs = require('fs');
var colors = require('colors');
var dbstruct = JSON.parse(fs.readFileSync(require("path").join(__dirname + "/../../../../../../../configs/dbstruct.json"), 'utf8'));

const single = (user_id, data, callback) => {
    var sql = "UPDATE " + dbstruct.database + ".rel_perm_usr" +
        " SET active=0 , deactivatedIn='" + new Date().getTime() + "' , deactivatedBy=" + user_id + " " +
        " WHERE id_Permission=" + data.id_Permission + " AND id_user=" + data.id_user + " " +
        ";";
    db.query(sql, function (err, results, fields) {

        if (err) { callback({ status: "ERROR", mess: "[ERROR] on  {" + __filename + "}:\n", sql: sql, stack: err }); return; }
        var data = [];
        callback(data);
    });
};

module.exports = single;