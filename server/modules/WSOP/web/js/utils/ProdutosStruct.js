
if (!window.Modules) {
    window.Modules = {
        WSOP: {
            Produtos: null
        }
    }
}
window.Modules.WSOP.Produtos = new class WSOP_Products {
    /**
     * Lista de Estrutura de produtos
     */

    _Tamanhos = [
        "PP",
        "P",
        "M",
        "G",
        "GG",
        "EXG",
        "EXGG",
        "G3",
        "G4"
    ]

    _Tecidos = [
        "Dry",
        "Elastano",
        "Dynamic"
    ]

    _Vies = [
        "Preto",
        "Branco"
    ]

    _Gola = [
        "Branca",
        "Preta",
        "Especial"
    ]

    _Modelos = [
        {
            name: "Regata",
            sigla: "Rg",
        },
        {
            name: "Camisa Manga Curta",
            sigla: "Mc",
        },
        {
            name: "Camisa Manga Longa",
            sigla: "Ml",
        },
        {
            name: "Camisa Manga Longa Raglan",
            sigla: "MlR",
        },
        {
            name: "Agasalho",
            sigla: "Ag",
        }
    ]


    getModelos(selected = 0) {
        let ret = ""
        this._Modelos.forEach((item, index) => {
            ret += "<option value='" + index + "' " + ((index == selected) ? "selected" : "") + ">" + item.name + "</option>";
        })
        return ret;
    }

    getTamanhos(Modelo = 0, selected = 0) {
        let ret = "<option disabled selected>Selecione:</option>";
        (this._Modelos[Modelo].tamanhos || this._Tamanhos).forEach((item, index) => {
            ret += "<option value='" + index + "' " + ((index == selected - 1) ? "selected" : "") + ">" + item + "</option>";
        })
        return ret;
    }
    getVies(Modelo = 0, selected = 0) {
        let ret = "<option disabled selected>Selecione:</option>";
        (this._Modelos[Modelo].vies || this._Vies).forEach((item, index) => {
            ret += "<option value='" + index + "' " + ((index == selected - 1) ? "selected" : "") + ">" + item + "</option>";
        })
        return ret;
    }
    getGola(Modelo = 0, selected = 0) {
        let ret = "<option disabled selected>Selecione:</option>";
        (this._Modelos[Modelo].gola || this._Gola).forEach((item, index) => {
            ret += "<option value='" + index + "' " + ((index == selected - 1) ? "selected" : "") + ">" + item + "</option>";
        })
        return ret;
    }
}
