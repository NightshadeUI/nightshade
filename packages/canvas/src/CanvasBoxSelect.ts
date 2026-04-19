import { type Box, boxFromPoints, boxOverlap, type Point } from '@nightshadeui/util/src';
import { dependency } from 'mesh-ioc';

import { CanvasConfig } from './CanvasConfig.js';
import { CanvasInputState } from './CanvasInputState.js';
import { CanvasObjectRegistry } from './CanvasObjectRegistry.js';
import { CanvasSelection } from './CanvasSelection.js';
import { CanvasSpace } from './CanvasSpace.js';

export class CanvasBoxSelect {

    private config = dependency(this, CanvasConfig);
    private inputState = dependency(this, CanvasInputState);
    private objectRegistry = dependency(this, CanvasObjectRegistry);
    private selection = dependency(this, CanvasSelection);
    private space = dependency(this, CanvasSpace);

    private selectionOriginPos: Point | null = null;
    private initialSelectionIds = new Set<string>();
    private objectBoxes: Array<[string, Box]> = [];

    isSelecting() {
        return this.selectionOriginPos != null;
    }

    onUiDragStart(ev: MouseEvent) {
        if (!this.config.allowMultiSelect) {
            return;
        }
        if (this.isSelecting()) {
            return;
        }
        this.selectionOriginPos = { x: ev.pageX, y: ev.pageY };
        if (ev.shiftKey) {
            this.initialSelectionIds = new Set(this.selection.getSelectedIds());
        } else {
            this.initialSelectionIds.clear();
            this.selection.deselectAll();
        }
        this.captureObjectBoxes();
    }

    onUiDragMove(ev: MouseEvent) {
        if (!this.isSelecting()) {
            return;
        }
        ev.preventDefault();
        this.updateSelection(ev);
    }

    onUiDragEnd(ev: MouseEvent) {
        if (this.isSelecting()) {
            this.updateSelection(ev);
        }
        this.stopSelecting();
    }

    getSelectionBox() {
        if (!this.selectionOriginPos) {
            return null;
        }
        return boxFromPoints(
            this.space.pageToLocal(this.selectionOriginPos),
            this.space.pageToLocal(this.inputState.lastMousePos),
        );
    }

    getSelectionStyle() {
        if (!this.selectionOriginPos) {
            return null;
        }
        const box = boxFromPoints(this.selectionOriginPos, this.inputState.lastMousePos);
        const min = this.space.pageToCanvas(box[0]);
        const max = this.space.pageToCanvas(box[1]);
        return {
            left: `${min.x}px`,
            top: `${min.y}px`,
            width: `${max.x - min.x}px`,
            height: `${max.y - min.y}px`,
        };
    }

    private stopSelecting() {
        this.selectionOriginPos = null;
        this.initialSelectionIds.clear();
        this.objectBoxes = [];
    }

    private captureObjectBoxes() {
        this.objectBoxes = [];
        const viewportBox = this.space.viewportBox;
        for (const objectController of this.objectRegistry.getAll()) {
            if (!objectController.isSelectable()) {
                continue;
            }
            const element = objectController.element;
            if (!element) {
                continue;
            }
            const rect = element.getBoundingClientRect();
            const pageBox = boxFromPoints(
                { x: rect.left, y: rect.top },
                { x: rect.right, y: rect.bottom },
            );
            if (!boxOverlap(pageBox, viewportBox)) {
                continue;
            }
            const objectBox = boxFromPoints(
                this.space.pageToLocal(pageBox[0]),
                this.space.pageToLocal(pageBox[1]),
            );
            this.objectBoxes.push([objectController.objectId, objectBox]);
        }
    }

    private updateSelection(_ev: MouseEvent) {
        const selectionBox = this.getSelectionBox();
        if (!selectionBox) {
            return;
        }
        const selectionIds = new Set(this.initialSelectionIds);
        for (const [objectId, objectBox] of this.objectBoxes) {
            if (boxOverlap(selectionBox, objectBox)) {
                selectionIds.add(objectId);
            }
        }
        this.selection.setSelectedIds(selectionIds);
    }

}
