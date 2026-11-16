import {
    DEFAULT_CHROMA_CURVE,
    DEFAULT_LIGHTNESS_CURVE,
    DEFAULT_RAMPS,
    RAMP_ANCHOR_INDEX,
    RAMP_STEPS,
    REQUIRED_RAMPS,
    RESERVED_RAMPS,
} from './constants.js';
import { PaletteRampSpec, PaletteSpec, RampStep } from './types.js';

/**
 * Emits every ramp as scheme-aware CSS values: `light-dark(<light>, <dark>)`.
 * The dark ramp is the light ramp mirrored, so a step keeps its meaning in both schemes:
 * `0` is always the canvas end, `950` always the ink end.
 * Throws when the palette lacks a ramp the styles read by name, names a ramp twice or takes a reserved name,
 * or has a curve (its own or a ramp's) without one value per step.
 */
export function generatePaletteOklch(palette: PaletteSpec = {}) {
    const ramps = palette.ramps ?? DEFAULT_RAMPS;
    checkPalette(palette, ramps);
    const out: Record<string, string> = {};
    for (const ramp of ramps) {
        Object.assign(out, generateRampOklch(ramp, palette));
    }
    return out;
}

export function generateRampOklch(ramp: PaletteRampSpec, palette: PaletteSpec = {}) {
    const light = generateRampSteps(ramp, palette);
    const dark = light.toReversed();
    const variables: Record<string, string> = {
        [`--color-${ramp.name}-contrast`]: schemeValue(
            contrastColor(light[RAMP_ANCHOR_INDEX]!),
            contrastColor(dark[RAMP_ANCHOR_INDEX]!),
        ),
    };
    for (const [index, { step }] of light.entries()) {
        variables[`--color-${ramp.name}-${step}`] = schemeValue(
            formatOklch(light[index]!),
            formatOklch(dark[index]!),
        );
    }
    return variables;
}

/**
 * Samples one ramp along its curves, as the light scheme sees it.
 * A ramp's own curve takes the place of the palette's; the multipliers apply to either.
 */
export function generateRampSteps(ramp: PaletteRampSpec, palette: PaletteSpec = {}): RampStep[] {
    const lightnessCurve = ramp.lightnessCurve ?? palette.lightnessCurve ?? DEFAULT_LIGHTNESS_CURVE;
    const chromaCurve = ramp.chromaCurve ?? palette.chromaCurve ?? DEFAULT_CHROMA_CURVE;
    return RAMP_STEPS.map((step, index) => {
        return {
            step,
            lightness: round(ramp.lightness * lightnessCurve[index]!),
            chroma: round(ramp.chroma * chromaCurve[index]!),
            hue: ramp.hue,
        };
    });
}

/**
 * Emits the tone context of one ramp: `.tone-<name>` points the context ramp
 * (`--tone-0` … `--tone-950`, `--tone-contrast`) at the ramp.
 */
export function generateToneCss(name: string) {
    const lines = [
        ...RAMP_STEPS.map(step => `--tone-${step}: var(--color-${name}-${step});`),
        `--tone-contrast: var(--color-${name}-contrast);`,
    ];
    return wrapDeclarations(`.tone-${name}`, lines);
}

/**
 * Emits the palette: the ramps under `selector`, then one tone context per ramp.
 * With `selector` set to `null`, emits bare ramp declarations only.
 */
export function generatePaletteCss(palette: PaletteSpec = {}, selector: string | null = ':root') {
    const lines = Object.entries(generatePaletteOklch(palette))
        .map(([key, value]) => `${key}: ${value};`);
    if (selector == null) {
        return lines.join('\n');
    }
    const tones = (palette.ramps ?? DEFAULT_RAMPS).map(ramp => generateToneCss(ramp.name));
    return [wrapDeclarations(selector, lines), ...tones].join('\n\n');
}

export function contrastColor({ lightness, chroma }: RampStep) {
    return lightness > 0.62 + 0.8 * chroma ? '#000' : '#fff';
}

function formatOklch({ lightness, chroma, hue }: RampStep) {
    return `oklch(${lightness} ${chroma} ${hue})`;
}

function schemeValue(light: string, dark: string) {
    return light === dark ? light : `light-dark(${light}, ${dark})`;
}

function wrapDeclarations(selector: string, lines: string[]) {
    return `${selector} {\n${lines.map(line => `    ${line}`).join('\n')}\n}`;
}

function round(value: number) {
    return Math.round(value * 10000) / 10000;
}

function checkPalette(palette: PaletteSpec, ramps: PaletteRampSpec[]) {
    const names = ramps.map(ramp => ramp.name);
    const missing = REQUIRED_RAMPS.filter(name => !names.includes(name));
    if (missing.length > 0) {
        throw new Error(`A palette needs these ramps, which the styles read by name: ${missing.join(', ')}.`);
    }
    const repeated = names.filter((name, index) => names.indexOf(name) !== index);
    if (repeated.length > 0) {
        throw new Error(`A palette names each ramp once: ${repeated.join(', ')}.`);
    }
    const reserved = names.filter(name => RESERVED_RAMPS.includes(name));
    if (reserved.length > 0) {
        throw new Error(`These ramp names are reserved: ${reserved.join(', ')}.`);
    }
    const curves = [palette, ...ramps].flatMap(owner => [owner.lightnessCurve, owner.chromaCurve]);
    if (curves.some(curve => curve && curve.length !== RAMP_STEPS.length)) {
        throw new Error(`A palette's curves, and its ramps' own, have one value per step: ${RAMP_STEPS.length} values each.`);
    }
}
