<script setup>
import { onMounted, watchEffect } from 'vue';
import { generatePaletteCss } from '@nightshadeui/palette-generator/src';

import {
    effectivePaletteForGalleryCss,
    galleryPaletteOverrides,
    loadGalleryPaletteFromStorage,
} from '../../utils/palette-theme.js';

const STYLE_ID = 'gallery-palette-override';

onMounted(() => {
    loadGalleryPaletteFromStorage();
});

watchEffect(() => {
    if (typeof document === 'undefined' || typeof document.getElementById !== 'function') {
        return;
    }
    const css = generatePaletteCss(effectivePaletteForGalleryCss(galleryPaletteOverrides.value));
    let el = document.getElementById(STYLE_ID);
    if (!el) {
        el = document.createElement('style');
        el.id = STYLE_ID;
        document.head.appendChild(el);
    }
    el.textContent = css;
});
</script>

<template />
