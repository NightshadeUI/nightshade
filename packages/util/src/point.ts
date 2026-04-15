export interface Point {
    x: number;
    y: number;
}

export function pointsEqual(a: Point, b: Point, threshold = 0) {
    return Math.abs(a.x - b.x) <= threshold && Math.abs(a.y - b.y) <= threshold;
}

export function clonePoint(point: Point): Point {
    return { x: point.x, y: point.y };
}

export function addPoints(a: Point, b: Point): Point {
    return {
        x: a.x + b.x,
        y: a.y + b.y,
    };
}

export function subtractPoints(a: Point, b: Point): Point {
    return {
        x: a.x - b.x,
        y: a.y - b.y,
    };
}

export function scalePoint(p: Point, fac: number): Point {
    return {
        x: p.x * fac,
        y: p.y * fac,
    };
}

export function normalizePoint(p: Point): Point {
    const l = Math.hypot(p.x, p.y);
    if (l === 0) {
        return { x: 0, y: 0 };
    }
    return {
        x: p.x / l,
        y: p.y / l,
    };
}
