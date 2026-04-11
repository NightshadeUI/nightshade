<template>
    <Btn
        ref="paletteAnchor"
        label="Palette Builder"
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
                    :key="row.name"
                    class="HueRow">
                    <span class="HueLabel">{{ row.label }}</span>
                    <input
                        type="range"
                        min="0"
                        max="360"
                        :value="hue(row.name)"
                        @input="onHue(row.name, Number(($event.target).value))" />
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
</template>

<script>
import { DEFAULT_SCALE_SPECS, generatePaletteCss } from '@nightshadeui/palette-generator/src';

import {
    effectivePaletteForGalleryCss,
    galleryPaletteOverrides,
    resetGalleryPalette,
    saveGalleryPaletteToStorage,
} from '../../utils/palette-theme.js';

const rows = [
    { name: 'base-light', label: 'Base (light)' },
    { name: 'base-dark', label: 'Base (dark)' },
    { name: 'primary', label: 'Primary' },
    { name: 'secondary', label: 'Secondary' },
    { name: 'tertiary', label: 'Tertiary' },
    { name: 'success', label: 'Success' },
    { name: 'warning', label: 'Warning' },
    { name: 'danger', label: 'Danger' },
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
                ...effectivePaletteForGalleryCss(galleryPaletteOverrides.value),
                cssSelector: false,
            });
        },

    },

    methods: {

        open() {
            this.shown = true;
        },

        hue(name) {
            const d = DEFAULT_SCALE_SPECS.find((s) => s.name === name);
            const o = galleryPaletteOverrides.value.scales?.find((s) => s.name === name);
            return o?.hue ?? d.hue;
        },

        onHue(name, value) {
            const d = DEFAULT_SCALE_SPECS.find((s) => s.name === name);
            const scales = [...(galleryPaletteOverrides.value.scales ?? [])];
            const idx = scales.findIndex((s) => s.name === name);
            const merged = { ...d, ...scales[idx], hue: value, name };
            if (idx >= 0) {
                scales[idx] = merged;
            } else {
                scales.push(merged);
            }
            const next = { ...galleryPaletteOverrides.value, scales };
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
.PaletteBuilder {
    margin: var(--sp2) 0;
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

.CssOut {
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
