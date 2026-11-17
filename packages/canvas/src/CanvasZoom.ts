import { clamp } from '@nightshadeui/util';
import { dependency } from 'mesh-ioc';

import { CanvasSpace } from './CanvasSpace.js';
import { CanvasViewport } from './CanvasViewport.js';

const ZOOM_STEPS = [0.33, 0.5, 0.6, 0.75, 0.85, 1, 1.15, 1.25, 1.5, 1.75, 2];
const ZOOM_MIN = Math.min(...ZOOM_STEPS);
const ZOOM_MAX = Math.max(...ZOOM_STEPS);

export class CanvasZoom {

    viewport = dependency(this, CanvasViewport);
    space = dependency(this, CanvasSpace);

    onWheel(ev: WheelEvent) {
        if (!ev.ctrlKey) {
            return;
        }
        ev.preventDefault();
        const delta = clamp(ev.deltaY, -40, 40) / 400;
        const zoomFactor = Math.exp(-delta);
        this.setZoom(this.space.zoom * zoomFactor);
    }

    setZoom(newZoom: number) {
        const viewCenter = this.space.getViewportCenterInLocal();
        this.space.zoom = clamp(newZoom, ZOOM_MIN, ZOOM_MAX);
        this.viewport.scrollToLocalPoint(viewCenter);
    }

    zoomIn() {
        const index = this.getClosestZoomStepIndex();
        if (index < ZOOM_STEPS.length - 1) {
            this.setZoom(ZOOM_STEPS[index + 1]);
        }
    }

    zoomOut() {
        const index = this.getClosestZoomStepIndex();
        if (index > 0) {
            this.setZoom(ZOOM_STEPS[index - 1]);
        }
    }

    private getClosestZoomStepIndex() {
        let closestIndex = 0;
        let minDelta = Number.POSITIVE_INFINITY;
        for (let index = 0; index < ZOOM_STEPS.length; index++) {
            const delta = Math.abs(ZOOM_STEPS[index] - this.space.zoom);
            if (delta < minDelta) {
                minDelta = delta;
                closestIndex = index;
            }
        }
        return closestIndex;
    }

}
