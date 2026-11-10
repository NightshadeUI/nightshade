/**
 * One color ramp: a hue sampled along the shared lightness and chroma curves.
 * Every ramp is also a tone: the generator emits a `.tone-<name>` context for it.
 */
export interface PaletteRampSpec {
    name: string;
    hue: number;
    /** Multiplier applied to the chroma curve (1 = curve as is). */
    chroma: number;
    /** Multiplier applied to the lightness curve (1 = curve as is). */
    lightness: number;
}

export interface PaletteSpec {
    lightnessCurve?: number[];
    chromaCurve?: number[];
    ramps?: PaletteRampSpec[];
}

export interface RampStep {
    step: number;
    lightness: number;
    chroma: number;
    hue: number;
}
