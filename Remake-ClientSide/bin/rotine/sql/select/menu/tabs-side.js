const colors = require('colors');
const fs = require('fs');
const path = require("path");

var lista = [

];

function init() {
    fs.readdirSync(path.join(__dirname + '../../../../../modules')).forEach(e => {
        if (fs.existsSync(path.join(__dirname + '../../../../../modules/' + e + "/server/tabs-side.js"))) {
            var v = require(path.join(__dirname + '../../../../../modules/' + e + "/server/tabs-side.js"))
            lista = lista.concat(v);
        }
    })
}

init();

const exe = (UUID, callback, index = 0, ret = []) => {
    require('../../../check/checkPermission')(UUID, lista[index].perm, (state) => {
        try {
            if (state) {
                ret.push(lista[index].data);
            }
            if (lista.length > (index + 1)) {
                exe(UUID, callback, index + 1, ret)
            } else {
                callback(ret);
            }
        } catch (err) {
            if (err) { console.log(colors.red("[ERROR] on <" + __filename + ">:\n") + err); return; }
        }

    })
};

module.exports = exe;