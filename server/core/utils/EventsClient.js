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
        console.log(name)
        console.log(this._events)
        if (this._events[name]) {
            this._events[name].forEach(event => {
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
     * Set as Core Event Listener that locks clearing 
     * @param {String} name 
     */
    setCoreEvent(name) {
        if (this._coreEvents.find(e => e == name) == undefined) {
            this._coreEvents.push(name);
        }
    }
}
module.exports = { ClientEvent }