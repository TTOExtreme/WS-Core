
ClientEvents.on("wsop/os/insumos", (data) => {
    ClientEvents.emit("close_menu");

    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsop_add_div menu_dragger");
    div.setAttribute("id", "wsop_materiais_div");

    let htm = "";
    let listInsumos = [];

    function processItems(produto) {
        let ins = window.Modules.WSOP.Produtos.getInsumos(produto.description.modelo);
        if (ins.length > 0) {
            ins.forEach(ins1 => {
                let insset = { nome: ins1.nome, valor: ins1.valor, unid: ins1.unid };
                insset.valor = (parseFloat(insset.valor) * produto.qnt)

                //seta o tecido do produto para o respectivo
                if (insset.nome == "Tecido") {
                    insset.nome = "Tecido - " + produto.description.tecido;
                }

                if (ins1.genero == undefined || ins1.genero == produto.description.genero) {
                    insset.setted = false;
                    listInsumos.forEach(lstIns => {
                        if (lstIns.nome == insset.nome) {
                            //console.log(insset, produto);
                            lstIns.valor = parseFloat(lstIns.valor) + parseFloat(insset.valor);
                            insset.setted = true;
                        }
                    })
                    if (insset.setted != true) {
                        listInsumos.push(insset);
                    }
                }
            })
        } else {
            ClientEvents.emit("system_mess", { status: "INFO", mess: "Informação pendente para calculo de insumos", time: 1000 });
            console.log(ins);
        }
    }

    data.produtos.forEach((produto) => {
        try {
            produto.description = JSON.parse(produto.description)
        } catch (err) {
            produto.description = { gola: "-", vies: "-", genero: "-", modelo: "-" }
        }
        processItems(produto);
    });


    if (listInsumos != undefined) {
        if (listInsumos.length >= 0) {
            listInsumos.forEach((insumo, index) => {
                htm += "<tr class='wsop_hist_data'>" +
                    "<td>" + insumo.nome + "</td>" +
                    "<td>" + parseFloat(insumo.valor).toFixed(2) + "</td>" +
                    "<td>" + insumo.unid + "</td>";
            });
        }
    }

    div.innerHTML = "" +
        "<table>" +
        "<tr class='menu_header'><td id='move_menu_wsop_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsop_materiais_div')>&#9776;</td><td class='wsop_edt_label'><p class='wsop_add_closeButton' onclick=ClientEvents.emit(\"close_menu\",'wsop_materiais_div')>X</p></td></tr>" +
        "<tr><td class='wsop_edt_label'>ID OS:</td><td><input type='text' disabled value='" + data.id + "'></td></tr>" +
        "<tr><td colspan=3></br></td></tr>" +
        "<tr><td colspan =2><div class='div_wsop_hist_table'><table  class='wsop_hist_table'>" +
        "<tr class='wsop_hist_label'>" +
        "<td>Material</td>" +
        "<td>Quantidade</td>" +
        "<td>Unidade</td>" +
        htm +
        "</table></div></table>";
    document.body.appendChild(div);
});

