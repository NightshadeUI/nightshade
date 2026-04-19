import { init } from '@flexent/init-decorator';
import { type Point, subtractPoints } from '@nightshadeui/util/src';
import { dependency } from 'mesh-ioc';

import { CanvasEvents } from './CanvasEvents';
import { CanvasObjectRegistry } from './CanvasObjectRegistry';
import { CanvasSelection } from './CanvasSelection';
import { CanvasSpace } from './CanvasSpace';

export class CanvasMove {

    private events = dependency(this, CanvasEvents);
    private selection = dependency(this, CanvasSelection);
    private objectRegistry = dependency(this, CanvasObjectRegistry);
    private space = dependency(this, CanvasSpace);

    private movingIds = new Set<string>();
    private moveOriginPos: Point | null = null;

    @init()
    init() {
        this.events.dragMove.on(ev => this.onDragMove(ev));
        this.events.dragEnd.on(() => this.stopMovingSelection());
        this.events.unmounted.on(() => this.stopMovingSelection());
    }

    isMoving(objectId: string) {
        return this.movingIds.has(objectId);
    }

    startMovingSelection(ev: MouseEvent) {
        this.movingIds = new Set(this.selection.getSelectedIds());
        this.moveOriginPos = { x: ev.pageX, y: ev.pageY };
        for (const objectId of this.movingIds) {
            const controller = this.objectRegistry.get(objectId);
            controller?.onMoveStart();
        }
    }

    private onDragMove(ev: MouseEvent) {
        if (!this.moveOriginPos) {
            return;
        }
        const localFrom = this.space.pageToLocal(this.moveOriginPos);
        const localTo = this.space.pageToLocal({ x: ev.pageX, y: ev.pageY });
        const offset = subtractPoints(localTo, localFrom);
        for (const objectId of this.movingIds) {
            const controller = this.objectRegistry.get(objectId);
            controller?.onMoveOffset(offset);
        }
    }

    stopMovingSelection() {
        for (const objectId of this.movingIds) {
            const controller = this.objectRegistry.get(objectId);
            controller?.onMoveEnd();
        }
        this.movingIds.clear();
        this.moveOriginPos = null;
    }

}
