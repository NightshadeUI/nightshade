import { init } from '@luminable/init-decorator';
import { DomEventProxy } from '@nightshadeui/util';
import { dependency } from 'mesh-ioc';

import { CanvasEvents } from './CanvasEvents.js';

type Modifiers = Pick<KeyboardEvent, 'altKey' | 'ctrlKey' | 'metaKey' | 'shiftKey'>;

export class CanvasInputState {

    lastMousePos = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };

    lmbPressed = false;
    mmbPressed = false;
    rmbPressed = false;

    altKey = false;
    ctrlKey = false;
    metaKey = false;
    shiftKey = false;

    private events = dependency(this, CanvasEvents);
    private windowEvents = new DomEventProxy(window);

    @init()
    init() {
        this.events.mounted.on(() => {
            this.windowEvents.add('mousedown', event => this.onMouseDown(event as MouseEvent));
            this.windowEvents.add('mousemove', event => this.onMouseMove(event as MouseEvent));
            this.windowEvents.add('mouseup', event => this.onMouseUp(event as MouseEvent));
            this.windowEvents.add('keydown', event => this.onKeyDown(event as KeyboardEvent));
            this.windowEvents.add('keyup', event => this.onKeyUp(event as KeyboardEvent));
        });
        this.events.unmounted.on(() => {
            this.windowEvents.removeAll();
        });
    }

    get ctrlOrMetaKey() {
        return this.ctrlKey || this.metaKey;
    }

    private onMouseDown(ev: MouseEvent) {
        this.lastMousePos = { x: ev.pageX, y: ev.pageY };
        this.lmbPressed = ev.button === 0;
        this.mmbPressed = ev.button === 1;
        this.rmbPressed = ev.button === 2;
    }

    private onMouseMove(ev: MouseEvent) {
        this.lastMousePos = { x: ev.pageX, y: ev.pageY };
    }

    private onMouseUp(ev: MouseEvent) {
        this.lastMousePos = { x: ev.pageX, y: ev.pageY };
        this.lmbPressed = false;
        this.mmbPressed = false;
        this.rmbPressed = false;
    }

    private onKeyDown(ev: KeyboardEvent) {
        this.updateModifiers(ev);
    }

    private onKeyUp(ev: KeyboardEvent) {
        this.updateModifiers(ev);
    }

    private updateModifiers(ev: Modifiers) {
        this.altKey = ev.altKey;
        this.ctrlKey = ev.ctrlKey;
        this.metaKey = ev.metaKey;
        this.shiftKey = ev.shiftKey;
    }

}
