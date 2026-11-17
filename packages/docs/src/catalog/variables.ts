/**
 * The variable catalog: every public token the styles declare, grouped by category,
 * with how far each one is meant to be overridden.
 * A pattern entry (`--sp<step>`) stands for a whole family; `members` lists them for search,
 * `examples` are the one or two names whose specified values illustrate the family.
 */

export type VariableTier = 'raw' | 'context' | 'role' | 'component';

/**
 * How it goes when you override it, for Nightshade's own docs:
 * - `specify`: a knob, made for the system to set at its :root;
 * - `tune`: a sensible default, fine to change;
 * - `care`: reaches far; fine for a specific look, check every tone and both schemes;
 * - `avoid`: works against the system; a better knob exists.
 */
export type VariableStance = 'specify' | 'tune' | 'care' | 'avoid';

export type VariablePreview = 'color' | 'length' | 'radius' | 'shadow' | 'text' | 'font' | 'none';

export interface VariableEntry {
    name: string;
    members?: string[];
    /** Names whose specified values illustrate a group. Singles omit this. */
    examples?: string[];
    /** Fallback when the live sheets don't declare the name, for a system's own groups. */
    value?: string;
    about: string;
    stance?: VariableStance;
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
    /** The note for the usage view, where `note` speaks to a system's author. */
    usageNote?: string;
    entries: VariableEntry[];
}

export interface VariableTierInfo {
    id: Exclude<VariableTier, 'component'>;
    title: string;
    short: string;
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
const FONT_SIZE_STEPS = ['xxxs', 'xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'];

export const VARIABLE_STANCES: VariableStanceInfo[] = [
    {
        id: 'specify',
        title: 'Specify',
        tone: 'success',
        icon: 'fas fa-hand-pointer',
        note: 'The knobs. Set them at your :root, and everything downstream follows.',
    },
    {
        id: 'tune',
        title: 'Fine tune',
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
        title: 'Do not override',
        tone: 'danger',
        icon: 'fas fa-signs-post',
        note: 'Overriding it works against the system. There is a better knob, and the entry names it.',
    },
];

export const VARIABLE_TIERS: VariableTierInfo[] = [
    {
        id: 'raw',
        title: 'Raw values',
        short: 'Raw',
        note: 'Numbers and colors with no meaning yet. Scales are ladders; settings are single values.',
    },
    {
        id: 'context',
        title: 'Context',
        short: 'Context',
        note: 'Set by a class for a whole subtree: one tone ramp, one input size.',
    },
    {
        id: 'role',
        title: 'Roles',
        short: 'Role',
        note: 'Meaning, stated once. What components and your own CSS read.',
    },
];

/**
 * The names whose specified values illustrate an entry.
 * A group or pattern shows one or two; a single has none, and the entry's own name is the value.
 */
export function readExampleNames(entry: VariableEntry) {
    if (entry.examples?.length) {
        return entry.examples;
    }
    if (entry.name.includes('<') || (entry.members && entry.members.length > 1)) {
        return (entry.members ?? []).slice(0, 2);
    }
    return [];
}

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
                about: 'The grid unit. Every gap, padding and control height is a multiple of it. ' +
                    'Read a step whenever one exists; calc(n * var(--sp)) keeps a length off the ladder on the grid.',
                stance: 'specify',
                preview: 'length',
            },
            {
                name: '--sp<step>',
                members: SP_STEPS.map(step => `--sp${step}`),
                examples: ['--sp0-5', '--sp2'],
                about: 'Multiples of the unit: quarters and halves up to 2.5, then whole steps, then every fourth.',
                stance: 'avoid',
                instead: 'Set --sp and every step follows. Missing a step? Add it to the scale, for everyone.',
                preview: 'length',
                sample: '--sp2',
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
                about: 'The corner of controls and cards. The other two derive from it.',
                stance: 'specify',
                preview: 'radius',
            },
            {
                name: '--radius-s',
                about: 'The small corner: tags and insets. Half of --radius-m.',
                stance: 'tune',
                preview: 'radius',
            },
            {
                name: '--radius-l',
                about: 'The large corner: panels and dialogs. Twice --radius-m. ' +
                    'A round control takes half its own height, not a radius.',
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
                name: '--font-size-<step>',
                members: FONT_SIZE_STEPS.map(step => `--font-size-${step}`),
                examples: ['--font-size-m', '--font-size-xl'],
                about: 'The type scale: 8, 10, 12, 14, 16, 20, 24, 40, 88px. --font-size-m is body, xxxl is h1. ' +
                    'Set each at :root; none is derived from another.',
                stance: 'specify',
                preview: 'font',
                sample: '--font-size-xl',
            },
            {
                name: '--font-weight-<weight>',
                members: ['thin', 'light', 'normal', 'bold', 'heavy'].map(weight => `--font-weight-${weight}`),
                examples: ['--font-weight-normal', '--font-weight-bold'],
                about: 'Named weights. Match them to what your typeface actually ships. Read the name, not a number.',
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
                examples: ['--gr6', '--vgr6'],
                about: 'Widths on a twelve-column grid: --gr6 is half the container, --vgr6 half the viewport. ' +
                    'Fractions, not design decisions.',
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
                examples: ['--input-size-m-major-height', '--input-size-s-gap'],
                about: 'The rows of the control size scale. Don\'t read these: put an .input-size-* class on a ' +
                    'region and read --input-major-height and the rest.',
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
        usageNote: 'Twelve scheme-aware steps per ramp, generated from the system\'s palette.',
        entries: [
            {
                name: '--color-<ramp>-<step>',
                members: ['base', 'primary'].flatMap(ramp => RAMP_STEPS.map(step => `--color-${ramp}-${step}`)),
                examples: ['--color-primary-500', '--color-base-0'],
                about: 'Scheme-aware steps of every ramp. Read them in single-tone CSS: a brand mark, a chart ' +
                    'series, a status dot. In a control that takes any tone, read a tone role. Prefer a canvas ' +
                    'role where one names the use.',
                stance: 'avoid',
                instead: 'Change the palette spec and regenerate. Hand-edited steps drift from ' +
                    'the curves and the other scheme.',
                preview: 'color',
                sample: '--color-primary-500',
            },
            {
                name: '--color-<ramp>-contrast',
                members: ['base', 'primary'].map(ramp => `--color-${ramp}-contrast`),
                examples: ['--color-primary-contrast'],
                about: 'Black or white, whichever reads on the ramp\'s step 500. On a control\'s fill, ' +
                    'read --tone-fill-text.',
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
                about: 'The face of body text and controls.',
                stance: 'specify',
                preview: 'none',
            },
            {
                name: '--font-alt',
                about: 'A second face, for display and headings.',
                stance: 'specify',
                preview: 'none',
            },
            {
                name: '--font-monospace',
                about: 'Code and tabular figures.',
                stance: 'specify',
                preview: 'none',
            },
            {
                name: '--line-height',
                about: 'The page\'s line height: one line of a single-line control. Inherited by the whole app. ' +
                    'Leave it; set height on the box. Read --line-height-main with the face, or ' +
                    '--line-height-prose for running text.',
                stance: 'specify',
                preview: 'none',
            },
            {
                name: '--line-height-<face>',
                members: [
                    '--line-height-main',
                    '--line-height-alt',
                    '--line-height-monospace',
                    '--line-height-prose',
                ],
                examples: ['--line-height-main', '--line-height-prose'],
                about: 'A face\'s line height. -main, -alt and -monospace inherit --line-height (--sp2). ' +
                    '-prose is 1.5, a ratio, for articles and long copy. Don\'t set line-height to a spacing step.',
                stance: 'tune',
                preview: 'none',
            },
            {
                name: '--font-weight',
                about: 'The page\'s default weight. Body text has it already. Read a named weight: ' +
                    '--font-weight-bold.',
                stance: 'tune',
                preview: 'none',
            },
            {
                name: '--font-size',
                about: 'The page\'s default size, picked from the scale. Body text has it already. ' +
                    'Read a step: --font-size-s.',
                stance: 'care',
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
                about: 'Outlined controls\' border. 2px gives a heavier look.',
                stance: 'tune',
                preview: 'none',
            },
            {
                name: '--input-outline-size',
                about: 'The focus ring\'s width, for a focusable of your own.',
                stance: 'tune',
                preview: 'none',
            },
            {
                name: '--input-outline-offset',
                about: 'The focus ring\'s distance from the control.',
                stance: 'tune',
                preview: 'none',
            },
            {
                name: '--input-disabled-opacity',
                about: 'How a disabled control fades.',
                stance: 'tune',
                preview: 'none',
            },
            {
                name: '--input-disabled-filter',
                about: 'How a disabled control desaturates.',
                stance: 'tune',
                preview: 'none',
            },
            {
                name: '--input-hover-overlay',
                about: 'Hover on filled controls: a grey overlay.',
                stance: 'care',
                instead: 'Too strong or too weak in one scheme? Adjust it, but test filled and well controls in both.',
                preview: 'none',
            },
            {
                name: '--input-hover-filter',
                about: 'Hover on wells: a brightness filter.',
                stance: 'care',
                instead: 'Too strong or too weak in one scheme? Adjust it, but test filled and well controls in both.',
                preview: 'none',
            },
            {
                name: '--input-focus-outline',
                about: 'The focus ring of neutral controls, which have no hue of their own. ' +
                    'Point it at another ramp\'s step for another accent.',
                stance: 'specify',
                preview: 'color',
            },
            {
                name: '--input-focus-border',
                about: 'The focus border of neutral controls. Pair it with --input-focus-outline.',
                stance: 'specify',
                preview: 'color',
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
                examples: ['--tone-500', '--tone-contrast'],
                about: 'The current tone\'s ramp. Read them in a component meant to take any tone, when no role ' +
                    'names the step. Pick a tone with a .tone-* class; never assign these.',
                stance: 'avoid',
                instead: 'Set them with a .tone-* class. To change a tone, change its ramp in the spec.',
                preview: 'color',
                sample: '--tone-500',
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
                examples: ['--input-major-height', '--input-gap'],
                about: 'The current size: --input-major-height, --input-gap and the rest. Read them so your ' +
                    'controls line up. Pick a size with an .input-size-* class; never assign these.',
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
                examples: ['--surface-base', '--border-base'],
                about: 'Level 1: the page, and the edges and dividers on it.',
                stance: 'care',
                instead: 'Reassign a level to change what it means everywhere. Keep each surface with its border.',
                preview: 'color',
            },
            {
                name: '--surface-shade',
                members: ['--surface-shade', '--border-shade'],
                examples: ['--surface-shade', '--border-shade'],
                about: 'Level 2: a region inside the page: sidebars, cards, code.',
                stance: 'care',
                instead: 'Reassign a level to change what it means everywhere. Keep each surface with its border.',
                preview: 'color',
            },
            {
                name: '--surface-deep',
                members: ['--surface-deep', '--border-deep'],
                examples: ['--surface-deep', '--border-deep'],
                about: 'Level 3: a well: fields, tracks, toggles, tool panels.',
                stance: 'care',
                instead: 'Reassign a level to change what it means everywhere. Keep each surface with its border.',
                preview: 'color',
            },
            {
                name: '--surface-raised',
                members: ['--surface-raised', '--border-raised'],
                examples: ['--surface-raised', '--border-raised'],
                about: 'Above the page: popups, menus, tooltips. A step lighter than the page in dark mode.',
                stance: 'care',
                instead: 'Check popups in dark mode after changing it.',
                preview: 'color',
            },
            {
                name: '--surface-knob',
                about: 'The moving part of a control: toggle and slider knobs. Light in both schemes.',
                stance: 'tune',
                preview: 'color',
            },
            {
                name: '--surface-overlay',
                about: 'The scrim behind modals and drawers.',
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
                about: 'Body text.',
                stance: 'care',
                instead: 'Reassign for a softer ink, but keep contrast with every surface level.',
                preview: 'text',
            },
            {
                name: '--text-subtle',
                about: 'Secondary text.',
                stance: 'care',
                instead: 'Reassign for a softer ink, but keep contrast with every surface level.',
                preview: 'text',
            },
            {
                name: '--text-faint',
                about: 'Hints, captions and placeholders.',
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
                examples: ['--shadow-light', '--shadow-medium'],
                about: 'Shadow colors, not shadows: write your own offsets and blur around one.',
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
                examples: ['--translucency-mix-medium', '--translucency-blur'],
                about: 'How much shows through translucent controls, how blurred, and their inner rim light.',
                stance: 'tune',
                preview: 'none',
            },
            {
                name: '--text-shadow-auto',
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
                examples: ['--tone-fill', '--tone-fill-text'],
                about: 'A control\'s solid face, the ends of its gradient, and the text on it.',
                stance: 'care',
                instead: 'Reassign on [class^="tone-"] for every tone at once. A fill that\'s off for ' +
                    'one tone is a ramp to tune in the spec.',
                preview: 'color',
            },
            {
                name: '--tone-tint',
                members: ['--tone-tint', '--tone-tint-text'],
                examples: ['--tone-tint', '--tone-tint-text'],
                about: 'A soft background and the text on it: chips, badges, callouts.',
                stance: 'care',
                instead: 'Reassign on [class^="tone-"] for every tone at once.',
                preview: 'color',
            },
            {
                name: '--tone-text',
                members: ['--tone-text', '--tone-border'],
                examples: ['--tone-text', '--tone-border'],
                about: 'Tone-colored text and icons on the canvas, and a control\'s edge.',
                stance: 'care',
                instead: 'Reassign on [class^="tone-"] for every tone at once.',
                preview: 'text',
            },
            {
                name: '--tone-shadow',
                about: 'The tinted part of a raised control\'s shadow.',
                stance: 'tune',
                preview: 'shadow',
            },
            {
                name: '--tone-focus-outline',
                members: ['--tone-focus-outline', '--tone-focus-border'],
                examples: ['--tone-focus-outline', '--tone-focus-border'],
                about: 'The focus ring in the current tone, outside and inside. Neutral controls focus in ' +
                    '--input-focus-outline|border.',
                stance: 'care',
                instead: 'Neutral controls focus in --input-focus-outline|border: set those ' +
                    'for another accent.',
                preview: 'color',
            },
        ],
    },
];
