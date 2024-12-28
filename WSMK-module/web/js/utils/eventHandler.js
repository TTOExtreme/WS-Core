class ClientEvent {
    _events = {};
    _coreEvents = [];

    /**
     * 
     * @param {String} name
     * @param {Function|Promise} call
     * @description Create Events with name append if exists
     */
    on(name, call) {
        if (!this._events[name]) {
            this._events[name] = [];
        }
        this._events[name].push(call);
    }

    /**
     * 
     * @param {string} name
     * @param {args} args
     * @description Call all events with name and arguments 
     */
    emit(name, ...args) {
        /*
                console.log("\\/Event emiter:");
                console.log(name);
                console.log(args);
                console.log("/\\");
                //*/
        if (this._events[name]) {
            this._events[name].forEach(event => {
                if (typeof (event.then) === 'function') {
                    Promise.all([event]).then().catch();
                } else {
                    if (args.length == 1) {
                        event(args[0]);
                    } else {
                        event(...args);
                    }
                }
            });

        }
    }

    /**
     * Clear all listerners for specified Event Name
     * @param {String} name 
     */
    clear(name) {
        if (this._events[name]) {
            delete this._events[name];
        }
    }

    /**
     * Clear all listerners Except for Core Events
     * @param {String} name 
     */
    clearAll() {
        Object.keys(this._events).forEach(name => {
            if (this._coreEvents.find(e => e == name) == undefined) {
                delete this._events[name];
            }
        })
    }

    /**
     * Clear all listerners duplicated
     * @param {String} name 
     */
    clearAllDupes() {
        Object.keys(this._events).forEach(name => {
            if (this._events[name]) {
                this._events[name].forEach((event, index) => {
                    if (index > 0)
                        delete this._events[name][index];
                });

            }
        })
    }

    /**
     * Set as Core Event Listener that locks clearing 
     * @param {String} name 
     */
    setCoreEvent(name) {
        if (this._coreEvents.find(e => e == name) == undefined) {
            this._coreEvents.push(name);
        }
    }
}

let ClientEvents = new ClientEvent();

ClientEvents.setCoreEvent("Load");
ClientEvents.on("Load", (file) => {
    loadExternal(file).then(() => {
    }).catch((err) => {
        console.log("An error ocurred when loading external css\nAre you disconnected from internet?")
        console.log(err);
    })
})