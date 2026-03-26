import type {
    ContentBlockDefinition,
    ContentDocument,
    ContentEditorOptions,
    ContentInlineDefinition,
} from '../types.js';

const DEFAULT_BLOCKS: ContentBlockDefinition[] = [
    { type: 'paragraph', tag: 'p', label: 'Paragraph' },
];

const DEFAULT_INLINES: ContentInlineDefinition[] = [
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

export function createEmptyDocument(options: ContentEditorOptions): ContentDocument {
    return {
        type: 'doc',
        children: [
            {
                type: options.defaultBlockType ?? options.blocks[0].type,
                children: [{ type: 'text', text: '' }],
            },
        ],
    };
}
