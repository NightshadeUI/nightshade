import { InputStateManager } from '@nightshadeui/util';

export interface CanvasConfigSpec {
    autoCenter?: boolean;
    allowMultiSelect?: boolean;
    /**
     * Shared global input / UI event manager. When omitted, the controller creates
     * one and calls {@link InputStateManager.mount} / {@link InputStateManager.unmount}
     * from {@link CanvasController.mount} / {@link CanvasController.unmount}.
     * When provided, the application owns the lifecycle of {@link InputStateManager.mount}.
     */
    inputStateManager?: InputStateManager;
}

export class CanvasConfig {

    autoCenter = true;
    allowMultiSelect = true;

    set(config: Partial<CanvasConfigSpec>) {
        Object.assign(this, config);
    }

}
