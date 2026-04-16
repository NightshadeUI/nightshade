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
    selectable = true;

    private config = dependency(this, CanvasConfig);
    private selection = dependency(this, CanvasSelection);

    constructor(objectId: string) {
        this.objectId = objectId;
    }

    setElement(element: HTMLElement | null) {
        this.element = element;
    }

    setSelectable(selectable: boolean) {
        this.selectable = selectable;
        if (!selectable) {
            this.selection.removeFromSelection(this.objectId);
        }
    }

    isSelected() {
        return this.selection.isSelected(this.objectId);
    }

    setSelected(isSelected: boolean) {
        if (isSelected && !this.selectable) {
            return;
        }
        this.selection.setSelected(this.objectId, isSelected);
    }

    handleUiClick(ev: MouseEvent) {
        if (!this.selectable) {
            return;
        }
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
