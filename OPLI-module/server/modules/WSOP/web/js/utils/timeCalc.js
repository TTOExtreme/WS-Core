
if (!window.Modules) {
    window.Modules = {
        WSOP: {
            Produtos: null
        }
    }
}
window.Modules.WSOP.TimeCalc = class TimeCalc {
    prazos = [
        {
            name: "30 Dias Úteis",
            code: "30_dias_uteis",
            getDue: (inicio) => {
                return this.calculaNovaData(new Date(inicio), 30, true)
            }
        },
        {
            name: "30 Dias Corridos",
            code: "30_dias_corridos",
            getDue: (inicio) => {
                return this.calculaNovaData(new Date(inicio), 30, false)
            }
        },
        {
            name: "45 Dias Úteis",
            code: "45_dias_uteis",
            getDue: (inicio) => {
                return this.calculaNovaData(new Date(inicio), 45, true)
            }
        },
        {
            name: "45 Dias Corridos",
            code: "45_dias_corridos",
            getDue: (inicio) => {
                return this.calculaNovaData(new Date(inicio), 45, false)
            }
        }
    ]


    feriados = [
        "1/1/2021",
        "15/2/2021",
        "16/2/2021",
        "17/2/2021",
        "1/4/2021",
        "2/4/2021",
        "4/4/2021",
        "21/4/2021",
        "1/5/2021",
        "9/5/2021",
        "3/6/2021",
        "12/6/2021",
        "9/7/2021",
        "8/8/2021",
        "7/9/2021",
        "12/10/2021",
        "15/10/2021",
        "17/10/2021",
        "28/10/2021",
        "2/11/2021",
        "15/11/2021",
        "20/11/2021",
        "25/12/2021"
    ]

    getPrazo(inicio, selected = "30_dias_uteis") {
        let ret = new Date().getTime();
        this.prazos.forEach((item, index) => {
            if (item.code == selected)
                ret = item.getDue(inicio).getTime();
        });
        return ret;
    }

    /**
     * 
     * @param {string} selected 
     * @returns 
     */
    prazosIdToOptList(selected = "30_dias_uteis") {
        let ret = ""
        this.prazos.forEach((item, index) => {
            ret += "<option value='" + item.code + "' " + ((item.code == selected) ? "selected" : "") + ">" + item.name + "</option>";
        });
        return ret;
    }

    /**
     * Calcula nova data em dias Uteis
     * @param {Date} data data de inicio
     * @param {Int} dias numero de dias para adicionar
     * @param {Boolean} somenteUteis Calcula Somente dias Uteis se True
     * @returns {Date}
     */
    calculaNovaData(data, dias, somenteUteis = true) {
        while (dias >= 0) {

            data.setTime(data.getTime() + (24 * 3600 * 1000));
            if (somenteUteis) {
                var isFimDeSemana = false;
                //Verifica se o dia é util
                if (data.getDay() == 0 || data.getDay() == 6) { isFimDeSemana = true };
                //verifica se é feriado
                if (!isFimDeSemana) {
                    isFimDeSemana = this.feriados.lastIndexOf(data.getDate() + "/" + data.getMonth() + "/" + data.getFullYear()) > -1;
                }
                //Se for util remove um dia 
                if (!isFimDeSemana) {
                    dias--;
                }
            } else {
                dias--;
            }
        }
        return data;

    }

    /**
     * Prazos Colors
     * 
     */
    prazosColor = [
        {
            time: 360 * 24 * 3600 * 1000,//1 Ano restante
            bgColor: "#00b000",
            color: "#ffffff",
        },
        {
            time: 30 * 24 * 3600 * 1000,//1 mes restante
            bgColor: "#c0c000",
            color: "#000000",
        },
        {
            time: 21 * 24 * 3600 * 1000,//3 semana restante
            bgColor: "#90aa00",
            color: "#000000",
        },
        {
            time: 14 * 24 * 3600 * 1000,//2 semana restante
            bgColor: "#559000",
            color: "#000000",
        },
        {
            time: 7 * 24 * 3600 * 1000,//1 semana restante
            bgColor: "#ffff00",
            color: "#000000",
        },
        {
            time: 4 * 24 * 3600 * 1000,//4 dias restante
            bgColor: "#ffff00",
            color: "#000000",
        },
        {
            time: 3 * 24 * 3600 * 1000,//3 dias restante
            bgColor: "#ffaa00",
            color: "#000000",
        },
        {
            time: 2 * 24 * 3600 * 1000,//2 dias restante
            bgColor: "#dd0000",
            color: "#ffffff",
        },
        {
            time: 1 * 24 * 3600 * 1000,//1 dias restante
            bgColor: "#ff0000",
            color: "#ffffff",
        },
        {
            time: 0,//Atrasado
            bgColor: "#000000",
            color: "#ffffff",
        },
    ]

    /**
     * Get color for font from timestamp
     * @param {Milisseconds} time 
     */
    getPrazosColor(time) {
        let color = "#000000";
        this.prazosColor.forEach(praz => {
            if (time - new Date().getTime() < praz.time) {
                color = praz.color;
            }
        })
        return color;
    }
    /**
     * Get color for Background from timestamp
     * @param {Milisseconds} time 
     */
    getPrazosBgColor(time) {
        let color = "#000000";
        this.prazosColor.forEach(praz => {
            if (time - new Date().getTime() < praz.time) {
                color = praz.bgColor;
            }
        })
        return color;
    }
}