let ClientEvents = new EventEmitter();
let ClientInitializers = []; // aray of promises for initializing each dependency if necessary


ClientEvents.on("Page_Loaded", () => {
    Promise.all(ClientInitializers).then(() => {
        ClientEvents.emit("Page_Initialize");
    }).catch((err) => {
        console.log(err);
    })
})