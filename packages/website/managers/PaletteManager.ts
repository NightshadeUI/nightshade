import {
    DEFAULT_CHROMA_CURVE,
    DEFAULT_LIGHTNESS_CURVE,
    DEFAULT_RAMPS,
    generatePaletteCss,
    generateRampSteps,
    PaletteRampSpec,
    PaletteSpec,
    PaletteSpecSchema,
    RAMP_STEPS,
} from '@nightshadeui/palette-generator/src';
import { clearStored, readStored, writeStored } from '@nightshadeui/util/src';

const STORAGE_KEY = 'nightshade-palette-3';

export type PaletteCurve = 'lightnessCurve' | 'chromaCurve';

/**
 * The site palette: one spec, persisted in local storage and applied to the whole site.
 * Provided as a single reactive instance from the theme's `enhanceApp`.
 */
export class PaletteManager {

    spec: Required<PaletteSpec> = this.createDefaultSpec();

    /** The ramps, and one tone context per ramp: what `nightshade palette` writes. */
    get css() {
        return generatePaletteCss(this.spec);
    }

    get customRamps() {
        return this.spec.ramps.filter(ramp => !this.isStandardRamp(ramp.name));
    }

    get json() {
        return JSON.stringify(this.spec, null, 4);
    }

    get customized() {
        return JSON.stringify(this.spec) !== JSON.stringify(this.createDefaultSpec());
    }

    load() {
        try {
            const spec = PaletteSpecSchema.decode(readStored<unknown>(STORAGE_KEY, {}));
            this.spec = this.completeSpec(spec);
        } catch {
            this.spec = this.createDefaultSpec();
        }
    }

    getRamp(name: string) {
        const ramp = this.spec.ramps.find(ramp => ramp.name === name);
        if (!ramp) {
            throw new Error(`Unknown palette ramp: ${name}`);
        }
        return ramp;
    }

    getRampSteps(name: string) {
        return generateRampSteps(this.getRamp(name), this.spec);
    }

    isStandardRamp(name: string) {
        return DEFAULT_RAMPS.some(ramp => ramp.name === name);
    }

    updateRamp(name: string, update: Partial<PaletteRampSpec>) {
        const ramps = this.spec.ramps.map(ramp => ramp.name === name ? { ...ramp, ...update, name } : ramp);
        this.saveSpec({ ...this.spec, ramps });
    }

    addRamp(name: string) {
        const ramp: PaletteRampSpec = {
            name,
            hue: Math.round(Math.random() * 360),
            chroma: 1,
            lightness: 1,
        };
        this.saveSpec({ ...this.spec, ramps: [...this.spec.ramps, ramp] });
    }

    deleteRamp(name: string) {
        this.saveSpec({ ...this.spec, ramps: this.spec.ramps.filter(ramp => ramp.name !== name) });
    }

    updateCurve(curve: PaletteCurve, index: number, value: number) {
        const values = this.spec[curve].map((current, i) => i === index ? value : current);
        this.saveSpec({ ...this.spec, [curve]: values });
    }

    resetCurve(curve: PaletteCurve) {
        this.saveSpec({ ...this.spec, [curve]: this.createDefaultSpec()[curve] });
    }

    reset() {
        this.spec = this.createDefaultSpec();
        clearStored(STORAGE_KEY);
    }

    private saveSpec(spec: Required<PaletteSpec>) {
        this.spec = spec;
        writeStored(STORAGE_KEY, spec);
    }

    private completeSpec(spec: PaletteSpec): Required<PaletteSpec> {
        const defaults = this.createDefaultSpec();
        const ramps = spec.ramps ?? defaults.ramps;
        const missing = defaults.ramps.filter(ramp => !ramps.some(r => r.name === ramp.name));
        return {
            lightnessCurve: this.completeCurve(spec.lightnessCurve, defaults.lightnessCurve),
            chromaCurve: this.completeCurve(spec.chromaCurve, defaults.chromaCurve),
            ramps: [...missing, ...ramps],
        };
    }

    private completeCurve(curve: number[] | undefined, fallback: number[]) {
        return curve?.length === RAMP_STEPS.length ? curve : fallback;
    }

    private createDefaultSpec(): Required<PaletteSpec> {
        return {
            lightnessCurve: [...DEFAULT_LIGHTNESS_CURVE],
            chromaCurve: [...DEFAULT_CHROMA_CURVE],
            ramps: DEFAULT_RAMPS.map(ramp => ({ ...ramp })),
        };
    }

}
