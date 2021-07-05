
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
        "RN",
        "01",
        "02",
        "04",
        "06",
        "08",
        "10",
        "12",
        "14",
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

        //Modelos Corretos
        {
            name: "Agasalho Ziper",
            tecidos: ["Dinamic"],
            gola: ["-"],
            vies: ["-"],
            preco: 85.70,
            precoRevenda: 85.70,
            custo: 44.25
        },
        {
            name: "Agasalho Canguru",
            tecidos: ["Dinamic"],
            gola: ["-"],
            vies: ["-"],
            preco: 85.70,
            precoRevenda: 85.70,
            custo: 29.30
        },
        {
            name: "Agasalho Treino",
            tecidos: ["Dinamic"],
            gola: ["-"],
            vies: ["-"],
            preco: 60.00,
            precoRevenda: 60.00,
            custo: 25.00
        },
        {
            name: "Bag",
            tecidos: ["Dry"],
            gola: ["-"],
            vies: ["-"],
            genero: ["-"],
            preco: 60.00,
            precoRevenda: 60.00,
            custo: 25.00
        },
        /* // Desativado no momento
        {
            name: "Bandana",
            tecidos: ["Dry"],
            gola: ["-"],
            vies: ["-"],
            genero: ["-"],
            preco: 60.00,
            custo: 25.00
        },
        //*/
        {
            name: "Boné",
            tecidos: ["Dry"],
            gola: ["-"],
            vies: ["-"],
            genero: ["-"],
            preco: 29.90,
            precoRevenda: 29.90,
            custo: 29.90
        },
        {
            name: "Chinelo",
            tecidos: ["-"],
            gola: ["-"],
            vies: ["-"],
            genero: ["-"],
            preco: 29.90,
            precoRevenda: 29.90,
            custo: 29.90
        },
        {
            name: "Calça Termica (Legging)",
            tecidos: ["Heavy Elastano"],
            gola: ["-"],
            vies: ["-"],
            preco: 74.70,
            precoRevenda: 74.70,
            custo: 27.44
        },
        {
            name: "Calça Treino",
            tecidos: ["Helanca"],
            gola: ["-"],
            vies: ["-"],
            preco: 74.70,
            precoRevenda: 74.70,
            custo: 27.44
        },
        {
            name: "Calça Techstripe",
            tecidos: ["Helanca"],
            gola: ["-"],
            vies: ["-"],
            preco: 98.00,
            precoRevenda: 98.00,
            custo: 50.00
        },
        {
            name: "Manga Curta Futebol",
            tecidos: ["Elastano", "Dry"],
            vies: ["-"],
            preco: 54.70,
            precoRevenda: 54.70,
            custo: 31.12
        },
        {
            name: "Manga Curta Futevôlei",
            tecidos: ["Elastano", "Dry"],
            vies: ["-"],
            preco: 54.70,
            precoRevenda: 54.70,
            custo: 33.44
        },
        {
            name: "Manga Curta POLO",
            tecidos: ["Dry"],
            gola: ["POLO"],
            vies: ["-"],
            preco: 60.70,
            precoRevenda: 60.70,
            custo: 33.44
        },
        {
            name: "Manga Longa",
            tecidos: ["Dry", "Elastano"],
            vies: ["-"],
            preco: 60.70,
            precoRevenda: 60.70,
            custo: 27.02
        },
        {
            name: "Regata",
            tecidos: ["Elastano", "Dry"],
            gola: ["-"],
            preco: 44.70,
            precoRevenda: 44.70,
            custo: 19.12
        },
        {
            name: "Shorts com Bolso (Bermuda)",
            tecidos: ["Dinamic"],
            gola: ["-"],
            vies: ["-"],
            preco: 44.70,
            precoRevenda: 44.70,
            custo: 19.12
        },
        {
            name: "Shorts Feminino Futevôlei",
            tecidos: ["Elastano"],
            gola: ["-"],
            vies: ["-"],
            genero: ["Feminino"],
            preco: 44.70,
            precoRevenda: 44.70,
            custo: 17.89
        },
        {
            name: "Shorts Masculino Futevôlei",
            tecidos: ["DRY"],
            gola: ["-"],
            vies: ["-"],
            genero: ["Masculino"],
            preco: 42.70,
            precoRevenda: 42.70,
            custo: 20.18
        },
        {
            name: "Shorts Saia",
            tecidos: ["Elastano"],
            gola: ["-"],
            vies: ["-"],
            genero: ["Feminino"],
            preco: 42.70,
            precoRevenda: 42.70,
            custo: 20.18
        },
        {
            name: "Sunga",
            tecidos: ["Heavy Elastano"],
            gola: ["-"],
            vies: ["-"],
            genero: ["Masculino"],
            preco: 42.70,
            precoRevenda: 42.70,
            custo: 20.18
        },
        {
            name: "TOP",
            tecidos: ["Heavy Elastano"],
            gola: ["-"],
            vies: ["-"],
            genero: ["Masculino"],
            preco: 49.90,
            precoRevenda: 49.90,
            custo: 19.97
        },
        {
            name: "Viseira",
            tecidos: ["-"],
            gola: ["-"],
            vies: ["-"],
            genero: ["-"],
            preco: 29.90,
            precoRevenda: 29.90,
            custo: 29.90
        },
        {
            name: "Bola",
            tecidos: ["-"],
            gola: ["-"],
            vies: ["-"],
            genero: ["-"],
            preco: 244.90,
            precoRevenda: 244.90,
            custo: 244.90
        },
        {
            name: "Conjunto Regata e Shorts",
            tecidos: ["-"],
            gola: ["-"],
            vies: ["-"],
            preco: 74.70,
            precoRevenda: 74.70,
            custo: 39.30
        },
        {
            name: "Conjunto Manga Longa e Shorts",
            tecidos: ["-"],
            gola: ["-"],
            vies: ["-"],
            preco: 94.70,
            precoRevenda: 94.70,
            custo: 47.20
        },
        {
            name: "Kit Manga Longa, Regata e Shorts",
            tecidos: ["-"],
            gola: ["-"],
            vies: ["-"],
            preco: 129.90,
            precoRevenda: 129.90,
            custo: 66.32
        },













        //Modelos Teste
        /*
        {
            name: "Regata Esportiva Padrão",
            tecidos: ["Dry"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Regata Esportiva Gabiru",
            tecidos: ["Dry"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Regata Esportiva Nadador",
            tecidos: ["Elastano"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Regata Esportiva Machão",
            tecidos: ["Elastano"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Shorts Esportivo",
            tecidos: ["Dry", "Elastano"],
            gola: ["-"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Shorts Especial Recortado",
            tecidos: ["Dry", "Elastano"],
            gola: ["-"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Shorts Especial Training",
            tecidos: ["Dry"],
            gola: ["-"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Shorts Especial Recortado Com Cós",
            tecidos: ["Elastano"],
            gola: ["-"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Shorts Saia Beach (Saia)",
            tecidos: ["Elastano"],
            gola: ["-"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Shorts Saia Entrelaçado",
            tecidos: ["Elastano"],
            gola: ["-"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Shorts Ciclista",
            tecidos: ["Elastano"],
            genero: ["Feminino"],
            gola: ["-"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Bermuda",
            tecidos: ["Dry"],
            gola: ["-"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Manga Curta Futebol",
            tecidos: ["Dry", "Sport Dry"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Manga Curta Futevôlei",
            tecidos: ["Elastano"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Manga Curta Slim",
            tecidos: ["Elastano"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Polo de Treino Esportiva",
            tecidos: ["Sport Dry"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Colete Unisex",
            tecidos: ["Sport Dry"],
            genero: ["Unisex"],
            gola: ["-"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Top",
            tecidos: ["Heavy Elastano"],
            genero: ["Feminino"],
            gola: ["-"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Manga Longa Futevôlei",
            tecidos: ["Elastano"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Manga Longa Slim",
            tecidos: ["Elastano"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Manga Longa Raglan",
            tecidos: ["Elastano"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Agasalho Zipper C/ Capuz",
            tecidos: ["Premium"],
            gola: ["-"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Agasalho Canguru C/ Capuz",
            tecidos: ["Premium"],
            gola: ["-"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Agasalho Treino",
            tecidos: ["Helanca"],
            gola: ["-"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Sunga Boxer",
            tecidos: ["Heavy Elastano"],
            gola: ["-"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Calça Termica Boxer",
            tecidos: ["Heavy Elastano"],
            gola: ["-"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Calça Treino",
            tecidos: ["Heavy Elastano", "Helanca"],
            gola: ["-"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Calça TechStripe",
            tecidos: ["Heavy Elastano", "Helanca"],
            gola: ["-"],
            preco: 98.00,
            custo: 50.00
        },
        {
            name: "Conjunto Sunga e Manga Longa",
            tecidos: ["-"],
            gola: ["-"],
            genero: ["Masculino"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Conjunto Manga Longa e Shorts",
            tecidos: ["-"],
            gola: ["-"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Conjunto Manga Longa e Boné",
            tecidos: ["-"],
            gola: ["-"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Conjunto Regata e Shorts",
            tecidos: ["-"],
            gola: ["-"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Kit: Regata, Manga Longa e Shorts",
            tecidos: ["-"],
            gola: ["-"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Kit: Regata, Manga Longa e Bermuda",
            tecidos: ["-"],
            gola: ["-"],
            genero: ["Masculino"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Bag",
            tecidos: ["-"],
            gola: ["-"],
            genero: ["-"],
            tamanhos: ["Unico"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Boné Aba Curvada",
            tecidos: ["-"],
            gola: ["-"],
            genero: ["Unisex"],
            tamanhos: ["Unico"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Boné Aba Reta",
            tecidos: ["-"],
            gola: ["-"],
            genero: ["Unisex"],
            tamanhos: ["Unico"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Chinelo",
            tecidos: ["-"],
            gola: ["-"],
            genero: ["Unisex"],
            tamanhos: ["-"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Tênis",
            tecidos: ["-"],
            gola: ["-"],
            genero: ["Unisex"],
            tamanhos: ["-"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Viseira",
            tecidos: ["-"],
            gola: ["-"],
            genero: ["Unisex"],
            tamanhos: ["Unico"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Bola",
            tecidos: ["-"],
            gola: ["-"],
            genero: ["-"],
            tamanhos: ["Unico"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Chaveiro",
            tecidos: ["-"],
            gola: ["-"],
            genero: ["-"],
            tamanhos: ["Unico"],
            preco: 60.00,
            custo: 25.00
        },
        {
            name: "Óculos",
            tecidos: ["-"],
            gola: ["-"],
            genero: ["Unisex"],
            tamanhos: ["Unico"],
            preco: 60.00,
            custo: 25.00
        },
        //*/
    ]


    getModelos(Modelo = "") {
        let ret = "<option disabled " + (Modelo == "" ? "selected" : "") + ">Selecione:</option>"
        this._Modelos.forEach((item, index) => {
            ret += "<option value='" + item.name + "' " + ((item.name == Modelo) ? "selected" : "") + ">" + item.name + "</option>";
        })
        return ret;
    }

    getTamanhos(Modelo = "", selected = "") {
        let ret = "<option disabled selected>Selecione:</option>";
        ((this._Modelos.filter((val) => val.name == Modelo)[0] != undefined ? this._Modelos.filter((val) => val.name == Modelo)[0].tamanhos : undefined) || this._Tamanhos).forEach((item, index) => {
            ret += "<option value='" + item + "' " + ((item == selected) ? "selected" : "") + ">" + item + "</option>";
        })
        return ret;
    }
    getVies(Modelo = "", selected = "") {
        let ret = "<option disabled selected>Selecione:</option>";
        ((this._Modelos.filter((val) => val.name == Modelo)[0] != undefined ? this._Modelos.filter((val) => val.name == Modelo)[0].vies : undefined) || this._Vies).forEach((item, index) => {
            if (selected == "") { selected = item };
            ret += "<option value='" + item + "' " + ((item == selected) ? "selected" : "") + ">" + item + "</option>";
        })
        return ret;
    }
    getGola(Modelo = "", selected = "") {
        let ret = "<option disabled selected>Selecione:</option>";
        ((this._Modelos.filter((val) => val.name == Modelo)[0] != undefined ? this._Modelos.filter((val) => val.name == Modelo)[0].gola : undefined) || this._Gola).forEach((item, index) => {
            if (selected == "") { selected = item };
            ret += "<option value='" + item + "' " + ((item == selected) ? "selected" : "") + ">" + item + "</option>";
        })
        return ret;
    }
    getGenero(Modelo = "", selected = "") {
        let ret = "<option disabled selected>Selecione:</option>";
        ((this._Modelos.filter((val) => val.name == Modelo)[0] != undefined ? this._Modelos.filter((val) => val.name == Modelo)[0].genero : undefined) || ["Masculino", "Feminino"]).forEach((item, index) => {
            if (selected == "") { selected = item };
            ret += "<option value='" + item + "' " + ((item == selected) ? "selected" : "") + ">" + item + "</option>";
        })
        return ret;
    }

    getPreco(Modelo = "") {
        let ret = 50.00;
        this._Modelos.forEach((item, index) => {
            if (item.name == Modelo)
                ret = item.preco;
        })
        return ret;
    }

    getPrecoRevenda(Modelo = "") {
        let ret = 50.00;
        this._Modelos.forEach((item, index) => {
            if (item.name == Modelo)
                ret = item.precoRevenda;
        })
        return ret;
    }

    getCusto(Modelo = "") {
        let ret = 50.00;
        this._Modelos.forEach((item, index) => {
            if (item.name == Modelo)
                ret = item.custo;
        })
        return ret;
    }
}
