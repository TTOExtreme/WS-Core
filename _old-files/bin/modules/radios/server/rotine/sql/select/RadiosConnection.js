const db = require('../../../../../../rotine/sql/connector');
const fs = require('fs');
const colors = require('colors');
const dbstruct = JSON.parse(fs.readFileSync(require("path").join(__dirname + "/../../../../../../configs/dbstruct.json"), 'utf8'));
const ipnormalize = require('../../../utils/ipNetmask-List.js').normalizeip;
const ipList = require('../../../utils/ipNetmask-List.js');

const exe = (callback) => {
    var sql = "SELECT * FROM " + dbstruct.database + ".rel_radio_radio;";
    //console.log(colors.green(sql + "\n"));
    db.query(sql, function (err, results, fields) {

        if (err) { callback({ status: "ERROR", mess: "[ERROR] on  {" + __filename + "}:\n", sql: sql, stack: err }); return; }
        //console.log("Return: ");
        var data = [];
        results.forEach(element => {
            data.push(JSON.parse(JSON.stringify(element)));
        });
        //console.log(data);
        callback(data);
    });
};

module.exports = exe;