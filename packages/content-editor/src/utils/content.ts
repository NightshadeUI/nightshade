import type { ContentBlock, ContentEditorOptions, ContentValue } from '../types.js';
import { BlockParser } from './BlockParser.js';
import { BlockRenderer } from './BlockRenderer.js';
import { HtmlInlineSanitizer } from './HtmlInlineSanitizer.js';

export function sanitizeContentValue(input: unknown, options: ContentEditorOptions): ContentValue {
    const fallbackType = options.defaultBlockType ?? options.blocks[0].type;
    const inlineSanitizer = new HtmlInlineSanitizer(options.inlines);
    const parser = new BlockParser(options.blocks, fallbackType, inlineSanitizer);
    const blocks = parser.sanitizeValue(input);
    return blocks.length ? blocks : createEmptyValue(options);
}

export function parseEditorElement(root: HTMLElement, options: ContentEditorOptions): ContentValue {
    const fallbackType = options.defaultBlockType ?? options.blocks[0].type;
    const inlineSanitizer = new HtmlInlineSanitizer(options.inlines);
    const parser = new BlockParser(options.blocks, fallbackType, inlineSanitizer);
    const blocks = parser.parseRoot(root);
    return sanitizeContentValue(blocks, options);
}

export function renderContentValue(value: ContentValue, options: ContentEditorOptions): string {
    const sanitized = sanitizeContentValue(value, options);
    const fallbackType = options.defaultBlockType ?? options.blocks[0].type;
    const inlineSanitizer = new HtmlInlineSanitizer(options.inlines);
    const renderer = new BlockRenderer(options.blocks, fallbackType, inlineSanitizer);
    return renderer.render(sanitized);
}

function createEmptyBlock(options: ContentEditorOptions): ContentBlock {
    return {
        type: options.defaultBlockType ?? options.blocks[0].type,
        text: '',
    };
}

function createEmptyValue(options: ContentEditorOptions): ContentValue {
    return [createEmptyBlock(options)];
}
