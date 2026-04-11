import { PaletteScaleSpec } from './types.js';

export const SCALE_STEPS = [
    0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

export const DEFAULT_LIGHTNESS_SCALE = [
    1, 0.98, 0.94, 0.88, 0.80, 0.72, 0.64, 0.56, 0.48, 0.42, 0.36, 0.32,
];

export const DEFAULT_CHROMA_SCALE = [
    0.01, 0.02, 0.03, 0.06, 0.09, 0.12, 0.12, 0.09, 0.06, 0.03, 0.02, 0.01,
];

export const DEFAULT_SCALE_SPECS: PaletteScaleSpec[] = [
    { name: 'base-light', hue: 320, int: 0.2, lum: 1 },
    { name: 'base-dark', hue: 340, int: 0.2, lum: 1, reverse: true },
    { name: 'primary', hue: 340, int: 1.2, lum: 1 },
    { name: 'secondary', hue: 172, int: 0.72, lum: 1 },
    { name: 'tertiary', hue: 20, int: 0.25, lum: 1 },
    { name: 'success', hue: 140, int: 1.2, lum: 1 },
    { name: 'warning', hue: 72, int: 1.33, lum: 1.12 },
    { name: 'danger', hue: 24, int: 1.5, lum: 0.9 },
];
