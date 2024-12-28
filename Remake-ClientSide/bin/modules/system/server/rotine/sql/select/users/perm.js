var db = require('../../../../../../../rotine/sql/connector');
var fs = require('fs');
var colors = require('colors');
var dbstruct = JSON.parse(fs.readFileSync(require("path").join(__dirname + "/../../../../../../../configs/dbstruct.json"), 'utf8'));

const single = (user_id, id_usr, callback) => {
    var sql = "SELECT PER.*,RPU.*, IF(SEL1.id_user=" + id_usr + ",1,0) AS atr " +
        " FROM " + dbstruct.database + "._Permissions AS PER" +
        " LEFT JOIN " + dbstruct.database + ".rel_perm_usr AS RPU ON PER.id_Permission = RPU.id_Permission " +
        " LEFT JOIN " + dbstruct.database + "._Users AS USR1 ON USR1.id_user = RPU.id_user" +

        " LEFT JOIN " +
        " (SELECT USR2.id_user,RPU1.id_Permission FROM " + dbstruct.database + ".rel_perm_usr AS RPU1" +
        " LEFT JOIN " + dbstruct.database + "._Users AS USR2 ON USR2.id_user = RPU1.id_user" +
        " WHERE USR2.id_user=" + id_usr + " AND RPU1.active=1)" +
        " AS SEL1 ON SEL1.id_Permission = PER.id_Permission" +

        " WHERE USR1.id_user=" + user_id + " AND RPU.active=1" +
        ";";
    db.query(sql, function (err, results, fields) {

        if (err) { callback({ status: "ERROR", mess: "[ERROR] on  {" + __filename + "}:\n", sql: sql, stack: err }); return; }
        var data = [];
        results.forEach(element => {
            if (element.perm_code != null && element.perm_code != undefined)
                data.push(JSON.parse(JSON.stringify(element)));
        });
        callback(data);
    });
};

module.exports = single;