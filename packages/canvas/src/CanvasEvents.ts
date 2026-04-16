import { Event } from 'nanoevent';

import { CanvasObjectPos } from './CanvasObjectController.js';

export class CanvasEvents {

    mounted = new Event<void>();
    unmounted = new Event<void>();
    selectionChanged = new Event<string[]>();
    dragMove = new Event<MouseEvent>();
    dragEnd = new Event<MouseEvent>();
    objectPosUpdated = new Event<{ objectId: string; pos: CanvasObjectPos }>();

}
