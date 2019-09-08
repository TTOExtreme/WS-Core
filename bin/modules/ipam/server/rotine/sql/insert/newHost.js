var db = require('../../../../../../rotine/sql/connector');
var fs = require('fs');
var colors = require('colors');
var dbstruct = JSON.parse(fs.readFileSync(require("path").join(__dirname + "/../../../../../../configs/dbstruct.json"), 'utf8'));
var ipnormalize = require('../../../utils/ipNetmask-List.js').normalizeip;
var ipList = require('../../../utils/ipNetmask-List.js');
function server(subnet, name, ip, hostname, mac, vendor, hostnameErr, macErr, vendorErr, alive, callback) {
    ip = ipnormalize(ip);
    subnet = ipnormalize(subnet);

    if (name == "null" || name == null) { name = "-" }
    if (hostname == "null" || hostname == null) { hostname = "-" }
    if (mac == "null" || mac == null) { mac = "-" }
    if (vendor == "null" || vendor == null) { vendor = "-" }


    var sql = "";
    if (alive) {
        sql = "INSERT INTO " + dbstruct.database + "._Hosts (subnet,name,ip,hostname,mac,vendor,hostnameErr,macErr,vendorErr,addedIn,alive,seted)";
        sql += " VALUES ('" + subnet + "','" + name + "','" + ip + "','" + hostname + "','" + mac + "',\"" + vendor + "\",\"" + hostnameErr + "\",\"" + macErr + "\",\"" + vendorErr + "\"," + new Date().getTime() + ",1,1)";
        sql += " ON DUPLICATE KEY UPDATE ";
        sql += "`subnet`='" + subnet + "', `hostname`='" + hostname + "', `mac`='" + mac + "', `vendor`=\"" + vendor + "\", `hostnameErr`=\"" + hostnameErr + "\", `macErr`=\"" + macErr + "\", `vendorErr`=\"" + vendorErr + "\", `alive`=1, `seted`=1 ";
        sql += ";";
    } else {
        sql = "INSERT INTO " + dbstruct.database + "._Hosts (subnet,name,ip,hostname,mac,vendor,hostnameErr,macErr,vendorErr,addedIn,alive,seted)";
        sql += " VALUES ('" + subnet + "','" + name + "','" + ip + "','" + hostname + "','" + mac + "',\"" + vendor + "\",\"" + hostnameErr + "\",\"" + macErr + "\",\"" + vendorErr + "\"," + new Date().getTime() + ",0,0)";
        sql += " ON DUPLICATE KEY UPDATE ";
        sql += "`alive`= 0 ";
        sql += ";";
    }
    //console.log(colors.green(sql + "\n"));
    db.query(sql, function (err, results, fields) {

        if (err) { callback({ status: "ERROR", mess: "[ERROR] on  {" + __filename + "}:\n", sql: sql, stack: err }); return; }
        callback({});
    });
};

function portsOpen(subnet, ip, ports, callback) {
    ip = ipnormalize(ip);
    subnet = ipnormalize(subnet);


    var sql = "";
    sql = "INSERT INTO " + dbstruct.database + "._Hosts (subnet,ip,portsOpen)";
    sql += " VALUES ('" + subnet + "','" + ip + "','" + ports + "')";
    sql += " ON DUPLICATE KEY UPDATE ";
    sql += "`subnet`='" + subnet + "', `portsOpen`='" + ports + "'  ";
    sql += ";";
    db.query(sql, function (err, results, fields) {

        if (err) { callback({ status: "ERROR", mess: "[ERROR] on  {" + __filename + "}:\n", sql: sql, stack: err }); return; }
        callback({});
    });
};

function client(data, callback) {
    var ip = ipList.normalizeip(data.ip);
    var subnet = ipList.normalizeip(ipList.normalizeIP3(data.subnet));
    var name = (data.name != undefined) ? data.name : "-";
    var mac = (data.mac != undefined) ? data.mac : "-";
    var hostname = (data.hostname != undefined) ? data.hostname : "-";
    var vendor = (data.vendor != undefined) ? data.vendor : "-";


    if (name == "null") { name = "-" }
    if (hostname == "null") { hostname = "-" }
    if (mac == "null") { mac = "-" }
    if (vendor == "null") { vendor = "-" }

    var sql = "";
    sql = "INSERT INTO " + dbstruct.database + "._Hosts (subnet,name,ip,hostname,mac,vendor,hostnameErr,macErr,vendorErr,addedIn,alive,seted)";
    sql += " VALUES ('" + subnet + "','" + name + "','" + ip + "','-','" + mac + "',\"-\",\"-\",\"-\",\"-\"," + new Date().getTime() + ",0,0)";
    sql += " ON DUPLICATE KEY UPDATE ";
    sql += "`subnet`='" + subnet + "',`name`='" + name + "', `hostname`='" + hostname + "', `vendor`=\"" + vendor + "\", `mac`='" + mac + "' , `seted`=1 ";
    sql += ";";

    //console.log(colors.green(sql + "\n"));
    db.query(sql, function (err, results, fields) {

        if (err) { callback({ status: "ERROR", mess: "[ERROR] on  {" + __filename + "}:\n", sql: sql, stack: err }); return; }
        callback(data);
    });
};

module.exports = { client, server, portsOpen };