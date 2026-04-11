<template>
    <div class="AdjustPalette">
        <Btn
            ref="paletteAnchor"
            class="Trigger"
            label="Adjust Palette"
            kind="secondary"
            block
            @click="open" />
        <ContextPopup
            v-if="shown"
            anchor-ref="paletteAnchor"
            @hide="shown = false">
            <VGroup
                gap="m"
                class="Panel">
                <div class="HueList">
                    <div
                        v-for="row in rows"
                        :key="row.key"
                        class="HueRow">
                        <span class="HueLabel">{{ row.label }}</span>
                        <input
                            type="range"
                            min="0"
                            max="360"
                            :value="hue(row.key)"
                            @input="onHue(row.key, Number(($event.target).value))" />
                    </div>
                </div>
                <textarea
                    class="CssOut"
                    readonly
                    rows="10"
                    :value="cssCopyText" />
                <Btn
                    label="Reset to defaults"
                    kind="tertiary"
                    block
                    @click="onReset" />
            </VGroup>
        </ContextPopup>
    </div>
</template>

<script>
import { DEFAULT_SCALE_SPECS, generatePaletteCss } from '@nightshadeui/palette-generator/src';

import {
    galleryPaletteOverrides,
    resetGalleryPalette,
    saveGalleryPaletteToStorage,
} from '../../utils/palette-theme.js';

const rows = [
    { key: 'baseLight', label: 'Base (light)' },
    { key: 'baseDark', label: 'Base (dark)' },
    { key: 'primary', label: 'Primary' },
    { key: 'secondary', label: 'Secondary' },
    { key: 'tertiary', label: 'Tertiary' },
    { key: 'success', label: 'Success' },
    { key: 'warning', label: 'Warning' },
    { key: 'danger', label: 'Danger' },
];

export default {

    data() {
        return {
            shown: false,
            rows,
        };
    },

    computed: {

        cssCopyText() {
            return generatePaletteCss({
                ...galleryPaletteOverrides.value,
                cssSelector: false,
            });
        },

    },

    methods: {

        open() {
            this.shown = true;
        },

        hue(key) {
            const d = DEFAULT_SCALE_SPECS[key];
            return galleryPaletteOverrides.value[key]?.hue ?? d.hue;
        },

        onHue(key, value) {
            const d = DEFAULT_SCALE_SPECS[key];
            const next = {
                ...galleryPaletteOverrides.value,
                [key]: { ...d, ...galleryPaletteOverrides.value[key], hue: value },
            };
            galleryPaletteOverrides.value = next;
            saveGalleryPaletteToStorage(next);
        },

        onReset() {
            resetGalleryPalette();
        },

    },

};
</script>

<style scoped>
.AdjustPalette {
    margin: var(--sp2) 0;
}

.Trigger {
    width: 100%;
}

.Panel {
    padding: var(--sp2);
    min-width: min(90vw, 20rem);
    max-width: min(90vw, 24rem);
}

.HueList {
    display: flex;
    flex-direction: column;
    gap: var(--sp-xs);
    max-height: 40vh;
    overflow-y: auto;
    padding-right: var(--sp-xxs);
}

.HueRow {
    display: grid;
    grid-template-columns: 6.5rem 1fr;
    align-items: center;
    gap: var(--sp);
    font-size: var(--font-size-s);
}

.HueLabel {
    color: var(--color-base-600);
}

input[type="range"] {
    width: 100%;
}

.CssOut {
    width: 100%;
    box-sizing: border-box;
    padding: var(--sp);
    border-radius: var(--border-radius);
    border: 1px solid var(--color-base-200);
    background: var(--color-base-50);
    font-family: ui-monospace, monospace;
    font-size: var(--font-size-xs);
    line-height: 1.4;
    resize: vertical;
    min-height: 8rem;
    color: var(--color-base-800);
}
</style>
