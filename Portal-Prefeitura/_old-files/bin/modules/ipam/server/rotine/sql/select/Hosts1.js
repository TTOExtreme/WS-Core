var db = require('../../../../../../rotine/sql/connector');
var fs = require('fs');
var colors = require('colors');

const exe = (callback) => {
    require('./Subnet')((data) => {
        if (data.length > 0) {
            rec(data, 0, (ret) => {
                callback(ret)
            });
        }
    })

};

function rec(data, index) {

}

module.exports = exe;