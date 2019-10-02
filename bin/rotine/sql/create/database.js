var db = require('../connector');
var fs = require('fs');
var colors = require('colors');
var dbstruct = JSON.parse(fs.readFileSync(__dirname + "/../../../configs/dbstruct.json", 'utf8'));

const exe = (callback) => {
    let sql = "CREATE DATABASE IF NOT EXISTS " + dbstruct.database + ";";
    db.query(sql, function (err, results, fields) {
        if (err) { console.log(colors.red("[ERROR] on <" + _filename + ">:\n") + "sql: " + sql + "\n" + err); return; }
        callback();
    });
};

module.exports = exe;