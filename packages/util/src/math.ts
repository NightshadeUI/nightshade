export function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
}

export function quantize(value: number, min: number, step: number) {
    if (!step) {
        return value;
    }
    const steps = Math.round((value - min) / step);
    return min + steps * step;
}
