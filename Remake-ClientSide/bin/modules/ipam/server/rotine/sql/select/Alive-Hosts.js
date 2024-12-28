var db = require('../../../../../../rotine/sql/connector');
var fs = require('fs');
var colors = require('colors');
var dbstruct = JSON.parse(fs.readFileSync(require("path").join(__dirname + "/../../../../../../configs/dbstruct.json"), 'utf8'));

const exe = (callback) => {
    var sql = "SELECT * FROM " + dbstruct.database + "._Hosts WHERE `seted`=1;";
    //console.log(colors.green(sql + "\n"));
    db.query(sql, function (err, results, fields) {

        if (err) { callback({ status: "ERROR", mess: "[ERROR] on  {" + __filename + "}:\n", sql: sql, stack: err }); return; }
        var data = [];
        results.forEach(element => {
            data.push(JSON.parse(JSON.stringify(element)).ip);
        });
        //console.log(data);
        callback(data);
    });
};

module.exports = exe;