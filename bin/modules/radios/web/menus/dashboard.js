
function radios_dashboard_init() {
    appendRoutes();
    send("radios/top/menu/dashboard", {});
    radios_get_lists();
}
function radios_get_lists() {
    stopLoader();
    menuCancel();
    indb.lists["radiosList"] = [];
    send("radios/get/radios", {});
    send("radios/get/connection", {});
}
//Add new


function appendRoutes() {
    appendRoute("radios/list/dashboard/menu", changeRadiosMenuItems);
    appendRoute("radios/list/radios", radios_list_radios);
    appendRoute("radios/list/connection", radios_list_radios_connection);
}


var actionFunction = "null";
var actionName = "Ações";
var actionIcon = "buttonTick"; //"buttonTick" "buttonCross" "tickCross"
var actionfield = "";
var actionCallback = (data) => {
    if (data.dashboard != undefined) {
        main_table.setData(data.dashboard);
    } else {
        actionIcon = "";
    }
};
var confirmExecution = false;
var actionOptions = [];
var actionRowFormatter = (data) => { return "Abrir"; };

function radios_list_radios(data) {
    indb.lists["radiosList"] = data;
    reloadDashboard();
}

function radios_list_radios_connection(data) {
    indb.lists["connectionList"] = data;
    reloadDashboard();
}


function reloadDashboard() {
    menuCancel();
    let div = document.getElementById("radios_bottom_table");
    div.innerHTML = "";


    let dataBase = organizeRadios(indb.lists["radiosList"], indb.lists["connectionList"]);


    //dataBase = flatToHierarchy(dataBase);

    //console.log(JSON.stringify(dataBase));
    //console.log(dataBase);

    ////////////////////////inicio D3 Draw ////////////////////////////////////////////

    let radius = div.offsetHeight / 2 // radius of the dendrogram

    // append the svg object to the body of the page
    let svg = d3.select("#radios_bottom_table")
        .append("svg")
        .attr("width", div.offsetWidth)
        .attr("height", div.offsetHeight)
        .append("g")
        .attr("transform", "translate(100,40)");  // bit of margin on the left = 40


    // Create the cluster layout:
    var cluster = d3.tree()
        .size([div.offsetWidth - 150, div.offsetHeight - 100]);  // 100 is the margin I will have on the right side

    // Give the data to this cluster layout:
    let root = d3.hierarchy(dataBase[0], function (d) {
        return (d != null) ? d.children : [];
    });
    //*/
    cluster(root);

    // Add the links between nodes:
    svg.selectAll('path')
        .data(root.descendants().slice(1))
        .enter()
        .append('path')
        .attr("d", function (d) {
            return "M" + d.x + "," + d.y
                + "C" + (d.parent.x) + "," + d.y
                + " " + (d.parent.x) + "," + d.parent.y // 50 and 150 are coordinates of inflexion, plax with it to change links shape
                + " " + d.parent.x + "," + d.parent.y;
        })
        .style("fill", 'none')
        .attr("stroke", '#aaaaaa30')


    // Add a circle for each node.
    svg.selectAll("g")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")"
        })
        .append("circle")
        .attr("r", 7)
        .style("fill", function (d) {
            return (d.data.alive == 1 || d.data.community == "") ? "var(--message-bg-ok)" : "var(--message-bg-err)"
        })
        .attr("stroke", "black")
        .style("stroke-width", 2)
        .append("title")
        .text(function (d, i) { return "     " + HostData(d.data); });



    //add a text to node
    svg.selectAll("g")
        .append("text")
        .attr("dy", ".35em")
        .attr("x", -13)
        .attr("transform", "rotate(-20,0,0)")
        .style("text-anchor", "end")
        .style("font-size", "9pt")
        .text(function (d) { return d.data.name; });



    ////////////////////////end D3 Draw ////////////////////////////////////////////

    /*
    //code for the Map of radios========================================================================;

    let scr = document.getElementById("radios_map_screen");
    if (scr != undefined) {//check if the screen is created
        const context = scr.getContext('2d');
        context.clearRect(0, 0, scr.width, scr.height); //clear the painel




    } else {
        let div = document.getElementById("radios_bottom_table");
        div.innerHTML = "<canvas id='radios_map_screen' width='" + div.offsetWidth + "' height='" + div.offsetHeight + "'></canvas>";
    }
    //*/
}

function HostData(e) {
    //console.log(e);
    if (e != null) {
        return "\n\
    Nome:" + e.name + "\n\
    IP:" + normalizeIP(e.ip) + "\n\
    Ativo: " + ((e.alive) ? "Sim" : "Não") + "\n\
    ";
    } else {
        return "null";
    }
}

radios_dashboard_init();


function menuCancel() {
    var h = document.getElementById("overlay_input_table");
    if (h != undefined) {
        document.getElementById("overlay_input_table").style.opacity = 0;
        document.getElementById("overlay_input_table").style.top = "-100vh";
    }
}


function organizeRadios(radios, indexers) {
    let rad = radios;
    let ret = [];

    for (let i = 0; i < rad.length; i++) {
        rad[i] = getChildren(rad[i], rad, indexers);
        if (rad[i] != undefined) {
            //if (rad[i].children.length == 0) { rad[i] = null; } // insere na raiz se não encontrar o pai (considera Root)
            //console.log(rad[i]);
        }
    }
    //console.log(rad);
    rad.forEach(item => {
        if (item != null) {
            if (item.children.length > 0)
                ret.push(item);
        }
    })
    //console.log(ret);
    return ret;
}

function getChildren(item, radios, indexers) {
    let ret = item;
    if (indexers != undefined && ret != undefined) {
        if (ret["children"] == undefined) { ret["children"] = []; }
        indexers.forEach(id => {
            if (id != null) {
                if (ret.id == id.id_radio_ap) {
                    for (let ri = 0; ri < radios.length; ri++) {
                        if (id != null && radios[ri] != null) {
                            if (radios[ri].id == id.id_radio_st) {
                                let c = getChildren(radios[ri], radios, indexers);
                                ret.children.forEach(c1 => { if (c != null) { if (c.id == c1.id) { c = null; } } })
                                if (c != null) { ret.children.push(c); }
                                radios[ri] = null;
                            }
                        }
                    }
                    return ret;
                }
            }
        })
    }
    return ret;
}
/*
//find the father of child
function getChildren(item, radios, indexers) {
    let ret = null;
    if (item != undefined) {
        indexers.forEach(ind => {
            //verifica se o radio é um ap ou um pai para procurar pelo filho
            if (item.id == ind.id_radio_ap) {
                for (let i = 0; i < radios.length; i++) {
                    if (radios[i] != null) {
                        if (radios[i].id == ind.id_radio_st) { //encontra os filhos do filho
                            if (item["children"] == undefined) {
                                item["children"] = [];
                            }
                            let r = getChildren(radios[i], radios, indexers);
                            if (r != null) {
                                radios[i] = null;
                                item["children"].push(r);
                            }
                        }
                    }
                }
                ret = item;
            }
        });
        if (ret == null) {
            ret = item;
            indexers.forEach(ind => {
                //verifica se o radio faz parte de um enlace
                if (item.id == ind.id_radio_st) {
                    ret = null;
                }
            });
        }
    }
    return ret;
}
//*/