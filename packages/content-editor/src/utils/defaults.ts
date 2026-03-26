import type {
    BlockMarkupConfig,
    ContentBlock,
    ContentEditorOptions,
    ContentValue,
    InlineMarkupConfig,
} from '../types.js';

const DEFAULT_BLOCKS: BlockMarkupConfig[] = [
    { type: 'paragraph', tag: 'p', label: 'Paragraph' },
];

const DEFAULT_INLINES: InlineMarkupConfig[] = [
    { type: 'bold', tag: 'strong', label: 'Bold' },
    { type: 'italic', tag: 'em', label: 'Italic' },
    { type: 'underline', tag: 'u', label: 'Underline' },
];

export function normalizeOptions(options?: Partial<ContentEditorOptions>): ContentEditorOptions {
    const blocks = options?.blocks?.length ? options.blocks : DEFAULT_BLOCKS;
    const inlines = options?.inlines?.length ? options.inlines : DEFAULT_INLINES;
    const defaultBlockType = options?.defaultBlockType ?? blocks[0].type;
    return {
        blocks,
        inlines,
        defaultBlockType,
    };
}

export function createEmptyBlock(options: ContentEditorOptions): ContentBlock {
    return {
        type: options.defaultBlockType ?? options.blocks[0].type,
        text: '',
    };
}

export function createEmptyValue(options: ContentEditorOptions): ContentValue {
    return [createEmptyBlock(options)];
}
