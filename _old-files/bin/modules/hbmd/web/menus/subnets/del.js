

var actionFunction = "";
var actionName = "Deletar";
var actionIcon = "buttonCross"; //"buttonTick" "buttonCross" "tickCross"
var actionfield = "0";
var actionCallback = delSubnet;
var confirmExecution = true;
var actionOptions = [];
var actionRowFormatter = (data) => { };

reloadSubnetTable();

function delSubnet(row) {
    send("ipam/del/subnets", row);
    startLoader();
}