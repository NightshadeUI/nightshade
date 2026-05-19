import { BlockMarkupConfig, ContentBlock, ContentBlockType } from '../types.js';
import { ContentEditor } from './ContentEditor.js';
import { escapeHtmlAttr } from './escape.js';

export class BlockRenderer {

    private blockMap: Map<ContentBlockType, BlockMarkupConfig>;

    constructor(public editor: ContentEditor) {
        const blocks = editor.config.blocks;
        this.blockMap = new Map(blocks.map(block => [block.type, block]));
    }

    render(blocks: ContentBlock[]): string {
        const result: string[] = [];
        for (const block of blocks) {
            const blockDef = this.blockMap.get(block.type);
            if (!blockDef) {
                continue;
            }
            const classAttr = blockDef.className ? ` class="${escapeHtmlAttr(blockDef.className)}"` : '';
            // Important: block.text is assumed to already be sanitized
            const inlineHtml = block.text;
            // <br> is inserted for empty paragraphs,
            // so that the browser doesn't collapse them
            const blockHtml = inlineHtml === '' ? '<br>' : inlineHtml;
            result.push(`<${blockDef.tag}${classAttr}>${blockHtml}</${blockDef.tag}>`);
        }
        return result.join('\n');
    }

}
