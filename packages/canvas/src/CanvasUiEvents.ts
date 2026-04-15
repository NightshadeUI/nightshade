import { init } from '@luminable/init-decorator';
import { DomEventProxy } from '@nightshadeui/util/src';
import { dependency } from 'mesh-ioc';

import { CanvasEvents } from './CanvasEvents.js';
import { CanvasInputState } from './CanvasInputState.js';

const NO_DRAG_SELECTORS = [
    'button', 'a', 'input', 'textarea', 'select',
    '[role="textbox"]', '[role="button"]', '[nodrag]'
];

export class CanvasUiEvents {

    private events = dependency(this, CanvasEvents);
    private inputState = dependency(this, CanvasInputState);

    private windowEvents = new DomEventProxy(window);
    private lastMouseDownPos = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
    private lastMouseDownTarget: EventTarget | null = null;
    private dragTarget: EventTarget | null = null;
    private inClickVicinity = false;
    private dragDistance = 4;

    @init()
    init() {
        this.events.mounted.on(() => {
            this.windowEvents.add('mousedown', event => this.onMouseDown(event as MouseEvent));
            this.windowEvents.add('mousemove', event => this.onMouseMove(event as MouseEvent));
            this.windowEvents.add('mouseup', event => this.onMouseUp(event as MouseEvent));
            this.windowEvents.add('keydown', event => this.onKeyDown(event as KeyboardEvent));
        });
        this.events.unmounted.on(() => {
            this.windowEvents.removeAll();
        });
    }

    private onMouseDown(ev: MouseEvent) {
        if (ev.button !== 0) {
            return;
        }
        this.lastMouseDownPos = { x: ev.pageX, y: ev.pageY };
        this.lastMouseDownTarget = ev.target;
        this.inClickVicinity = true;
    }

    private onMouseMove(ev: MouseEvent) {
        if (!this.inputState.lmbPressed) {
            return;
        }
        if (this.dragTarget) {
            this.dragTarget.dispatchEvent(this.cloneMouseEvent('uidragmove', ev));
            return;
        }
        if (!this.inClickVicinity || !this.lastMouseDownTarget) {
            return;
        }
        const dx = ev.pageX - this.lastMouseDownPos.x;
        const dy = ev.pageY - this.lastMouseDownPos.y;
        if (Math.hypot(dx, dy) < this.dragDistance) {
            return;
        }
        this.inClickVicinity = false;
        if (this.isDragAllowed(this.lastMouseDownTarget)) {
            this.dragTarget = this.lastMouseDownTarget;
            this.dragTarget.dispatchEvent(this.cloneMouseEvent('uidragstart', ev));
        }
    }

    private onMouseUp(ev: MouseEvent) {
        if (ev.button !== 0) {
            return;
        }
        const dragTarget = this.dragTarget;
        const inClickVicinity = this.inClickVicinity;
        const lastMouseDownTarget = this.lastMouseDownTarget;
        this.dragTarget = null;
        this.inClickVicinity = false;
        this.lastMouseDownTarget = null;
        if (dragTarget) {
            dragTarget.dispatchEvent(this.cloneMouseEvent('uidragend', ev));
        }
        if (inClickVicinity && lastMouseDownTarget) {
            lastMouseDownTarget.dispatchEvent(this.cloneMouseEvent('uiclick', ev));
            this.dispatchActivate(lastMouseDownTarget, ev);
        }
    }

    private onKeyDown(ev: KeyboardEvent) {
        if ((ev.key === 'Enter' || ev.key === ' ') && ev.target) {
            if (ev.target === document.body && ev.key === ' ') {
                ev.preventDefault();
            }
            this.dispatchActivate(ev.target, ev);
        }
    }

    private dispatchActivate(target: EventTarget, baseEvent: Event) {
        const el = target as HTMLElement;
        if (el.closest(':disabled')) {
            return;
        }
        target.dispatchEvent(new CustomEvent('uiactivate', { detail: baseEvent }));
    }

    private isDragAllowed(target: EventTarget) {
        if (!(target instanceof Element)) {
            return false;
        }
        return !target.closest(NO_DRAG_SELECTORS.join(','));
    }

    private cloneMouseEvent(type: string, ev: MouseEvent) {
        return new MouseEvent(type, {
            bubbles: true,
            cancelable: true,
            clientX: ev.clientX,
            clientY: ev.clientY,
            screenX: ev.screenX,
            screenY: ev.screenY,
            button: ev.button,
            buttons: ev.buttons,
            ctrlKey: ev.ctrlKey,
            shiftKey: ev.shiftKey,
            altKey: ev.altKey,
            metaKey: ev.metaKey,
        });
    }

}
