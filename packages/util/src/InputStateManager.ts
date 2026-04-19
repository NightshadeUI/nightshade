import { DomEventProxy } from './DomEventProxy.js';

const NO_DRAG_SELECTORS = [
    'button', 'a', 'input', 'textarea', 'select',
    '[role="textbox"]', '[role="button"]', '[nodrag]',
];

type Modifiers = Pick<KeyboardEvent, 'altKey' | 'ctrlKey' | 'metaKey' | 'shiftKey'>;

/**
 * Tracks global pointer position, button and modifier state, and dispatches
 * semantic UI events (`uiclick`, `uidrag*`, `uiactivate`) on the DOM.
 *
 * Call {@link mount} when the application should begin listening (typically when
 * your shell is mounted) and {@link unmount} to remove listeners.
 */
export class InputStateManager {

    lastMousePos = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };

    lmbPressed = false;
    mmbPressed = false;
    rmbPressed = false;

    altKey = false;
    ctrlKey = false;
    metaKey = false;
    shiftKey = false;

    /** Minimum pointer movement (px) before a press becomes a drag. */
    dragDistance = 4;

    private windowEvents = new DomEventProxy(window);
    private lastMouseDownPos = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
    private lastMouseDownTarget: EventTarget | null = null;
    private dragTarget: EventTarget | null = null;
    private inClickVicinity = false;
    private listening = false;

    get ctrlOrMetaKey() {
        return this.ctrlKey || this.metaKey;
    }

    mount() {
        if (this.listening) {
            return;
        }
        this.listening = true;
        this.windowEvents.add('mousedown', event => this.onMouseDown(event as MouseEvent));
        this.windowEvents.add('mousemove', event => this.onMouseMove(event as MouseEvent));
        this.windowEvents.add('mouseup', event => this.onMouseUp(event as MouseEvent));
        this.windowEvents.add('keydown', event => this.onKeyDown(event as KeyboardEvent));
        this.windowEvents.add('keyup', event => this.onKeyUp(event as KeyboardEvent));
    }

    unmount() {
        if (!this.listening) {
            return;
        }
        this.listening = false;
        this.windowEvents.removeAll();
        this.dragTarget = null;
        this.inClickVicinity = false;
        this.lastMouseDownTarget = null;
    }

    private onMouseDown(ev: MouseEvent) {
        this.lastMousePos = { x: ev.pageX, y: ev.pageY };
        this.lmbPressed = ev.button === 0;
        this.mmbPressed = ev.button === 1;
        this.rmbPressed = ev.button === 2;
        if (ev.button !== 0) {
            return;
        }
        this.lastMouseDownPos = { x: ev.pageX, y: ev.pageY };
        this.lastMouseDownTarget = ev.target;
        this.inClickVicinity = true;
    }

    private onMouseMove(ev: MouseEvent) {
        this.lastMousePos = { x: ev.pageX, y: ev.pageY };
        if (!this.lmbPressed) {
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
        if (ev.button === 0) {
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
        this.lastMousePos = { x: ev.pageX, y: ev.pageY };
        this.lmbPressed = false;
        this.mmbPressed = false;
        this.rmbPressed = false;
    }

    private onKeyDown(ev: KeyboardEvent) {
        this.updateModifiers(ev);
        if ((ev.key === 'Enter' || ev.key === ' ') && ev.target) {
            if (ev.target === document.body && ev.key === ' ') {
                ev.preventDefault();
            }
            this.dispatchActivate(ev.target, ev);
        }
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
