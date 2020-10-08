ClientEvents.on("WPMA/sites/disable", (data) => {   
    data.active = ((data.active == 1) ? 0 : 1);
    ClientEvents.emit("SendSocket", "adm/WPMA/sites/disable/save", data);
});