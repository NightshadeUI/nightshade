export type ContentInlineType = string;
export type ContentBlockType = string;

export interface ContentBlock {
    type: ContentBlockType;
    text: string;
}

export interface BlockMarkupConfig {
    type: ContentBlockType;
    tag: string;
    className?: string;
    label?: string;
}

export interface InlineMarkupConfig {
    type: ContentInlineType;
    tag: string;
    className?: string;
    label?: string;
}

export interface ContentEditorOptions {
    blocks: BlockMarkupConfig[];
    inlines?: InlineMarkupConfig[];
    defaultBlockType: ContentBlockType;
}
