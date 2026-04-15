import { clamp } from './math.js';
import { Point, pointsEqual, scalePoint } from './point.js';

export type Box = [Point, Point];

export function boxFromPoints(a: Point, b: Point): Box {
    const min = { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y) };
    const max = { x: Math.max(a.x, b.x), y: Math.max(a.y, b.y) };
    return [min, max];
}

export function boxOverlap(a: Box, b: Box): boolean {
    // https://stackoverflow.com/questions/20925818/algorithm-to-check-if-two-boxes-overlap
    const xOverlap = a[1].x >= b[0].x && b[1].x >= a[0].x;
    const yOverlap = a[1].y >= b[0].y && b[1].y >= a[0].y;
    return xOverlap && yOverlap;
}

export function boxContains(box: Box, point: Point): boolean {
    return boxOverlap(box, [point, point]);
}

export function boxCovers(boundingBox: Box, box: Box): boolean {
    const [a, b] = boundingBox;
    const [c, d] = box;
    return a.x <= c.x && a.y <= c.y && b.x >= d.x && b.y >= d.y;
}

export function boxEquals(a: Box, b: Box) {
    return pointsEqual(a[0], b[0]) && pointsEqual(a[1], b[1]);
}

export function boxScale(box: Box, scale: number) {
    return boxFromPoints(scalePoint(box[0], scale), scalePoint(box[1], scale));
}

export function boxCenter(box: Box): Point {
    const [min, max] = box;
    return {
        x: (max.x - min.x) * .5 + min.x,
        y: (max.y - min.y) * .5 + min.y,
    };
}

export function boundingBox(a: Box, b: Box): Box {
    return [
        {
            x: Math.min(a[0].x, b[0].x),
            y: Math.min(a[0].y, b[0].y),
        },
        {
            x: Math.max(a[1].x, b[1].x),
            y: Math.max(a[1].y, b[1].y),
        },
    ];
}

export function boxArea(box: Box) {
    const a = Math.abs(box[0].x - box[1].x);
    const b = Math.abs(box[0].y - box[1].y);
    return a * b;
}

export function clampPointToBox(point: Point, box: Box): Point {
    return {
        x: clamp(point.x, box[0].x, box[1].x),
        y: clamp(point.y, box[0].y, box[1].y),
    };
}
