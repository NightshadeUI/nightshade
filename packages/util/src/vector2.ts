export type Vector2 = [number, number];

export function create(x: number, y: number): Vector2 {
    return [x, y];
}

export function magnitude(vector: Vector2) {
    return Math.hypot(vector[0], vector[1]);
}

export function normalize(vector: Vector2): Vector2 {
    const length = magnitude(vector);
    if (length === 0) {
        return create(0, 0);
    }
    return create(
        vector[0] / length,
        vector[1] / length,
    );
}

export function add(a: Vector2, b: Vector2): Vector2 {
    return create(
        a[0] + b[0],
        a[1] + b[1],
    );
}

export function subtract(a: Vector2, b: Vector2): Vector2 {
    return create(
        a[0] - b[0],
        a[1] - b[1],
    );
}

export function scale(vector: Vector2, scale: number): Vector2 {
    return create(
        vector[0] * scale,
        vector[1] * scale,
    );
}
