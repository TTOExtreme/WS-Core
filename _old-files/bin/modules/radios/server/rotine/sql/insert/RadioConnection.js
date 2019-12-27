const db = require('../../../../../../rotine/sql/connector');
const fs = require('fs');
const colors = require('colors');
const dbstruct = JSON.parse(fs.readFileSync(require("path").join(__dirname + "/../../../../../../configs/dbstruct.json"), 'utf8'));
const ipnormalize = require('../../../utils/ipNetmask-List.js').normalizeip;
const ipList = require('../../../utils/ipNetmask-List.js');

function exe(user_id, dt, callback) {
    let data = JSON.parse(dt);

    if (data.id_radio_ap == undefined) { callback(data); }
    if (data.id_radio_st == undefined) { callback(data); }

    let sql = "INSERT INTO " + dbstruct.database + ".rel_radio_radio " +
        "(id_radio_ap,id_radio_st,addedIn,addedBy,active)" +
        " VALUES " +
        "(" + data.id_radio_ap + "," + data.id_radio_st + "," + new Date().getTime() + "," + user_id + ",1);";

    db.query(sql, function (err, results, fields) {
        if (err) { console.log(colors.red("[ERROR] on " + __dirname + " <" + __filename + ">:\n") + err); console.log(colors.red("SQL: " + sql)); }
        callback(data);
    });
};

module.exports = exe;