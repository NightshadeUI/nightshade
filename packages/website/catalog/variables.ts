/**
 * The variable catalog: every variable the styles declare, grouped by tier,
 * with how far each one is meant to be overridden.
 * A pattern entry (`--sp<step>`) stands for a whole family; `members` lists them for search.
 */

export type VariableTier = 'raw' | 'context' | 'role' | 'component';

/**
 * How it goes when you override it:
 * - `yours`: a knob, made for overriding;
 * - `tune`: a sensible default, fine to change;
 * - `care`: reaches far; fine for a specific look, check every tone and both schemes;
 * - `avoid`: works against the system; a better knob exists.
 */
export type VariableStance = 'yours' | 'tune' | 'care' | 'avoid';

export type VariablePreview = 'color' | 'length' | 'radius' | 'shadow' | 'text' | 'font' | 'none';

export interface VariableEntry {
    name: string;
    members?: string[];
    value: string;
    about: string;
    stance: VariableStance;
    instead?: string;
    preview: VariablePreview;
    sample?: string;
}

export interface VariableGroup {
    id: string;
    tier: VariableTier;
    title: string;
    note: string;
    file: string;
    entries: VariableEntry[];
}

export interface VariableTierInfo {
    id: VariableTier;
    title: string;
    note: string;
}

export interface VariableStanceInfo {
    id: VariableStance;
    title: string;
    tone: string;
    icon: string;
    note: string;
}

const SP_STEPS = [
    '0-25', '0-5', '1', '1-5', '2', '2-5', '3', '4', '5', '6', '7', '8', '9', '10',
    '12', '16', '20', '24', '28', '32', '36', '40', '44', '48', '52', '56', '60', '64',
    '68', '72', '76', '80', '84', '88', '92', '96', '100',
];
const RAMP_STEPS = ['0', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
const TWELFTHS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const SIZES = ['xs', 's', 'm', 'l', 'xl'];
const METRICS = ['major-height', 'minor-height', 'major-padding', 'minor-padding', 'gap', 'font-size'];

export const VARIABLE_STANCES: VariableStanceInfo[] = [
    {
        id: 'yours',
        title: 'Made for you',
        tone: 'success',
        icon: 'fas fa-hand-pointer',
        note: 'The knobs. Set them at your :root, and everything downstream follows.',
    },
    {
        id: 'tune',
        title: 'Tune to fit',
        tone: 'secondary',
        icon: 'fas fa-sliders',
        note: 'A sensible default that some systems want different. Change it, and look at the result.',
    },
    {
        id: 'care',
        title: 'Override with care',
        tone: 'warning',
        icon: 'fas fa-triangle-exclamation',
        note: 'Reaches far. Right for a specific look, but check every tone and both schemes.',
    },
    {
        id: 'avoid',
        title: 'Look elsewhere',
        tone: 'danger',
        icon: 'fas fa-signs-post',
        note: 'Overriding it works against the system. There is a better knob, and the entry names it.',
    },
];

export const VARIABLE_TIERS: VariableTierInfo[] = [
    {
        id: 'raw',
        title: 'Raw values',
        note: 'Numbers and colors with no meaning yet. Scales are ladders; settings are single values.',
    },
    {
        id: 'context',
        title: 'Context',
        note: 'Set by a class for a whole subtree: one tone ramp, one input size.',
    },
    {
        id: 'role',
        title: 'Roles',
        note: 'Meaning, stated once. What components and your own CSS read.',
    },
    {
        id: 'component',
        title: 'Components',
        note: 'Each component\'s own knobs, defaulted from roles.',
    },
];

export const VARIABLE_GROUPS: VariableGroup[] = [
    {
        id: 'spacing',
        tier: 'raw',
        title: 'Spacing',
        note: 'One grid unit, and every length as a multiple of it.',
        file: 'scales/spacing.css',
        entries: [
            {
                name: '--sp',
                value: '8px',
                about: 'The grid unit. Every gap, padding and control height is a multiple of it.',
                stance: 'yours',
                preview: 'length',
            },
            {
                name: '--sp<step>',
                members: SP_STEPS.map(step => `--sp${step}`),
                value: '--sp0-25 … --sp100',
                about: 'Multiples of the unit: quarters and halves up to 2.5, then whole steps, then every fourth.',
                stance: 'avoid',
                instead: 'Set --sp and every step follows. Missing a step? Add it to the scale, for everyone.',
                preview: 'length',
                sample: '--sp3',
            },
        ],
    },
    {
        id: 'radius',
        tier: 'raw',
        title: 'Radius',
        note: 'Three corners. Round controls skip this scale: they use half their own height.',
        file: 'scales/radius.css',
        entries: [
            {
                name: '--radius-m',
                value: '4px',
                about: 'The corner of controls and cards. The other two derive from it.',
                stance: 'yours',
                preview: 'radius',
            },
            {
                name: '--radius-s',
                members: ['--radius-s', '--radius-l'],
                value: '½ and 2 × --radius-m',
                about: 'The small and large corners: tags and insets, panels and dialogs.',
                stance: 'tune',
                preview: 'radius',
            },
        ],
    },
    {
        id: 'type-scale',
        tier: 'raw',
        title: 'Type scale',
        note: 'Sizes and weights, as ladders.',
        file: 'scales/font.css',
        entries: [
            {
                name: '--font-size-m',
                value: '16px',
                about: 'Body size. The whole size ladder is computed from it.',
                stance: 'yours',
                preview: 'font',
            },
            {
                name: '--font-size-<step>',
                members: ['xxs', 'xs', 's', 'l', 'xl', 'xxl', 'xxxl'].map(step => `--font-size-${step}`),
                value: 'm − 6, 4, 2px; m × 1.25, 1.5, 1.875, 2.25',
                about: 'Smaller steps subtract, larger ones multiply, so the ladder keeps its shape at any body size.',
                stance: 'care',
                instead: 'Change --font-size-m first. Moving one step breaks the rhythm between headings and body.',
                preview: 'font',
                sample: '--font-size-xl',
            },
            {
                name: '--font-weight-<weight>',
                members: ['thin', 'light', 'normal', 'bold', 'heavy'].map(weight => `--font-weight-${weight}`),
                value: '200, 300, 400, 500, 700',
                about: 'Named weights. Match them to what your typeface actually ships.',
                stance: 'tune',
                preview: 'none',
            },
        ],
    },
    {
        id: 'grid',
        tier: 'raw',
        title: 'Grid fractions',
        note: 'Twelfths, for widths that follow a column grid.',
        file: 'scales/grid.css',
        entries: [
            {
                name: '--gr<n>',
                members: [
                    ...TWELFTHS.map(n => `--gr${n}`),
                    ...TWELFTHS.map(n => `--vgr${n}`),
                ],
                value: 'n/12 of the container; --vgr<n>: of the viewport',
                about: 'Fractions, not design decisions.',
                stance: 'avoid',
                instead: 'There is nothing to tune. For a different column count, use your own fractions.',
                preview: 'none',
            },
        ],
    },
    {
        id: 'control-sizes',
        tier: 'raw',
        title: 'Control sizes',
        note: 'Five rows, xs to xl. Major is the control itself; minor is a knob, toggle or checkbox beside it.',
        file: 'scales/inputs.css',
        entries: [
            {
                name: '--input-size-<size>-<metric>',
                members: SIZES.flatMap(size => METRICS.map(metric => `--input-size-${size}-${metric}`)),
                value: 'm: --sp4 high, --sp2-5 minor, --sp1-5 padding',
                about: 'Every control of one size reads its row, through the size context.',
                stance: 'care',
                instead: 'Move a whole row together, and keep heights on the grid, so fields and buttons stay aligned.',
                preview: 'length',
                sample: '--input-size-m-major-height',
            },
        ],
    },
    {
        id: 'ramps',
        tier: 'raw',
        title: 'Color ramps',
        note: 'Generated from your palette spec: twelve scheme-aware steps per ramp.',
        file: 'palette.css (yours)',
        entries: [
            {
                name: '--color-<ramp>-<step>',
                members: ['base', 'primary', 'secondary'].flatMap(ramp => RAMP_STEPS.map(step => `--color-${ramp}-${step}`)),
                value: 'oklch, light-dark()',
                about: 'Step 0 is the canvas end in both schemes. Read them freely in single-tone components.',
                stance: 'avoid',
                instead: 'Change the palette spec and regenerate. Hand-edited steps drift from ' +
                    'the curves and the other scheme.',
                preview: 'color',
                sample: '--color-primary-500',
            },
            {
                name: '--color-<ramp>-contrast',
                members: ['base', 'primary', 'secondary'].map(ramp => `--color-${ramp}-contrast`),
                value: 'black or white',
                about: 'Whichever reads on step 500, per scheme.',
                stance: 'avoid',
                instead: 'Tune the ramp\'s lightness in the spec; the contrast flips where it needs to.',
                preview: 'color',
                sample: '--color-primary-contrast',
            },
        ],
    },
    {
        id: 'type-settings',
        tier: 'raw',
        title: 'Type settings',
        note: 'Faces, and the defaults the page picks from the type scales.',
        file: 'settings/font.css',
        entries: [
            {
                name: '--font-main',
                value: 'sans-serif',
                about: 'The face of body text and controls.',
                stance: 'yours',
                preview: 'none',
            },
            {
                name: '--font-alt',
                value: '--font-main',
                about: 'A second face, for display and headings.',
                stance: 'yours',
                preview: 'none',
            },
            {
                name: '--font-monospace',
                value: 'monospace',
                about: 'Code and tabular figures.',
                stance: 'yours',
                preview: 'none',
            },
            {
                name: '--line-height',
                value: '1.5',
                about: 'The line height every face starts from.',
                stance: 'yours',
                preview: 'none',
            },
            {
                name: '--line-height-<face>',
                members: [
                    '--line-height-main',
                    '--line-height-alt',
                    '--line-height-monospace',
                ],
                value: '--line-height',
                about: 'One face\'s line height, where it differs: a display face often sets tighter, code looser.',
                stance: 'tune',
                preview: 'none',
            },
            {
                name: '--font-weight',
                value: '--font-weight-normal',
                about: 'The page\'s default weight.',
                stance: 'tune',
                preview: 'none',
            },
            {
                name: '--font-size',
                value: '--font-size-m',
                about: 'The page\'s default size, picked from the scale.',
                stance: 'care',
                instead: 'Set --font-size-m: it moves body text and the whole ladder together.',
                preview: 'none',
            },
        ],
    },
    {
        id: 'control-settings',
        tier: 'raw',
        title: 'Control settings',
        note: 'What every control shares, whatever its size.',
        file: 'settings/inputs.css',
        entries: [
            {
                name: '--input-border-size',
                value: '1px',
                about: 'Outlined controls\' border. 2px gives a heavier look.',
                stance: 'tune',
                preview: 'none',
            },
            {
                name: '--input-outline-size',
                members: ['--input-outline-size', '--input-outline-offset'],
                value: '2px, offset 0',
                about: 'The focus ring\'s width and its distance from the control.',
                stance: 'tune',
                preview: 'none',
            },
            {
                name: '--input-disabled-opacity',
                members: ['--input-disabled-opacity', '--input-disabled-filter'],
                value: '.6, saturate(50%)',
                about: 'How a disabled control fades.',
                stance: 'tune',
                preview: 'none',
            },
            {
                name: '--input-hover-overlay',
                members: ['--input-hover-overlay', '--input-hover-filter'],
                value: '10% grey; brightness(.96)',
                about: 'Hover on filled controls (an overlay) and on wells (a filter).',
                stance: 'care',
                instead: 'Too strong or too weak in one scheme? Adjust it, but test filled and well controls in both.',
                preview: 'none',
            },
        ],
    },
    {
        id: 'tone-context',
        tier: 'context',
        title: 'Tone context',
        note: 'A .tone-* class points these at one ramp for its subtree. :root is base.',
        file: 'context/tones.css, palette.css',
        entries: [
            {
                name: '--tone-<step>',
                members: [
                    ...RAMP_STEPS.map(step => `--tone-${step}`),
                    '--tone-contrast',
                ],
                value: 'the current tone\'s ramp',
                about: 'Read them in multi-tone components when no role names the step you need.',
                stance: 'avoid',
                instead: 'Set them with a .tone-* class. To change a tone, change its ramp in the spec.',
                preview: 'color',
                sample: '--tone-300',
            },
        ],
    },
    {
        id: 'size-context',
        tier: 'context',
        title: 'Size context',
        note: 'An .input-size-* class collapses one row of control sizes into these slots. :root is m.',
        file: 'context/inputs.css',
        entries: [
            {
                name: '--input-<metric>',
                members: METRICS.map(metric => `--input-${metric}`),
                value: 'the current size\'s row',
                about: 'What controls read: --input-major-height, --input-gap and the rest.',
                stance: 'avoid',
                instead: 'Set them with an .input-size-* class. To change a size, change its row in the scale.',
                preview: 'length',
                sample: '--input-major-height',
            },
        ],
    },
    {
        id: 'surfaces',
        tier: 'role',
        title: 'Surfaces and borders',
        note: 'Three nesting levels of the page, each with its border, plus what sits above.',
        file: 'roles/canvas.css',
        entries: [
            {
                name: '--surface-base',
                members: ['--surface-base', '--border-base'],
                value: 'base 0, border 100',
                about: 'Level 1: the page, and the edges and dividers on it.',
                stance: 'care',
                instead: 'Reassign a level to change what it means everywhere. Keep each surface with its border.',
                preview: 'color',
            },
            {
                name: '--surface-shade',
                members: ['--surface-shade', '--border-shade'],
                value: 'base 50, border 100',
                about: 'Level 2: a region inside the page: sidebars, cards, code.',
                stance: 'care',
                instead: 'Reassign a level to change what it means everywhere. Keep each surface with its border.',
                preview: 'color',
            },
            {
                name: '--surface-deep',
                members: ['--surface-deep', '--border-deep'],
                value: 'base 100, border 200',
                about: 'Level 3: a well: fields, tracks, toggles, tool panels.',
                stance: 'care',
                instead: 'Reassign a level to change what it means everywhere. Keep each surface with its border.',
                preview: 'color',
            },
            {
                name: '--surface-raised',
                members: ['--surface-raised', '--border-raised'],
                value: 'base 0 / 800, border 100 / 700',
                about: 'Above the page: knobs, popovers.',
                stance: 'care',
                instead: 'Check knobs and popovers in dark mode after changing it: raised is lighter there.',
                preview: 'color',
            },
            {
                name: '--surface-overlay',
                value: 'black 10% / 20%',
                about: 'The scrim behind modals.',
                stance: 'tune',
                preview: 'color',
            },
        ],
    },
    {
        id: 'text',
        tier: 'role',
        title: 'Text',
        note: 'Three strengths of ink on the canvas.',
        file: 'roles/canvas.css',
        entries: [
            {
                name: '--text-base',
                value: 'base 950',
                about: 'Body text.',
                stance: 'care',
                instead: 'Reassign for a softer ink, but keep contrast with every surface level.',
                preview: 'text',
            },
            {
                name: '--text-subtle',
                members: ['--text-subtle', '--text-faint'],
                value: 'base 600, base 500',
                about: 'Secondary text; hints, captions and placeholders.',
                stance: 'care',
                instead: 'Reassign for a softer ink, but keep contrast with every surface level.',
                preview: 'text',
            },
        ],
    },
    {
        id: 'depth',
        tier: 'role',
        title: 'Depth',
        note: 'Reference colors for shadows, and the ingredients of translucency.',
        file: 'roles/canvas.css',
        entries: [
            {
                name: '--shadow-<strength>',
                members: ['--shadow-light', '--shadow-medium', '--shadow-heavy'],
                value: 'black 10/20/30% (dark: 20/40/60%)',
                about: 'Colors, not shadows: each component owns its own offsets and blur.',
                stance: 'tune',
                preview: 'shadow',
                sample: '--shadow-medium',
            },
            {
                name: '--translucency-<part>',
                members: [
                    '--translucency-mix-light',
                    '--translucency-mix-medium',
                    '--translucency-mix-heavy',
                    '--translucency-blur',
                    '--translucency-highlight',
                ],
                value: 'mix 15/50/75%, blur 3px, white rim',
                about: 'How much shows through translucent controls, how blurred, and their inner rim light.',
                stance: 'tune',
                preview: 'none',
            },
            {
                name: '--text-shadow-auto',
                value: 'inverse of the text, 25%',
                about: 'Lifts text off any fill. Computed from the current text color.',
                stance: 'avoid',
                instead: 'Set a component\'s own text shadow (--Btn-text-shadow) instead.',
                preview: 'none',
            },
        ],
    },
    {
        id: 'tone-roles',
        tier: 'role',
        title: 'Tone roles',
        note: 'What a control takes from its tone. Stated once against the context ramp; ' +
            'neutral tones fill from the canvas end.',
        file: 'roles/tones.css',
        entries: [
            {
                name: '--tone-fill',
                members: ['--tone-fill', '--tone-fill-top', '--tone-fill-bottom', '--tone-fill-text'],
                value: '500; bevel 400 → 600; contrast',
                about: 'A control\'s solid face, the ends of its gradient, and the text on it.',
                stance: 'care',
                instead: 'Reassign on [class^="tone-"] for every tone at once. A fill that\'s off for ' +
                    'one tone is a ramp to tune in the spec.',
                preview: 'color',
            },
            {
                name: '--tone-tint',
                members: ['--tone-tint', '--tone-tint-text'],
                value: '100, text 900',
                about: 'A soft background and the text on it: chips, badges, callouts.',
                stance: 'care',
                instead: 'Reassign on [class^="tone-"] for every tone at once.',
                preview: 'color',
            },
            {
                name: '--tone-text',
                members: ['--tone-text', '--tone-border'],
                value: '500, border 600',
                about: 'Tone-colored text and icons on the canvas, and a control\'s edge.',
                stance: 'care',
                instead: 'Reassign on [class^="tone-"] for every tone at once.',
                preview: 'text',
            },
            {
                name: '--tone-shadow',
                value: '800 (dark: 100)',
                about: 'The tinted part of a raised control\'s shadow.',
                stance: 'tune',
                preview: 'shadow',
            },
            {
                name: '--tone-focus-outline',
                members: ['--tone-focus-outline', '--tone-focus-border'],
                value: '300 and 600; neutral tones: secondary',
                about: 'The focus ring, outside and inside.',
                stance: 'care',
                instead: 'Neutral controls focus in secondary. Reassign on :root, .tone-base, ' +
                    '.tone-inverse for another accent.',
                preview: 'color',
            },
        ],
    },
    {
        id: 'component',
        tier: 'component',
        title: 'Component variables',
        note: 'Each component\'s knobs, listed on its own page.',
        file: 'the component',
        entries: [
            {
                name: '--<Component>-*',
                members: [
                    '--Btn-padding',
                    '--Btn-radius',
                    '--Btn-fill',
                    '--Chip-text',
                    '--Toggle-width',
                    '--Slider-knob-size',
                ],
                value: 'defaulted from roles and the size context',
                about: 'Set them on a class of your own to restyle one component without touching the rest.',
                stance: 'yours',
                preview: 'none',
            },
        ],
    },
];
