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
        @hide="shown = false"
        :overlayShown="false"
        :overlayEnabled="false">
        <VGroup
            gap="m"
            class="Panel">
            <HGroup
                v-for="row in rows"
                :key="row.name"
                class="PaletteRow">
                <div class="PaletteLabel">
                    {{ row.label }}
                </div>
                <div class="ControlCell">
                    <input
                        type="number"
                        class="NumInput"
                        min="0"
                        max="360"
                        step="1"
                        :value="hue(row.name)"
                        :aria-label="`${row.label} hue (numeric)`"
                        @input="commitScaleNumber(row.name, 'hue', 0, 360, $event)" />
                    <input
                        type="range"
                        min="0"
                        max="360"
                        :value="hue(row.name)"
                        :aria-label="`${row.label} hue`"
                        @input="onScaleProp(row.name, { hue: Number(($event.target).value) })" />
                </div>
                <div class="ControlCell">
                    <input
                        type="number"
                        class="NumInput"
                        min="0"
                        max="2"
                        step="0.01"
                        :value="intensity(row.name)"
                        :aria-label="`${row.label} intensity (numeric)`"
                        @input="commitScaleNumber(row.name, 'int', 0, 2, $event)" />
                    <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.01"
                        :value="intensity(row.name)"
                        :aria-label="`${row.label} intensity`"
                        @input="onScaleProp(row.name, { int: Number(($event.target).value) })" />
                </div>
                <div class="ControlCell">
                    <input
                        type="number"
                        class="NumInput"
                        min="0.5"
                        max="1.5"
                        step="0.01"
                        :value="luminance(row.name)"
                        :aria-label="`${row.label} luminance (numeric)`"
                        @input="commitScaleNumber(row.name, 'lum', 0.5, 1.5, $event)" />
                    <input
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.01"
                        :value="luminance(row.name)"
                        :aria-label="`${row.label} luminance`"
                        @input="onScaleProp(row.name, { lum: Number(($event.target).value) })" />
                </div>
            </HGroup>
            <textarea
                class="CssOut"
                readonly
                rows="10"
                :value="cssCopyText" />
            <HGroup>
                <Btn
                    label="Close"
                    kind="tertiary"
                    block
                    @click="close" />
                <Btn
                    label="Copy to clipboard"
                    kind="tertiary"
                    block
                    @click="copyToClipboard(cssCopyText)" />
                <Btn
                    label="Reset to defaults"
                    kind="tertiary"
                    block
                    @click="onReset" />
            </HGroup>
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
            justCopied: false,
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

        close() {
            this.shown = false;
        },

        open() {
            this.shown = true;
        },

        hue(name) {
            const d = DEFAULT_SCALE_SPECS.find((s) => s.name === name);
            const o = galleryPaletteOverrides.value.scales?.find((s) => s.name === name);
            return o?.hue ?? d.hue;
        },

        intensity(name) {
            const d = DEFAULT_SCALE_SPECS.find((s) => s.name === name);
            const o = galleryPaletteOverrides.value.scales?.find((s) => s.name === name);
            return o?.int ?? d.int;
        },

        luminance(name) {
            const d = DEFAULT_SCALE_SPECS.find((s) => s.name === name);
            const o = galleryPaletteOverrides.value.scales?.find((s) => s.name === name);
            return o?.lum ?? d.lum;
        },

        onScaleProp(name, partial) {
            const d = DEFAULT_SCALE_SPECS.find((s) => s.name === name);
            const scales = [...(galleryPaletteOverrides.value.scales ?? [])];
            const idx = scales.findIndex((s) => s.name === name);
            const merged = { ...d, ...scales[idx], ...partial, name };
            if (idx >= 0) {
                scales[idx] = merged;
            } else {
                scales.push(merged);
            }
            const next = { ...galleryPaletteOverrides.value, scales };
            galleryPaletteOverrides.value = next;
            saveGalleryPaletteToStorage(next);
        },

        commitScaleNumber(name, key, min, max, event) {
            const raw = event.target.value;
            if (raw === '' || raw === '-') {
                return;
            }
            const n = Number(raw);
            if (!Number.isFinite(n)) {
                return;
            }
            const v = Math.min(max, Math.max(min, n));
            this.onScaleProp(name, { [key]: v });
        },

        onReset() {
            resetGalleryPalette();
        },

        copyToClipboard() {
            navigator.clipboard.writeText(this.cssCopyText);
            this.justCopied = true;
            setTimeout(() => {
                this.justCopied = false;
            }, 2000);
        },

    },

};
</script>

<style scoped>
.Panel {
    font-size: var(--font-size-s);
    padding: var(--sp2);
}

.PaletteLabel {
    width: 120px;
    color: var(--color-base-600);
}

.PaletteRow {
    align-items: baseline;
}

.ControlCell {
    display: flex;
    flex-flow: column;
    flex: 0 0 96px;
    width: 96px;
    gap: var(--sp-xs);
}

.ControlCell input[type='range'] {
    height: 8px;
}

.NumInput {
    box-sizing: border-box;
    padding: var(--sp-xxs) var(--sp-xs);
    border-radius: var(--border-radius);
    border: 1px solid var(--color-base-200);
    background: var(--color-base-50);
    font-size: var(--font-size-xs);
    font-variant-numeric: tabular-nums;
    color: var(--color-base-800);
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
