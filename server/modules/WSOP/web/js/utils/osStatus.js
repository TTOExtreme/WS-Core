
/**
 * Lista de STATUS
 */
const statusIDs = [
    { name: "Orçamento", color: "#ffffff", bgColor: "#0000a0" },
    { name: "Criação Arte", color: "#ffffff", bgColor: "#000050" },
    { name: "Aprovação", color: "#ffffff", bgColor: "#ff6000" },
    { name: "Aprovado", color: "#ffffff", bgColor: "#c3540f" },
    { name: "Falta de Informação", color: "#ffffff", bgColor: "#a00000" },
    { name: "Montando Arquivo", color: "#ffffff", bgColor: "#00bb00" },
    { name: "Arquivo Montado", color: "#ffffff", bgColor: "#1d7718" },
    { name: "Impressão", color: "#ffffff", bgColor: "#15c5bf" },
    { name: "Impresso", color: "#ffffff", bgColor: "#227d76" },
    { name: "Calandra", color: "#ffffff", bgColor: "#ff8d13" },
    { name: "Calandrado", color: "#ffffff", bgColor: "#b98522" },
    { name: "Costura", color: "#ffffff", bgColor: "#2c30f1" },
    { name: "Costurado", color: "#ffffff", bgColor: "#6164e8" },
    { name: "Expedição", color: "#ffffff", bgColor: "#2bbd5a" },
    { name: "Finalizado", color: "#ffffff", bgColor: "#000000" },
]

function StatusIdToName(ID) {
    if (ID < statusIDs.length) {
        return statusIDs[ID].name
    }
    return "-"
}

function StatusIdToOptList(selected = 0) {
    let ret = ""
    statusIDs.forEach((item, index) => {
        ret += "<option value='" + index + "' " + ((index == selected) ? "selected" : "") + ">" + item.name + "</option>";
    })
    return ret;
}

function StatusIdToColor(ID = 0) {
    if (ID < statusIDs.length) {
        return statusIDs[ID].color
    }
}

function StatusIdToBgColor(ID = 0) {
    if (ID < statusIDs.length) {
        return statusIDs[ID].bgColor
    }
}

