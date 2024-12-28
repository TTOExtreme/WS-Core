
/**
 * Lista de STATUS
 * 2: Aguardando Pagamento
 * 3: Pedido em Análise
 * 4: Pedido Pago
 * 6: Pedido em Disputa
 * 7: Pagamento Devolvido
 * 8: Pedido Cancelado
 * 9: Pedido Efetuado (padrão)
 * 11: Pedido Enviado
 * 13: Pedido Pronto da Retirada
 * 14: Pedido Entregue
 */
if (window.utils == undefined) {
    window.utils = {};
}

window.utils.OPLIstatusIDs = [
    { name: "Checar STATUS", color: "#000000", bgColor: "#ff0000" },//0
    { name: "Checar STATUS", color: "#000000", bgColor: "#ff0000" },//1
    { name: "Aguardando Pagamento", color: "#ffffff", bgColor: "#227d76" },//2
    { name: "Pagamento em Análise", color: "#ffffff", bgColor: "#227d76" },//3
    { name: "Pago", color: "#ffffff", bgColor: "#a00000" },//4
    { name: "Checar STATUS", color: "#000000", bgColor: "#ff0000" },//5
    { name: "Pagamento em Disputa", color: "#ffffff", bgColor: "#6164e8" },//6
    { name: "Pagamento Devolvido", color: "#ffffff", bgColor: "#ff8d13" },//7
    { name: "Cancelado", color: "#ffffff", bgColor: "#0000a0" },//8
    { name: "Efetuado", color: "#ffffff", bgColor: "#000050" },//9
    { name: "Checar STATUS", color: "#000000", bgColor: "#ff0000" },//10
    { name: "Enviado", color: "#ffffff", bgColor: "#c3540f" },//11
    { name: "Checar STATUS", color: "#000000", bgColor: "#ff0000" },//12
    { name: "Pronto Para Retirada", color: "#ffffff", bgColor: "#15c5bf" },//13
    { name: "Entregue", color: "#ffffff", bgColor: "#ff6000" },//14
    { name: "Em Separação", color: "#000000", bgColor: "#ff0000" },//15
    { name: "Pagamento em Chargeback", color: "#000000", bgColor: "#ff0000" },//16
    { name: "Em Produção", color: "#ffffff", bgColor: "#00bb00" },//17
]

window.utils.OPLIStatusIdToName = (ID) => {
    if (ID < window.utils.OPLIstatusIDs.length) {
        return window.utils.OPLIstatusIDs[ID].name
    }
    return "-"
}

window.utils.OPLIStatusIdToOptList = (selected = 0) => {
    let ret = ""
    window.utils.OPLIstatusIDs.forEach((item, index) => {
        if (item.name != "Checar STATUS") {
            ret += "<option value='" + index + "' " + ((index == selected) ? "selected" : "") + ">" + item.name + "</option>";
        }
    })
    return ret;
}

window.utils.OPLIStatusIdToColor = (ID = 0) => {
    if (ID < window.utils.OPLIstatusIDs.length) {
        return window.utils.OPLIstatusIDs[ID].color
    }
}

window.utils.OPLIStatusIdToBgColor = (ID = 0) => {
    if (ID < window.utils.OPLIstatusIDs.length) {
        return window.utils.OPLIstatusIDs[ID].bgColor
    }
}

