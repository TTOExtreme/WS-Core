var db = require('../connector');
var fs = require('fs');
var colors = require('colors');
var bcypher = require('../../../lib/bcypher');
var dbstruct = JSON.parse(fs.readFileSync(__dirname + "/../../../configs/dbstruct.json", 'utf8'));
var dbdata = JSON.parse(fs.readFileSync(__dirname + "/../../../configs/dbdata.json", 'utf8'));

const exe = (callback) => {

    //add user admin:admin
    require('../insert/users/add')("admin", "Administrador", bcypher.sha512("admin"), bcypher.sha512("admin" + bcypher.sha512("admin") + bcypher.ger_crypt()), 1, 1, () => {


        //ad more 300 users
        for (var i = 0; i < 300; i++) {
            require('../insert/users/add')("admin-" + i, i, "ads", "asd", 1, 1, () => { });
        }
        //add 30 groups
        for (var i = 0; i < 30; i++) {
            require('../insert/groups/add')("group-" + i, "G-" + i, "ads", 1, 1, () => { });
        }
        //add user 1 to 30 groups
        for (var i = 0; i < 30; i++) {
            require('../insert/users/groups')(1, i, 1, 1, () => { });
        }
        //add more 30 groups
        for (var i = 0; i < 30; i++) {
            require('../insert/groups/add')("sub-group-" + i + 30, "sub-G-" + i + 30, "ads", 1, 1, () => { });
        }
        //add group 1 to 30 groups
        for (var i = 0; i < 30; i++) {
            require('../insert/groups/groups')(1, i + 30, 1, 1, () => { });
        }

        //add data to tables
        if (dbdata.tables != undefined) {
            if (dbdata.tables.length > 0) {
                dbdata.tables.forEach(table => {
                    table.data.forEach(dat => {
                        require('../insert/dataToTables.js')(table.name, table.struct, dat, () => { })
                    })
                });
            }
        }
        callback();

    });
};

module.exports = exe;