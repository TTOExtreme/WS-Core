const db = require('../../../../../../rotine/sql/connector');
const fs = require('fs');
const colors = require('colors');
const dbstruct = JSON.parse(fs.readFileSync(require("path").join(__dirname + "/../../../../../../configs/dbstruct.json"), 'utf8'));
const ipnormalize = require('../../../utils/ipNetmask-List.js').normalizeip;
const ipList = require('../../../utils/ipNetmask-List.js');

const exe = (data, callback) => {

    var sql = "DELETE FROM " + dbstruct.database + "._Radios WHERE `id`='" + data.id + "';";
    db.query(sql, function (err, results, fields) {
        if (err) { console.log(colors.red("[ERROR] on bin/rotine/sql/drop/Subnet.js:\n") + err); return; }

        callback({});
    });
};
module.exports = exe;