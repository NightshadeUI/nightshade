import { readStored, writeStored } from '@nightshadeui/util/src';

import { schemeStorageKey } from '../helpers/commons.js';

export type ColorScheme = 'auto' | 'light' | 'dark';

const SCHEMES: ColorScheme[] = ['auto', 'light', 'dark'];

/**
 * Site color scheme. `auto` follows the OS; the others pin `data-theme` on `<html>`.
 */
export class AppearanceManager {

    scheme: ColorScheme = 'auto';

    load() {
        const stored = readStored<unknown>(schemeStorageKey, 'auto');
        this.scheme = SCHEMES.find(scheme => scheme === stored) ?? 'auto';
        this.applyScheme();
    }

    setScheme(scheme: ColorScheme) {
        this.scheme = scheme;
        writeStored(schemeStorageKey, scheme);
        this.applyScheme();
    }

    private applyScheme() {
        if (this.scheme === 'auto') {
            delete document.documentElement.dataset.theme;
        } else {
            document.documentElement.dataset.theme = this.scheme;
        }
    }

}
