var db = require('../connector');
const fs = require('fs');
const colors = require('colors');
const path = require("path");

var bcypher = require('../../../lib/bcypher');
var dbstruct = JSON.parse(fs.readFileSync(__dirname + "/../../../configs/dbstruct.json", 'utf8'));
let dbdata = {};

const exe = (callback) => {

    //add user admin:admin
    require('../insert/users/add')("admin", "Administrador", bcypher.sha512("admin"), bcypher.sha512("admin" + bcypher.sha512("admin") + bcypher.ger_crypt()), 1, 1, () => {

        //add Admininstradores group
        require('../insert/groups/add')("Administradores", "Administradores", bcypher.ger_crypt(), 1, 1, () => {

            //add user admin to Administradores groups
            require('../insert/users/groups')(1, 1, 1, 1, () => {

                //request data on root folder
                dbdata = JSON.parse(fs.readFileSync(__dirname + "/../../../configs/dbdata.json", 'utf8'));

                //load all the modules  
                fs.readdirSync(path.join(__dirname + "/../../../modules/")).forEach((e) => {
                    let dpath = path.join(__dirname + "/../../../modules/" + e + "/server/configs/dbdata.json")
                    if (fs.existsSync(dpath)) {
                        dbdata.tables = dbdata.tables.concat(JSON.parse(fs.readFileSync(dpath, 'utf8')).tables);
                    }
                })

                //add data to tables
                insertData(dbdata, () => {
                    /*userCrt(50, () => {
                        grpCrt(80, () => {
                            callback();
                        })
                    })
                    //*/
                    callback();
                })
            });
        });

    });



    //*/
};

function insertData(data, callback) {
    if (data.tables != undefined) {
        if (data.tables.length > 0) {
            subTableInsert(data.tables, () => {
                callback();
            })
        }
    }
}

function subTableInsert(tableList, callback) {
    if (tableList.length > 0) {
        let table = tableList.pop();
        if (table.data != undefined) {
            if (table.data.length > 0) {
                subdataInsert(table.name, table.struct, table.data, () => {
                    subTableInsert(tableList, callback);
                })
            }
        }
    } else {
        callback();
    }
}

function subdataInsert(tableName, tableStruct, dataList, callback) {
    require('../insert/dataToTables.js')(tableName, tableStruct, dataList.pop(), () => {
        if (dataList.length > 0) {
            subdataInsert(tableName, tableStruct, dataList, callback);
        } else {
            callback();
        }
    })
}

function userCrt(id, callback) {
    require('../insert/users/add')("usr-" + id, "user-" + id, "asd", bcypher.ger_crypt(), 1, 1, () => {
        if (id == 1) {
            callback();
        } else {
            userCrt(id - 1, callback);
        }
    });
}
function grpCrt(id, callback) {
    require('../insert/groups/add')("grp-" + id, "grp-" + id, bcypher.ger_crypt(), 1, 1, () => {
        if (id == 1) {
            callback();
        } else {
            grpCrt(id - 1, callback);
        }
    });
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

module.exports = exe;