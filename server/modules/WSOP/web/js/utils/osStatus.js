
/**
 * Lista de STATUS
 */

if (!window.Modules) {
    window.Modules = {
        WSOP: {
            Produtos: null
        }
    }
}

window.Modules.WSOP.StatusID = class StatusID {
    statusIDs = [
        //vendas e Design
        {
            name: "Orçamento", color: "#ffffff", bgColor: "#0000a0",
            code: "orcamento", changeto: ["criacao_arte", "aprovacao_mockups", "aguardando_pagamento", "liberado_producao"],
            edit: ["vendas"],
            view: ["vendas"]
        },
        {
            name: "Aprovação Mockups", color: "#ffffff", bgColor: "#ff6000",
            code: "aprovacao_mockups", changeto: ["orcamento", "criacao_arte", "aguardando_pagamento", "liberado_producao"],
            edit: ["vendas"],
            view: ["vendas"]
        },
        {
            name: "Falta de Informação", color: "#ffffff", bgColor: "#ff6000",
            code: "falta_informacao", changeto: ["orcamento", "criacao_arte", "aguardando_pagamento", "liberado_producao"],
            edit: ["vendas"],
            view: ["vendas"]
        },
        {
            name: "Aguardando Pagamento", color: "#ffffff", bgColor: "#ff6000",
            code: "aguardando_pagamento", changeto: ["orcamento", "criacao_arte", "aprovacao_mockups", "liberado_producao"],
            edit: ["vendas"],
            view: ["vendas"]
        },
        {
            name: "Liberado Produção", color: "#ffffff", bgColor: "#ff6000",
            code: "liberado_producao", changeto: ["falta_informacao", "montagem_arquivos"],
            edit: ["vendas", "prepress"],
            view: ["vendas", "prepress"]
        },
        //Design
        {
            name: "Criação de Arte Fila", color: "#ffffff", bgColor: "#000050",
            code: "criacao_arte", changeto: ["falta_informacao", "desenvolvendo_mockups"],
            edit: ["nulo"],
            view: ["vendas", "design"],
            blockView: ["design"],
        },
        {
            name: "Desenvolvendo Mockups", color: "#ffffff", bgColor: "#000050",
            code: "desenvolvendo_mockups", changeto: ["falta_informacao", "mockups_prontos"],
            edit: ["design"],
            view: ["vendas", "design"]
        },
        {
            name: "Mockups Prontos", color: "#ffffff", bgColor: "#000050",
            code: "mockups_prontos", changeto: ["aprovacao_mockups"],
            edit: ["design", "vendas"],
            view: ["vendas"]
        },
        //Pre Press
        {
            name: "Montagem de Arquivos", color: "#ffffff", bgColor: "#00bb00",
            code: "montagem_arquivos", changeto: ["falta_informacao", "arquivo_pronto"],
            edit: ["prepress"],
            view: ["vendas", "prepress"]
        },
        {
            name: "Arquivo Pronto", color: "#ffffff", bgColor: "#1d7718",
            code: "arquivo_pronto", changeto: ["falta_informacao", "soltar_piloto"],
            edit: ["prepress"],
            view: ["vendas", "prepress"]
        },
        {
            name: "Correção Arquivos ", color: "#ffffff", bgColor: "#1d7718",
            code: "correcao_arquivos", changeto: ["falta_informacao", "soltar_piloto"],
            edit: ["prepress"],
            view: ["vendas", "prepress"]
        },
        {
            name: "Soltar Piloto", color: "#ffffff", bgColor: "#1d7718",
            code: "soltar_piloto", changeto: ["falta_informacao", "aprovacao_piloto"],
            edit: ["prepress"],
            view: ["vendas", "prepress"]
        },
        {
            name: "Aguardando Aprovação Piloto", color: "#ffffff", bgColor: "#1d7718",
            code: "aprovacao_piloto", changeto: ["falta_informacao", "piloto_aprovada", "piloto_rejeitada"],
            edit: ["prepress"],
            view: ["vendas", "prepress"]
        },
        {
            name: "Piloto Aprovada", color: "#ffffff", bgColor: "#c3540f",
            code: "piloto_aprovada", changeto: ["falta_informacao", "liberado_impressao"],
            edit: ["prepress"],
            view: ["vendas", "prepress"]
        },
        {
            name: "Piloto Rejeitada", color: "#ffffff", bgColor: "#c3540f",
            code: "piloto_rejeitada", changeto: ["falta_informacao", "correcao_arquivos"],
            edit: ["prepress"],
            view: ["vendas", "prepress"]
        },
        {
            name: "Liberado Impressão", color: "#ffffff", bgColor: "#15c5bf",
            code: "liberado_impressao", changeto: ["falta_informacao", "impresso"],
            edit: ["prepress"],
            view: ["vendas", "prepress"]
        },
        {
            name: "Impresso", color: "#ffffff", bgColor: "#227d76",
            code: "impresso", changeto: ["liberado_calandra"],
            edit: ["prepress", "calandra"],
            view: ["vendas", "prepress", "calandra"]
        },
        //Calandra
        {
            name: "Liberado Calandra", color: "#ffffff", bgColor: "#ff8d13",
            code: "liberado_calandra", changeto: ["calandrado"],
            edit: ["calandra"]
        },
        {
            name: "Calandrado", color: "#ffffff", bgColor: "#b98522",
            code: "calandrado", changeto: ["costura"],
            edit: ["calandra", "costura"],
            view: ["vendas", "calandra"]
        },
        //costura
        {
            name: "Costura", color: "#ffffff", bgColor: "#2c30f1",
            code: "costura", changeto: ["costurado"],
            edit: ["costura"],
            view: ["vendas", "costura"]
        },
        {
            name: "Costurado", color: "#ffffff", bgColor: "#6164e8",
            code: "costurado", changeto: ["conferencia"],
            edit: ["costura", "expedicao"],
            view: ["vendas", "costura", "expedicao"]
        },
        //Conferencia e expedição
        {
            name: "Conferência", color: "#ffffff", bgColor: "#2bbd5a",
            code: "conferencia", changeto: ["empacotamento"],
            edit: ["expedicao"],
            view: ["vendas", "expedicao"]
        },
        {
            name: "Empacotamento", color: "#ffffff", bgColor: "#2bbd5a",
            code: "empacotamento", changeto: ["aguardando_liberar_envio"],
            edit: ["expedicao"],
            view: ["vendas", "expedicao"]
        },
        {
            name: "Aguardando Liberação de Envio", color: "#ffffff", bgColor: "#2bbd5a",
            code: "aguardando_liberar_envio", changeto: ["liberado_expedicao"],
            edit: ["expedicao"],
            view: ["vendas", "expedicao"]
        },
        {
            name: "Liberado Expedição", color: "#ffffff", bgColor: "#2bbd5a",
            code: "liberado_expedicao", changeto: ["enviado", "liberado_retirada"],
            edit: ["expedicao"],
            view: ["vendas", "expedicao"]
        },
        {
            name: "Enviado", color: "#ffffff", bgColor: "#2bbd5a",
            code: "enviado", changeto: ["finalizado"],
            edit: ["expedicao"],
            view: ["vendas", "expedicao"]
        },
        {
            name: "Liberado Retirada", color: "#ffffff", bgColor: "#2bbd5a",
            code: "liberado_retirada", changeto: ["finalizado"],
            edit: ["expedicao"],
            view: ["vendas", "expedicao"]
        },
        {
            name: "Finalizado", color: "#ffffff", bgColor: "#000000",
            code: "finalizado", changeto: ["falta_informacao"],
            edit: [""],
            view: [""]
        },
    ]

    StatusIdToName(ID = "orcamento") {
        let ret = "-";
        this.statusIDs.forEach((item, index) => {
            if (item.code == ID) ret = item.name;
        });
        return ret;
    }

    StatusIdToOptList(selected = "orcamento") {
        let ret = ""
        this.statusIDs.forEach((item1, index1) => {
            if (item1.code == selected) {
                ret += "<option value='" + item1.code + "' " + "selected" + ">" + item1.name + "</option>";
                item1.changeto.forEach((cht) => {
                    this.statusIDs.forEach((item, index) => {
                        if (cht == item.code)
                            ret += "<option value='" + item.code + "'> " + item.name + "</option > ";
                    });

                })
            }
        });
        return ret;
    }

    StatusIdToColor(ID = "orcamento") {
        let ret = "#ffffff";
        this.statusIDs.forEach((item, index) => {
            if (item.code == ID) ret = item.color;
        });
        return ret;
    }

    StatusIdToBgColor(ID = "orcamento") {
        let ret = "#303030";
        this.statusIDs.forEach((item, index) => {
            if (item.code == ID) ret = item.bgColor;
        });
        return ret;
    }

    enableEdit(status = "orcamento", setor = "vendas") {
        let ret = false;
        this.statusIDs.forEach((item, index) => {
            if (item.code == status) ret = (item.edit.indexOf(setor) > -1);
        });
        return ret;
    }

    blockView(status = "orcamento", setor = "vendas") {
        let ret = false;
        this.statusIDs.forEach((item, index) => {
            if (item.code == status) {
                if (item.blockView != undefined) {
                    ret = (item.blockView.indexOf(setor) == -1);
                }
            }
        });
        return ret;
    }

    getStatusSector(sector = "vendas") {
        let ret = [];
        this.statusIDs.forEach((item, index) => {
            if (item.view != undefined)
                item.view.forEach(sec => {
                    if (sec == sector) ret.push(item.code);
                })
        });
        return ret;
    }
}
