
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
        "Dynamic",
        "Favo",
        "Heavy Dry",
        "Heavy Elastano",
        "Helanca",
        "Piquet"
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
        "Gola Semi V",
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
            gola: ["-"],
            vies: ["-"],
            preco: 85.70,
            precoRevenda: 85.70,
            custo: 44.25,
            subproduto: [
                {
                    nome: "Papel Sublimatico",
                    valor: 2.995,
                    unid: "M"
                },
                {
                    nome: "Papel Kraft",
                    valor: 2.995,
                    unid: "M"
                },
                {
                    nome: "Tecido",
                    valor: 320,
                    unid: "g"
                },
                {
                    nome: "Ziper",
                    valor: 1,
                    unid: "UN"
                },
                {
                    nome: "Elastico",
                    valor: 0.53,
                    unid: "g"
                }
            ]
        },
        {
            name: "Agasalho Canguru",
            gola: ["-"],
            vies: ["-"],
            preco: 85.70,
            precoRevenda: 85.70,
            custo: 29.30,
            subproduto: [
                {
                    nome: "Papel Sublimatico",
                    valor: 2.910,
                    unid: "M"
                },
                {
                    nome: "Papel Kraft",
                    valor: 2.910,
                    unid: "M"
                },
                {
                    nome: "Tecido",
                    valor: 320,
                    unid: "g"
                },
                {
                    nome: "Ziper",
                    valor: 1,
                    unid: "UN"
                },
                {
                    nome: "Elastico",
                    valor: 0.53,
                    unid: "g"
                }
            ]
        },
        {
            name: "Agasalho Treino",
            gola: ["-"],
            vies: ["-"],
            preco: 60.00,
            precoRevenda: 60.00,
            custo: 25.00,
            subproduto: [
                {
                    nome: "Papel Sublimatico",
                    valor: 3.270,
                    unid: "M"
                },
                {
                    nome: "Papel Kraft",
                    valor: 3.270,
                    unid: "M"
                },
                {
                    nome: "Tecido",
                    valor: 370,
                    unid: "g"
                },
                {
                    nome: "Ziper",
                    valor: 1,
                    unid: "UN"
                },
                {
                    nome: "Elastico",
                    valor: 0.53,
                    unid: "g"
                }
            ]
        },
        {
            name: "Agasalho Techstripe",
            gola: ["-"],
            vies: ["-"],
            preco: 60.00,
            precoRevenda: 60.00,
            custo: 25.00,
            subproduto: [
                {
                    nome: "Papel Sublimatico",
                    valor: 3.000,
                    unid: "M"
                },
                {
                    nome: "Papel Kraft",
                    valor: 3.000,
                    unid: "M"
                },
                {
                    nome: "Tecido",
                    valor: 440,
                    unid: "g"
                },
                {
                    nome: "Ziper",
                    valor: 1,
                    unid: "UN"
                },
                {
                    nome: "Elastico",
                    valor: 0.53,
                    unid: "g"
                }
            ]
        },
        {
            name: "Bag",
            gola: ["-"],
            vies: ["-"],
            genero: ["-"],
            preco: 60.00,
            precoRevenda: 60.00,
            custo: 25.00,
            subproduto: [
                {
                    nome: "Papel Sublimatico",
                    valor: 0.400,
                    unid: "M"
                },
                {
                    nome: "Papel Kraft",
                    valor: 0.400,
                    unid: "M"
                },
                {
                    nome: "Tecido",
                    valor: 40,
                    unid: "g"
                },
                {
                    nome: "Cordão",
                    valor: 1,
                    unid: "UN"
                }
            ]
        },
        {
            name: "Bandana",
            tecidos: ["Dry"],
            gola: ["-"],
            vies: ["-"],
            genero: ["-"],
            preco: 60.00,
            custo: 25.00,
            subproduto: [
                {
                    nome: "Papel Sublimatico",
                    valor: 0.225,
                    unid: "M"
                },
                {
                    nome: "Papel Kraft",
                    valor: 0.225,
                    unid: "M"
                },
                {
                    nome: "Tecido",
                    valor: 20,
                    unid: "g"
                },
                {
                    nome: "Cordão",
                    valor: 1,
                    unid: "UN"
                }
            ]
        },
        {
            name: "Boné",
            tecidos: ["-"],
            gola: ["-"],
            vies: ["-"],
            genero: ["-"],
            preco: 29.90,
            precoRevenda: 29.90,
            custo: 29.90,
            subproduto: [
                {
                    nome: "Boné",
                    valor: 1,
                    unid: "UN"
                }
            ]
        },
        {
            name: "Chinelo",
            tecidos: ["-"],
            gola: ["-"],
            vies: ["-"],
            genero: ["-"],
            preco: 29.90,
            precoRevenda: 29.90,
            custo: 29.90,
            subproduto: [
                {
                    nome: "Chinelo",
                    valor: 1,
                    unid: "UN"
                }
            ]
        },
        {
            name: "Calça Termica (Legging)",
            gola: ["-"],
            vies: ["-"],
            preco: 74.70,
            precoRevenda: 74.70,
            custo: 27.44,
            subproduto: [
                {
                    nome: "Papel Sublimatico",
                    valor: 1.500,
                    unid: "M"
                },
                {
                    nome: "Papel Kraft",
                    valor: 1.500,
                    unid: "M"
                },
                {
                    nome: "Tecido",
                    valor: 240,
                    unid: "g"
                },
                {
                    nome: "Elastico",
                    valor: 0.53,
                    unid: "g"
                }
            ]
        },
        {
            name: "Calça Treino",
            gola: ["-"],
            vies: ["-"],
            preco: 74.70,
            precoRevenda: 74.70,
            custo: 27.44,
            subproduto: [
                {
                    nome: "Papel Sublimatico",
                    valor: 3.090,
                    unid: "M"
                },
                {
                    nome: "Papel Kraft",
                    valor: 3.090,
                    unid: "M"
                },
                {
                    nome: "Tecido",
                    valor: 220,
                    unid: "g"
                }
            ]
        },
        {
            name: "Calça Techstripe",
            gola: ["-"],
            vies: ["-"],
            preco: 98.00,
            precoRevenda: 98.00,
            custo: 50.00,
            subproduto: [
                {
                    nome: "Papel Sublimatico",
                    valor: 2.142,
                    unid: "M"
                },
                {
                    nome: "Papel Kraft",
                    valor: 2.142,
                    unid: "M"
                },
                {
                    nome: "Tecido",
                    valor: 240,
                    unid: "g"
                }
            ]
        },
        {
            name: "Manga Curta Futebol",
            vies: ["-"],
            preco: 54.70,
            precoRevenda: 54.70,
            custo: 31.12,
            subproduto: [
                {
                    nome: "Papel Sublimatico",
                    valor: 1.545,
                    unid: "M"
                },
                {
                    nome: "Papel Kraft",
                    valor: 1.545,
                    unid: "M"
                },
                {
                    nome: "Tecido",
                    valor: 220,
                    unid: "g"
                }
            ]
        },
        {
            name: "Manga Curta Futebol Raglan",
            vies: ["-"],
            preco: 53.70,
            precoRevenda: 53.70,
            custo: 31.12,
            subproduto: [
                {
                    nome: "Papel Sublimatico",
                    valor: 1.753,
                    unid: "M"
                },
                {
                    nome: "Papel Kraft",
                    valor: 1.753,
                    unid: "M"
                },
                {
                    nome: "Tecido",
                    valor: 140,
                    unid: "g"
                }
            ]
        },
        {
            name: "Manga Curta Futevôlei",
            vies: ["-"],
            preco: 54.70,
            precoRevenda: 54.70,
            custo: 33.44,
            subproduto: [
                {
                    nome: "Papel Sublimatico",
                    valor: 1.578,
                    unid: "M"
                },
                {
                    nome: "Papel Kraft",
                    valor: 1.578,
                    unid: "M"
                },
                {
                    nome: "Tecido",
                    valor: 220,
                    unid: "g"
                }
            ]
        },
        {
            name: "Manga Curta Casual",
            tecidos: ["Algodão"],
            vies: ["-"],
            preco: 54.70,
            precoRevenda: 54.70,
            custo: 33.44,
            subproduto: [
                {
                    nome: "Papel Sublimatico",
                    valor: 1.578,
                    unid: "M"
                },
                {
                    nome: "Papel Kraft",
                    valor: 1.578,
                    unid: "M"
                },
                {
                    nome: "Tecido",
                    valor: 240,
                    unid: "g"
                }
            ]
        },
        {
            name: "Manga Curta POLO",
            vies: ["-"],
            preco: 60.70,
            precoRevenda: 60.70,
            custo: 33.44,
            subproduto: [
                {
                    nome: "Papel Sublimatico",
                    valor: 1.578,
                    unid: "M"
                },
                {
                    nome: "Papel Kraft",
                    valor: 1.578,
                    unid: "M"
                },
                {
                    nome: "Tecido",
                    valor: 250,
                    unid: "g"
                },
                {
                    nome: "Tecido",
                    valor: 240,
                    unid: "g"
                }
            ]
        },
        {
            name: "Manga Longa",
            vies: ["-"],
            preco: 60.70,
            precoRevenda: 60.70,
            custo: 27.02,
            subproduto: [
                {
                    nome: "Papel Sublimatico",
                    valor: 1.960,
                    unid: "M"
                },
                {
                    nome: "Papel Kraft",
                    valor: 1.960,
                    unid: "M"
                },
                {
                    nome: "Tecido",
                    valor: 250,
                    unid: "g"
                }
            ]
        },
        {
            name: "Manga Longa Raglan",
            vies: ["-"],
            preco: 60.70,
            precoRevenda: 60.70,
            custo: 27.02,
            subproduto: [
                {
                    nome: "Papel Sublimatico",
                    valor: 1.960,
                    unid: "M"
                },
                {
                    nome: "Papel Kraft",
                    valor: 1.960,
                    unid: "M"
                },
                {
                    nome: "Tecido",
                    valor: 140,
                    unid: "g"
                }
            ]
        },
        {
            name: "Manga Longa FTB",
            vies: ["-"],
            preco: 60.70,
            precoRevenda: 60.70,
            custo: 27.02,
            subproduto: [
                {
                    nome: "Papel Sublimatico",
                    valor: 1.960,
                    unid: "M"
                },
                {
                    nome: "Papel Kraft",
                    valor: 1.960,
                    unid: "M"
                },
                {
                    nome: "Tecido",
                    valor: 250,
                    unid: "g"
                }
            ]
        },
        {
            name: "Manga Longa Raglan FTB",
            vies: ["-"],
            preco: 60.70,
            precoRevenda: 60.70,
            custo: 27.02,
            subproduto: [
                {
                    nome: "Papel Sublimatico",
                    valor: 1.960,
                    unid: "M"
                },
                {
                    nome: "Papel Kraft",
                    valor: 1.960,
                    unid: "M"
                },
                {
                    nome: "Tecido",
                    valor: 140,
                    unid: "g"
                }
            ]
        },
        {
            name: "Regata",
            gola: ["-"],
            preco: 44.70,
            precoRevenda: 44.70,
            custo: 19.12,
            subproduto: [
                {
                    nome: "Papel Sublimatico",
                    valor: 1.210,
                    unid: "M"
                },
                {
                    nome: "Papel Kraft",
                    valor: 1.210,
                    unid: "M"
                },
                {
                    nome: "Tecido",
                    genero: "Masculino",
                    valor: 100,
                    unid: "g"
                },
                {
                    nome: "Tecido",
                    genero: "Feminino",
                    valor: 130,
                    unid: "g"
                },
                {
                    nome: "Viés",
                    valor: 30,
                    unid: "g"
                }
            ]
        },
        {
            name: "Shorts com Bolso (Bermuda)",
            tecidos: ["Dynamic"],
            gola: ["-"],
            vies: ["-"],
            preco: 44.70,
            precoRevenda: 44.70,
            custo: 19.12,
            subproduto: [
                {
                    nome: "Papel Sublimatico",
                    valor: 1.620,
                    unid: "M"
                },
                {
                    nome: "Papel Kraft",
                    valor: 1.620,
                    unid: "M"
                },
                {
                    nome: "Tecido",
                    valor: 170,
                    unid: "g"
                }
            ]
        },
        {
            name: "Shorts Feminino Futevôlei",
            gola: ["-"],
            genero: ["Feminino"],
            preco: 44.70,
            precoRevenda: 44.70,
            custo: 17.89,
            subproduto: [
                {
                    nome: "Papel Sublimatico",
                    valor: 0.705,
                    unid: "M"
                },
                {
                    nome: "Papel Kraft",
                    valor: 0.705,
                    unid: "M"
                },
                {
                    nome: "Tecido",
                    valor: 90,
                    unid: "g"
                },
                {
                    nome: "Viés",
                    valor: 20,
                    unid: "g"
                }
            ]
        },
        {
            name: "Shorts Masculino Futevôlei",
            gola: ["-"],
            vies: ["-"],
            genero: ["Masculino"],
            preco: 42.70,
            precoRevenda: 42.70,
            custo: 20.18,
            subproduto: [
                {
                    nome: "Papel Sublimatico",
                    valor: 1.300,
                    unid: "M"
                },
                {
                    nome: "Papel Kraft",
                    valor: 1.300,
                    unid: "M"
                },
                {
                    nome: "Tecido",
                    valor: 120,
                    unid: "g"
                }
            ]
        },
        {
            name: "Shorts Feminino Futevôlei Cadarço",
            gola: ["-"],
            genero: ["Feminino"],
            preco: 44.70,
            precoRevenda: 44.70,
            custo: 17.89,
            subproduto: [
                {
                    nome: "Papel Sublimatico",
                    valor: 0.705,
                    unid: "M"
                },
                {
                    nome: "Papel Kraft",
                    valor: 0.705,
                    unid: "M"
                },
                {
                    nome: "Tecido",
                    valor: 90,
                    unid: "g"
                },
                {
                    nome: "Cadarço",
                    valor: 1,
                    unid: "UN"
                },
                {
                    nome: "Viés",
                    valor: 20,
                    unid: "g"
                }
            ]
        },
        {
            name: "Shorts Masculino Futevôlei Cadarço",
            gola: ["-"],
            vies: ["-"],
            genero: ["Masculino"],
            preco: 42.70,
            precoRevenda: 42.70,
            custo: 20.18,
            subproduto: [
                {
                    nome: "Papel Sublimatico",
                    valor: 1.300,
                    unid: "M"
                },
                {
                    nome: "Papel Kraft",
                    valor: 1.300,
                    unid: "M"
                },
                {
                    nome: "Tecido",
                    valor: 120,
                    unid: "g"
                },
                {
                    nome: "Cadarço",
                    valor: 1,
                    unid: "UN"
                }
            ]
        },
        {
            name: "Shorts Saia",
            tecidos: ["Elastano"],
            gola: ["-"],
            vies: ["-"],
            genero: ["Feminino"],
            preco: 42.70,
            precoRevenda: 42.70,
            custo: 20.18,
            subproduto: [
                {
                    nome: "Papel Sublimatico",
                    valor: 1.617,
                    unid: "M"
                },
                {
                    nome: "Papel Kraft",
                    valor: 1.617,
                    unid: "M"
                },
                {
                    nome: "Tecido - Elastano",
                    valor: 130,
                    unid: "g"
                }
            ]
        },
        {
            name: "Shorts Saia Beach Tennis",
            tecidos: ["Elastano"],
            gola: ["-"],
            vies: ["-"],
            genero: ["Feminino"],
            preco: 42.70,
            precoRevenda: 42.70,
            custo: 20.18,
            subproduto: [
                {
                    nome: "Papel Sublimatico",
                    valor: 1.617,
                    unid: "M"
                },
                {
                    nome: "Papel Kraft",
                    valor: 1.617,
                    unid: "M"
                },
                {
                    nome: "Tecido - Elastano",
                    valor: 130,
                    unid: "g"
                }
            ]
        },
        {
            name: "Sunga",
            tecidos: ["Heavy Dry"],
            gola: ["-"],
            vies: ["-"],
            genero: ["Masculino"],
            preco: 42.70,
            precoRevenda: 42.70,
            custo: 20.18,
            subproduto: [
                {
                    nome: "Papel Sublimatico",
                    valor: 0.557,
                    unid: "M"
                },
                {
                    nome: "Papel Kraft",
                    valor: 0.557,
                    unid: "M"
                },
                {
                    nome: "Tecido - Heavy Dry",
                    valor: 100,
                    unid: "g"
                },
                {
                    nome: "Forro",
                    valor: 20,
                    unid: "g"
                }
            ]
        },
        {
            name: "TOP",
            tecidos: ["Heavy Dry"],
            gola: ["-"],
            vies: ["-"],
            genero: ["Feminino"],
            preco: 49.90,
            precoRevenda: 49.90,
            custo: 19.97,
            subproduto: [
                {
                    nome: "Papel Sublimatico",
                    valor: 0.507,
                    unid: "M"
                },
                {
                    nome: "Papel Kraft",
                    valor: 0.507,
                    unid: "M"
                },
                {
                    nome: "Tecido - Heavy Dry",
                    valor: 80,
                    unid: "g"
                },
                {
                    nome: "Forro",
                    valor: 20,
                    unid: "g"
                }
            ]
        },
        {
            name: "Viseira",
            tecidos: ["-"],
            gola: ["-"],
            vies: ["-"],
            genero: ["-"],
            preco: 29.90,
            precoRevenda: 29.90,
            custo: 29.90,
            subproduto: [
                {
                    nome: "Viseira",
                    valor: 1,
                    unid: "UN"
                }
            ]
        },
        {
            name: "Bola",
            tecidos: ["-"],
            gola: ["-"],
            vies: ["-"],
            genero: ["-"],
            preco: 244.90,
            precoRevenda: 244.90,
            custo: 244.90,
            subproduto: [
                {
                    nome: "Bola",
                    valor: 1,
                    unid: "UN"
                }
            ]
        },
        {
            name: "Conjunto 2 Peças",
            multiply: 2,
            tecidos: ["-"],
            gola: ["-"],
            vies: ["-"],
            preco: 94.70,
            precoRevenda: 94.70,
            custo: 47.20,
            subproduto: [
                {
                    nome: "Papel Sublimatico",
                    valor: 3.260,
                    unid: "M"
                },
                {
                    nome: "Papel Kraft",
                    valor: 3.260,
                    unid: "M"
                },
                {
                    nome: "Tecido - Dry",
                    genero: "Masculino",
                    valor: 120,
                    unid: "g"
                },
                {
                    nome: "Tecido - Elastano",
                    genero: "Masculino",
                    valor: 250,
                    unid: "g"
                },
                {
                    nome: "Tecido - Elastano",
                    genero: "Feminino",
                    valor: 340,
                    unid: "g"
                },
                {
                    nome: "Viés",
                    genero: "Feminino",//Reg e sh
                    valor: 50,
                    unid: "g"
                }
            ]
        },
        {
            name: "Kit 3 Peças",
            multiply: 3,
            tecidos: ["-"],
            gola: ["-"],
            vies: ["-"],
            preco: 139.70,
            precoRevenda: 139.70,
            custo: 66.32,
            subproduto: [
                {
                    nome: "Papel Sublimatico",
                    valor: 4.470,
                    unid: "M"
                },
                {
                    nome: "Papel Kraft",
                    valor: 4.470,
                    unid: "M"
                },
                {
                    nome: "Tecido - Dry",
                    genero: "Masculino",
                    valor: 220,
                    unid: "g"
                },
                {
                    nome: "Tecido - Elastano",
                    genero: "Masculino",
                    valor: 250,
                    unid: "g"
                },
                {
                    nome: "Tecido - Elastano",
                    genero: "Feminino",
                    valor: 470,
                    unid: "g"
                },
                {
                    nome: "Viés",
                    genero: "Feminino",//Reg e sh
                    valor: 50,
                    unid: "g"
                },
                {
                    nome: "Viés",
                    genero: "Masculino",//Reg e sh
                    valor: 30,
                    unid: "g"
                }
            ]
        }
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
    getTecido(Modelo = "", selected = "") {
        let ret = "<option disabled selected>Selecione:</option>";
        ((this._Modelos.filter((val) => val.name == Modelo)[0] != undefined ? this._Modelos.filter((val) => val.name == Modelo)[0].tecidos : undefined) || this._Tecidos).forEach((item, index) => {
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

    getInsumos(Modelo = "") {
        let ret = [];
        this._Modelos.forEach((item, index) => {
            if (item.name == Modelo)
                ret = item.subproduto;
        })
        return ret;
    }

    getMultiply(Modelo = "") {
        let ret = 1;
        this._Modelos.forEach((item, index) => {
            if (item.name == Modelo && item.multiply >= 0)
                ret = item.multiply;
        })
        return ret;
    }
}
