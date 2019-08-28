var db = require('../connector');
var fs = require('fs');
var colors = require('colors');
var dbstruct = JSON.parse(fs.readFileSync(__dirname + "/../../../configs/dbstruct.json", 'utf8'));

const exe = (callback) => {

    var sql = "";

    rec(dbstruct.tables, callback);

};

function rec(tble, callback) {
    if (tble[0] != undefined) {
        var table = tble.pop();
        sql = "CREATE TABLE IF NOT EXISTS " + dbstruct.database + "." + table.table + " (";
        var index = 0;
        table.colunas.forEach(coluna => {
            if (index != 0) sql += ",";
            sql += coluna.name + " " + coluna.struct + " ";
            index++;
        })
        sql += ");"
        console.log(colors.green(sql + "\n"));

        db.query(sql, function (err, results, fields) {
            if (err) { console.log(colors.red("[ERROR] on <" + __dirname + ">:\n") + "sql: " + sql + "\n"); console.log(err); return; }
            rec(tble, callback);
        });
    } else {
        callback();
    }
}

module.exports = exe;