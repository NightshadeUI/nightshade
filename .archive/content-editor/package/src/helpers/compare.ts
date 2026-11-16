export function getType(value: unknown): string {
    if (value == null) {
        return 'null';
    }
    if (Array.isArray(value)) {
        return 'array';
    }
    return typeof value;
}

export function deepEquals(a: any, b: any): boolean {
    const aType = getType(a);
    const bType = getType(b);
    switch (aType) {
        case 'object':
            return (
                bType === 'object' &&
                Object.keys(a).length === Object.keys(b).length &&
                Object.keys(a).every(k => deepEquals(a[k], b[k])));
        case 'array':
            return (
                bType === 'array' &&
                a.length === b.length &&
                a.every((ca: any, i: number) => deepEquals(ca, b[i])));
        default:
            return a === b;
    }
}
