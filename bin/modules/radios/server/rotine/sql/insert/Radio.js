const db = require('../../../../../../rotine/sql/connector');
const fs = require('fs');
const colors = require('colors');
const dbstruct = JSON.parse(fs.readFileSync(require("path").join(__dirname + "/../../../../../../configs/dbstruct.json"), 'utf8'));
const ipnormalize = require('../../../utils/ipNetmask-List.js').normalizeip;
const ipList = require('../../../utils/ipNetmask-List.js');

function exe(dt, callback) {
    let data = JSON.parse(dt);

    let ip = ipList.normalizeip(data.ip);
    let name = (data.name != undefined) ? data.name : "-";
    let mac = (data.mac != undefined) ? data.mac : "-";
    let hostname = (data.hostname != undefined) ? data.hostname : "-";
    let vendor = (data.vendor != undefined) ? data.vendor : "-";
    let autoScan = (data.autoScan != undefined) ? data.autoScan : 0;
    let pass = (data.pass != undefined) ? data.pass : "-";
    let community = (data.community != undefined) ? data.community : "-";

    let SSID = (data.SSID != undefined) ? data.SSID : "-";
    let AirmaxCapacity = (data.AirmaxCapacity != undefined) ? data.AirmaxCapacity : -1;
    let AirmaxQuality = (data.AirmaxQuality != undefined) ? data.AirmaxQuality : -1;
    let AirmaxState = (data.AirmaxState != undefined) ? data.AirmaxState : -1;
    let CCQ = (data.CCQ != undefined) ? data.CCQ : -1;
    let ChannelFreq = (data.ChannelFreq != undefined) ? data.ChannelFreq : -1;
    let ChannelWidth = (data.ChannelWidth != undefined) ? data.ChannelWidth : -1;
    let Encrypt = (data.Encrypt != undefined) ? data.Encrypt : 0;
    let Noise = (data.Noise != undefined) ? data.Noise : -1;
    let RSSI = (data.RSSI != undefined) ? data.RSSI : -1;
    let RXrate = (data.RXrate != undefined) ? data.RXrate : -1;
    let TXrate = (data.TXrate != undefined) ? data.TXrate : -1;
    let RadioMode = (data.RadioMode != undefined) ? data.RadioMode : -1;
    let RadioSignal = (data.RadioSignal != undefined) ? data.RadioSignal : -1;
    let dbmPower = (data.dbmPower != undefined) ? data.dbmPower : -1;


    if (name == "null") { name = "-" }
    if (hostname == "null") { hostname = "-" }
    if (mac == "null") { mac = "-" }
    if (vendor == "null") { vendor = "-" }

    let sql = "";
    sql = "INSERT INTO " + dbstruct.database + "._Radios (name,ip,community,hostname,mac,vendor,hostnameErr,macErr,vendorErr,addedIn,alive,seted,autoscan,";
    sql += "SSID,Pass,AirmaxCapacity,AirmaxQuality,AirmaxState,CCQ,ChannelFreq,ChannelWidth,Encrypt,Noise,RSSI,RXrate,TXrate,RadioMode,RadioSignal,dbmPower)";
    sql += " VALUES ('" + name + "','" + ip + "','" + community + "','-','" + mac + "',\"-\",\"-\",\"-\",\"-\"," + new Date().getTime() + ",0,1," + autoScan + ",";
    sql += "'" + SSID + "','" + pass + "'," + AirmaxCapacity + "," + AirmaxQuality + "," + AirmaxState + "," + CCQ + "," + ChannelFreq + "," + ChannelWidth + ",'" + Encrypt + "'," + Noise + "," + RSSI + "," + RXrate + "," + TXrate + "," + RadioMode + "," + RadioSignal + "," + dbmPower + ")";
    sql += " ON DUPLICATE KEY UPDATE ";
    sql += "`name`='" + name + "', `pass`='" + pass + "', `seted`=1, `autoscan`=" + autoScan + ", `community`='" + community + "' ";
    sql += ";";

    console.log(colors.green(sql + "\n"));
    db.query(sql, function (err, results, fields) {
        if (err) { console.log(colors.red("[ERROR] on " + __dirname + " <" + __filename + ">:\n") + err); console.log(colors.red("SQL: " + sql)); }
        callback(data);
    });
};

module.exports = exe;