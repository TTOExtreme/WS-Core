var db = require('../../../../../../../rotine/sql/connector');
var fs = require('fs');
var colors = require('colors');
var dbstruct = JSON.parse(fs.readFileSync(require("path").join(__dirname + "/../../../../../../../configs/dbstruct.json"), 'utf8'));

const single = (user_id, data, callback) => {
    db.query("SELECT * FROM " + dbstruct.database + ".rel_perm_usr AS PER WHERE PER.id_user=" + data.id_user + " AND PER.id_Permission=" + data.id_Permission,
        function (err, results, fields) {

            if (err) { callback({ status: "ERROR", mess: "[ERROR] on  {" + __filename + "}:\n", sql: sql, stack: err }); return; }
            var sql = "";
            console.log(results)
            if (results.length > 0) {
                sql = "UPDATE " + dbstruct.database + ".rel_perm_usr" +
                    " SET active=1 " +
                    " WHERE id_Permission=" + data.id_Permission + " AND id_user=" + data.id_user + " " +
                    ";";
            } else {
                sql = "INSERT INTO " + dbstruct.database + ".rel_perm_usr" +
                    " (id_Permission,id_user,addedIn,addedBy,active) VALUES" +
                    " (" + data.id_Permission + "," + data.id_user + ",'" + new Date().getTime() + "'," + user_id + ",1)" +
                    ";";
            }
            console.log(sql.green);
            db.query(sql, function (err, results, fields) {

                if (err) { callback({ status: "ERROR", mess: "[ERROR] on  {" + __filename + "}:\n", sql: sql, stack: err }); return; }
                var data = [];
                callback({});
            });
        });
};

module.exports = single;