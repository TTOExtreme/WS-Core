

var actionFunction = "";
var actionName = "Escanear ARP";
var actionIcon = "buttonTick"; //"buttonTick" "buttonCross" "tickCross"
var actionfield = "0";
var actionCallback = scanSubnet;
var confirmExecution = false;
var actionOptions = [];
var actionRowFormatter = (data) => { };

reloadSubnetTable();

function scanSubnet(row) {
    send("ipam/scan/subnets/full", row);
    startLoader();
}