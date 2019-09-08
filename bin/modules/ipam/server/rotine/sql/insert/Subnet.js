var db = require('../../../../../../rotine/sql/connector');
var fs = require('fs');
var colors = require('colors');
var dbstruct = JSON.parse(fs.readFileSync(require("path").join(__dirname + "/../../../../../../configs/dbstruct.json"), 'utf8'));
var newHost = require('./newHost.js');
var ipList = require('../../../utils/ipNetmask-List.js');

const exe = (data, callback) => {
    var subnet = JSON.parse(data.data);
    var name = subnet.name, ip = subnet.ip, gtw = subnet.gtw, netmask = subnet.netmask, autoScan = subnet.autoScan;
    ip = ipList.normalizeip(ip);
    gtw = ipList.normalizeip(gtw);
    netmask = ipList.normalizeNetmask(netmask);

    var sql = "INSERT INTO " + dbstruct.database + "._Subnets (name,ip,gtw,netmask,autoscan) VALUES ('" + name + "','" + ip + "','" + gtw + "'," + netmask + "," + autoScan + ") ";
    sql += "ON DUPLICATE KEY UPDATE ";
    sql += " `name`= '" + name + "',`ip`= '" + ip + "',`gtw`='" + gtw + "' ,`netmask`=" + netmask + " ,`autoscan`=" + autoScan + " ";
    sql += ";";
    db.query(sql, function (err, results, fields) {

        if (err) { callback({ status: "ERROR", mess: "[ERROR] on  {" + __filename + "}:\n", sql: sql, stack: err }); return; }
        fillHosts(ip, netmask, () => {
            callback(subnet);
        });
    });
};

function fillHosts(ip, netmask, callback) {
    require('../delete/HostsOtherNetmask')(ip, netmask, () => {
        require('../../../utils/ipNetmask-List.js').GetList(ip, netmask, (subnetsList) => {
            ipList.GetList(ip, netmask, (ips) => {
                var promise = ips.map((host) => {
                    return getPromiseInsert(ip, host);
                })
                Promise.all(promise).then(() => { callback(); })
            })
        });
    });
}

function getPromiseInsert(ip, host) {
    return new Promise((resolve, reject) => {
        newHost.server(ip, "-", host, "-", "-", "-", "-", "-", "-", 0, () => { resolve(); });
    })
}

module.exports = exe;