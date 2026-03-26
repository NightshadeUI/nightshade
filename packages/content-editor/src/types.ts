export type ContentInlineType = string;
export type ContentBlockType = string;

export interface ContentBlock {
    type: ContentBlockType;
    text: string;
}

export type ContentValue = ContentBlock[];

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
    defaultBlockType?: ContentBlockType;
}

export interface ToolbarState {
    visible: boolean;
    x: number;
    y: number;
    activeBlockType: ContentBlockType | null;
    activeInlineTypes: ContentInlineType[];
    hasSelection: boolean;
}
