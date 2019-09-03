var db = require('../../../../../rotine/sql/connector');
var fs = require('fs');
var colors = require('colors');
var dbstruct = JSON.parse(fs.readFileSync(__dirname + "/../../../configs/dbstruct.json", 'utf8'));
var ipnormalize = require('../../../../../rotine/utils/ipNetmask-List.js').normalizeip;
var ipList = require('../../../../../rotine/utils/ipNetmask-List.js');

function exe(data, callback) {
    var ip = ipList.normalizeip(data.ip);
    var name = (data.name != undefined) ? data.name : "-";
    var mac = (data.mac != undefined) ? data.mac : "-";
    var hostname = (data.hostname != undefined) ? data.hostname : "-";
    var vendor = (data.vendor != undefined) ? data.vendor : "-";
    var autoScan = (data.autoScan != undefined) ? data.autoScan : "-";
    var pass = (data.pass != undefined) ? data.pass : "-";
    var community = (data.community != undefined) ? data.community : "-";

    var SSID = (data.SSID != undefined) ? data.SSID : "-";
    var AirmaxCapacity = (data.AirmaxCapacity != undefined) ? data.AirmaxCapacity : -1;
    var AirmaxQuality = (data.AirmaxQuality != undefined) ? data.AirmaxQuality : -1;
    var AirmaxState = (data.AirmaxState != undefined) ? data.AirmaxState : -1;
    var CCQ = (data.CCQ != undefined) ? data.CCQ : -1;
    var ChannelFreq = (data.ChannelFreq != undefined) ? data.ChannelFreq : -1;
    var ChannelWidth = (data.ChannelWidth != undefined) ? data.ChannelWidth : -1;
    var Encrypt = (data.Encrypt != undefined) ? data.Encrypt : 0;
    var Noise = (data.Noise != undefined) ? data.Noise : -1;
    var RSSI = (data.RSSI != undefined) ? data.RSSI : -1;
    var RXrate = (data.RXrate != undefined) ? data.RXrate : -1;
    var TXrate = (data.TXrate != undefined) ? data.TXrate : -1;
    var RadioMode = (data.RadioMode != undefined) ? data.RadioMode : -1;
    var RadioSignal = (data.RadioSignal != undefined) ? data.RadioSignal : -1;
    var dbmPower = (data.dbmPower != undefined) ? data.dbmPower : -1;


    if (name == "null") { name = "-" }
    if (hostname == "null") { hostname = "-" }
    if (mac == "null") { mac = "-" }
    if (vendor == "null") { vendor = "-" }

    var sql = "";
    sql = "INSERT INTO " + dbstruct.database + "._Radios (name,ip,community,hostname,mac,vendor,hostnameErr,macErr,vendorErr,addedIn,alive,seted,autoscan,";
    sql += "SSID,Pass,AirmaxCapacity,AirmaxQuality,AirmaxState,CCQ,ChannelFreq,ChannelWidth,Encrypt,Noise,RSSI,RXrate,TXrate,RadioMode,RadioSignal,dbmPower)";
    sql += " VALUES ('" + name + "','" + ip + "','" + community + "','-','" + mac + "',\"-\",\"-\",\"-\",\"-\"," + new Date().getTime() + ",0,1," + autoScan + ",";
    sql += "'" + SSID + "','" + pass + "'," + AirmaxCapacity + "," + AirmaxQuality + "," + AirmaxState + "," + CCQ + "," + ChannelFreq + "," + ChannelWidth + ",'" + Encrypt + "'," + Noise + "," + RSSI + "," + RXrate + "," + TXrate + "," + RadioMode + "," + RadioSignal + "," + dbmPower + ")";
    sql += " ON DUPLICATE KEY UPDATE ";
    sql += "`name`='" + name + "', `pass`='" + pass + "', `seted`=1, `autoscan`=" + autoScan + ", `community`='" + community + "' ";
    sql += ";";

    //console.log(colors.green(sql + "\n"));
    db.query(sql, function (err, results, fields) {
        if (err) { console.log(colors.red("[ERROR] on " + __dirname + " <" + __filename + ">:\n") + err); console.log(colors.red("SQL: " + sql)); return; }
        callback(data);
    });
};

module.exports = exe;