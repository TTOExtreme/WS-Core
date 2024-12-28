
/**
 * Lista de STATUS
 */

if (!window.Modules) {
    window.Modules = {
        WSMA: {
            typo: null
        }
    }
}

window.Modules.WSMA.Typo = class typo {

    MateriaisType = [
        {
            name: "Material Permanente",
            code: "ma_permanente",
        },
        {
            name: "Material Consumo ",
            code: "ma_consumo",
        }
    ]
    ServicosType = [
        {
            name: "Serviço Recorrente",
            code: "sv_recorrente",
        },
        {
            name: "Serviço Único",
            code: "sv_unico",
        }
    ]

    Unit = [
        {
            name: "Unitário",
            code: "UN"
        },
        {
            name: "Pacote",
            code: "PCT"
        },
        {
            name: "Caixa",
            code: "CX"
        },
        {
            name: "Centimetros Cúbicos",
            code: "CM3"
        },
        {
            name: "Milimetros",
            code: "MM"
        },
        {
            name: "Centimetros",
            code: "CM"
        },
        {
            name: "Metros",
            code: "M"
        },
        {
            name: "Kilimetros",
            code: "KM"
        },
        {
            name: "Centimetros Quadrados",
            code: "CM2"
        },
        {
            name: "Metros Quadrados",
            code: "M2"
        },
        {
            name: "Kilimetros Quadrados",
            code: "KM2"
        },
        {
            name: "Metros Cúbicos",
            code: "M3"
        },
        {
            name: "Litro",
            code: "L"
        },
        {
            name: "Grama",
            code: "G"
        },
        {
            name: "Kilograma",
            code: "KG"
        },
        {
            name: "Tonelada",
            code: "T"
        },
    ]


    MAIdToName(ID = "ma_permanente") {
        let ret = "-";
        this.MateriaisType.forEach((item, index) => {
            if (item.code == ID) ret = item.name;
        });
        return ret;
    }

    MAToOptList(selected = "ma_permanente") {
        let ret = ""
        this.MateriaisType.forEach((item1, index1) => {
            ret += "<option value='" + item1.code + "' " + (selected == item1.code ? "selected" : "") + ">" + item1.name + "</option>";
        });
        return ret;
    }

    UnitToOptList(selected = "UN") {
        let ret = ""
        this.Unit.forEach((item1, index1) => {
            ret += "<option value='" + item1.code + "' " + (selected == item1.code ? "selected" : "") + ">" + item1.name + "</option>";
        });
        return ret;
    }

    SVIdToName(ID = "sv_unico") {
        let ret = "-";
        this.ServicosType.forEach((item, index) => {
            if (item.code == ID) ret = item.name;
        });
        return ret;
    }

    SVToOptList(selected = "sv_unico") {
        let ret = ""
        this.ServicosType.forEach((item1, index1) => {
            ret += "<option value='" + item1.code + "' " + (selected == item1.code ? "selected" : "") + ">" + item1.name + "</option>";
        });
        return ret;
    }

}
