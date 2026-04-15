type Listener = EventListenerOrEventListenerObject;

interface Entry {
    type: string;
    listener: Listener;
    options?: AddEventListenerOptions | boolean;
}

export class DomEventProxy {

    private entries: Entry[] = [];

    constructor(private target: EventTarget) {}

    add(type: string, listener: Listener, options?: AddEventListenerOptions | boolean) {
        this.target.addEventListener(type, listener, options);
        this.entries.push({ type, listener, options });
    }

    removeAll() {
        for (const entry of this.entries) {
            this.target.removeEventListener(entry.type, entry.listener, entry.options);
        }
        this.entries = [];
    }

}
