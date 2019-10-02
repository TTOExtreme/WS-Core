
var colors = require('colors');
var snmp = require("net-snmp");
var fs = require("fs");
var oidsList = require("./snmp_oids");

var SetName = require("../../sql/update/radios/radio_set_name");
var SetHostname = require("../../sql/update/radios/radio_set_hostname");
var SetSSID = require("../../sql/update/radios/radio_set_ssid");
var SetAMC = require("../../sql/update/radios/radio_set_airmaxcapacity");
var SetAMQ = require("../../sql/update/radios/radio_set_airmaxquality");
var SetAMS = require("../../sql/update/radios/radio_set_airmaxstate");
var SetCCQ = require("../../sql/update/radios/radio_set_ccq");
var SetCFreq = require("../../sql/update/radios/radio_set_channelfreq");
var SetCWidth = require("../../sql/update/radios/radio_set_channelwidth");
var SetEnc = require("../../sql/update/radios/radio_set_encrypt");
var SetNoise = require("../../sql/update/radios/radio_set_noise");
var SetRSSI = require("../../sql/update/radios/radio_set_rssi");
var SetRXR = require("../../sql/update/radios/radio_set_rxrate");
var SetTXR = require("../../sql/update/radios/radio_set_txrate");
var SetRMode = require("../../sql/update/radios/radio_set_radiomode");
var SetRSignal = require("../../sql/update/radios/radio_set_radiosignal");
var SetDBMPower = require("../../sql/update/radios/radio_set_dbmpower");


function getOID(ip, community, oid, callback, errorcall) {
    var session = snmp.createSession(ip, community);
    session.get([oid], function (error, varbinds) {
        if (error) {
            errorcall(error.toString())
            console.error("ip: " + ip + " > " + error.toString());
        } else {
            for (var i = 0; i < varbinds.length; i++) {
                // for version 1 we can assume all OIDs were successful
                //console.log("V1: " + varbinds[i].oid + "|" + varbinds[i].value);
                // for version 2c we must check each OID for an error condition
                if (snmp.isVarbindError(varbinds[i])) {
                    //console.error("V2: " + snmp.varbindError(varbinds[i]));
                    errorcall("Cannot Comunicate");
                } else {
                    //console.log("V2: " + varbinds[i].oid + "|" + varbinds[i].value);
                    callback(varbinds[i].value);
                }
            }
        }
    });
}

function getIP(ip, community, callback, errorcall) {
    //console.log("Radio IP: " + ip)
    getOID(ip, community, oidsList.name, (value) => {
        SetHostname(ip, value);
        getOID(ip, community, oidsList.SSID, (value) => {
            SetSSID(ip, value);
            getOID(ip, community, oidsList.AirmaxCapacity, (value) => {
                SetAMC(ip, value);
                getOID(ip, community, oidsList.AirmaxQuality, (value) => {
                    SetAMQ(ip, value);
                    getOID(ip, community, oidsList.AirmaxState, (value) => {
                        SetAMS(ip, value);
                        getOID(ip, community, oidsList.CCQ, (value) => {
                            SetCCQ(ip, value);
                            getOID(ip, community, oidsList.ChannelFreq, (value) => {
                                SetCFreq(ip, value);
                                getOID(ip, community, oidsList.ChannelWidth, (value) => {
                                    SetCWidth(ip, value);
                                    getOID(ip, community, oidsList.Encrypt, (value) => {
                                        SetEnc(ip, value);
                                        getOID(ip, community, oidsList.Noise, (value) => {
                                            SetNoise(ip, value);
                                            getOID(ip, community, oidsList.RSSI, (value) => {
                                                SetRSSI(ip, value);
                                                getOID(ip, community, oidsList.RXrate, (value) => {
                                                    SetRXR(ip, value);
                                                    getOID(ip, community, oidsList.RadioMode, (value) => {
                                                        SetRMode(ip, value);
                                                        getOID(ip, community, oidsList.RadioSignal, (value) => {
                                                            SetRSignal(ip, value);
                                                            getOID(ip, community, oidsList.TXrate, (value) => {
                                                                SetTXR(ip, value);
                                                                getOID(ip, community, oidsList.dbmPower, (value) => {
                                                                    SetDBMPower(ip, value);
                                                                    callback();
                                                                }, (error) => { errorcall(error) });
                                                            }, (error) => { errorcall(error) });
                                                        }, (error) => { errorcall(error) });
                                                    }, (error) => { errorcall(error) });
                                                }, (error) => { errorcall(error) });
                                            }, (error) => { errorcall(error) });
                                        }, (error) => { errorcall(error) });
                                    }, (error) => { errorcall(error) });
                                }, (error) => { errorcall(error) });
                            }, (error) => { errorcall(error) });
                        }, (error) => { errorcall(error) });
                    }, (error) => { errorcall(error) });
                }, (error) => { errorcall(error) });
            }, (error) => { errorcall(error) });
        }, (error) => { errorcall(error) });
    }, (error) => { errorcall(error) });
}

//getIP("192.168.140.2");

module.exports = getIP;