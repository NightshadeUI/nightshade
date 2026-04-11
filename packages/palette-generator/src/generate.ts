import {
    DEFAULT_CHROMA_SCALE,
    DEFAULT_LIGHTNESS_SCALE,
    DEFAULT_SCALE_SPECS,
    SCALE_STEPS,
} from './constants.js';
import { PaletteScaleSpec, PaletteSpec } from './types.js';

function reversedCopy(values: number[]): number[] {
    return [...values].reverse();
}

function lightnessStepsForScale(scale: PaletteScaleSpec, lightnessScale: number[]) {
    return scale.reverse ? reversedCopy(lightnessScale) : lightnessScale;
}

type ScaleKey = keyof typeof DEFAULT_SCALE_SPECS;

const CSS_NAMES: Record<ScaleKey, string> = {
    baseLight: 'base-light',
    baseDark: 'base-dark',
    primary: 'primary',
    secondary: 'secondary',
    tertiary: 'tertiary',
    success: 'success',
    warning: 'warning',
    danger: 'danger',
};

const SCALE_ORDER: ScaleKey[] = [
    'baseLight',
    'baseDark',
    'primary',
    'secondary',
    'tertiary',
    'success',
    'warning',
    'danger',
];

function mergedScale(key: ScaleKey, partial?: Partial<PaletteScaleSpec>): PaletteScaleSpec {
    return {
        ...DEFAULT_SCALE_SPECS[key],
        ...partial,
    };
}

export function generatePaletteOklch(palette: PaletteSpec = {}) {
    const lightnessScale = palette.lightnessScale ?? DEFAULT_LIGHTNESS_SCALE;
    const chromaScale = palette.chromaScale ?? DEFAULT_CHROMA_SCALE;
    const out: Record<string, string> = {};
    for (const key of SCALE_ORDER) {
        const scale = mergedScale(key, (palette as any)[key]);
        const L = lightnessStepsForScale(scale, lightnessScale);
        Object.assign(out, generateScaleOklch(CSS_NAMES[key], scale, L, chromaScale));
    }
    return out;
}

export function generateScaleOklch(
    name: string,
    scale: PaletteScaleSpec,
    lightnessScale: number[],
    chromaScale: number[],
) {
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
