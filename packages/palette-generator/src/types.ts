export interface PaletteScaleSpec {
    name: string;
    hue: number;
    int: number;
    lum: number;
    reverse?: boolean;
}

export interface PaletteSpec {
    lightnessScale?: number[];
    chromaScale?: number[];
    cssSelector?: string | false;
    scales?: PaletteScaleSpec[];
}
