var db = require('../connector');
var fs = require('fs');
var colors = require('colors');
var bcypher = require('../../../lib/bcypher');
var dbstruct = JSON.parse(fs.readFileSync(__dirname + "/../../../configs/dbstruct.json", 'utf8'));
var dbdata = JSON.parse(fs.readFileSync(__dirname + "/../../../configs/dbdata.json", 'utf8'));

const exe = (callback) => {

    //add user admin:admin
    require('../insert/users/add')("admin", "Administrador", bcypher.sha512("admin"), bcypher.sha512("admin" + bcypher.sha512("admin") + bcypher.ger_crypt()), 1, 1, () => {

        //add Admininstradores group
        require('../insert/groups/add')("Administradores", "Administradores", bcypher.ger_crypt(), 1, 1, () => { });

        //add user admin to Administradores groups
        require('../insert/users/groups')(1, 1, 1, 1, () => { });

        //add data to tables
        if (dbdata.tables != undefined) {
            if (dbdata.tables.length > 0) {
                asyncForEach(dbdata.tables, (table) => {
                    asyncForEach(table.data, (dat, datIndex) => {
                        require('../insert/dataToTables.js')(table.name, table.struct, dat, () => {
                            if (datIndex == table.data.length - 1) {
                                userCrt(300, () => {
                                    grpCrt(80, () => {
                                        callback();

                                    })
                                })
                            }
                        })
                    })
                })
                /*
                dbdata.tables.forEach(table => {
                    table.data.forEach(dat => {
                        require('../insert/dataToTables.js')(table.name, table.struct, dat, () => { })
                    })
                });
                //*/
            }
        }
    });
};


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
            userCrt(id - 1, callback);
        }
    });
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

module.exports = exe;