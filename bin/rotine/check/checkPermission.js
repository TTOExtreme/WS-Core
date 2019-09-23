var db = require('../sql/connector');
var fs = require('fs');
var colors = require('colors');
var dbstruct = JSON.parse(fs.readFileSync(__dirname + "/../../configs/dbstruct.json", 'utf8'));

const exe = (UUID, Permission, callback) => {
    var sql = "SELECT UUID FROM " + dbstruct.database + "._Users AS Usr " +
        " INNER JOIN " + dbstruct.database + ".rel_perm_usr AS RPU ON Usr.id_user = RPU.id_user " +
        " INNER JOIN " + dbstruct.database + "._Permissions AS Per ON RPU.id_Permission = Per.id_Permission " +
        " WHERE Usr.UUID='" + UUID + "' AND Per.perm_code='" + Permission + "';";
    db.query(sql, function (err, results, fields) {
        if (err) { console.log(colors.red("[ERROR] on " + __dirname + __filename + ":\n") + err); return; }
        var data = [];
        results.forEach(element => {
            data.push(JSON.parse(JSON.stringify(element)));
        });
        if (data[0] != undefined) {
            callback(data[0].UUID == UUID);
        } else {
            callback(false);
        }
    });
};

module.exports = exe;