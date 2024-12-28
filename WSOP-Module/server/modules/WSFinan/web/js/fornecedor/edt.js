
ClientEvents.on("wsfinan/fornecedor/edt", (data) => {
    ClientEvents.emit("close_menu", 'wsfinan_edt_clientes_div');
    console.log(data)

    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsfinan_add_div menu_dragger");
    div.setAttribute("id", "wsfinan_edt_clientes_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wsfinan_edt' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsfinan_edt_clientes_div')>&#9776;</td><td class='wsfinan_add_label'><p class='closeButton' onclick='ClientEvents.emit(\"close_menu\", \"wsfinan_edt_clientes_div\")'>X</p></td></tr>" +
        "<tr><td class='wsfinan_add_label'>ID:</td><td><input disabled id='wsfinan_edt_id' type='text' value='" + data.id + "'></td></tr>" +
        "<tr><td class='wsfinan_add_label'>Nome:</td><td><input id='wsfinan_edt_name' type='text' value='" + data.name + "'></td></tr>" +
        "<tr><td class='wsfinan_add_label'>Responsável:</td><td><input id='wsfinan_edt_responsavel' type='text' value='" + data.responsavel + "'></td></tr>" +
        "<tr><td class='wsfinan_add_label'>Descrição:</td><td><textarea id='wsfinan_edt_description'>" + unclearDesc(data.description) + "</textarea></td></tr>" +
        "<tr><td class='wsfinan_add_label'>CNPJ?:</td><td><input id='wsfinan_edt_iscnpj' type='checkbox' onchange='ClientEvents.emit(\"iscnpjchange\")' " + ((data.iscnpj == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr id='tr_wsfinan_edt_cnpj' style='display:contents'><td class='wsfinan_add_label'>CNPJ:</td><td><input id='wsfinan_edt_cnpj' type='text' onchange='ClientEvents.emit(\"cnpjchange\")' value='" + data.cpf_cnpj + "'></td></tr>" +
        "<tr id='tr_wsfinan_edt_cpf' style='display:none'><td class='wsfinan_add_label'>CPF:</td><td><input id='wsfinan_edt_cpf' type='text' value='" + data.cpf_cnpj + "'></td></tr>" +
        "<tr><td class='wsfinan_add_label'>CEP:</td><td><input id='wsfinan_edt_cep' type='text' onchange='ClientEvents.emit(\"cepchange\")' value='" + data.cep + "'></td></tr>" +
        "<tr><td class='wsfinan_add_label'>Logradouro:</td><td><input id='wsfinan_edt_logradouro' type='text' value='" + data.logradouro + "'></td></tr>" +
        "<tr><td class='wsfinan_add_label'>Complemento:</td><td><input id='wsfinan_edt_complemento' type='text' value='" + data.complemento + "'></td></tr>" +
        "<tr><td class='wsfinan_add_label'>Numero:</td><td><input id='wsfinan_edt_numero' type='text' value='" + data.numero + "'></td></tr>" +
        "<tr><td class='wsfinan_add_label'>Bairro:</td><td><input id='wsfinan_edt_bairro' type='text' value='" + data.bairro + "'></td></tr>" +
        "<tr><td class='wsfinan_add_label'>Município:</td><td><input id='wsfinan_edt_municipio' type='text' value='" + data.municipio + "'></td></tr>" +
        "<tr><td class='wsfinan_add_label'>Estado:</td><td><input id='wsfinan_edt_uf' type='text' value='" + data.uf + "'></td></tr>" +
        "<tr><td class='wsfinan_add_label'>Pais:</td><td><input id='wsfinan_edt_country' type='text' value='" + data.country + "'></td></tr>" +
        "<tr><td class='wsfinan_add_label'>Telefone:</td><td><input id='wsfinan_edt_telefone' type='text' value='" + data.telefone + "'></td></tr>" +
        "<tr><td class='wsfinan_add_label'>E-Mail:</td><td><input id='wsfinan_edt_email' type='text' value='" + data.email + "'></td></tr>" +
        "<tr><td class='wsfinan_add_label'>Ativo:</td><td><input id='wsfinan_edt_active' type='checkbox' " + ((data.active == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td colspan=2 class='wsfinan_add_label_info' id='wsfinan_add_info'></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Editar' type='button' onclick='ClientEvents.emit(\"wsfinan/fornecedor/edtsave\")'></td></tr>" +
        "</table>";

    document.body.appendChild(div);
});

ClientEvents.on("wsfinan/fornecedor/edtsave", () => {
    ClientEvents.emit("SendSocket", "WSFinan/fornecedor/edt", {
        id: document.getElementById("wsfinan_edt_id").value,
        name: document.getElementById("wsfinan_edt_name").value,
        responsavel: document.getElementById("wsfinan_edt_responsavel").value,
        description: clearDesc(document.getElementById("wsfinan_edt_description").value),
        cpf_cnpj: document.getElementById("wsfinan_edt_cnpj").value || document.getElementById("wsfinan_edt_cpf").value,
        cep: document.getElementById("wsfinan_edt_cep").value,
        logradouro: document.getElementById("wsfinan_edt_logradouro").value,
        complemento: document.getElementById("wsfinan_edt_complemento").value,
        numero: document.getElementById("wsfinan_edt_numero").value,
        bairro: document.getElementById("wsfinan_edt_bairro").value,
        municipio: document.getElementById("wsfinan_edt_municipio").value,
        uf: document.getElementById("wsfinan_edt_uf").value,
        telefone: document.getElementById("wsfinan_edt_telefone").value,
        email: document.getElementById("wsfinan_edt_email").value,
        iscnpj: document.getElementById("wsfinan_edt_iscnpj").checked,
        active: document.getElementById("wsfinan_edt_active").checked,
        country: document.getElementById("wsfinan_edt_country").value
    });
    /**
     * save data and closes the page if success
     * closing part from server command
     */
})