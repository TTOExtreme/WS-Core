var db = require('../sql/connector');
var fs = require('fs');
var colors = require('colors');
var dbstruct = JSON.parse(fs.readFileSync(__dirname + "/../../configs/dbstruct.json", 'utf8'));

const exe = (user, pass, callback) => {
    let sql = "SELECT * FROM " + dbstruct.database + "._Users  WHERE `user`='" + user + "' AND `pass`='" + pass + "';";
    //console.log(colors.green(sql + "\n"));
    db.query(sql, function (err, results, fields) {
        if (err) { console.log(colors.red("[ERROR] on " + __dirname + __filename + ":\n") + err); return; }
        let data = [];
        results.forEach(element => {
            data.push(JSON.parse(JSON.stringify(element)));
        });
        callback(data[0]);
    });
};

module.exports = exe;