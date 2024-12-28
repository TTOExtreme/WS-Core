function init_loading() {
    //add the element to page
    if (document.getElementById("loading_holder") == undefined) {
        let ls = document.createElement("div");
        ls.setAttribute("class", "loading_holderBg");
        ls.setAttribute("id", "loading_holderBg");
        let ls1 = document.createElement("div");
        ls1.setAttribute("class", "loading_holder");
        ls1.setAttribute("id", "loading_holder");
        let lsvg = document.createElement("svg");
        lsvg.setAttribute("class", "loading_svg");
        lsvg.setAttribute("id", "loading_svg");
        ls.appendChild(ls1);
        ls1.appendChild(lsvg);
        document.body.appendChild(ls);
    }
    // create svg element
    let cx = 50;
    let cy = 50;
    let r = 40;
    let percent = 100;

    let icolor = "#808080f0";
    let fcolor = "#30303030";

    let svg = document.getElementById('loading_svg');
    svg.classList.add("svg-circle");
    svg.setAttribute("data-percent", percent);
    svg.setAttribute("width", cx * 2);
    svg.setAttribute("height", cy * 2);
    svg.innerHTML = "";
    //svg.innerHTML += "<defs><conicalGradient id='loaderStroke' x1='0%' y1='0%' x2='100%' y2='0%'><stop offset='0%' stop-color='" + icolor + "' /> <stop offset='100%' stop-color='" + fcolor + "' /></defs>";
    svg.innerHTML += "<defs><linearGradient id='loaderStroke' x1='0%' y1='0%' x2='100%' y2='0%'><stop offset='0%' stop-color='" + icolor + "' /> <stop offset='100%' stop-color='" + fcolor + "' /></defs>";
    svg.innerHTML += "<circle cx='" + cx + "' cy='" + cy + "' r='" + r + "'/>";

    let rc = 2 * r * Math.PI;
    let rd = percent * rc / 100;

    svg.style.strokeDasharray = rd;
}
function init_end() {
    if (ClientEvents != undefined) {
        ClientEvents.setCoreEvent("startLoader")
        ClientEvents.on("startLoader", () => {
            let svg = document.getElementById('loading_holderBg');
            if (!svg) { setTimeout(() => { ClientEvents.emit("startLoader") }); return; }
            svg.style.opacity = 1;
            svg.style.top = "0";
            svg.style.left = "0";
            svg.style.backgroundColor = "#10101055";
            svg.style.width = "100vw";
            svg.style.height = "100vh";
        })
        ClientEvents.setCoreEvent("stopLoader");
        ClientEvents.on("stopLoader", () => {
            let svg = document.getElementById('loading_holderBg');
            if (!svg) { setTimeout(() => { ClientEvents.emit("stopLoader") }); return; }
            svg.style.opacity = 0;
            svg.style.top = "-200px";
            svg.style.left = "calc(50vw - 50px)";
            svg.style.backgroundColor = "let(--loader-bg)";
            svg.style.width = "100px";
            svg.style.height = "100px";
        });

        ClientEvents.setCoreEvent("Page_Loaded")
        ClientEvents.on("Page_Loaded", new Promise((resolve, reject) => {
            //console.log("initializing Loader")
            init_loading();
            resolve();
        }));
    } else {
        setTimeout(() => {
            init_end();
        }, 100);
    }
}