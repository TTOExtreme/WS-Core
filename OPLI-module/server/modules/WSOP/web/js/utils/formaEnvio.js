
if (!window.Modules) {
    window.Modules = {
        WSOP: {
            Produtos: null
        }
    }
}

window.Modules.WSOP.formaEnvio = class formaEnvio {
    caixas = [
        {
            name: "Saquinho",
            altura: 3,
            largura: 16,
            profundidade: 16,
            peso: 1,
            qntmax: 9
        },
        {
            name: "Caixa 2",
            altura: 35,
            largura: 46,
            profundidade: 47,
            peso: 25,
            qntmax: 250,
        },
        {
            name: "Caixa 3",
            altura: 19,
            largura: 46,
            profundidade: 47,
            peso: 3,
            qntmax: 30
        },
        {
            name: "Caixa 4",
            altura: 29,
            largura: 21,
            profundidade: 30,
            peso: 12,
            qntmax: 120
        }
    ]


    prazos = [
        {
            name: "Retirar Pessoalmente",
            code: "retirada",
            country: [
            ],
            preco: 0.00,
            prazo: "0 Dias Uteis"
        },
        {
            name: "SEDEX",
            code: "SEDEX",
            country: [
                {
                    country: "Brasil",
                    states: [
                        {
                            uf: "AC",
                            preco: [490, 490, 490, 490],//preco por caixa na ordem
                            prazo: "6-7 Dias Uteis"
                        },
                        {
                            uf: "AL",
                            preco: [490, 490, 490, 490],//preco por caixa na ordem
                            prazo: "5-6 Dias Uteis"
                        },
                        {
                            uf: "AP",
                            preco: [600, 600, 600, 600],//preco por caixa na ordem
                            prazo: "7-8 Dias Uteis"
                        },
                        {
                            uf: "AM",
                            preco: [490, 490, 490, 490],//preco por caixa na ordem
                            prazo: "5-6 Dias Uteis"
                        },
                        {
                            uf: "BA",
                            preco: [400, 400, 400, 400],//preco por caixa na ordem
                            prazo: "5-6 Dias Uteis"
                        },
                        {
                            uf: "CE",
                            preco: [400, 400, 400, 400],//preco por caixa na ordem
                            prazo: "4-5 Dias Uteis"
                        },
                        {
                            uf: "DF",
                            preco: [210, 210, 210, 210],//preco por caixa na ordem
                            prazo: "2-3 Dias Uteis"
                        },
                        {
                            uf: "ES",
                            preco: [320, 320, 320, 320],//preco por caixa na ordem
                            prazo: "2-4 Dias Uteis"
                        },
                        {
                            uf: "GO",
                            preco: [210, 210, 210, 210],//preco por caixa na ordem
                            prazo: "2-3 Dias Uteis"
                        },
                        {
                            uf: "MA",
                            preco: [490, 490, 490, 490],//preco por caixa na ordem
                            prazo: "5-6 Dias Uteis"
                        },
                        {
                            uf: "MT",
                            preco: [320, 320, 320, 320],//preco por caixa na ordem
                            prazo: "3-4 Dias Uteis"
                        },
                        {
                            uf: "MS",
                            preco: [210, 210, 210, 210],//preco por caixa na ordem
                            prazo: "2-3 Dias Uteis"
                        },
                        {
                            uf: "MG",
                            preco: [200, 200, 200, 200],//preco por caixa na ordem
                            prazo: "3-4 Dias Uteis"
                        },
                        {
                            uf: "PA",
                            preco: [400, 400, 400, 400],//preco por caixa na ordem
                            prazo: "4-5 Dias Uteis"
                        },
                        {
                            uf: "PB",
                            preco: [490, 490, 490, 490],//preco por caixa na ordem
                            prazo: "5-6 Dias Uteis"
                        },
                        {
                            uf: "PR",
                            preco: [115, 115, 115, 115],//preco por caixa na ordem
                            prazo: "2-3 Dias Uteis"
                        },
                        {
                            uf: "PE",
                            preco: [400, 400, 400, 400],//preco por caixa na ordem
                            prazo: "4-5 Dias Uteis"
                        },
                        {
                            uf: "PI",
                            preco: [490, 490, 490, 490],//preco por caixa na ordem
                            prazo: "5-6 Dias Uteis"
                        },
                        {
                            uf: "RJ",
                            preco: [240, 240, 240, 240],//preco por caixa na ordem
                            prazo: "3-4 Dias Uteis"
                        },
                        {
                            uf: "RN",
                            preco: [490, 490, 490, 490],//preco por caixa na ordem
                            prazo: "5-6 Dias Uteis"
                        },
                        {
                            uf: "RS",
                            preco: [200, 200, 200, 200],//preco por caixa na ordem
                            prazo: "2-3 Dias Uteis"
                        },
                        {
                            uf: "RO",
                            preco: [490, 490, 490, 490],//preco por caixa na ordem
                            prazo: "5-6 Dias Uteis"
                        },
                        {
                            uf: "RR",
                            preco: [490, 490, 490, 490],//preco por caixa na ordem
                            prazo: "6-7 Dias Uteis"
                        },
                        {
                            uf: "SC",
                            preco: [320, 320, 320, 320],//preco por caixa na ordem
                            prazo: "2-3 Dias Uteis"
                        },
                        {
                            uf: "SP",
                            preco: [60, 60, 60, 60],//preco por caixa na ordem
                            prazo: "2-3 Dias Uteis"
                        },
                        {
                            uf: "SE",
                            preco: [490, 490, 490, 490],//preco por caixa na ordem
                            prazo: "5-6 Dias Uteis"
                        },
                        {
                            uf: "TO",
                            preco: [400, 400, 400, 400],//preco por caixa na ordem
                            prazo: "4-5 Dias Uteis"
                        }
                    ]
                },
            ],
            preco: 490.0,
            prazo: "0 Dias Uteis"
        },
        {
            name: "BusLog",
            code: "BusLog",
            country: [
                {
                    country: "Brasil",
                    states: [
                        {
                            uf: "MG",
                            preco: [40, 40, 40, 40],//preco por caixa na ordem
                            prazo: "1-2 Dias Uteis"
                        },
                        {
                            uf: "PR",
                            preco: [40, 40, 40, 40],//preco por caixa na ordem
                            prazo: "2-3 Dias Uteis"
                        },
                        {
                            uf: "RJ",
                            preco: [42, 42, 42, 42],//preco por caixa na ordem
                            prazo: "1-2 Dias Uteis"
                        },
                        {
                            uf: "RS",
                            preco: [45, 45, 45, 45],//preco por caixa na ordem
                            prazo: "3-4 Dias Uteis"
                        },
                        {
                            uf: "SC",
                            preco: [40, 40, 40, 40],//preco por caixa na ordem
                            prazo: "2-3 Dias Uteis"
                        },
                        {
                            uf: "SP",
                            preco: [40, 40, 40, 40],//preco por caixa na ordem
                            prazo: "1-2 Dias Uteis"
                        }
                    ]
                },
            ],
            preco: 0.00,
            prazo: "0 Dias Uteis"
        },
        {
            name: "JadLog.Package",
            code: "JadLog.Package",
            country: [
                {
                    country: "Brasil",
                    states: [
                        {
                            uf: "AC",
                            preco: [180, 180, 180, 180],//preco por caixa na ordem
                            prazo: "16-19 Dias Uteis"
                        },
                        {
                            uf: "AL",
                            preco: [140, 140, 140, 140],//preco por caixa na ordem
                            prazo: "9-12 Dias Uteis"
                        },
                        {
                            uf: "AP",
                            preco: [310, 310, 310, 310],//preco por caixa na ordem
                            prazo: "14-17 Dias Uteis"
                        },
                        {
                            uf: "AM",
                            preco: [190, 190, 190, 190],//preco por caixa na ordem
                            prazo: "19-22 Dias Uteis"
                        },
                        {
                            uf: "BA",
                            preco: [132, 132, 132, 132],//preco por caixa na ordem
                            prazo: "7-10 Dias Uteis"
                        },
                        {
                            uf: "CE",
                            preco: [150, 150, 150, 150],//preco por caixa na ordem
                            prazo: "9-12 Dias Uteis"
                        },
                        {
                            uf: "DF",
                            preco: [100, 100, 100, 100],//preco por caixa na ordem
                            prazo: "3-4 Dias Uteis"
                        },
                        {
                            uf: "ES",
                            preco: [200, 200, 200, 200],//preco por caixa na ordem
                            prazo: "7-8 Dias Uteis"
                        },
                        {
                            uf: "GO",
                            preco: [115, 115, 115, 115],//preco por caixa na ordem
                            prazo: "3-4 Dias Uteis"
                        },
                        {
                            uf: "MA",
                            preco: [170, 170, 170, 170],//preco por caixa na ordem
                            prazo: "11-14 Dias Uteis"
                        },
                        {
                            uf: "MT",
                            preco: [100, 100, 100, 100],//preco por caixa na ordem
                            prazo: "7-8 Dias Uteis"
                        },
                        {
                            uf: "MS",
                            preco: [100, 100, 100, 100],//preco por caixa na ordem
                            prazo: "7-8 Dias Uteis"
                        },
                        {
                            uf: "MG",
                            preco: [100, 100, 100, 100],//preco por caixa na ordem
                            prazo: "3-4 Dias Uteis"
                        },
                        {
                            uf: "PA",
                            preco: [150, 150, 150, 150],//preco por caixa na ordem
                            prazo: "6-9 Dias Uteis"
                        },
                        {
                            uf: "PB",
                            preco: [180, 180, 180, 180],//preco por caixa na ordem
                            prazo: "11-14 Dias Uteis"
                        },
                        {
                            uf: "PR",
                            preco: [90, 90, 90, 90],//preco por caixa na ordem
                            prazo: "3-4 Dias Uteis"
                        },
                        {
                            uf: "PE",
                            preco: [150, 150, 150, 150],//preco por caixa na ordem
                            prazo: "8-11 Dias Uteis"
                        },
                        {
                            uf: "PI",
                            preco: [180, 180, 180, 180],//preco por caixa na ordem
                            prazo: "9-12 Dias Uteis"
                        },
                        {
                            uf: "RJ",
                            preco: [90, 90, 90, 90],//preco por caixa na ordem
                            prazo: "3-4 Dias Uteis"
                        },
                        {
                            uf: "RN",
                            preco: [180, 180, 180, 180],//preco por caixa na ordem
                            prazo: "9-12 Dias Uteis"
                        },
                        {
                            uf: "RS",
                            preco: [100, 100, 100, 100],//preco por caixa na ordem
                            prazo: "3-4 Dias Uteis"
                        },
                        {
                            uf: "RO",
                            preco: [180, 180, 180, 180],//preco por caixa na ordem
                            prazo: "11-14 Dias Uteis"
                        },
                        {
                            uf: "RR",
                            preco: [371, 371, 371, 371],//preco por caixa na ordem
                            prazo: "20-23 Dias Uteis"
                        },
                        {
                            uf: "SC",
                            preco: [90, 90, 90, 90],//preco por caixa na ordem
                            prazo: "3-4 Dias Uteis"
                        },
                        {
                            uf: "SP",
                            preco: [55, 55, 55, 55],//preco por caixa na ordem
                            prazo: "2-3 Dias Uteis"
                        },
                        {
                            uf: "SE",
                            preco: [150, 150, 150, 150],//preco por caixa na ordem
                            prazo: "9-12 Dias Uteis"
                        },
                        {
                            uf: "TO",
                            preco: [115, 115, 115, 115],//preco por caixa na ordem
                            prazo: "7-10 Dias Uteis"
                        }
                    ]
                },
            ],
            preco: 0.00,
            prazo: "0 Dias Uteis"
        },
        {
            name: "JadLog.Com",
            code: "JadLog.Com",
            country: [
                {
                    country: "Brasil",
                    states: [
                        {
                            uf: "AC",
                            preco: [500, 500, 500, 500],//preco por caixa na ordem
                            prazo: "16-19 Dias Uteis"
                        },
                        {
                            uf: "AL",
                            preco: [340, 340, 340, 340],//preco por caixa na ordem
                            prazo: "7-10 Dias Uteis"
                        },
                        {
                            uf: "AP",
                            preco: [600, 600, 600, 600],//preco por caixa na ordem
                            prazo: "15-18 Dias Uteis"
                        },
                        {
                            uf: "AM",
                            preco: [470, 470, 470, 470],//preco por caixa na ordem
                            prazo: "6-9 Dias Uteis"
                        },
                        {
                            uf: "BA",
                            preco: [280, 280, 280, 280],//preco por caixa na ordem
                            prazo: "7-10 Dias Uteis"
                        },
                        {
                            uf: "CE",
                            preco: [390, 390, 390, 390],//preco por caixa na ordem
                            prazo: "7-10 Dias Uteis"
                        },
                        {
                            uf: "DF",
                            preco: [200, 200, 200, 200],//preco por caixa na ordem
                            prazo: "3-4 Dias Uteis"
                        },
                        {
                            uf: "ES",
                            preco: [300, 300, 300, 300],//preco por caixa na ordem
                            prazo: "7-8 Dias Uteis"
                        },
                        {
                            uf: "GO",
                            preco: [200, 200, 200, 200],//preco por caixa na ordem
                            prazo: "2-3 Dias Uteis"
                        },
                        {
                            uf: "MA",
                            preco: [430, 430, 430, 430],//preco por caixa na ordem
                            prazo: "9-12 Dias Uteis"
                        },
                        {
                            uf: "MT",
                            preco: [200, 200, 200, 200],//preco por caixa na ordem
                            prazo: "6-7 Dias Uteis"
                        },
                        {
                            uf: "MS",
                            preco: [200, 200, 200, 200],//preco por caixa na ordem
                            prazo: "6-7 Dias Uteis"
                        },
                        {
                            uf: "MG",
                            preco: [220, 220, 220, 220],//preco por caixa na ordem
                            prazo: "3-4 Dias Uteis"
                        },
                        {
                            uf: "PA",
                            preco: [380, 380, 380, 380],//preco por caixa na ordem
                            prazo: "6-9 Dias Uteis"
                        },
                        {
                            uf: "PB",
                            preco: [340, 340, 340, 340],//preco por caixa na ordem
                            prazo: "7-10 Dias Uteis"
                        },
                        {
                            uf: "PR",
                            preco: [110, 110, 110, 110],//preco por caixa na ordem
                            prazo: "3-4 Dias Uteis"
                        },
                        {
                            uf: "PE",
                            preco: [340, 340, 340, 340],//preco por caixa na ordem
                            prazo: "6-9 Dias Uteis"
                        },
                        {
                            uf: "PI",
                            preco: [470, 470, 470, 470],//preco por caixa na ordem
                            prazo: "3-6 Dias Uteis"
                        },
                        {
                            uf: "RJ",
                            preco: [110, 110, 110, 110],//preco por caixa na ordem
                            prazo: "3-4 Dias Uteis"
                        },
                        {
                            uf: "RN",
                            preco: [460, 460, 460, 460],//preco por caixa na ordem
                            prazo: "7-10 Dias Uteis"
                        },
                        {
                            uf: "RS",
                            preco: [210, 210, 210, 210],//preco por caixa na ordem
                            prazo: "3-4 Dias Uteis"
                        },
                        {
                            uf: "RO",
                            preco: [460, 460, 460, 460],//preco por caixa na ordem
                            prazo: "11-14 Dias Uteis"
                        },
                        {
                            uf: "RR",
                            preco: [500, 500, 500, 500],//preco por caixa na ordem
                            prazo: "7-10 Dias Uteis"
                        },
                        {
                            uf: "SC",
                            preco: [110, 110, 110, 110],//preco por caixa na ordem
                            prazo: "2-3 Dias Uteis"
                        },
                        {
                            uf: "SP",
                            preco: [60, 60, 60, 60],//preco por caixa na ordem
                            prazo: "2-3 Dias Uteis"
                        },
                        {
                            uf: "SE",
                            preco: [340, 340, 340, 340],//preco por caixa na ordem
                            prazo: "6-9 Dias Uteis"
                        },
                        {
                            uf: "TO",
                            preco: [340, 340, 340, 340],//preco por caixa na ordem
                            prazo: "6-9 Dias Uteis"
                        }
                    ]
                },
            ],
            preco: 0.00,
            prazo: "0 Dias Uteis"
        },
        {
            name: "PAC",
            code: "PAC",
            country: [
                {
                    country: "Brasil",
                    states: [
                        {
                            uf: "AC",
                            preco: [190, 190, 190, 190],//preco por caixa na ordem
                            prazo: "18-19 Dias Uteis"
                        },
                        {
                            uf: "AL",
                            preco: [190, 190, 190, 190],//preco por caixa na ordem
                            prazo: "9-10 Dias Uteis"
                        },
                        {
                            uf: "AP",
                            preco: [350, 350, 350, 350],//preco por caixa na ordem
                            prazo: "11-12 Dias Uteis"
                        },
                        {
                            uf: "AM",
                            preco: [190, 190, 190, 190],//preco por caixa na ordem
                            prazo: "23-24 Dias Uteis"
                        },
                        {
                            uf: "BA",
                            preco: [220, 220, 220, 220],//preco por caixa na ordem
                            prazo: "10-11 Dias Uteis"
                        },
                        {
                            uf: "CE",
                            preco: [150, 150, 150, 150],//preco por caixa na ordem
                            prazo: "8-9 Dias Uteis"
                        },
                        {
                            uf: "DF",
                            preco: [115, 115, 115, 115],//preco por caixa na ordem
                            prazo: "6-7 Dias Uteis"
                        },
                        {
                            uf: "ES",
                            preco: [115, 115, 115, 115],//preco por caixa na ordem
                            prazo: "8-9 Dias Uteis"
                        },
                        {
                            uf: "GO",
                            preco: [115, 115, 115, 115],//preco por caixa na ordem
                            prazo: "6-7 Dias Uteis"
                        },
                        {
                            uf: "MA",
                            preco: [190, 190, 190, 190],//preco por caixa na ordem
                            prazo: "9-10 Dias Uteis"
                        },
                        {
                            uf: "MT",
                            preco: [190, 190, 190, 190],//preco por caixa na ordem
                            prazo: "7-8 Dias Uteis"
                        },
                        {
                            uf: "MS",
                            preco: [115, 115, 115, 115],//preco por caixa na ordem
                            prazo: "6-7 Dias Uteis"
                        },
                        {
                            uf: "MG",
                            preco: [110, 110, 110, 110],//preco por caixa na ordem
                            prazo: "8-9 Dias Uteis"
                        },
                        {
                            uf: "PA",
                            preco: [150, 150, 150, 150],//preco por caixa na ordem
                            prazo: "12-13 Dias Uteis"
                        },
                        {
                            uf: "PB",
                            preco: [190, 190, 190, 190],//preco por caixa na ordem
                            prazo: "9-10 Dias Uteis"
                        },
                        {
                            uf: "PR",
                            preco: [210, 210, 210, 210],//preco por caixa na ordem
                            prazo: "5-6 Dias Uteis"
                        },
                        {
                            uf: "PE",
                            preco: [150, 150, 150, 150],//preco por caixa na ordem
                            prazo: "8-9 Dias Uteis"
                        },
                        {
                            uf: "PI",
                            preco: [190, 190, 190, 190],//preco por caixa na ordem
                            prazo: "9-10 Dias Uteis"
                        },
                        {
                            uf: "RJ",
                            preco: [120, 120, 120, 120],//preco por caixa na ordem
                            prazo: "8-9 Dias Uteis"
                        },
                        {
                            uf: "RN",
                            preco: [190, 190, 190, 190],//preco por caixa na ordem
                            prazo: "9-10 Dias Uteis"
                        },
                        {
                            uf: "RS",
                            preco: [115, 115, 115, 115],//preco por caixa na ordem
                            prazo: "6-7 Dias Uteis"
                        },
                        {
                            uf: "RO",
                            preco: [190, 190, 190, 190],//preco por caixa na ordem
                            prazo: "15-16 Dias Uteis"
                        },
                        {
                            uf: "RR",
                            preco: [190, 190, 190, 190],//preco por caixa na ordem
                            prazo: "25-26 Dias Uteis"
                        },
                        {
                            uf: "SC",
                            preco: [110, 110, 110, 110],//preco por caixa na ordem
                            prazo: "6-7 Dias Uteis"
                        },
                        {
                            uf: "SP",
                            preco: [60, 60, 60, 60],//preco por caixa na ordem
                            prazo: "3-4 Dias Uteis"
                        },
                        {
                            uf: "SE",
                            preco: [190, 190, 190, 190],//preco por caixa na ordem
                            prazo: "9-10 Dias Uteis"
                        },
                        {
                            uf: "TO",
                            preco: [150, 150, 150, 150],//preco por caixa na ordem
                            prazo: "9-10 Dias Uteis"
                        }
                    ]
                },
            ],
            preco: 0.00,
            prazo: "0 Dias Uteis"
        },
        {
            name: "Azul",
            code: "Azul",
            country: [
                {
                    country: "Brasil",
                    states: [
                        {
                            uf: "AC",
                            preco: [530, 530, 530, 530],//preco por caixa na ordem
                            prazo: "6-7 Dias Uteis"
                        },
                        {
                            uf: "AL",
                            preco: [330, 330, 330, 330],//preco por caixa na ordem
                            prazo: "4-5 Dias Uteis"
                        },
                        {
                            uf: "AM",
                            preco: [470, 470, 470, 470],//preco por caixa na ordem
                            prazo: "4-5 Dias Uteis"
                        },
                        {
                            uf: "BA",
                            preco: [320, 320, 320, 320],//preco por caixa na ordem
                            prazo: "3-4 Dias Uteis"
                        },
                        {
                            uf: "CE",
                            preco: [440, 440, 440, 440],//preco por caixa na ordem
                            prazo: "4-5 Dias Uteis"
                        },
                        {
                            uf: "DF",
                            preco: [190, 190, 190, 190],//preco por caixa na ordem
                            prazo: "3-4 Dias Uteis"
                        },
                        {
                            uf: "ES",
                            preco: [190, 190, 190, 190],//preco por caixa na ordem
                            prazo: "3-4 Dias Uteis"
                        },
                        {
                            uf: "GO",
                            preco: [190, 190, 190, 190],//preco por caixa na ordem
                            prazo: "3-4 Dias Uteis"
                        },
                        {
                            uf: "MA",
                            preco: [530, 530, 530, 530],//preco por caixa na ordem
                            prazo: "5-6 Dias Uteis"
                        },
                        {
                            uf: "MT",
                            preco: [190, 190, 190, 190],//preco por caixa na ordem
                            prazo: "3-4 Dias Uteis"
                        },
                        {
                            uf: "MS",
                            preco: [190, 190, 190, 190],//preco por caixa na ordem
                            prazo: "3-4 Dias Uteis"
                        },
                        {
                            uf: "MG",
                            preco: [130, 130, 130, 130],//preco por caixa na ordem
                            prazo: "3-4 Dias Uteis"
                        },
                        {
                            uf: "PA",
                            preco: [440, 440, 440, 440],//preco por caixa na ordem
                            prazo: "4-5 Dias Uteis"
                        },
                        {
                            uf: "PB",
                            preco: [530, 530, 530, 530],//preco por caixa na ordem
                            prazo: "6-7 Dias Uteis"
                        },
                        {
                            uf: "PR",
                            preco: [130, 130, 130, 130],//preco por caixa na ordem
                            prazo: "3-4 Dias Uteis"
                        },
                        {
                            uf: "PE",
                            preco: [330, 330, 330, 330],//preco por caixa na ordem
                            prazo: "3-4 Dias Uteis"
                        },
                        {
                            uf: "PI",
                            preco: [480, 480, 480, 480],//preco por caixa na ordem
                            prazo: "5-6 Dias Uteis"
                        },
                        {
                            uf: "RJ",
                            preco: [130, 130, 130, 130],//preco por caixa na ordem
                            prazo: "3-4 Dias Uteis"
                        },
                        {
                            uf: "RN",
                            preco: [530, 530, 530, 530],//preco por caixa na ordem
                            prazo: "5-6 Dias Uteis"
                        },
                        {
                            uf: "RS",
                            preco: [190, 190, 190, 190],//preco por caixa na ordem
                            prazo: "3-4 Dias Uteis"
                        },
                        {
                            uf: "RO",
                            preco: [480, 480, 480, 480],//preco por caixa na ordem
                            prazo: "4-5 Dias Uteis"
                        },
                        {
                            uf: "RR",
                            preco: [590, 590, 590, 590],//preco por caixa na ordem
                            prazo: "6-7 Dias Uteis"
                        },
                        {
                            uf: "SC",
                            preco: [130, 130, 130, 130],//preco por caixa na ordem
                            prazo: "3-4 Dias Uteis"
                        },
                        {
                            uf: "SP",
                            preco: [80, 80, 80, 80],//preco por caixa na ordem
                            prazo: "3-4 Dias Uteis"
                        },
                        {
                            uf: "SE",
                            preco: [430, 430, 430, 430],//preco por caixa na ordem
                            prazo: "4-5 Dias Uteis"
                        },
                        {
                            uf: "TO",
                            preco: [320, 320, 320, 320],//preco por caixa na ordem
                            prazo: "4-5 Dias Uteis"
                        }
                    ]
                },
            ],
            preco: 0.00,
            prazo: "0 Dias Uteis"
        },
    ]
    countrys = [
        {
            name: "Brasil",
            uk: ["AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RR", "SC", "SP", "SE", "TO"]
        },
        {
            name: "Exterior",
            uk: [""]
        }
    ]


    envioToOptList(selected = "30_dias_uteis") {
        let ret = ""
        this.prazos.forEach((item, index) => {
            ret += "<option value='" + item.code + "' " + ((item.code == selected) ? "selected" : "") + ">" + item.name + "</option>";
        });
        return ret;
    }

    envioToOptListCountry(selected = "Brasil") {
        let ret = ""
        this.countrys.forEach((item, index) => {
            ret += "<option value='" + item.name + "' " + ((item.name == selected) ? "selected" : "") + ">" + item.name + "</option>";
        });
        return ret;
    }
    envioToOptListEstado(selected = "SP", Country = "Brasil") {
        let ret = ""
        this.countrys.forEach(ctr => {
            if (ctr.name == Country) {
                ctr.uk.forEach((item, index) => {
                    ret += "<option value='" + item + "' " + ((item == selected) ? "selected" : "") + ">" + item + "</option>";
                });
            }
        });
        return ret;
    }
    envioToOptListCaixa(selected = "Caixa 2") {
        let ret = ""
        this.caixas.forEach((item, index) => {
            ret += "<option value='" + item.name + "' " + ((item.name == selected) ? "selected" : "") + ">" + item.name + "</option>";
        });
        return ret;
    }

    getSizeCaixa(selected = "Caixa 2") {
        let ret = ""
        this.caixas.forEach((item, index) => {
            if (item.name == selected) {
                ret = "Tamanho: <b>(" + item.altura + "x" + item.largura + "x" + item.profundidade + ")cm</b> | Quantidade Max Por Embalagem: <b>" + item.qntmax + "</b>";
            }
        });
        return ret;
    }

    getPrice(country = "Brasil", UF = "SP", formaEnvio = "SEDEX", caixa = "Caixa 2", qnt = 0) {
        let cxindex = 1;
        this.caixas.forEach((cxitem, index) => {
            if (cxitem.name == caixa) {
                cxindex = index;
            }
        })
        let ret = 0.00;
        this.prazos.forEach((item, index) => {
            if (item.code == formaEnvio) {
                item.country.forEach(countryitem => {
                    if (countryitem.country == country) {
                        countryitem.states.forEach(ufitem => {
                            if (ufitem.uf == UF) {
                                ret = ufitem.preco[cxindex] * this.getNCaixas(caixa, qnt);
                                return ret;
                            }
                        })
                    }
                })
            }
        });
        return ret;
    }

    getNCaixas(caixa = "Caixa 2", qnt = 0) {
        let cxmax = 1;
        this.caixas.forEach((cxitem, index) => {
            if (cxitem.name == caixa) {
                cxmax = cxitem.qntmax;
            }
        })
        let ret = (1 + Math.floor(qnt / cxmax));

        return ret;
    }

}