
ClientEvents.setCoreEvent("move_menu_down");
ClientEvents.on("move_menu_down", (div) => {
    let f = function (ev) { ClientEvents.emit("move_menu", ev, div) };
    document.body.addEventListener("mousemove", f);
    document.body.addEventListener("mouseup", function () { ClientEvents.emit("move_menu_up", div, f) });
})
ClientEvents.setCoreEvent("move_menu_up");
ClientEvents.on("move_menu_up", (div, ev) => {
    document.body.removeEventListener("mousemove", ev);
})
ClientEvents.setCoreEvent("move_menu");
ClientEvents.on("move_menu", (ev, div) => {
    let d = document.getElementById(div);
    d.style.top = "calc(" + (ev.screenY - 20 - 110) + "px)";
    d.style.left = "calc(" + (ev.screenX - 20) + "px)";
    d.style.transform = "translate(0px,0px)";
});
