

var actionFunction = "";
var actionName = "Excluir";
var actionIcon = "buttonCross"; //"buttonTick" "buttonCross" "tickCross"
var actionfield = "0";
var actionCallback = (data) => {
    if (data.hosts != undefined) {
        main_table.setData(data.hosts);
    } else {
        delHost(data);
    }
};
var confirmExecution = true;
var actionOptions = [];
var actionRowFormatter = (data) => { };

reloadSubnetTable();

function delHost(host) {
    startLoader();
    var data = {};
    data.name = "";
    data.ip = normalizeIP(host.ip);
    data.subnet = normalizeIP3(host.subnet);
    data.mac = "";
    data.hostname = "";
    data.vendor = "";

    send("ipam/del/hosts", data);
}