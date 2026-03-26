import type { ContentBlock, ContentEditorOptions } from '../types.js';
import { BlockParser } from './BlockParser.js';
import { BlockRenderer } from './BlockRenderer.js';
import { HtmlBlockSanitizer } from './HtmlBlockSanitizer.js';
import { HtmlInlineSanitizer } from './HtmlInlineSanitizer.js';

export function sanitizeContentValue(input: unknown, options: ContentEditorOptions): ContentBlock[] {
    const inlineSanitizer = new HtmlInlineSanitizer(options.inlines ?? []);
    const blockSanitizer = new HtmlBlockSanitizer(options.blocks, inlineSanitizer);
    const blocks = blockSanitizer.sanitizeValue(input);
    return blocks.length ? blocks : createEmptyValue(options);
}

export function parseEditorElement(root: HTMLElement, options: ContentEditorOptions): ContentBlock[] {
    const parser = new BlockParser(options.blocks, options.defaultBlockType);
    const inlineSanitizer = new HtmlInlineSanitizer(options.inlines ?? []);
    const blockSanitizer = new HtmlBlockSanitizer(options.blocks, inlineSanitizer);
    const parsedBlocks = parser.parseRoot(root);
    const blocks = blockSanitizer.sanitizeValue(parsedBlocks);
    return blocks.length ? blocks : createEmptyValue(options);
}

export function renderContentValue(value: ContentBlock[], options: ContentEditorOptions): string {
    const sanitized = sanitizeContentValue(value, options);
    const inlineSanitizer = new HtmlInlineSanitizer(options.inlines ?? []);
    const renderer = new BlockRenderer(options.blocks, inlineSanitizer);
    return renderer.render(sanitized);
}

function createEmptyBlock(options: ContentEditorOptions): ContentBlock {
    return {
        type: options.defaultBlockType,
        text: '',
    };
}

function createEmptyValue(options: ContentEditorOptions): ContentBlock[] {
    return [createEmptyBlock(options)];
}
