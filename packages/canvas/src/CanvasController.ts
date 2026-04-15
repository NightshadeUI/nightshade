import { invokeInitHandlers } from '@luminable/init-decorator';
import { dependency, Mesh } from 'mesh-ioc';
import { reactive } from 'vue';

import { CanvasConfig, CanvasConfigSpec } from './CanvasConfig.js';
import { CanvasEvents } from './CanvasEvents.js';
import { CanvasInputState } from './CanvasInputState.js';
import { CanvasPan } from './CanvasPan.js';
import { CanvasSpace } from './CanvasSpace.js';
import { CanvasUiEvents } from './CanvasUiEvents.js';
import { CanvasViewport } from './CanvasViewport.js';
import { CanvasZoom } from './CanvasZoom.js';

export class CanvasController {

    mesh = new Mesh();
    config = dependency(this, CanvasConfig);
    space = dependency(this, CanvasSpace);
    viewport = dependency(this, CanvasViewport);
    pan = dependency(this, CanvasPan);
    events = dependency(this, CanvasEvents);
    inputState = dependency(this, CanvasInputState);
    uiEvents = dependency(this, CanvasUiEvents);
    zoom = dependency(this, CanvasZoom);

    constructor(config: CanvasConfigSpec = {}) {
        this.mesh.connect(this);
        this.mesh.use(_ => reactive(_));
        this.mesh.service(CanvasViewport);
        this.mesh.service(CanvasPan);
        this.mesh.service(CanvasConfig);
        this.mesh.service(CanvasSpace);
        this.mesh.service(CanvasEvents);
        this.mesh.service(CanvasInputState);
        this.mesh.service(CanvasUiEvents);
        this.mesh.service(CanvasZoom);
        this.config.set(config);
    }

    mount(viewportEl: HTMLElement) {
        invokeInitHandlers(this.mesh);
        this.viewport.mount(viewportEl);
        this.events.mounted.emit();
    }

    unmount() {
        invokeInitHandlers(this.mesh);
        this.viewport.destroy();
        this.events.unmounted.emit();
    }

}
