export function getCssVar(el: HTMLElement | null | undefined, name: string, fallback: string) {
    const root = el ?? document.documentElement;
    const value = getComputedStyle(root).getPropertyValue(name).trim();
    return value || fallback;
}

export function getCssVarNumber(el: HTMLElement | null | undefined, name: string, fallback: number) {
    const raw = getCssVar(el, name, String(fallback));
    const parsed = Number(raw.replace(/px|em|%|vh|vw/g, ''));
    return Number.isFinite(parsed) ? parsed : fallback;
}

export function getCssColorVar(el: HTMLElement | null | undefined, name: string, fallback: string) {
    const root = el ?? document.documentElement;
    const value = getCssVar(el, name, fallback);
    const probe = document.createElement('span');
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    probe.style.pointerEvents = 'none';
    probe.style.color = fallback;
    probe.style.color = value;
    root.appendChild(probe);
    const resolved = getComputedStyle(probe).color.trim();
    probe.remove();
    return resolved || fallback;
}
