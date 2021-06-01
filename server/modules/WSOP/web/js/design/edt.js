
ClientEvents.on("wsop/os/edt", (data) => {
    ClientEvents.emit("close_menu", 'wsop_edt_div');
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsop_edt_div  menu_dragger");
    div.setAttribute("id", "wsop_edt_div");
    console.log(data);

    div.innerHTML = "" +
        "<table>" +
        "<tr class='menu_header'><td id='move_menu_wsop_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsop_edt_div')>&#9776;</td><td class='wsop_edt_label' colspan=3><p class='wsop_add_closeButton' onclick=ClientEvents.emit(\"close_menu\",'wsop_edt_div')>X</p></td></tr>" +
        "<tr><td class='wsop_edt_label'>ID:</td><td class='wsop_os_descr' id='wsop_edt_id' type='text'>" + data.id + "</td></tr>" +
        "<tr><td class='wsop_edt_label'>Cliente:</td><td class='wsop_os_descr' id='wsop_edt_cliente' type='text'>" + data.cliente + "</td></tr>" +
        "<tr><td class='wsop_edt_label'>Descrição:</td><td class='wsop_os_descr' id='wsop_edt_description' >" + (data.description).replace(new RegExp("&lt;", "g"), "<").replace(new RegExp("&gt;", "g"), ">") + "</textarea></td></tr>" +
        "<tr><td class='wsop_edt_label'>Status:</td><td><Select id='wsop_edt_status' disabled>" + new window.Modules.WSOP.StatusID().StatusIdToOptList(data.status) + "</select></td></tr>" +
        "<tr><td class='wsop_edt_label'>Prazo:</td><td><Select id='wsop_edt_prazo' disabled>" + new window.Modules.WSOP.TimeCalc().prazosIdToOptList(data.prazo) + "</select></td></tr>" +
        "<tr><td class='wsop_edt_label'>Data Entrega:</td><td class='wsop_os_descr' id='wsop_edt_endingIn'>" + formatTimeAMD(data.endingIn) + "</td></tr>" +
        "<tr style='display:none'><td class='wsop_edt_label'>Forma Envio:</td><td><Select id='wsop_edt_formaEnvio' onChange='ClientEvents.emit(\"wsop_changeBoxSize\")'>" + new window.Modules.WSOP.formaEnvio().envioToOptList(data.formaEnvio) + "</select></td></tr>" +
        "<tr style='display:none'><td class='wsop_edt_label'>Pais:</td><td><Select id='wsop_edt_formaEnvio_country' onChange='ClientEvents.emit(\"wsop_changeBoxSize\")'>" + new window.Modules.WSOP.formaEnvio().envioToOptListCountry(data.C_country) + "</select></td></tr>" +
        "<tr style='display:none'><td class='wsop_edt_label'>Estado:</td><td><Select id='wsop_edt_formaEnvio_uf' onChange='ClientEvents.emit(\"wsop_changeBoxSize\")'>" + new window.Modules.WSOP.formaEnvio().envioToOptListEstado(data.C_uf) + "</select></td></tr>" +
        "<tr style='display:none'><td class='wsop_edt_label'>Caixa:</td><td><Select id='wsop_edt_formaEnvio_caixa' onChange='ClientEvents.emit(\"wsop_changeBoxSize\")'>" + new window.Modules.WSOP.formaEnvio().envioToOptListCaixa(data.caixa) + "</select><sizecaixa id='wsop_edt_formaEnvio_size'>" + new window.Modules.WSOP.formaEnvio().getSizeCaixa(data.caixa) + "</td></tr>" +
        "<tr style='display:none'><td class='wsop_edt_label'>Ativo:</td><td><input id='wsop_edt_active' type='checkbox' " + ((data.active == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr style='display:none'><td class='wsop_edt_label'>Cod. Rastreio:</td><td><input id='wsop_edt_rastreio' type='text' value='" + (data.rastreio || "") + "'></td></tr>" +
        "</table><hr>" +
        "<table style='width: calc(100vw - 250px);'><tbody id='wsop_edt_anexos' class='wsop_edt_anexos'>" +
        "<tr><td colspan=5><p class='wsop_edt_label' style='float:left; padding:0;margin:0;'>Anexos:</p><input id='wsop_edt_img' style='float:right' type='button' value='Adicionar' onclick='ClientEvents.emit(\"wsop/os/uploadIMG\",\"" + data.id + "\")'></td></tr>" +
        "</table><hr>" +
        "<table style='width: calc(100vw - 250px);; border-collapse:collapse'><tbody id='wsop_edt_produtos' class='wsop_edt_produtos'>" +
        "<tr><td class='wsop_edt_label' style='float:left'>Produtos:</td><td></td></tr>" +
        "<tr><td colspan=5 style='height:20px'>  </td></tr>" +
        "</table>";

    document.body.appendChild(div);

    let anexosTable = document.getElementById("wsop_edt_anexos");
    let htm = "";
    data.anexos.forEach((anexo, index) => {
        anexo.id_os = data.id;
        htm += "" + ((index % 4 == 0) ? "<tr>" : "") + "<td><div class='wsop_anexo_item'><center>" + anexo.name + "</center><center><img class='wsop_edt_img_thumb' onclick='ClientEvents.emit(\"WSOP/os/anexo/edt\"," + JSON.stringify(anexo) + ")' alt='' src='./module/WSOP/img/" + anexo.thumb + "'></td>";
    });
    anexosTable.innerHTML += htm;

    let produtosTable = document.getElementById("wsop_edt_produtos");
    htm = "<tr class='wsop_produto_item1'><td style='width:30px'>Ações:</td><td>Código:</td><td>Item:</td><td>Quantidade:</td></tr>";

    let total = 0;
    let totalqnt = 0;
    data.produtos.forEach((produto) => {
        total += (produto.qnt * parseFloat(produto.price.replace(",", ".").replace(" ", "")));
        totalqnt += produto.qnt;

        ClientEvents.clear("wsop/os/produto/edt/" + produto.id);
        ClientEvents.on("wsop/os/produto/edt/" + produto.id, () => {
            ClientEvents.emit("wsop/os/produto/edt", produto);
        });
        htm += "<tr class='wsop_produto_item1'><td style='width:30px'><input type='button' value='Editar' onclick='ClientEvents.emit(\"wsop/os/produto/edt/" + produto.id + "\")'></td>" +
            "<td>" + produto.barcode + "</td>" +
            "<td>" + produto.name + "</td>" +
            "<td>" + produto.qnt + "</td>" +
            "<tr class='wsop_produto_item2'><td>OBS:</td><td colspan=2>" + (produto.obs).replace(new RegExp("&lt;", "g"), "<").replace(new RegExp("&gt;", "g"), ">") + "</td><td><center><img id='wsop_edt_img_thumb' class='wsop_edt_img_thumb' alt='' src='./module/WSOP/img/" + produto.img.replace(".", "_thumb.") + "' onclick='ClientEvents.emit(\"WSOP/os/anexo/view\"," + JSON.stringify({ name: produto.name, filename: produto.img }) + ")'></td>";
    });

    produtosTable.innerHTML += htm;


    ClientEvents.clear("wsop/os/fileuploaded");
    ClientEvents.on("wsop/os/fileuploaded", () => {
        ClientEvents.emit("SendSocket", "wsop/os/lst/edt", { id: data.id });
    })
    ClientEvents.clear("wsop/os/produto/added");
    ClientEvents.on("wsop/os/produto/added", () => {
        ClientEvents.emit("SendSocket", "wsop/os/lst/edt", { id: data.id });
    })
});


ClientEvents.on("WSOP/os/edtproduct", () => {
    ClientEvents.emit("SendSocket", "wsop/os/edtproduct", {
        id: document.getElementById("wsop_edt_id_produto").value | "",
        id_os: document.getElementById("wsop_edt_id").value | "",
        description: document.getElementById("wsop_edt_description").innerHTML,
        status: document.getElementById("wsop_edt_status").value,
        active: document.getElementById("wsop_edt_active").checked,
    });
})

ClientEvents.on("wsop/os/uploadIMG", (id) => {
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.onchange = (ev) => {
        if (input.files && input.files[0]) {
            var sender = new FileReader();
            let ext = input.files[0].name.substring(input.files[0].name.lastIndexOf("."));
            let name = input.files[0].name.substring(0, input.files[0].name.lastIndexOf("."));

            let tr = document.createElement("tr");
            tr.innerHTML = "<td><div class='wsop_anexo_item'><input value='Excluir' type='button' ><img class='wsop_edt_img_thumb' alt='' src='./module/WSOP/img/loading.gif'><div></td>";
            document.getElementById("wsop_edt_anexos").appendChild(tr);

            sender.onload = function (e) {
                ClientEvents.emit("SendSocket", "wsop/os/file", { name: name, ext: ext, stream: e.target.result, id: id })
            };
            sender.readAsArrayBuffer(input.files[0]);
        }
    }
    input.click();
})
