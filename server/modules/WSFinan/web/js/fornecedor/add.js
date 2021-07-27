
ClientEvents.on("WSFinan/fornecedor/add", () => {
    ClientEvents.emit("close_menu", "wsfinan_add_clientes_div");
    let data = {
        name: "",
        responsavel: "",
        iscnpj: true,
        cpf_cnpj: "",
        cep: "",
        logradouro: "",
        complemento: "",
        numero: "",
        bairro: "",
        municipio: "",
        uf: "",
        country: "",
        telefone: "",
        email: "",
        active: 1,
    }

    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsfinan_add_div menu_dragger");
    div.setAttribute("id", "wsfinan_add_clientes_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wsfinan_add' class='move_menu' onmousedown='ClientEvents.emit(\"move_menu_down\",\"wsfinan_add_clientes_div\")'>&#9776;</td><td class='wsfinan_add_label'><p class='closeButton' onclick=ClientEvents.emit('close_menu','wsfinan_add_clientes_div')>X</p></td></tr>" +
        "<tr><td class='wsfinan_add_label'>Nome:</td><td><input id='wsfinan_add_name' type='text' value='" + data.name + "'></td></tr>" +
        "<tr><td class='wsfinan_add_label'>Responsável:</td><td><input id='wsfinan_add_responsavel' type='text' value='" + data.responsavel + "'></td></tr>" +
        "<tr><td class='wsfinan_add_label'>CNPJ?:</td><td><input id='wsfinan_add_iscnpj' type='checkbox' onchange='ClientEvents.emit(\"iswsfinancnpjchange\")' " + ((data.iscnpj == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr id='tr_wsfinan_add_cnpj' style='display:contents'><td class='wsfinan_add_label'>CNPJ:</td><td><input id='wsfinan_add_cnpj' type='text' onchange='ClientEvents.emit(\"wsfinancnpjchange\")' value='" + data.cpf_cnpj + "'></td></tr>" +
        "<tr id='tr_wsfinan_add_cpf' style='display:none'><td class='wsfinan_add_label'>CPF:</td><td><input id='wsfinan_add_cpf' type='text' value='" + data.cpf_cnpj + "'></td></tr>" +
        "<tr><td class='wsfinan_add_label'>CEP:</td><td><input id='wsfinan_add_cep' type='text' onchange='ClientEvents.emit(\"wsfinancepchange\")' value='" + data.cep + "'></td></tr>" +
        "<tr><td class='wsfinan_add_label'>Logradouro:</td><td><input id='wsfinan_add_logradouro' type='text' value='" + data.logradouro + "'></td></tr>" +
        "<tr><td class='wsfinan_add_label'>Complemento:</td><td><input id='wsfinan_add_complemento' type='text' value='" + data.complemento + "'></td></tr>" +
        "<tr><td class='wsfinan_add_label'>Numero:</td><td><input id='wsfinan_add_numero' type='text' value='" + data.numero + "'></td></tr>" +
        "<tr><td class='wsfinan_add_label'>Bairro:</td><td><input id='wsfinan_add_bairro' type='text' value='" + data.bairro + "'></td></tr>" +
        "<tr><td class='wsfinan_add_label'>Município:</td><td><input id='wsfinan_add_municipio' type='text' value='" + data.municipio + "'></td></tr>" +
        "<tr><td class='wsfinan_add_label'>Estado:</td><td><input id='wsfinan_add_uf' type='text' value='" + data.uf + "'></td></tr>" +
        "<tr><td class='wsfinan_add_label'>Pais:</td><td><input id='wsfinan_add_country' type='text' value='" + data.country + "'></td></tr>" +
        "<tr><td class='wsfinan_add_label'>Telefone:</td><td><input id='wsfinan_add_telefone' type='text' value='" + data.telefone + "'></td></tr>" +
        "<tr><td class='wsfinan_add_label'>E-Mail:</td><td><input id='wsfinan_add_email' type='text' value='" + data.email + "'></td></tr>" +
        "<tr><td class='wsfinan_add_label'>Ativo:</td><td><input id='wsfinan_add_active' type='checkbox' " + ((data.active == 1) ? "Checked" : "") + "></td></tr>" +
        "<tr><td colspan=2 class='wsfinan_add_label_info' id='wsfinan_add_info'></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Adicionar' type='button' onclick='ClientEvents.emit(\"WSFinan/fornecedor/save\")'></td></tr>" +
        "</table>";

    document.body.appendChild(div);
});


ClientEvents.on("wsfinancnpjchange", () => {
    if (document.getElementById("wsfinan_add_clientes_div")) {
        let cnpj = document.getElementById("wsfinan_add_cnpj").value;
        consultaCNPJ(cnpj).then(data => {
            if (document.getElementById("wsfinan_add_name").value == "")
                document.getElementById("wsfinan_add_name").setAttribute("value", data.nome);
            if (document.getElementById("wsfinan_add_responsavel").value == "") {
                if (data.qsa[0] != undefined)
                    document.getElementById("wsfinan_add_responsavel").setAttribute("value", data.qsa[0].nome);
            }
            document.getElementById("wsfinan_add_cep").setAttribute("value", data.cep);
            document.getElementById("wsfinan_add_logradouro").setAttribute("value", data.logradouro);
            document.getElementById("wsfinan_add_numero").setAttribute("value", data.numero);
            document.getElementById("wsfinan_add_bairro").setAttribute("value", data.bairro);
            document.getElementById("wsfinan_add_municipio").setAttribute("value", data.municipio);
            document.getElementById("wsfinan_add_uf").setAttribute("value", data.uf);
            document.getElementById("wsfinan_add_country").setAttribute("value", "Brasil");
            document.getElementById("wsfinan_add_telefone").setAttribute("value", data.telefone);
            document.getElementById("wsfinan_add_email").setAttribute("value", data.email);

        }).catch(err => {
            if (err == "CNPJ inválido") { ClientEvents.emit("WSFinan/fornecedor/error", err); }
            if (err == "CNPJ rejeitado pela Receita Federal") { ClientEvents.emit("WSFinan/fornecedor/error", err); }
            if (err == "CEP inválido") { ClientEvents.emit("WSFinan/fornecedor/error", err); }
            if (err == "CEP não encontrado") { ClientEvents.emit("WSFinan/fornecedor/error", err); }
            if (err == "Tempo limite atingido") { ClientEvents.emit("WSFinan/fornecedor/error", err); }
        })
    }
});


ClientEvents.on("wsfinancepchange", () => {
    if (document.getElementById("wsfinan_add_clientes_div")) {
        let cep = document.getElementById("wsfinan_add_cep").value;
        consultaCEP(cep).then(data => {
            document.getElementById("wsfinan_add_logradouro").setAttribute("value", data.logradouro);
            document.getElementById("wsfinan_add_numero").setAttribute("value", data.complemento);
            document.getElementById("wsfinan_add_bairro").setAttribute("value", data.bairro);
            document.getElementById("wsfinan_add_municipio").setAttribute("value", data.localidade);
            document.getElementById("wsfinan_add_uf").setAttribute("value", data.uf);
            document.getElementById("wsfinan_add_country").setAttribute("value", "Brasil");

        }).catch(err => {
            if (err == "CNPJ inválido") { ClientEvents.emit("WSFinan/fornecedor/error", err); }
            if (err == "CNPJ rejeitado pela Receita Federal") { ClientEvents.emit("WSFinan/fornecedor/error", err); }
            if (err == "CEP inválido") { ClientEvents.emit("WSFinan/fornecedor/error", err); }
            if (err == "CEP não encontrado") { ClientEvents.emit("WSFinan/fornecedor/error", err); }
            if (err == "Tempo limite atingido") { ClientEvents.emit("WSFinan/fornecedor/error", err); }
        })
    }
});
ClientEvents.on("WSFinan/fornecedor/error", (info) => {
    if (document.getElementById("wsfinan_add_info")) {
        let infoHolder = document.getElementById("wsfinan_add_info");
        infoHolder.innerText = info;
        infoHolder.style.opacity = 1;
        setTimeout(() => {
            infoHolder.style.opacity = 0;
        }, 1000)
    }
});

ClientEvents.on("iswsfinancnpjchange", () => {
    if (document.getElementById("wsfinan_add_cnpj")) {
        if (document.getElementById("wsfinan_add_iscnpj").checked) {
            document.getElementById("tr_wsfinan_add_cnpj").style.display = "contents";
            document.getElementById("tr_wsfinan_add_cpf").style.display = "none";
        } else {
            document.getElementById("tr_wsfinan_add_cnpj").style.display = "none";
            document.getElementById("tr_wsfinan_add_cpf").style.display = "contents";
        }
    }
});

ClientEvents.on("WSFinan/fornecedor/save", () => {
    ClientEvents.emit("SendSocket", "WSFinan/fornecedor/add", {
        name: document.getElementById("wsfinan_add_name").value,
        responsavel: document.getElementById("wsfinan_add_responsavel").value,
        cpf_cnpj: document.getElementById("wsfinan_add_cnpj").value || document.getElementById("wsfinan_add_cpf").value,
        cep: document.getElementById("wsfinan_add_cep").value,
        logradouro: document.getElementById("wsfinan_add_logradouro").value,
        complemento: document.getElementById("wsfinan_add_complemento").value,
        numero: document.getElementById("wsfinan_add_numero").value,
        bairro: document.getElementById("wsfinan_add_bairro").value,
        municipio: document.getElementById("wsfinan_add_municipio").value,
        uf: document.getElementById("wsfinan_add_uf").value,
        telefone: document.getElementById("wsfinan_add_telefone").value,
        email: document.getElementById("wsfinan_add_email").value,
        iscnpj: document.getElementById("wsfinan_add_iscnpj").checked,
        active: document.getElementById("wsfinan_add_active").checked,
        country: document.getElementById("wsfinan_add_country").value
    });
    /**
     * save data and closes the page if success
     * closing part from server command
     */
})