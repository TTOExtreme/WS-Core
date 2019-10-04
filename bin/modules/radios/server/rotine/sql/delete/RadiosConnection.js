const db = require('../../../../../../rotine/sql/connector');
const fs = require('fs');
const colors = require('colors');
const dbstruct = JSON.parse(fs.readFileSync(require("path").join(__dirname + "/../../../../../../configs/dbstruct.json"), 'utf8'));
const ipnormalize = require('../../../utils/ipNetmask-List.js').normalizeip;
const ipList = require('../../../utils/ipNetmask-List.js');

const exe = (data, callback) => {
    //let data = JSON.parse(dt);

    if (data.id_radio_ap == undefined) { callback(data); }
    if (data.id_radio_st == undefined) { callback(data); }


    let sql = "DELETE FROM " + dbstruct.database + ".rel_radio_radio " +
        "WHERE `id_radio_ap`=" + data.id_radio_ap + " AND `id_radio_st`=" + data.id_radio_st +
        ";";


    db.query(sql, function (err, results, fields) {
        if (err) { console.log(colors.red("[ERROR] on bin/rotine/sql/drop/Subnet.js:\n") + err); return; }
        callback({});
    });
};
module.exports = exe;