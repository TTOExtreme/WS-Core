
let cr = document.getElementById("Credits_Holder");

cr.addEventListener("click", (ev) => {
    ClientEvents.emit("CreditsToggle");
});

ClientEvents.setCoreEvent("Page_Loaded");
ClientEvents.on("Page_Loaded", new Promise((res, rej) => {
    let credits = document.createElement("div");
    credits.innerHTML =
        "<div id='credits_holderbg' class='credits_holderbg noselect'>" +
        "<center><div id='credits_holder' class='credits_holder noselect'>" +
        "<div id='credits' class='credits'>" +
        "<h2>" +
        "<p style='color: #ffffff;'>Responsaveis pelo Projeto:</p>" +
        "</h2>" +
        "<p>Wilton L. Borges (Secretario)</p>" +
        "<p>Paulo C. Marostica (Diretor do Departamento)</p>" +
        "<p>Fernando R. Poli (Chefe de Secção)</p>" +
        "<p>Lucas R. Camarotto (Desenvolvedor)</p>" +
        "</div>" +
        "</div>" +
        "</div>";
    credits.onclick = (ev) => {
        document.getElementById("credits_holderbg").classList.toggle("CreditsShow");
    }
    document.body.appendChild(credits);
    res();
}));

ClientEvents.setCoreEvent("CreditsToggle");
ClientEvents.on("CreditsToggle", () => {
    document.getElementById("credits_holderbg").classList.toggle("CreditsShow");
})