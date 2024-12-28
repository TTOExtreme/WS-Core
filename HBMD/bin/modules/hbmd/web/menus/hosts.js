var main_table = null;

var actionFunction = "null";
var actionName = "Ações";
var actionIcon = "buttonTick"; //"buttonTick" "buttonCross" "tickCross"
var actionfield = "0";
var actionCallback = null;
var confirmExecution = false;
var actionOptions = []; ''
var actionRowFormatter = (row, e) => { }

var section = "lst";

function hbmd_host_init() {
    appendRoutes();
    send("hbmd/top/menu/hosts", {});

}

function appendRoutes() {
    appendRoute("hbmd/list/hosts", host_list);
    appendRoute("hbmd/added/hosts", () => { hbmd_get_host(); system_mess({ status: "OK", mess: "Host Adicionado com Exito", time: 1000 }); });
    appendRoute("hbmd/removed/hosts", () => { hbmd_get_host(); system_mess({ status: "OK", mess: "Host Removido com Exito", time: 1000 }); });
    appendRoute("hbmd/edited/hosts", () => { hbmd_get_host(); system_mess({ status: "OK", mess: "Host Editado com Exito", time: 1000 }); });
    appendRoute("hbmd/disabled/hosts", () => { hbmd_get_host(); system_mess({ status: "OK", mess: "Host Desabilitado com Exito", time: 1000 }); });
    appendRoute("hbmd/enabled/hosts", () => { hbmd_get_host(); system_mess({ status: "OK", mess: "Host Habilitado com Exito", time: 1000 }); });
}

actionRowFormatter = (row, e) => {
    //create and style holder elements
    let holderEl = document.createElement("div");
    let tableEl = document.createElement("table");

    const id = row.getData().pcid;
    const data = row.getData();

    holderEl.style.display = "none";
    holderEl.setAttribute('id', "subTableHolder" + id + "");
    holderEl.setAttribute('class', "host_data_holder");


    tableEl.style.border = "none";
    tableEl.setAttribute('id', "subTable" + id + "");
    tableEl.setAttribute('class', "host_data_table");

    holderEl.appendChild(tableEl);

    row.getElement().appendChild(holderEl);
    // create layout for machine

    //header 
    tableEl.innerHTML = "<tr><th class='host_data_table_right'>CPU% (min/med/max)</th>" +
        "<th class='host_data_table_right'>MEM ([real/total] [swap/total])</th>" +
        "<th class='host_data_table_right'>Network (min/med/max)</th>" +
        "<th>Disk Usage</th></tr>"

    let tr = document.createElement("tr");
    let td = document.createElement("td");
    td.setAttribute("class", "host_data_table_right");
    //CPU
    if (data.CPU) {
        td.innerHTML += (JSON.parse(data.CPU.min).percent) + "% / "
            + parseFloat(JSON.parse(data.CPU.med).percent) + "% / "
            + parseFloat(JSON.parse(data.CPU.max).percent) + "%";
    }
    tr.appendChild(td);
    //MEM
    td = document.createElement("td");
    td.setAttribute("class", "host_data_table_right");
    if (data.Mem) {
        td.innerHTML += "[" + convertBytes(JSON.parse(data.Mem.med).used) + " / " + convertBytes(JSON.parse(data.Mem.info).total) +
            "] [" + convertBytes(JSON.parse(data.Mem.med).swap) + " / " + convertBytes(JSON.parse(data.Mem.info).swaptotal) + "]"
    }
    tr.appendChild(td);
    //Network
    td = document.createElement("td");
    td.setAttribute("class", "host_data_table_right");
    if (data.Network) {

        td.innerHTML += "[ RX:" + convertBytes(JSON.parse(data.Network.med).rx) + " / TX:" + convertBytes(JSON.parse(data.Network.med).tx) + "]";
    }
    tr.appendChild(td);
    //Disk
    td = document.createElement("td");
    td.setAttribute("class", "host_data_table_right");
    if (data.Disk) {
        td.innerHTML += diskFormat(JSON.parse(data.Disk.data));
    }
    tr.appendChild(td);
    tableEl.appendChild(tr);

}

function host_list(data) {
    indb.lists["hostsList"] = data;
    reloadSubnetTable();
    console.log(indb.lists["hostsList"])
}

function update_subnet(data) {
    if (main_table != null) {
        main_table.updateData([data]);
    }
}
function toggleNestedTable(id) {
    let ele = document.getElementById(id)
    if (ele) {
        if (ele.style.display == "none") {
            ele.style.display = "block";
        } else {
            ele.style.display = "none";
        }
    }
}

function reloadSubnetTable() {
    menuCancel();

    const newCollums = [
        {
            title: actionName, field: actionfield, formatter: actionIcon, cellClick: function (e, cell) {
                const id = cell.getData().pcid;
                toggleNestedTable("subTableHolder" + id + "");

            }, visible: !(actionName == "")
        },
        { title: 'Hostname', field: 'hostname', headerFilter: "input", formatter: ((data) => { return (data.getRow().getData().hostname == undefined) ? "-" : data.getRow().getData().hostname }) },
        { title: 'MAC', field: 'mac', headerFilter: "input", formatter: ((data) => { return (data.getRow().getData().mac == undefined) ? "-" : data.getRow().getData().mac }) },
        { title: 'Ultimo Registro', field: 'timestamp', headerFilter: "input", formatter: ((data) => { return (data.getRow().getData().timestamp == undefined) ? "-" : formatTime(data.getRow().getData().timestamp) }) },
    ];

    main_table = new Tabulator("#hbmd_bottom_table", {
        data: indb.lists["hostsList"],
        headerFilterPlaceholder: "Filtrar",
        index: "ip",
        dataTree: true,
        dataTreeChildField: "child",
        dataTreeStartExpanded: false,
        dataTreeChildIndent: 25,

        columns: newCollums,
        height: '100%',
        paginationButtonCount: 3,
        pagination: "local",
        paginationSize: 30,
        paginationSizeSelector: [10, 15, 20, 25, 30, 50, 100, 200, 500, 1000],
        movableColumns: true,
        layout: "fitColumns",
        rowFormatter: actionRowFormatter
    });
}

function filterChild(headerValue, cellValue, rowData, filterParams) {
    //headerValue - the value of the header filter element
    //cellValue- the value of the column in this row
    //rowData - the data for the row being filtered
    //filterParams - params object passed to the headerFilterFuncParams property

    let matched = false;
    let values = headerValue.split(","); //break header into list of options

    values.forEach(function (val) {
        if (val.toLowerCase().indexOf(cellValue.toLowerCase()) > -1) {
            matched = true;
        }
        if (rowData.getData().ip.indexOf(rowData.getData().subnet) > -1) {
            matched = true;
            console.log(rowData.getData())
        }
    });

    return matched;
}

function createActionField(row) {
    let data = row.getRow().getData();

    htm = "<table><tr>"
    htm += "<td class='action_item'><a onclick=\"User_execute('" + data + "')\" style='transform:rotate(90deg);'>&#9998;</a></td>";
    htm += "</tr></table>"

    return htm;

}


function HostData(e) {
    return "\n\
    Nome:" + e.name + "\n\
    Host:" + e.hostname + "\n\
    IP:" + normalizeIP(e.ip) + "\n\
    MAC: " + e.mac + "\n\
    Fabricante: " + e.vendor + "\n\
    Ativo: " + ((e.alive) ? "Sim" : "Não") + "\n\
    Cadastrado: " + ((e.seted) ? "Sim" : "Não") + "\n\
    ";
}

function convertBytes(value) {
    if (value == undefined) { return "0 B"; }
    if (value > 1024 * 1024 * 1024 * 1024) {
        return (value / (1024 * 1024 * 1024 * 1024)).toFixed(1) + " TB";
    }
    if (value > 1024 * 1024 * 1024) {
        return (value / (1024 * 1024 * 1024)).toFixed(1) + " GB";
    }
    if (value > 1024 * 1024) {
        return (value / (1024 * 1024)).toFixed(1) + " MB";
    }
    if (value > 1024) {
        return (value / (1024)).toFixed(1) + " KB";
    }
    return (value / 1).toFixed(1) + " B";

}

function diskFormat(data) {
    let ret = "<table>";
    data.forEach(disk => {
        ret += "<tr><td>[\"" + disk.mount + "\" " + convertBytes(disk.used) + " / " + convertBytes(disk.size) + "]</td></tr>";
    })
    return ret;
}

hbmd_host_init();