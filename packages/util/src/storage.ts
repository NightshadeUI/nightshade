export type StorageArea = 'local' | 'session';

/**
 * JSON values in browser storage that never throw.
 * Private browsing, quota and SSR all fall back to the given default.
 * Values read back are untrusted: decode them before use.
 */
export function readStored<T>(key: string, fallback: T, area: StorageArea = 'local'): T {
    try {
        const raw = storageArea(area)?.getItem(key);
        return raw == null ? fallback : JSON.parse(raw);
    } catch {
        return fallback;
    }
}

export function writeStored(key: string, value: unknown, area: StorageArea = 'local') {
    try {
        storageArea(area)?.setItem(key, JSON.stringify(value));
    } catch {
        // Quota or private browsing: the value just does not persist.
    }
}

export function clearStored(key: string, area: StorageArea = 'local') {
    try {
        storageArea(area)?.removeItem(key);
    } catch {
        // Private browsing: nothing was stored.
    }
}

function storageArea(area: StorageArea): Storage | undefined {
    return area === 'local' ? globalThis.localStorage : globalThis.sessionStorage;
}
