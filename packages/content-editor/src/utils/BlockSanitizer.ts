import type { BlockMarkupConfig, ContentBlock, ContentBlockType } from '../types.js';
import type { ContentEditor } from './ContentEditor.js';
import { InlineSanitizer } from './InlineSanitizer.js';

export class BlockSanitizer {

    private blockMap: Map<ContentBlockType, BlockMarkupConfig>;

    constructor(public editor: ContentEditor) {
        const blocks = editor.config.blocks;
        this.blockMap = new Map(blocks.map(block => [block.type, block]));
    }

    get inlineSanitizer(): InlineSanitizer {
        return this.editor.inlineSanitizer;
    }

    sanitizeInputBlocks(input: unknown): ContentBlock[] {
        if (!Array.isArray(input)) {
            return [];
        }
        const sanitized: ContentBlock[] = [];
        for (const entry of input) {
            const block = this.sanitizeBlock(entry);
            if (block) {
                sanitized.push(block);
            }
        }
        return sanitized;
    }

    private sanitizeBlock(input: unknown): ContentBlock | null {
        if (!input || typeof input !== 'object') {
            return null;
        }
        const record = input as Record<string, unknown>;
        if (typeof record.type !== 'string' || typeof record.text !== 'string') {
            return null;
        }
        const blockDef = this.blockMap.get(record.type);
        if (!blockDef) {
            return null;
        }
        return {
            type: blockDef.type,
            text: this.inlineSanitizer.sanitizeHtml(record.text),
        };
    }

}
