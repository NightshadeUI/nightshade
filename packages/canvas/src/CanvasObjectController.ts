import { type Box, type Point, subtractPoints } from '@nightshadeui/util';
import { clamp } from '@nightshadeui/util';
import { dependency } from 'mesh-ioc';

import { CanvasConfig } from './CanvasConfig.js';
import { CanvasEvents } from './CanvasEvents.js';
import { CanvasMove } from './CanvasMove.js';
import { CanvasSelection } from './CanvasSelection.js';
import { CanvasSpace } from './CanvasSpace.js';
import { type CanvasResizeDirection, type CanvasResizeMode } from './types.js';

export interface CanvasObjectPos {
    x: number;
    y: number;
    w?: number;
    h?: number;
}

export class CanvasObjectController {

    private config = dependency(this, CanvasConfig);
    private events = dependency(this, CanvasEvents);
    private selection = dependency(this, CanvasSelection);
    private move = dependency(this, CanvasMove);
    private space = dependency(this, CanvasSpace);

    objectId: string;
    element: HTMLElement | null = null;

    // User-specified props, updated by watchers
    private selectable = true;
    private movable = true;
    private snapToGrid = true;
    private resizable: CanvasResizeMode = 'none';
    private bounds: Box = [{ x: 1, y: 1 }, { x: 10, y: 10 }];
    private pos: CanvasObjectPos = { x: 0, y: 0 };

    // Internal state
    private localPos: Required<CanvasObjectPos> = { x: 0, y: 0, w: 1, h: 1 };
    private prevLocalPos: Required<CanvasObjectPos> = { x: 0, y: 0, w: 1, h: 1 };
    private resizingDirection: CanvasResizeDirection | null = null;
    private resizingBounds: Box = [{ x: 0, y: 0 }, { x: 0, y: 0 }];

    constructor(objectId: string) {
        this.objectId = objectId;
    }

    setElement(element: HTMLElement | null) {
        this.element = element;
    }

    getPos() {
        return this.pos;
    }

    setPos(pos: CanvasObjectPos) {
        this.pos = pos;
        if (!this.isMoving() && !this.isResizing()) {
            this.recalcLocalPos();
        }
    }

    getBounds() {
        return this.bounds;
    }

    setBounds(bounds: Box) {
        this.bounds = bounds;
        if (!this.isMoving() && !this.isResizing()) {
            this.recalcLocalPos();
        }
    }

    isSelectable() {
        return this.selectable;
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

    isMovable() {
        return this.movable;
    }

    setMovable(movable: boolean) {
        this.movable = movable;
    }

    isSnapToGrid() {
        return this.snapToGrid;
    }

    setSnapToGrid(snapToGrid: boolean) {
        this.snapToGrid = snapToGrid;
    }

    isResizable() {
        return this.resizable;
    }

    setResizable(resizable: CanvasResizeMode) {
        this.resizable = resizable;
    }

    /* Render state */

    getCanvasCoords(): CanvasObjectPos {
        const min = this.space.localToCanvas({ x: this.localPos.x, y: this.localPos.y });
        const max = this.space.localToCanvas({
            x: this.localPos.x + this.localPos.w,
            y: this.localPos.y + this.localPos.h,
        });
        const canvasSize = subtractPoints(max, min);
        const w = this.pos.w === undefined ? undefined : canvasSize.x;
        const h = this.pos.h === undefined ? undefined : canvasSize.y;
        return {
            x: min.x,
            y: min.y,
            w,
            h,
        };
    }

    getStyle() {
        const coords = this.getCanvasCoords();
        return {
            position: 'absolute',
            left: `${coords.x}px`,
            top: `${coords.y}px`,
            width: coords.w === undefined ? undefined : `${coords.w}px`,
            height: coords.h === undefined ? undefined : `${coords.h}px`,
        };
    }

    isMoving() {
        return this.move.isMoving(this.objectId);
    }

    isResizing() {
        return this.resizingDirection != null;
    }

    commitNewPos(newPos: CanvasObjectPos) {
        Object.assign(this.pos, newPos);
        this.events.objectPosUpdated.emit({
            objectId: this.objectId,
            pos: { ...this.pos },
        });
    }

    // Event handlers

    /**
     * Click handles selection
     * Shift/Ctrl/Meta key allows multi-select, if allowed by canvas config
     */
    onUiClick(ev: MouseEvent) {
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

    /**
     * Dragging starts moving selected objects, if allowed.
     * If not selected, single selection is performed first, then dragging starts.
     */
    onUiDragStart(ev: MouseEvent) {
        if (!this.movable) {
            return;
        }
        if (!this.isSelected()) {
            if (ev.shiftKey) {
                this.selection.addToSelection(this.objectId);
            } else {
                this.selection.selectSingle(this.objectId);
            }
        }
        if (!this.isResizing() && !this.isMoving()) {
            this.move.startMovingSelection(ev);
        }
    }

    /**
     * Drag move is re-emitted to global canvas events, so that each selected object moves.
     * CanvasMove will call onMoveOffset on objects that are currently moving.
     */
    onUiDragMove(ev: MouseEvent) {
        this.events.dragMove.emit(ev);
    }

    /**
     * Drag end is re-emitted to global canvas events, so that each selected object stops moving.
     * CanvasMove will call onMoveEnd on objects that are currently moving.
     */
    onUiDragEnd(ev: MouseEvent) {
        this.events.dragEnd.emit(ev);
    }

    /* Moving */

    /**
     * Move start is called by CanvasMove when selected objects starts moving.
     * It saves the previous local position, so that the offset can be calculated.
     */
    onMoveStart() {
        this.prevLocalPos = { ...this.localPos };
    }

    /**
     * Move offset is called by CanvasMove when selected objects moves.
     * It calculates the new local position based on the previous local position and the offset.
     */
    onMoveOffset(offset: Point) {
        if (!this.movable) {
            return;
        }
        this.localPos = {
            x: this.prevLocalPos.x + offset.x,
            y: this.prevLocalPos.y + offset.y,
            w: this.prevLocalPos.w,
            h: this.prevLocalPos.h,
        };
    }

    /**
     * Move end is called by CanvasMove when selected objects stops moving.
     * It commits the new local position to the object.
     */
    onMoveEnd() {
        this.commitNewPos({
            x: this.maybeRound(this.localPos.x),
            y: this.maybeRound(this.localPos.y),
        });
    }

    /* Resizing */

    startResizing(direction: CanvasResizeDirection) {
        if (this.resizable === 'none' || !this.canResizeInDirection(direction)) {
            return;
        }
        this.resizingDirection = direction;
        this.resizingBounds = this.getObjectBounds();
        this.selection.selectSingle(this.objectId);
    }

    onResizeMove(ev: MouseEvent) {
        if (!this.resizingDirection) {
            return;
        }
        const pointer: Point = { x: ev.pageX, y: ev.pageY };
        const point = this.space.pageToLocal(pointer);
        const [min, max] = this.getResizingUpdates(this.resizingDirection, point);
        this.localPos = {
            x: min.x,
            y: min.y,
            w: max.x - min.x,
            h: max.y - min.y,
        };
    }

    onResizeEnd() {
        if (!this.resizingDirection) {
            return;
        }
        this.commitNewPos({
            x: this.maybeRound(this.localPos.x),
            y: this.maybeRound(this.localPos.y),
            w: clamp(this.maybeRound(this.localPos.w), this.bounds[0].x, this.bounds[1].x),
            h: clamp(this.maybeRound(this.localPos.h), this.bounds[0].y, this.bounds[1].y),
        });
        this.resizingDirection = null;
    }

    getResizeDirections(): CanvasResizeDirection[] {
        switch (this.resizable) {
            case 'both':
                return ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
            case 'horizontal':
                return ['e', 'w'];
            case 'vertical':
                return ['n', 's'];
            default:
                return [];
        }
    }

    private getObjectBounds(): Box {
        const min = { x: this.localPos.x, y: this.localPos.y };
        const max = {
            x: this.localPos.x + this.localPos.w,
            y: this.localPos.y + this.localPos.h,
        };
        return [min, max];
    }

    private canResizeInDirection(direction: CanvasResizeDirection) {
        return this.getResizeDirections().includes(direction);
    }

    private recalcLocalPos() {
        const w = this.pos.w ?? this.localPos.w;
        const h = this.pos.h ?? this.localPos.h;
        this.localPos = {
            x: this.pos.x,
            y: this.pos.y,
            w: clamp(w, this.bounds[0].x, this.bounds[1].x),
            h: clamp(h, this.bounds[0].y, this.bounds[1].y),
        };
    }

    private maybeRound(value: number) {
        return this.snapToGrid ? Math.round(value) : value;
    }

    private getResizingUpdates(
        direction: CanvasResizeDirection,
        point: Point,
    ): Box {
        const [min, max] = this.resizingBounds;
        const clampedLeft = clamp(point.x, max.x - this.bounds[1].x, max.x - this.bounds[0].x);
        const clampedRight = clamp(point.x, min.x + this.bounds[0].x, min.x + this.bounds[1].x);
        const clampedTop = clamp(point.y, max.y - this.bounds[1].y, max.y - this.bounds[0].y);
        const clampedBottom = clamp(point.y, min.y + this.bounds[0].y, min.y + this.bounds[1].y);
        switch (direction) {
            case 'n':
                return [{ x: min.x, y: clampedTop }, { x: max.x, y: max.y }];
            case 's':
                return [{ x: min.x, y: min.y }, { x: max.x, y: clampedBottom }];
            case 'w':
                return [{ x: clampedLeft, y: min.y }, { x: max.x, y: max.y }];
            case 'e':
                return [{ x: min.x, y: min.y }, { x: clampedRight, y: max.y }];
            case 'ne':
                return [{ x: min.x, y: clampedTop }, { x: clampedRight, y: max.y }];
            case 'nw':
                return [{ x: clampedLeft, y: clampedTop }, { x: max.x, y: max.y }];
            case 'se':
                return [{ x: min.x, y: min.y }, { x: clampedRight, y: clampedBottom }];
            case 'sw':
                return [{ x: clampedLeft, y: min.y }, { x: max.x, y: clampedBottom }];
            default:
                return [{ x: min.x, y: min.y }, { x: max.x, y: max.y }];
        }
    }

}
