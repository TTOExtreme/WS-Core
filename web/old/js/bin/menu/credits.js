
var cr = document.getElementById("credits_holderbg");
cr.addEventListener("click", credits);


cr.style.opacity = "0";
cr.style.top = "-100vh";
cr.style.left = "25vw";
cr.style.backgroundColor = "#10101000";
cr.style.width = "50vw";
cr.style.height = "50vh";
var cr1 = document.getElementById("credits_holder");
cr1.style.opacity = "0";



function credits() {
    cr = document.getElementById("credits_holderbg");
    if (cr.style.opacity == "1") {
        cr.style.opacity = "0";
        cr.style.top = "-100vh";
        cr.style.left = "25vw";
        cr.style.backgroundColor = "#10101000";
        cr.style.width = "50vw";
        cr.style.height = "50vh";
        var cr1 = document.getElementById("credits_holder");
        cr1.style.opacity = "0";
    } else {
        cr.style.opacity = "1";
        cr.style.top = "0";
        cr.style.left = "0";
        cr.style.backgroundColor = "#10101055";
        cr.style.width = "100vw";
        cr.style.height = "100vh";
        var cr1 = document.getElementById("credits_holder");
        cr1.style.opacity = "1";
    }
}