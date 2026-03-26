import type { BlockMarkupConfig, ContentBlockType, ContentValue } from '../types.js';
import { HtmlInlineSanitizer } from './HtmlInlineSanitizer.js';

function escapeHtmlAttr(input: string): string {
    return input
        .replaceAll('&', '&amp;')
        .replaceAll('"', '&quot;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');
}

export class BlockRenderer {

    private readonly blockMap: Map<ContentBlockType, BlockMarkupConfig>;
    private readonly fallbackType: ContentBlockType;
    private readonly inlineSanitizer: HtmlInlineSanitizer;

    constructor(
        config: BlockMarkupConfig[],
        fallbackType: ContentBlockType,
        inlineSanitizer: HtmlInlineSanitizer,
    ) {
        this.blockMap = new Map(config.map(item => [item.type, item]));
        this.fallbackType = fallbackType;
        this.inlineSanitizer = inlineSanitizer;
    }

    public render(value: ContentValue): string {
        return value.map(block => {
            const blockDef = this.blockMap.get(block.type) ?? this.blockMap.get(this.fallbackType);
            if (!blockDef) {
                return '';
            }
            const classAttr = blockDef.className ? ` class="${escapeHtmlAttr(blockDef.className)}"` : '';
            const inlineHtml = this.inlineSanitizer.sanitizeHtml(block.text);
            return `<${blockDef.tag}${classAttr}>${inlineHtml}</${blockDef.tag}>`;
        }).join('');
    }

}
