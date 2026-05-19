import {
    DEFAULT_CHROMA_SCALE,
    DEFAULT_LIGHTNESS_SCALE,
    DEFAULT_SCALE_SPECS,
    SCALE_STEPS,
} from './constants.js';
import { PaletteScaleSpec, PaletteSpec } from './types.js';

export function generatePaletteOklch(palette: PaletteSpec = {}) {
    const lightnessScale = palette.lightnessScale ?? DEFAULT_LIGHTNESS_SCALE;
    const chromaScale = palette.chromaScale ?? DEFAULT_CHROMA_SCALE;
    const out: Record<string, string> = {};
    for (const scale of palette.scales ?? DEFAULT_SCALE_SPECS) {
        const lightness = scale.reverse ? lightnessScale.toReversed() : lightnessScale;
        Object.assign(out, generateScaleOklch(scale, lightness, chromaScale));
    }
    return out;
}

export function generateScaleOklch(
    scale: PaletteScaleSpec,
    lightnessScale: number[],
    chromaScale: number[],
) {
    const { name } = scale;
    const variables: Record<string, string> = {};
    const textColor = generateTextColor(scale, lightnessScale, chromaScale);
    variables[`--color-${name}-text`] = textColor;
    for (const [index, step] of SCALE_STEPS.entries()) {
        const varName = `--color-${name}-${step}`;
        const l = scale.lum * lightnessScale[index]!;
        const c = scale.int * chromaScale[index]!;
        const oklch = `oklch(${l} ${c} ${scale.hue})`;
        variables[varName] = oklch;
    }
    return variables;
}

export function generateTextColor(
    scale: PaletteScaleSpec,
    lightnessScale: number[],
    chromaScale: number[],
) {
    const l = scale.lum * lightnessScale[6]!;
    const c = scale.int * chromaScale[6]!;
    return contrastColor(l, c);
}

export function generatePaletteCss(palette: PaletteSpec = {}) {
    const selector = palette.cssSelector === undefined ? ':root' : palette.cssSelector;
    const variables = generatePaletteOklch(palette);
    const body = Object.entries(variables)
        .map(([key, value]) => `  ${key}: ${value};`)
        .join('\n');
    if (selector === false) {
        return Object.entries(variables)
            .map(([key, value]) => `${key}: ${value};`)
            .join('\n');
    }
    return `${selector} {\n${body}\n}`;
}

export function contrastColor(l: number, c: number) {
    return l > 0.62 + 0.8 * c ? '#000' : '#fff';
}
