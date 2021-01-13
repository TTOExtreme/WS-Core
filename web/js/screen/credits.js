
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
        "<p style='color: #ffffff;'>Direito de Uso:</p>" +
        "</h2>" +
        "<p>Licença de uso em Base GPL 3.0</p>" +
        "<a href='http://www.gnu.org/licenses/gpl-3.0.html' target='_blank'>http://www.gnu.org/licenses/gpl-3.0.html</a>" +
        "<p>Desenvolvido por:</p>" +
        "<p>Lucas R. Camarotto</p>" +
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