import { dependency } from 'mesh-ioc';

import { CanvasConfig } from './CanvasConfig.js';
import { CanvasSelection } from './CanvasSelection.js';

export interface CanvasObjectPos {
    x: number;
    y: number;
    w?: number;
    h?: number;
}

export class CanvasObjectController {

    objectId: string;
    element: HTMLElement | null = null;

    private config = dependency(this, CanvasConfig);
    private selection = dependency(this, CanvasSelection);

    constructor(objectId: string) {
        this.objectId = objectId;
    }

    setElement(element: HTMLElement | null) {
        this.element = element;
    }

    isSelected() {
        return this.selection.isSelected(this.objectId);
    }

    setSelected(isSelected: boolean) {
        this.selection.setSelected(this.objectId, isSelected);
    }

    handleUiClick(ev: MouseEvent) {
        const multiSelectIntent = ev.shiftKey || ev.ctrlKey || ev.metaKey;
        if (this.config.allowMultiSelect && multiSelectIntent) {
            this.selection.toggleSelection(this.objectId);
            return;
        }
        this.selection.selectSingle(this.objectId);
    }

    updatePos(_pos: CanvasObjectPos) {
        // Stub for future drag/move integration.
    }

}
