import type { BlockMarkupConfig, ContentBlock, ContentBlockType } from '../types.js';
import { escapeHtmlAttr } from './escape.js';
import { HtmlInlineSanitizer } from './HtmlInlineSanitizer.js';

export class BlockRenderer {

    private blockMap: Map<ContentBlockType, BlockMarkupConfig>;

    constructor(
        public config: BlockMarkupConfig[],
        public inlineSanitizer: HtmlInlineSanitizer,
    ) {
        this.blockMap = new Map(config.map(item => [item.type, item]));
    }

    public render(blocks: ContentBlock[]): string {
        const result: string[] = [];
        for (const block of blocks) {
            const blockDef = this.blockMap.get(block.type);
            if (!blockDef) {
                continue;
            }
            const classAttr = blockDef.className ? ` class="${escapeHtmlAttr(blockDef.className)}"` : '';
            const inlineHtml = this.inlineSanitizer.sanitizeHtml(block.text);
            result.push(`<${blockDef.tag}${classAttr}>${inlineHtml}</${blockDef.tag}>`);
        }
        return result.join('\n');
    }

}
