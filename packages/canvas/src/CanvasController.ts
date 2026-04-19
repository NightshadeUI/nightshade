import { invokeInitHandlers } from '@flexent/init-decorator';
import { InputStateManager } from '@nightshadeui/util';
import { dependency, Mesh } from 'mesh-ioc';
import { reactive } from 'vue';

import { CanvasBoxSelect } from './CanvasBoxSelect.js';
import { CanvasConfig, type CanvasConfigSpec } from './CanvasConfig.js';
import { CanvasEvents } from './CanvasEvents.js';
import { CanvasMove } from './CanvasMove.js';
import { CanvasObjectRegistry } from './CanvasObjectRegistry.js';
import { CanvasPan } from './CanvasPan.js';
import { CanvasSelection } from './CanvasSelection.js';
import { CanvasSpace } from './CanvasSpace.js';
import { CanvasViewport } from './CanvasViewport.js';
import { CanvasZoom } from './CanvasZoom.js';

export class CanvasController {

    mesh = new Mesh();
    boxSelect = dependency(this, CanvasBoxSelect);
    config = dependency(this, CanvasConfig);
    space = dependency(this, CanvasSpace);
    viewport = dependency(this, CanvasViewport);
    pan = dependency(this, CanvasPan);
    events = dependency(this, CanvasEvents);
    inputStateManager = dependency(this, InputStateManager);
    objectRegistry = dependency(this, CanvasObjectRegistry);
    selection = dependency(this, CanvasSelection);
    zoom = dependency(this, CanvasZoom);

    private ownsInputStateManager: boolean;

    constructor(config: CanvasConfigSpec = {}) {
        const inputStateManager = config.inputStateManager ?? new InputStateManager();
        this.ownsInputStateManager = config.inputStateManager == null;
        this.mesh.connect(this);
        this.mesh.use(_ => reactive(_));
        this.mesh.constant(InputStateManager, inputStateManager);
        this.mesh.service(CanvasBoxSelect);
        this.mesh.service(CanvasViewport);
        this.mesh.service(CanvasPan);
        this.mesh.service(CanvasConfig);
        this.mesh.service(CanvasSpace);
        this.mesh.service(CanvasEvents);
        this.mesh.service(CanvasMove);
        this.mesh.service(CanvasObjectRegistry);
        this.mesh.service(CanvasSelection);
        this.mesh.service(CanvasZoom);
        this.config.set(config);
    }

    mount(viewportEl: HTMLElement) {
        invokeInitHandlers(this.mesh);
        this.viewport.mount(viewportEl);
        this.events.mounted.emit();
        if (this.ownsInputStateManager) {
            this.inputStateManager.mount();
        }
    }

    unmount() {
        invokeInitHandlers(this.mesh);
        this.viewport.destroy();
        if (this.ownsInputStateManager) {
            this.inputStateManager.unmount();
        }
        this.events.unmounted.emit();
    }

}
