import { PaletteRampSpec } from './types.js';

export const RAMP_STEPS = [
    0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
];

/** Index of step 500: the step that `-contrast` is computed against. */
export const RAMP_ANCHOR_INDEX = 6;

/**
 * Ramps the styles read by name: `base` for the canvas and the neutral tones,
 * `primary` and `secondary` for brand accents (neutral controls focus in `secondary`).
 */
export const REQUIRED_RAMPS = ['base', 'primary', 'secondary'];

/** Ramp names the generator won't take: `inverse` is the mirrored `base` tone the styles define. */
export const RESERVED_RAMPS = ['inverse'];

/** Ramp names are lowercase kebab-case, so each one makes a valid `.tone-<name>` class. */
export const RAMP_NAME_PATTERN = '^[a-z][a-z0-9]*(-[a-z0-9]+)*$';

export const DEFAULT_LIGHTNESS_CURVE = [
    1, 0.98, 0.94, 0.88, 0.80, 0.72, 0.64, 0.56, 0.48, 0.42, 0.36, 0.32,
];

export const DEFAULT_CHROMA_CURVE = [
    0.01, 0.02, 0.03, 0.06, 0.09, 0.12, 0.12, 0.09, 0.06, 0.03, 0.02, 0.01,
];

export const DEFAULT_RAMPS: PaletteRampSpec[] = [
    {
        name: 'base',
        hue: 320,
        chroma: 0.2,
        lightness: 1,
    },
    {
        name: 'primary',
        hue: 340,
        chroma: 1.2,
        lightness: 1,
    },
    {
        name: 'secondary',
        hue: 172,
        chroma: 0.72,
        lightness: 1,
    },
    {
        name: 'tertiary',
        hue: 20,
        chroma: 0.25,
        lightness: 1,
    },
    {
        name: 'success',
        hue: 140,
        chroma: 1.2,
        lightness: 1,
    },
    {
        name: 'warning',
        hue: 72,
        chroma: 1.33,
        lightness: 1.12,
    },
    {
        name: 'danger',
        hue: 24,
        chroma: 1.5,
        lightness: 0.9,
    },
];
