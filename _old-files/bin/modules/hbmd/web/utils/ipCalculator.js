function GetNHosts(netmask) {
    //calculate number of hosts
    var nHosts = Math.pow(2, (32 - netmask));
    nHosts -= 2; //Subnet class 192.168.0.0 and broadcast
    return nHosts;
}

function GetInitialHost(ip) {
    return normalizeIP3(ip) + ".1";
}

function GetEndHost(ip, netmask) {
    netmask = normalizeNetmask(netmask);
    //ipv4
    ip = normalizeIP(ip);
    //normalize
    var ipSegment = ip.split(".");
    while (ipSegment.length < 4) {
        ipSegment.push("0");
    }
    var nHosts = GetNHosts(netmask);

    if (netmask == 32 || netmask == 31) {
        callback(["" + ipSegment[0] + "." + ipSegment[1] + "." + ipSegment[2] + "." + ipSegment[3]]);
        return;
    }

    for (var A = parseInt(ipSegment[0]); A <= 255; A++) {
        for (var B = parseInt(ipSegment[1]); B <= 255; B++) {
            for (var C = parseInt(ipSegment[2]); C <= 255; C++) {
                for (var D = 0; D <= 255; D++) {
                    nHosts--;
                    if (nHosts < 0) {
                        return normalizeIP("" + A + "." + B + "." + C + "." + D);
                    }
                }
                ipSegment[2] = "0";
            }
            ipSegment[1] = "0";
        }
    }
}

function GetList(ip, netmask, callback) {
    netmask = normalizeNetmask(netmask);
    //ipv4
    ip = normalizeip(ip);
    //normalize
    var ipSegment = ip.split(".");
    while (ipSegment.length < 4) {
        ipSegment.push("0");
    }

    //calculate number of hosts
    var nHosts = GetNHosts(netmask);

    if (netmask == 32 || netmask == 31) {
        callback(["" + ipSegment[0] + "." + ipSegment[1] + "." + ipSegment[2] + "." + ipSegment[3]]);
        return;
    }
    //create list of hosts
    var arrayHosts = [];
    for (var A = parseInt(ipSegment[0]); A <= 255; A++) {
        for (var B = parseInt(ipSegment[1]); B <= 255; B++) {
            for (var C = parseInt(ipSegment[2]); C <= 255; C++) {
                for (var D = 0; D <= 255; D++) {
                    if (D != 0) {
                        arrayHosts.push("" + A + "." + B + "." + C + "." + D);
                    }
                    nHosts--;
                    if (nHosts < 0) {
                        //console.log(JSON.stringify(arrayHosts));
                        callback(arrayHosts);
                        return;
                    }
                }
                ipSegment[2] = "0";
            }
            ipSegment[1] = "0";
        }
    }
}

function normalizeNetmask(netmask) {
    if (netmask != undefined) {
        //netmask completed xxx.xxx.xxx.xxx
        if ((netmask + "").indexOf(".") > -1) {
            var s = netmask.split(".");
            if (s.length == 4) { //verify structure of netmask
                if (parseInt(s[0]) >= 0 && parseInt(s[0]) <= 255) {
                    if (parseInt(s[1]) >= 0 && parseInt(s[1]) <= 255) {
                        if (parseInt(s[2]) >= 0 && parseInt(s[2]) <= 255) {
                            if (parseInt(s[3]) >= 0 && parseInt(s[3]) <= 255) {
                                var slash = parseInt(s[0]) * parseInt(s[1]) * parseInt(s[2]) * parseInt(s[3]);
                                console.log(slash)
                                slash = Math.log2(slash);
                                console.log("Netmask base: " + slash)
                                return slash;
                            }
                        }
                    }
                }
            }
            return 24;
        }
        //
        if (netmask > 0 && netmask < 33) {
            return netmask;
        }
    }
    return 24;
}

function GetFullNetmask(netmask) {
    //ipv4 only
    if (netmask != undefined) {
        if ((netmask + "").indexOf(".") == -1) {
            var nbin = "";
            var nmk = [];
            for (var i = 0; i < 32; i++) {
                if (i < netmask) { nbin += "1"; } else { nbin += "0"; }
                if (i == 7 || i == 15 || i == 23 || i == 31) { nmk.push(parseInt(nbin, 2)); nbin = ""; }
            }
            return "" + nmk[0] + "." + nmk[1] + "." + nmk[2] + "." + nmk[3]
        }
        return netmask;
    }
    return "255.255.255.0";
}

function normalizeIP(ip) {
    if (ip != undefined) {
        if ((ip + "").indexOf(".") > 0) {
            //normalize
            var ipSegment = ip.split(".");
            while (ipSegment.length < 4) {
                ipSegment.push("0");
            }
            if (parseInt(ipSegment[0]) >= 0 && parseInt(ipSegment[0]) <= 255) {
                if (parseInt(ipSegment[1]) >= 0 && parseInt(ipSegment[1]) <= 255) {
                    if (parseInt(ipSegment[2]) >= 0 && parseInt(ipSegment[2]) <= 255) {
                        if (parseInt(ipSegment[3]) >= 0 && parseInt(ipSegment[3]) <= 255) {
                            ip = ("" + parseInt(ipSegment[0]) + "." + parseInt(ipSegment[1]) + "." + parseInt(ipSegment[2]) + "." + parseInt(ipSegment[3]));
                            return ip;
                        }
                    }
                }
            }
        }
    }
    return "192.168.0.0";
}

function normalizeIP3(ip) {
    if (ip != undefined) {
        if ((ip + "").indexOf(".") > 0) {
            //normalize
            var ipSegment = ip.split(".");
            while (ipSegment.length < 4) {
                ipSegment.push("0");
            }
            if (parseInt(ipSegment[0]) >= 0 && parseInt(ipSegment[0]) <= 255) {
                if (parseInt(ipSegment[1]) >= 0 && parseInt(ipSegment[1]) <= 255) {
                    if (parseInt(ipSegment[2]) >= 0 && parseInt(ipSegment[2]) <= 255) {
                        if (parseInt(ipSegment[3]) >= 0 && parseInt(ipSegment[3]) <= 255) {
                            ip = ("" + parseInt(ipSegment[0]) + "." + parseInt(ipSegment[1]) + "." + parseInt(ipSegment[2]));
                            return ip;
                        }
                    }
                }
            }
        }
    }
    return "192.168.0";
}
function normalizeIP23(ip) {
    if (ip != undefined) {
        if ((ip + "").indexOf(".") > 0) {
            //normalize
            var ipSegment = ip.split(".");
            while (ipSegment.length < 4) {
                ipSegment.push("0");
            }
            if (parseInt(ipSegment[0]) >= 0 && parseInt(ipSegment[0]) <= 255) {
                if (parseInt(ipSegment[1]) >= 0 && parseInt(ipSegment[1]) <= 255) {
                    if (parseInt(ipSegment[2]) >= 0 && parseInt(ipSegment[2]) <= 255) {
                        if (parseInt(ipSegment[3]) >= 0 && parseInt(ipSegment[3]) <= 255) {
                            ip = (parseInt(ipSegment[2]) + "." + parseInt(ipSegment[3]));
                            return ip;
                        }
                    }
                }
            }
        }
    }
    return "0.0";
}