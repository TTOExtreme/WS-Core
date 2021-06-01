ClientEvents.clearAll();

ClientEvents.emit("LeftMenuClose");
ClientEvents.emit("LMI-CloseAll");

ClientEvents.emit("LoadExternal", [
    "./module/WSOP/js/clientes/add.js",
    "./module/WSOP/js/utils/consulta.js",
    "./module/WSOP/js/clientes/del.js",
    "./module/WSOP/js/clientes/edt.js",
    "./module/WSOP/css/index.css"
], () => { }, false)

if (window.UserList) { // usa a mesma interface global para todas as listas
    window.UserList = null;
    document.getElementById("MainScreen").innerHTML = "";
}

ClientEvents.on("wsop/emitente/add", (data) => {
    window.Emitente = data;
    ClientEvents.emit("WSOP/emitente/close");
    /**
     * create Show Page for user info
     */
    let div = document.createElement("div");
    div.setAttribute("class", "wsop_add_div");
    div.setAttribute("id", "wsop_add_div");

    div.innerHTML = "" +
        "<table>" +
        "<tr><td id='move_menu_wsop_add' class='move_menu' onmousedown=ClientEvents.emit(\"move_menu_down\",'wsop_add_div')>&#9776;</td><td class='wsop_edt_label'><p class='wsop_add_closeButton' onclick='ClientEvents.emit(\"WSOP/emitente/close\")'>X</p></td></tr>" +
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
        "<tr><td class='wsop_edt_label'>Telefone:</td><td><input id='wsop_add_telefone' type='text' value='" + data.telefone + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>E-Mail:</td><td><input id='wsop_add_email' type='text' value='" + data.email + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'>Logo:</td><td><img id='wsop_add_img_thumb' class='wsop_add_img_thumb' alt='' src='module/WSOP/img/" + data.img + "' loc='" + data.img + "'></td></tr>" +
        "<tr><td class='wsop_edt_label'></td><td><input id='wsop_add_img' type='file' onchange='ClientEvents.emit(\"uploadIMG\")' value='" + data.img + "'></td></tr>" +
        "<tr><td colspan=2 class='wsop_edt_label_info' id='wsop_add_info'></td></tr>" +
        "<tr><td></td><td><input id='wpma_sites_submit' value='Salvar' type='button' onclick='ClientEvents.emit(\"WSOP/emitente/save\")'></td></tr>" +
        "</table>";

    document.body.appendChild(div);
});
ClientEvents.emit("SendSocket", "wsop/emitente/lst");

ClientEvents.on("WSOP/emitente/close", () => {
    if (document.getElementById("wsop_add_div")) {
        document.body.removeChild(document.getElementById("wsop_add_div"));
    }
});

ClientEvents.on("cnpjchange", () => {
    if (document.getElementById("wsop_add_div")) {
        let cnpj = document.getElementById("wsop_add_cnpj").value;
        consultaCNPJ(cnpj).then(data => {
            if (document.getElementById("wsop_add_name").value == "")
                document.getElementById("wsop_add_name").setAttribute("value", data.nome);
            if (document.getElementById("wsop_add_responsavel").value == "") {
                if (data.qsa[0] != undefined)
                    document.getElementById("wsop_add_responsavel").setAttribute("value", data.qsa[0].nome);
            }
            document.getElementById("wsop_add_cep").setAttribute("value", data.cep);
            document.getElementById("wsop_add_logradouro").setAttribute("value", data.logradouro);
            document.getElementById("wsop_add_numero").setAttribute("value", data.numero);
            document.getElementById("wsop_add_bairro").setAttribute("value", data.bairro);
            document.getElementById("wsop_add_municipio").setAttribute("value", data.municipio);
            document.getElementById("wsop_add_uf").setAttribute("value", data.uf);
            document.getElementById("wsop_add_telefone").setAttribute("value", data.telefone);
            document.getElementById("wsop_add_email").setAttribute("value", data.email);

        }).catch(err => {
            if (err == "CNPJ inválido") { ClientEvents.emit("WSOP/emitente/error", err); }
            if (err == "CNPJ rejeitado pela Receita Federal") { ClientEvents.emit("WSOP/emitente/error", err); }
            if (err == "CEP inválido") { ClientEvents.emit("WSOP/emitente/error", err); }
            if (err == "CEP não encontrado") { ClientEvents.emit("WSOP/emitente/error", err); }
            if (err == "Tempo limite atingido") { ClientEvents.emit("WSOP/emitente/error", err); }
            //console.log(err);
        })
    }
});


ClientEvents.on("cepchange", () => {
    if (document.getElementById("wsop_add_div")) {
        let cep = document.getElementById("wsop_add_cep").value;
        consultaCEP(cep).then(data => {

            document.getElementById("wsop_add_logradouro").setAttribute("value", data.logradouro);
            document.getElementById("wsop_add_numero").setAttribute("value", data.complemento);
            document.getElementById("wsop_add_bairro").setAttribute("value", data.bairro);
            document.getElementById("wsop_add_municipio").setAttribute("value", data.localidade);
            document.getElementById("wsop_add_uf").setAttribute("value", data.uf);

        }).catch(err => {
            if (err == "CNPJ inválido") { ClientEvents.emit("WSOP/emitente/error", err); }
            if (err == "CNPJ rejeitado pela Receita Federal") { ClientEvents.emit("WSOP/emitente/error", err); }
            if (err == "CEP inválido") { ClientEvents.emit("WSOP/emitente/error", err); }
            if (err == "CEP não encontrado") { ClientEvents.emit("WSOP/emitente/error", err); }
            if (err == "Tempo limite atingido") { ClientEvents.emit("WSOP/emitente/error", err); }
            //console.log(err);
        })
    }
});
ClientEvents.on("WSOP/emitente/error", (info) => {
    if (document.getElementById("wsop_add_info")) {
        let infoHolder = document.getElementById("wsop_add_info");
        infoHolder.innerText = info;
        infoHolder.style.opacity = 1;
        setTimeout(() => {
            infoHolder.style.opacity = 0;
        }, 1000)
    }
});

ClientEvents.on("iscnpjchange", () => {
    if (document.getElementById("wsop_add_cnpj")) {
        if (document.getElementById("wsop_add_iscnpj").checked) {
            document.getElementById("tr_wsop_add_cnpj").style.display = "contents";
            document.getElementById("tr_wsop_add_cpf").style.display = "none";
        } else {
            document.getElementById("tr_wsop_add_cnpj").style.display = "none";
            document.getElementById("tr_wsop_add_cpf").style.display = "contents";
        }
    }
});

ClientEvents.on("WSOP/emitente/save", () => {
    ClientEvents.emit("SendSocket", "wsop/emitente/add", {
        name: document.getElementById("wsop_add_name").value,
        responsavel: document.getElementById("wsop_add_responsavel").value,
        cpf_cnpj: document.getElementById("wsop_add_cnpj").value || document.getElementById("wsop_add_cpf").value,
        cep: document.getElementById("wsop_add_cep").value,
        logradouro: document.getElementById("wsop_add_logradouro").value,
        numero: document.getElementById("wsop_add_numero").value,
        bairro: document.getElementById("wsop_add_bairro").value,
        municipio: document.getElementById("wsop_add_municipio").value,
        uf: document.getElementById("wsop_add_uf").value,
        telefone: document.getElementById("wsop_add_telefone").value,
        email: document.getElementById("wsop_add_email").value,
        iscnpj: document.getElementById("wsop_add_iscnpj").checked,
        img: document.getElementById("wsop_add_img_thumb").getAttribute("loc"),
    });
    /**
     * save data and closes the page if success
     * closing part from server command
     */
})

ClientEvents.on("uploadIMG", () => {
    if (document.getElementById("wsop_add_img")) {
        let input = document.getElementById("wsop_add_img");
        if (input.files && input.files[0]) {
            var sender = new FileReader();
            let ext = input.files[0].name.substring(input.files[0].name.lastIndexOf("."));
            let name = input.files[0].name.substring(0, input.files[0].name.lastIndexOf("."));

            let img = document.getElementById("wsop_add_img_thumb")
            img.setAttribute('src', "./module/WSOP/img/loading.gif")
            sender.onload = function (e) {
                ClientEvents.emit("SendSocket", "wsop/emitente/file", { name: name, ext: ext, stream: e.target.result })
            };

            sender.readAsArrayBuffer(input.files[0]);
        }
    }
})

ClientEvents.on("wsop/emitente/fileuploaded", (data) => {
    let img = document.getElementById("wsop_add_img_thumb")
    img.setAttribute('src', "./module/WSOP/img/" + data.file)
    img.setAttribute('loc', data.file)
    //img.setAttribute('onclick', "ClientEvents.emit(\"WSOP/emitente/anexo/view\"," + JSON.stringify({ name: "", thumb: data.file }) + ")")
})