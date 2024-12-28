let db = require('../../../../../../rotine/sql/connector');
let fs = require('fs');
let colors = require('colors');
let dbstruct = JSON.parse(fs.readFileSync(require("path").join(__dirname + "/../../../../../../configs/dbstruct.json"), 'utf8'));
let ipnormalize = require('../../../utils/ipNetmask-List').normalizeip;

const exe = (pcid, callback, reject) => {
    let sql = "SELECT min,med,max,data,info FROM " + dbstruct.database + "._HBMD_CPU_Stats WHERE `pcid`='" + pcid + "' ORDER BY TIMESTAMP DESC Limit 1;";

    db.query(sql, function (err, results, fields) {

        if (err) { reject({ status: "ERROR", mess: "[ERROR] on  {" + __filename + "}:\n", sql: sql, stack: err }); return; }
        let data = [];

        results.forEach(element => {
            let e = JSON.parse(JSON.stringify(element));
            data.push(e);
        });
        callback(data);
    });
};

module.exports = exe;