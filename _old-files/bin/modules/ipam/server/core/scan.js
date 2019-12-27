const netList = require('network-list');
var colors = require('colors');

var opt = {
    ip: '192.168.0',
    timeout: 500,
    vendor: true
}

var data = [];


function exe(ip, timeout = 500, addNew = true) {
    opt.ip = ip;
    opt.timeout = timeout;
    netList.scanEach(opt, (err, obj) => {
        if (err) { console.log(err); return; }
        if (addNew) {
            require('./sql/insert/newHost')("-", obj.ip, obj.hostname, obj.mac, obj.vendor, obj.hostnameError, obj.macError, obj.vendorError, obj.alive, () => { });
        }
        //data.push(obj);
    });
}


module.exports = exe;