import { PaletteSpec } from '@nightshadeui/palette-generator/src';
import { ref } from 'vue';

const STORAGE_KEY = 'nightshade-gallery-palette';

/** Live overrides merged with package defaults by the generator. */
export const galleryPaletteOverrides = ref<PaletteSpec>({});

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
