import { Schema } from 'airtight';

import { RAMP_NAME_PATTERN } from '../constants.js';
import { PaletteSpec } from '../types.js';

/**
 * Decodes palette specs from untrusted JSON (files, stdin, browser storage): shapes, ramp names and ranges.
 * What spans the whole spec (curve lengths, unique, required and reserved names) the generator checks.
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
                    name: {
                        type: 'string',
                        regex: RAMP_NAME_PATTERN,
                    },
                    hue: {
                        type: 'number',
                        minimum: 0,
                        maximum: 360,
                    },
                    chroma: {
                        type: 'number',
                        minimum: 0,
                    },
                    lightness: {
                        type: 'number',
                        minimum: 0,
                    },
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
                },
            },
            optional: true,
        },
    },
});
