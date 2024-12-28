let db = require('../../../../../../rotine/sql/connector');
let fs = require('fs');
let colors = require('colors');
let dbstruct = JSON.parse(fs.readFileSync(require("path").join(__dirname + "/../../../../../../configs/dbstruct.json"), 'utf8'));
let ipnormalize = require('../../../utils/ipNetmask-List').normalizeip;

const exe = (callback) => {
    let sql = "SELECT pcid,hostname,mac,timestamp FROM " + dbstruct.database + "._HBMD_System_Stats as SYS;";

    sql += ";";

    db.query(sql, function (err, results, fields) {

        if (err) { callback({ status: "ERROR", mess: "[ERROR] on  {" + __filename + "}:\n", sql: sql, stack: err }); return; }
        let promisses = [];

        results.forEach(element => {
            let e = JSON.parse(JSON.stringify(element));
            promisses.push(new Promise(function (resolve, reject) {
                require("./Host_Last_Mem")(e.pcid, function (data) {
                    e["Mem"] = data[0];
                    require("./Host_Last_Network")(e.pcid, function (data) {
                        e["Network"] = data[0];
                        require("./Host_Last_CPU")(e.pcid, function (data) {
                            e["CPU"] = data[0];
                            require("./Host_Last_Disk")(e.pcid, function (data) {
                                e["Disk"] = data[0];
                                resolve(e);
                            }, (err) => { reject(err) })
                        }, (err) => { reject(err) })
                    }, (err) => { reject(err) })
                }, (err) => { reject(err) })
            }))
        });

        Promise.all(promisses).then(function (values) {

            callback(values);
        }).catch(err => { console.log("[ERROR] on requesting for host data: "); console.log(err) })
    });
};

module.exports = exe;