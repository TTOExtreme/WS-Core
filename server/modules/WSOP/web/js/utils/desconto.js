
if (!window.Modules) {
    window.Modules = {
        WSOP: {
            Produtos: null
        }
    }
}
window.Modules.WSOP.desconto = class desconto {
    prazos = [
        {
            name: "R$ 0.00",
            preco: 0.00,
            min: 0,
            max: 80000
        },
        {
            name: "R$ 100.00",
            preco: 100.00,
            min: 800,
            max: 800000
        },
        {
            name: "R$ 300.00",
            preco: 300.00,
            min: 1000,
            max: 80000
        },
        {
            name: "R$ 500.00",
            preco: 500.00,
            min: 2000,
            max: 80000
        },
        {
            name: "R$ 1000.00",
            preco: 1000.00,
            min: 10000,
            max: 80000
        },
    ]
    pagamento = [
        {
            name: "A Vista",
            code: "avista"
        },
        {
            name: "50% Entrada, 50% Saida",
            code: "50_50"
        }
    ]


    descontoToOPTList(selected = 100.00, total = 100) {
        let ret = ""
        if (total >= 0) { } else { total = 0 };
        this.prazos.forEach((item, index) => {
            if (parseFloat(total) >= item.min && parseFloat(total) <= item.max) {
                ret += "<option value='" + item.preco + "' " + ((item.preco == selected) ? "selected" : "") + ">" + item.name + "</option>";
            }
        });
        return ret;
    }
    pagamentoToOPTList(selected = "avista") {
        let ret = ""
        this.pagamento.forEach((item, index) => {
            ret += "<option value='" + item.code + "' " + ((item.code == selected) ? "selected" : "") + ">" + item.name + "</option>";
        });
        return ret;
    }
}

