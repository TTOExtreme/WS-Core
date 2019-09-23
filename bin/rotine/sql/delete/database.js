var db = require('../connector');
var fs = require('fs');
var colors = require('colors');
var dbstruct = JSON.parse(fs.readFileSync(__dirname + "/../../../configs/dbstruct.json", 'utf8'));

const exe = (callback) => {
    var sql = "DROP DATABASE IF EXISTS " + dbstruct.database + ";";
    console.log(colors.red(sql));
    db.query(sql, function (err, results, fields) {
        if (err) { console.log(colors.red("[ERROR] on bin/rotine/sql/create/database.js:\n") + err); return; }
        callback();
    });
};

module.exports = exe;