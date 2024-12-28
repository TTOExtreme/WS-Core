ClientEvents.on("wsma/materiais/add", () => {
    ClientEvents.emit("close_menu", 'wsma_materiais_div')
    let data = {
        name: "",
        description: {
            description: "",
            type: "ma_permanente",
            unid: "UN",
            altura: "",
            largura: "",
            comprimento: "",
            peso: ""
        },
        inventory: 0,
        inventoryMin: 0,
        inventoryMax: 0,
        active: 1
    }

    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsma_edt_div menu_dragger");
    div.setAttribute("id", "wsma_materiais_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wsma_ficha' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsma_materiais_div')>&#9776;</td><td class='wsma_edt_label'><p class='wsma_ficha_closeButton' onclick=ClientEvents.emit(\"close_menu\",'wsma_materiais_div')>X</p></td></tr>" +
        "<tr><td class='wsma_edt_label'>Nome:</td><td><input id='wsma_ficha_produto_name' type='text' value='" + data.name + "'></td></tr>" +
        "<tr><td class='wsma_edt_label'>Descrição:</td><td><input id='wsma_ficha_produto_description' type='text' value='" + unclearDesc(data.description.description) + "'></td></tr>" +
        "<tr><td class='wsma_edt_label'>Tipo:</td><td><select id='wsma_ficha_produto_type' type='text'>" + new window.Modules.WSMA.Typo().MAToOptList(data.description.type) + "</td></tr>" +
        "<tr><td class='wsma_edt_label'>Unidade:</td><td><select id='wsma_ficha_produto_unid' type='text'>" + new window.Modules.WSMA.Typo().UnitToOptList(data.description.unid) + "</td></tr>" +
        "<tr><td class='wsma_edt_label'>Altura:</td><td><input id='wsma_ficha_produto_altura' type='number' value='" + data.description.altura + "'></td></tr>" +
        "<tr><td class='wsma_edt_label'>Largura:</td><td><input id='wsma_ficha_produto_largura' type='number' value='" + data.description.largura + "'></td></tr>" +
        "<tr><td class='wsma_edt_label'>Comprimento:</td><td><input id='wsma_ficha_produto_comprimento' type='number' value='" + data.description.comprimento + "'></td></tr>" +
        "<tr><td class='wsma_edt_label'>Peso:</td><td><input id='wsma_ficha_produto_peso' type='number' value='" + data.description.peso + "'></td></tr>" +
        "<tr><td class='wsma_edt_label'>Estoque:</td><td><input id='wsma_ficha_produto_inventory' type='number' value='" + data.inventory + "'></td></tr>" +
        "<tr><td class='wsma_edt_label'>QNT. Min.:</td><td><input id='wsma_ficha_produto_inventoryMin' type='number' value='" + data.inventoryMin + "'></td></tr>" +
        "<tr><td class='wsma_edt_label'>QNT. Max.:</td><td><input id='wsma_ficha_produto_inventoryMax' type='number' value='" + data.inventoryMax + "'></td></tr>" +

        "<tr><td class='wsma_edt_label'>Ativo:</td><td><input id='wsma_ficha_produto_active' type='checkbox' " + ((data.active == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td colspan=2 class='wsma_edt_label_info' id='wsma_ficha_produto_info'></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Adicionar' type='button' onclick='ClientEvents.emit(\"WSMA/material/save\")' ></td></tr>" +
        "</table>";

    document.body.appendChild(div);
});


ClientEvents.on("WSMA/material/save", () => {
    ClientEvents.emit("SendSocket", "WSMA/materiais/add", {
        name: document.getElementById("wsma_ficha_produto_name").value,
        description: JSON.stringify({
            description: clearDesc(document.getElementById("wsma_ficha_produto_description").value),
            type: document.getElementById("wsma_ficha_produto_type").value,
            unid: document.getElementById("wsma_ficha_produto_unid").value,
            altura: document.getElementById("wsma_ficha_produto_altura").value,
            largura: document.getElementById("wsma_ficha_produto_largura").value,
            comprimento: document.getElementById("wsma_ficha_produto_comprimento").value,
            peso: document.getElementById("wsma_ficha_produto_peso").value,
        }),
        inventory: document.getElementById("wsma_ficha_produto_inventory").value,
        inventoryMin: document.getElementById("wsma_ficha_produto_inventoryMin").value,
        inventoryMax: document.getElementById("wsma_ficha_produto_inventoryMax").value,
        active: document.getElementById("wsma_ficha_produto_active").checked,
    });
    /**
     * save data and closes the page if success
     * closing part from server command
     */
})
