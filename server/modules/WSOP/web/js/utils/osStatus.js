
/**
 * Lista de STATUS
 */
const statusIDs = [
    "Orçamento",
    "Criação Arte",
    "Aprovação",
    "Aprovado",
    "Falta de Informação",
    "Montando Arquivo",
    "Arquivo Montado",
    "Impressão",
    "Impresso",
    "Calandra",
    "Calandrado",
    "Costura",
    "Costurado",
    "Expedição",
    "Finalizado",
]

function StatusIdToName(ID) {
    if (ID < statusIDs.length) {
        return statusIDs[ID]
    }
    return "-"
}

function StatusIdToOptList(selected = 0) {
    let ret = ""
    statusIDs.forEach((item, index) => {
        ret += "<option value='" + index + "' " + ((index == selected) ? "selected" : "") + ">" + item + "</option>";
    })
    return ret;
}