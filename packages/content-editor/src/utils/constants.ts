import { BlockMarkupConfig, InlineMarkupConfig } from '../types.js';

export const DEFAULT_BLOCKS: BlockMarkupConfig[] = [
    { type: 'h1', tag: 'h1', label: 'Page Title' },
    { type: 'h2', tag: 'h2', label: 'Section Header' },
    { type: 'h3', tag: 'h3', label: 'Subsection Header' },
    { type: 'h4', tag: 'h4', label: 'Minor Header' },
    { type: 'h5', tag: 'h5', label: 'Caption' },
    { type: 'h6', tag: 'h6', label: 'Small Caption' },
    { type: 'p', tag: 'p', label: 'Paragraph' },
    { type: 'kicker', tag: 'p', label: 'Kicker', className: 'kicker' },
    { type: 'callout', tag: 'p', label: 'Callout', className: 'callout' },
    { type: 'small', tag: 'p', label: 'Small Text', className: 'small' },
    { type: 'fine', tag: 'p', label: 'Fine Print', className: 'fine' },
];

export const DEFAULT_INLINES: InlineMarkupConfig[] = [
    { type: 'strong', tag: 'strong', label: 'Strong' },
    { type: 'em', tag: 'em', label: 'Emphasis' },
    { type: 's', tag: 's', label: 'Strikethrough' },
    { type: 'code', tag: 'code', label: 'Code' },
    { type: 'a', tag: 'a', label: 'Link' },
];

export const FAST_UPDATE_INPUT_TYPES = new Set<string>([
    'insertText',
    'deleteContentBackward',
    'deleteContentForward',
    'insertCompositionText',
]);
