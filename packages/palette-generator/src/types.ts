/**
 * One color ramp: a hue sampled along the palette's lightness and chroma curves, or its own.
 * Every ramp is also a tone: the generator emits a `.tone-<name>` context for it.
 */
export interface PaletteRampSpec {
    name: string;
    hue: number;
    /** Multiplier applied to the chroma curve (1 = curve as is). */
    chroma: number;
    /** Multiplier applied to the lightness curve (1 = curve as is). */
    lightness: number;
    /** This ramp's own lightness curve, in place of the palette's. */
    lightnessCurve?: number[];
    /** This ramp's own chroma curve, in place of the palette's. */
    chromaCurve?: number[];
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
