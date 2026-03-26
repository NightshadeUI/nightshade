export type ContentInlineType = string;
export type ContentBlockType = string;

export interface ContentTextNode {
    type: 'text';
    text: string;
    marks?: ContentInlineType[];
}

export interface ContentBlockNode {
    type: ContentBlockType;
    children: ContentTextNode[];
}

export interface ContentDocument {
    type: 'doc';
    children: ContentBlockNode[];
}

export interface ContentBlockDefinition {
    type: ContentBlockType;
    tag: string;
    className?: string;
    label?: string;
}

export interface ContentInlineDefinition {
    type: ContentInlineType;
    tag: string;
    className?: string;
    label?: string;
}

export interface ContentEditorOptions {
    blocks: ContentBlockDefinition[];
    inlines?: ContentInlineDefinition[];
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
