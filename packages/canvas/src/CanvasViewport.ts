import {
    createGridDotsSvg,
    DomEventProxy,
    getCssColorVar,
    getCssVarNumber,
    type Point,
} from '@nightshadeui/util/src';
import { dependency } from 'mesh-ioc';

import { CanvasConfig } from './CanvasConfig.js';
import { CanvasSpace } from './CanvasSpace.js';

/**
 * Coordinate systems:
 * - page: MouseEvent pageX/pageY.
 * - viewport: (0, 0) at viewport element top-left, unscaled.
 * - canvas: (0, 0) at canvas content top-left, scaled by zoom.
 * - local: (0, 0) at canvas origin, measured in cell units.
 */
export class CanvasViewport {

    viewportEl: HTMLElement | null = null;

    private windowEvents = new DomEventProxy(window);
    private config = dependency(this, CanvasConfig);
    private space = dependency(this, CanvasSpace);

    mount(viewportEl: HTMLElement) {
        this.viewportEl = viewportEl;
        this.recalcCanvasMetrics();
        this.updateViewportBox();
        this.centerOnOrigin();
        this.onScroll();
        this.windowEvents.add('resize', () => this.updateViewportBox());
        this.windowEvents.add('scroll', () => this.updateViewportBox());
        if (this.config.autoCenter) {
            requestAnimationFrame(() => this.centerOnOrigin());
        }
    }

    destroy() {
        this.windowEvents.removeAll();
        this.viewportEl = null;
        this.space.viewportBox = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
    }

    getCanvasStyle() {
        const majorColor = getCssColorVar(this.viewportEl, '--canvas-grid-major-color', '#ddd');
        const minorColor = getCssColorVar(this.viewportEl, '--canvas-grid-minor-color', '#eee');
        const subdivisions = getCssVarNumber(this.viewportEl, '--canvas-grid-subdivisions', 4);
        const majorRadius = getCssVarNumber(this.viewportEl, '--canvas-grid-major-radius', 2);
        const minorRadius = getCssVarNumber(this.viewportEl, '--canvas-grid-minor-radius', 1);
        const svg = createGridDotsSvg(
            this.space.cellSize,
            subdivisions,
            majorColor,
            majorRadius,
            minorColor,
            minorRadius,
        );
        const url = `data:image/svg+xml;base64,${window.btoa(svg)}`;
        return {
            background: `url(${url}) repeat`,
            width: `${this.space.canvasSize.x}px`,
            height: `${this.space.canvasSize.y}px`,
            transformOrigin: '0 0',
            transform: `scale(${this.space.zoom})`,
        };
    }

    getOriginStyle() {
        return {
            left: `${this.space.canvasOrigin.x}px`,
            top: `${this.space.canvasOrigin.y}px`,
        };
    }

    getSizerStyle() {
        // The scaled scroll area keeps viewport scrollbars synced with transform: scale.
        return {
            width: `${this.space.canvasSize.x * this.space.zoom}px`,
            height: `${this.space.canvasSize.y * this.space.zoom}px`,
        };
    }

    onScroll() {
        if (!this.viewportEl) {
            return;
        }
        this.space.scrollPos = {
            x: this.viewportEl.scrollLeft,
            y: this.viewportEl.scrollTop,
        };
        // this.updateViewportBox();
    }

    centerOnOrigin() {
        if (!this.viewportEl) {
            return;
        }
        const viewportSize = this.getViewportSize();
        this.setViewportScroll({
            x: this.space.canvasOrigin.x * this.space.zoom - viewportSize.x * 0.5,
            y: this.space.canvasOrigin.y * this.space.zoom - viewportSize.y * 0.5,
        });
    }

    scrollBy(dx: number, dy: number) {
        if (!this.viewportEl) {
            return;
        }
        this.setViewportScroll({
            x: this.viewportEl.scrollLeft + dx,
            y: this.viewportEl.scrollTop + dy,
        });
    }

    scrollToLocalPoint(pos: Point) {
        const viewportSize = this.getViewportSize();
        const canvasPos = this.space.localToCanvas(pos);
        this.setViewportScroll({
            x: canvasPos.x * this.space.zoom - viewportSize.x * 0.5,
            y: canvasPos.y * this.space.zoom - viewportSize.y * 0.5,
        });
    }

    private setViewportScroll(pos: Point) {
        if (!this.viewportEl) {
            return;
        }
        this.viewportEl.scrollTo({
            left: Math.max(0, pos.x),
            top: Math.max(0, pos.y),
            behavior: 'auto',
        });
        this.onScroll();
    }

    private updateViewportBox() {
        if (!this.viewportEl) {
            this.space.viewportBox = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
            return;
        }
        const rect = this.viewportEl.getBoundingClientRect();
        this.space.viewportBox = [
            { x: rect.left, y: rect.top },
            { x: rect.right, y: rect.bottom },
        ];
    }

    private getViewportSize() {
        return {
            x: this.space.viewportBox[1].x - this.space.viewportBox[0].x,
            y: this.space.viewportBox[1].y - this.space.viewportBox[0].y,
        };
    }

    private recalcCanvasMetrics() {
        const marginCells = getCssVarNumber(this.viewportEl, '--canvas-margin-cells', 64);
        this.space.cellSize = getCssVarNumber(this.viewportEl, '--canvas-grid-cell-size', 32);
        const margin = marginCells * this.space.cellSize;
        this.space.canvasSize = { x: margin * 2, y: margin * 2 };
        this.space.canvasOrigin = { x: margin, y: margin };
    }

}
