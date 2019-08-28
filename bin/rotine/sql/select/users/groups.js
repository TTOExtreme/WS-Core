var db = require('../../connector');
var fs = require('fs');
var colors = require('colors');
var dbstruct = JSON.parse(fs.readFileSync(__dirname + "/../../../../configs/dbstruct.json", 'utf8'));

const single = (id_user, callback) => {
    var sql = "SELECT GRP.grp,GRP.id_group,GRP.groupname,GRP.GID,GRP.addedIn,GRP.addedBy,GRP.deactivatedIn,GRP.deactivatedBy,GRP.active " +
        " FROM " + dbstruct.database + "._Users AS USR1" +
        " INNER JOIN " + dbstruct.database + ".rel_groups_usr AS RGU ON USR1.id_user = RGU.id_user" +
        " INNER JOIN " + dbstruct.database + "._Groups AS GRP ON GRP.id_group = RGU.id_group" +
        " WHERE USR1.id_user=" + id_user + "" +
        ";";
    //console.log(sql)
    db.query(sql, function (err, results, fields) {

        if (err) { callback({ status: "ERROR", mess: "[ERROR] on  <" + __filename + ">:\n", sql: sql, stack: err }); return; }
        var data = [];
        results.forEach(element => {
            data.push(JSON.parse(JSON.stringify(element)));
        });
        callback(data);
    });
};

module.exports = single;