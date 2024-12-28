/**
 * Simples classe de event emitter
 */
class EventEmitter {
    constructor() {
        this.events = {};
    }

    /**
     * 
     * @param {String} event 
     * @param {Function} listener 
     */
    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        const id = BCypher.generateString();
        this.events[event].push({ id: id, listener: listener });
        return id;
    }
    /**
     * 
     * @param {String} event 
     * @param  {...any} args 
     */
    emit(event, ...args) {
        if (this.events[event]) {
            this.events[event].forEach(listener => {
                listener.listener(...args);
            });
        }
    }

    /**
     * Retira o EventListener da lista
     * @param {String} event 
     * @param {String} idlistener Id do listener retornado ao adicionar na lista 
     */
    off(event, idlistener) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(l => l.id != idlistener);
        }
    }

    /**
     * Retira todos os EventListener da lista
     * @param {String} event 
     * @param {Function} listener 
     */
    offAll(event) {
        if (this.events[event]) {
            delete this.events[event];
        }
    }
}

// Example usage:

const _events = new EventEmitter();
