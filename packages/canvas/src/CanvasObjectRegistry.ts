import { CanvasObjectController } from './CanvasObjectController.js';

export class CanvasObjectRegistry {

    private objects = new Map<string, CanvasObjectController>();

    register(controller: CanvasObjectController) {
        this.objects.set(controller.objectId, controller);
    }

    unregister(objectId: string) {
        this.objects.delete(objectId);
    }

    get(objectId: string) {
        return this.objects.get(objectId) ?? null;
    }

    getAll() {
        return [...this.objects.values()];
    }

}
