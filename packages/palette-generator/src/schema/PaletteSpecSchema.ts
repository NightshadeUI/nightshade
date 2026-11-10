import { Schema } from 'airtight';

import { PaletteSpec } from '../types.js';

/**
 * Decodes palette specs from untrusted JSON (files, stdin, browser storage).
 */
export const PaletteSpecSchema = new Schema<PaletteSpec>({
    type: 'object',
    properties: {
        lightnessCurve: {
            type: 'array',
            items: { type: 'number' },
            optional: true,
        },
        chromaCurve: {
            type: 'array',
            items: { type: 'number' },
            optional: true,
        },
        ramps: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    hue: { type: 'number' },
                    chroma: { type: 'number' },
                    lightness: { type: 'number' },
                },
            },
            optional: true,
        },
    },
});
