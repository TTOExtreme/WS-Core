let db = require('../../../../../../rotine/sql/connector');
let fs = require('fs');
let colors = require('colors');
let dbstruct = JSON.parse(fs.readFileSync(require("path").join(__dirname + "/../../../../../../configs/dbstruct.json"), 'utf8'));
let ipnormalize = require('../../../utils/ipNetmask-List').normalizeip;

const exe = (callback) => {
    let sql = "SELECT pcid,hostname,mac,timestamp FROM " + dbstruct.database + "._HBMD_System_Stats;";
    db.query(sql, function (err, results, fields) {

        if (err) { callback({ status: "ERROR", mess: "[ERROR] on  {" + __filename + "}:\n", sql: sql, stack: err }); return; }
        let data = [];

        let promArray = [];

        results.forEach(element => {
            let e = JSON.parse(JSON.stringify(element));
            //e.data = e.data;
            promArray.push
            e.child = [

            ];
            data.push(e);
        });


        callback(data);
    });
};

module.exports = exe;