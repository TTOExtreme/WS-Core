
ClientEvents.on("wsop/clientes/edt", (data) => {
    ClientEvents.emit("close_menu", 'wsop_edt_clientes_div');

    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsop_edt_clientes_div");
    div.setAttribute("id", "wsop_edt_clientes_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wsop_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsop_edt_clientes_div')>&#9776;</td><td class='wsop_edt_label'><p class='wsop_add_closeButton' onclick=ClientEvents.emit(\"close_menu\", 'wsop_edt_clientes_div')>X</p></td></tr>" +
        "<tr><td class='wsop_edt_label'>ID:</td><td><input disabled id='wsop_add_id' type='text' value='" + data.id + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Nome:</td><td><input id='wsop_add_name' type='text' value='" + data.name + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Responsável:</td><td><input id='wsop_add_responsavel' type='text' value='" + data.responsavel + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>CNPJ?:</td><td><input id='wsop_add_iscnpj' type='checkbox' onchange='ClientEvents.emit(\"iscnpjchange\")' " + ((data.iscnpj == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr id='tr_wsop_add_cnpj' style='display:contents'><td class='wsop_edt_label'>CNPJ:</td><td><input id='wsop_add_cnpj' type='text' onchange='ClientEvents.emit(\"cnpjchange\")' value='" + data.cpf_cnpj + "'></td></tr>" +
        "<tr id='tr_wsop_add_cpf' style='display:none'><td class='wsop_edt_label'>CPF:</td><td><input id='wsop_add_cpf' type='text' value='" + data.cpf_cnpj + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>CEP:</td><td><input id='wsop_add_cep' type='text' onchange='ClientEvents.emit(\"cepchange\")' value='" + data.cep + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Logradouro:</td><td><input id='wsop_add_logradouro' type='text' value='" + data.logradouro + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Numero:</td><td><input id='wsop_add_numero' type='text' value='" + data.numero + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Bairro:</td><td><input id='wsop_add_bairro' type='text' value='" + data.bairro + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Município:</td><td><input id='wsop_add_municipio' type='text' value='" + data.municipio + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Estado:</td><td><input id='wsop_add_uf' type='text' value='" + data.uf + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Pais:</td><td><input id='wsop_add_country' type='text' value='" + data.country + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Telefone:</td><td><input id='wsop_add_telefone' type='text' value='" + data.telefone + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>E-Mail:</td><td><input id='wsop_add_email' type='text' value='" + data.email + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Ativo:</td><td><input id='wsop_add_active' type='checkbox' " + ((data.active == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td colspan=2 class='wsop_edt_label_info' id='wsop_add_info'></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Editar' type='button' onclick='ClientEvents.emit(\"WSOP/clientes/edt\")'></td></tr>" +
        "</table>";

    document.body.appendChild(div);
});

ClientEvents.on("WSOP/clientes/edt", () => {
    ClientEvents.emit("SendSocket", "wsop/clientes/edt", {
        id: document.getElementById("wsop_add_id").value,
        name: document.getElementById("wsop_add_name").value,
        responsavel: document.getElementById("wsop_add_responsavel").value,
        cpf_cnpj: document.getElementById("wsop_add_cnpj").value || document.getElementById("wsop_add_cpf").value,
        cep: document.getElementById("wsop_add_cep").value,
        logradouro: document.getElementById("wsop_add_logradouro").value,
        numero: document.getElementById("wsop_add_numero").value,
        bairro: document.getElementById("wsop_add_bairro").value,
        municipio: document.getElementById("wsop_add_municipio").value,
        uf: document.getElementById("wsop_add_uf").value,
        country: document.getElementById("wsop_add_country").value,
        telefone: document.getElementById("wsop_add_telefone").value,
        email: document.getElementById("wsop_add_email").value,
        iscnpj: document.getElementById("wsop_add_iscnpj").checked,
        active: document.getElementById("wsop_add_active").checked,
    });
    /**
     * save data and closes the page if success
     * closing part from server command
     */
})