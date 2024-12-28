var db = require('../connector');
const fs = require('fs');
const colors = require('colors');
const path = require("path")
var dbstruct = JSON.parse(fs.readFileSync(__dirname + "/../../../configs/dbstruct.json", 'utf8'));

const exe = (callback) => {

    let sql = "";


    fs.readdirSync(path.join(__dirname + '/../../../modules')).forEach(e => {
        if (fs.existsSync(path.join(__dirname + '/../../../modules/' + e + "/server/configs/dbstruct.json"))) {
            let v = JSON.parse(fs.readFileSync(path.join(__dirname + '/../../../modules/' + e + "/server/configs/dbstruct.json")));
            dbstruct.tables = dbstruct.tables.concat(v);
        }
    })

    rec(dbstruct.tables, callback);

};

function rec(tble, callback) {
    if (tble[0] != undefined) {
        let table = tble.pop();
        sql = "CREATE TABLE IF NOT EXISTS " + dbstruct.database + "." + table.table + " (";
        let index = 0;
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