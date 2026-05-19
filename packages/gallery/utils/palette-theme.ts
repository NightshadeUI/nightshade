import { DEFAULT_SCALE_SPECS, PaletteSpec } from '@nightshadeui/palette-generator/src';
import { ref } from 'vue';

const STORAGE_KEY = 'nightshade-gallery-palette';

/** Live palette spec; partial `scales` are expanded in `effectivePaletteForGalleryCss`. */
export const galleryPaletteOverrides = ref<PaletteSpec>({});

/** Fills in default gallery rows when `scales` is missing or only partially overridden. */
export function effectivePaletteForGalleryCss(spec: PaletteSpec): PaletteSpec {
    if (!spec.scales?.length) {
        return { ...spec, scales: [...DEFAULT_SCALE_SPECS] };
    }
    const byName = new Map(spec.scales.map(s => [s.name, s]));
    return {
        ...spec,
        scales: DEFAULT_SCALE_SPECS.map(def => ({
            ...def,
            ...byName.get(def.name),
            name: def.name,
        })),
    };
}

export function loadGalleryPaletteFromStorage() {
    if (typeof localStorage === 'undefined') {
        return;
    }
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            galleryPaletteOverrides.value = JSON.parse(raw) as PaletteSpec;
        }
    } catch {
        /* ignore */
    }
}

export function saveGalleryPaletteToStorage(spec: PaletteSpec) {
    if (typeof localStorage === 'undefined') {
        return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(spec));
}

export function resetGalleryPalette() {
    galleryPaletteOverrides.value = {};
    if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
    }
}
