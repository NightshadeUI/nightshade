import { init } from '@luminable/init-decorator';
import { DomEventProxy } from '@nightshadeui/util';
import { dependency } from 'mesh-ioc';

import { CanvasEvents } from './CanvasEvents.js';
import { CanvasViewport } from './CanvasViewport.js';

export class CanvasPan {

    private viewport = dependency(this, CanvasViewport);
    private events = dependency(this, CanvasEvents);

    private windowEvents = new DomEventProxy(window);
    private isPanning = false;

    @init()
    init() {
        this.events.unmounted.on(() => this.stopPanning());
    }

    onMouseDown(ev: MouseEvent) {
        if (ev.button !== 1) {
            return;
        }
        ev.preventDefault();
        this.isPanning = true;
        this.windowEvents.add('mousemove', event => this.onMouseMove(event as MouseEvent));
        this.windowEvents.add('mouseup', event => this.onMouseUp(event as MouseEvent));
    }

    stopPanning() {
        this.isPanning = false;
        this.windowEvents.removeAll();
    }

    private onMouseMove(ev: MouseEvent) {
        if (!this.isPanning) {
            return;
        }
        this.viewport.scrollBy(-ev.movementX, -ev.movementY);
    }

    private onMouseUp(ev: MouseEvent) {
        if (ev.button === 1) {
            this.stopPanning();
        }
    }

}
