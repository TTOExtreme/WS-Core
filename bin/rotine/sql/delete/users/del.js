var db = require('../../connector');
var colors = require('colors');
var fs = require('fs');
var dbstruct = JSON.parse(fs.readFileSync(__dirname + "/../../../../configs/dbstruct.json", 'utf8'));

const exe = (id_user, callback) => {
    var sql = "";
    sql = "DELETE FROM " + dbstruct.database + "._Users ";
    sql += " WHERE `id_user`='" + id_user + "';";

    //console.log(colors.green(sql + "\n"));
    db.query(sql, function (err, results, fields) {

        if (err) { callback({ status: "ERROR", mess: "[ERROR] on  {" + __filename + "}:\n", sql: sql, stack: err }); return; }
        callback({});
    });
};

module.exports = exe;