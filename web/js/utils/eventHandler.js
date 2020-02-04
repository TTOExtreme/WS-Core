class ClientEvent {
    events = {};

    /**
     * 
     * @param {String} name
     * @param {Function|Promise} call
     * @description Create Events with name append if exists
     */
    on(name, call) {
        if (!this.events[name]) {
            this.events[name] = [];
        }
        this.events[name].push(call);
    }

    /**
     * 
     * @param {string} name
     * @param {args} args
     * @description Call all events with name and arguments 
     */
    emit(name, ...args) {
        if (this.events[name]) {
            this.events[name].forEach(event => {
                if (typeof (event.then) === 'function') {
                    Promise.all([event]).then().catch();
                } else {
                    if (args.length == 1) {
                        event(args[0]);
                    } else {
                        event(args[1]);
                    }
                }
            });
        }
    }

    clear(name) {
        if (this.events[name]) {
            delete this.events[name];
        }
    }
}

let ClientEvents = new ClientEvent();