
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
        "Redonda",
        "Redonda Transpassada",
        "Decote V Transpassado",
        "Decote V Transpassado",
        "Decote V Com Vivo",
        "Decote V Duas Cores",
        "Decote V",
        "Gola Polo",
        "Soccer",
        "Soccer Com Vivo",
        "Confort",
        "Soccer Peitilho Meio Aberto"
    ]

    _Modelos = [
        {
            name: "Regata Esportiva Padrão",
            tecidos: ["Dry"]
        },
        {
            name: "Regata Esportiva Gabiru",
            tecidos: ["Dry"]
        },
        {
            name: "Regata Esportiva Nadador",
            tecidos: ["Elastano"]
        },
        {
            name: "Regata Esportiva Machão",
            tecidos: ["Elastano"]
        },
        {
            name: "Shorts Esportivo",
            tecidos: ["Dry", "Elastano"],
            gola: ["-"]
        },
        {
            name: "Shorts Especial Recortado",
            tecidos: ["Dry", "Elastano"],
            gola: ["-"]
        },
        {
            name: "Shorts Especial Training",
            tecidos: ["Dry"],
            gola: ["-"]
        },
        {
            name: "Shorts Especial Recortado Com Cós",
            tecidos: ["Elastano"],
            gola: ["-"]
        },
        {
            name: "Shorts Saia Beach (Saia)",
            tecidos: ["Elastano"],
            gola: ["-"]
        },
        {
            name: "Shorts Saia Entrelaçado",
            tecidos: ["Elastano"],
            gola: ["-"]
        },
        {
            name: "Shorts Ciclista",
            tecidos: ["Elastano"],
            genero: ["Feminino"],
            gola: ["-"]
        },
        {
            name: "Bermuda",
            tecidos: ["Dry"],
            gola: ["-"]
        },
        {
            name: "Manga Curta Futebol",
            tecidos: ["Dry", "Sport Dry"]
        },
        {
            name: "Manga Curta Futevôlei",
            tecidos: ["Elastano"]
        },
        {
            name: "Manga Curta Slim",
            tecidos: ["Elastano"]
        },
        {
            name: "Polo de Treino Esportiva",
            tecidos: ["Sport Dry"]
        },
        {
            name: "Colete Unisex",
            tecidos: ["Sport Dry"],
            genero: ["Unisex"],
            gola: ["-"]
        },
        {
            name: "Top",
            tecidos: ["Heavy Elastano"],
            genero: ["Feminino"],
            gola: ["-"]
        },
        {
            name: "Manga Longa Futevôlei",
            tecidos: ["Elastano"]
        },
        {
            name: "Manga Longa Slim",
            tecidos: ["Elastano"]
        },
        {
            name: "Manga Longa Raglan",
            tecidos: ["Elastano"]
        },
        {
            name: "Agasalho Zipper C/ Capuz",
            tecidos: ["Premium"],
            gola: ["-"]
        },
        {
            name: "Agasalho Canguru C/ Capuz",
            tecidos: ["Premium"],
            gola: ["-"]
        },
        {
            name: "Agasalho Treino",
            tecidos: ["Helanca"],
            gola: ["-"]
        },
        {
            name: "Sunga Boxer",
            tecidos: ["Heavy Elastano"],
            gola: ["-"]
        },
        {
            name: "Calça Termica Boxer",
            tecidos: ["Heavy Elastano"],
            gola: ["-"]
        },
        {
            name: "Calça Treino",
            tecidos: ["Heavy Elastano", "Helanca"],
            gola: ["-"]
        },
        {
            name: "Conjunto Sunga e Manga Longa",
            tecidos: ["-"],
            gola: ["-"],
            genero: ["Masculino"]
        },
        {
            name: "Conjunto Manga Longa e Shorts",
            tecidos: ["-"],
            gola: ["-"]
        },
        {
            name: "Conjunto Manga Longa e Boné",
            tecidos: ["-"],
            gola: ["-"]
        },
        {
            name: "Conjunto Regata e Shorts",
            tecidos: ["-"],
            gola: ["-"]
        },
        {
            name: "Kit: Regata, Manga Longa e Shorts",
            tecidos: ["-"],
            gola: ["-"],
        },
        {
            name: "Kit: Regata, Manga Longa e Bermuda",
            tecidos: ["-"],
            gola: ["-"],
            genero: ["Masculino"]
        },
        {
            name: "Bag",
            tecidos: ["-"],
            gola: ["-"],
            genero: ["-"],
            tamanhos: ["Unico"]
        },
        {
            name: "Boné Aba Curvada",
            tecidos: ["-"],
            gola: ["-"],
            genero: ["Unisex"],
            tamanhos: ["Unico"]
        },
        {
            name: "Boné Aba Reta",
            tecidos: ["-"],
            gola: ["-"],
            genero: ["Unisex"],
            tamanhos: ["Unico"]
        },
        {
            name: "Chinelo",
            tecidos: ["-"],
            gola: ["-"],
            genero: ["Unisex"],
            tamanhos: ["-"]
        },
        {
            name: "Tênis",
            tecidos: ["-"],
            gola: ["-"],
            genero: ["Unisex"],
            tamanhos: ["-"]
        },
        {
            name: "Viseira",
            tecidos: ["-"],
            gola: ["-"],
            genero: ["Unisex"],
            tamanhos: ["Unico"]
        },
        {
            name: "Bola",
            tecidos: ["-"],
            gola: ["-"],
            genero: ["-"],
            tamanhos: ["Unico"]
        },
        {
            name: "Chaveiro",
            tecidos: ["-"],
            gola: ["-"],
            genero: ["-"],
            tamanhos: ["Unico"]
        },
        {
            name: "Óculos",
            tecidos: ["-"],
            gola: ["-"],
            genero: ["Unisex"],
            tamanhos: ["Unico"]
        },
    ]


    getModelos(Modelo = "") {
        let ret = "<option disabled selected>Selecione:</option>"
        this._Modelos.forEach((item, index) => {
            ret += "<option value='" + item.name + "' " + ((item.name == Modelo) ? "selected" : "") + ">" + item.name + "</option>";
        })
        return ret;
    }

    getTamanhos(Modelo = "", selected = 0) {
        let ret = "<option disabled selected>Selecione:</option>";
        ((this._Modelos.filter((val) => val.name == Modelo)[0] != undefined ? this._Modelos.filter((val) => val.name == Modelo)[0].tamanhos : undefined) || this._Tamanhos).forEach((item, index) => {
            ret += "<option value='" + item + "' " + ((item == selected) ? "selected" : "") + ">" + item + "</option>";
        })
        return ret;
    }
    getVies(Modelo = "", selected = 0) {
        let ret = "<option disabled selected>Selecione:</option>";
        ((this._Modelos.filter((val) => val.name == Modelo)[0] != undefined ? this._Modelos.filter((val) => val.name == Modelo)[0].vies : undefined) || this._Vies).forEach((item, index) => {
            ret += "<option value='" + item + "' " + ((item == selected) ? "selected" : "") + ">" + item + "</option>";
        })
        return ret;
    }
    getGola(Modelo = "", selected = 0) {
        let ret = "<option disabled selected>Selecione:</option>";
        ((this._Modelos.filter((val) => val.name == Modelo)[0] != undefined ? this._Modelos.filter((val) => val.name == Modelo)[0].gola : undefined) || this._Gola).forEach((item, index) => {
            ret += "<option value='" + item + "' " + ((item == selected) ? "selected" : "") + ">" + item + "</option>";
        })
        return ret;
    }
    getGenero(Modelo = "", selected = 0) {
        let ret = "<option disabled selected>Selecione:</option>";
        ((this._Modelos.filter((val) => val.name == Modelo)[0] != undefined ? this._Modelos.filter((val) => val.name == Modelo)[0].genero : undefined) || ["Masculino", "Feminino"]).forEach((item, index) => {
            ret += "<option value='" + item + "' " + ((item == selected) ? "selected" : "") + ">" + item + "</option>";
        })
        return ret;
    }
}
