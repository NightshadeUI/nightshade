import { type Box, boxCenter, type Point } from '@nightshadeui/util/src';

export class CanvasSpace {

    zoom = 1;
    cellSize = 32;
    scrollPos: Point = { x: 0, y: 0 };
    viewportBox: Box = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
    canvasOrigin: Point = { x: 0, y: 0 };
    canvasSize: Point = { x: 0, y: 0 };

    localToCanvas(pos: Point): Point {
        return {
            x: pos.x * this.cellSize + this.canvasOrigin.x,
            y: pos.y * this.cellSize + this.canvasOrigin.y,
        };
    }

    canvasToLocal(pos: Point): Point {
        return {
            x: (pos.x - this.canvasOrigin.x) / this.cellSize,
            y: (pos.y - this.canvasOrigin.y) / this.cellSize,
        };
    }

    viewportToCanvas(pos: Point): Point {
        return {
            x: (pos.x + this.scrollPos.x) / this.zoom,
            y: (pos.y + this.scrollPos.y) / this.zoom,
        };
    }

    canvasToViewport(pos: Point): Point {
        return {
            x: pos.x * this.zoom - this.scrollPos.x,
            y: pos.y * this.zoom - this.scrollPos.y,
        };
    }

    viewportToLocal(pos: Point): Point {
        return this.canvasToLocal(this.viewportToCanvas(pos));
    }

    localToViewport(pos: Point): Point {
        return this.canvasToViewport(this.localToCanvas(pos));
    }

    pageToViewport(pos: Point): Point {
        return {
            x: pos.x - this.viewportBox[0].x,
            y: pos.y - this.viewportBox[0].y,
        };
    }

    pageToCanvas(pos: Point): Point {
        return this.viewportToCanvas(this.pageToViewport(pos));
    }

    pageToLocal(pos: Point): Point {
        return this.canvasToLocal(this.pageToCanvas(pos));
    }

    getViewportCenterInLocal(): Point {
        const viewportCenterInPage = boxCenter(this.viewportBox);
        const viewportCenter = this.pageToViewport(viewportCenterInPage);
        return this.viewportToLocal(viewportCenter);
    }

}
