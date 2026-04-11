export interface PaletteScaleSpec {
    hue: number;
    int: number;
    lum: number;
    reverse?: boolean;
}

export interface PaletteSpec {
    lightnessScale?: number[];
    chromaScale?: number[];
    cssSelector?: string | false;
    baseLight?: PaletteScaleSpec;
    baseDark?: PaletteScaleSpec;
    primary?: PaletteScaleSpec;
    secondary?: PaletteScaleSpec;
    tertiary?: PaletteScaleSpec;
    success?: PaletteScaleSpec;
    warning?: PaletteScaleSpec;
    danger?: PaletteScaleSpec;
}
