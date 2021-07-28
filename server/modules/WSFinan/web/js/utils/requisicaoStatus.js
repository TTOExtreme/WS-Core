
/**
 * Lista de STATUS
 */

if (!window.Modules) {
    window.Modules = {
        WSFinan: {
            statusID: null
        }
    }
}

window.Modules.WSFinan.StatusID = class StatusID {
    statusIDs = [
        //vendas e Design
        {
            name: "Orçamento", color: "#ffffff", bgColor: "#0000a0",
            code: "orcamento", changeto: ["orcamento", "aprovado", "executado", "reprovado"],
        },
        {
            name: "Aprovado", color: "#ffffff", bgColor: "#ff6000",
            code: "aprovado", changeto: ["orcamento", "aprovado", "executado", "reprovado"],
        },
        {
            name: "Executado", color: "#ffffff", bgColor: "#3030ff",
            code: "executado", changeto: ["orcamento", "aprovado", "executado", "reprovado"],
        },
        {
            name: "Reprovado", color: "#ffffff", bgColor: "#ff0000",
            code: "reprovado", changeto: ["orcamento", "aprovado", "executado", "reprovado"],
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
            if (item.code == status) {
                ret = (item.edit.indexOf(setor) != -1);
            }
        });
        return ret;
    }

    getStatusName(status = "orcamento") {
        let ret = [];
        this.statusIDs.forEach((item, index) => {
            if (item.code == status) {
                ret = item.name;
            }
        });
        return ret;
    }
}
