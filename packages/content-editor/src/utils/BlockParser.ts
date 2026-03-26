import type { BlockMarkupConfig, ContentBlock, ContentBlockType, ContentValue } from '../types.js';
import { escapeHtml } from './escape.js';
import { HtmlInlineSanitizer } from './HtmlInlineSanitizer.js';

export class BlockParser {

    private readonly blocks: BlockMarkupConfig[];
    private readonly fallbackType: ContentBlockType;
    private readonly blockMap: Map<string, BlockMarkupConfig>;
    private readonly inlineSanitizer: HtmlInlineSanitizer;

    constructor(
        config: BlockMarkupConfig[],
        fallbackType: ContentBlockType,
        inlineSanitizer: HtmlInlineSanitizer,
    ) {
        this.blocks = config;
        this.fallbackType = fallbackType;
        this.blockMap = new Map(config.map(item => [item.type, item]));
        this.inlineSanitizer = inlineSanitizer;
    }

    public parseRoot(root: HTMLElement): ContentValue {
        const blocks: ContentBlock[] = [];
        Array.from(root.childNodes).forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                const text = child.textContent ?? '';
                if (!text.trim()) {
                    return;
                }
                blocks.push({
                    type: this.fallbackType,
                    text: escapeHtml(text),
                });
                return;
            }
            const element = child as HTMLElement;
            blocks.push({
                type: this.findBlockTypeForElement(element) ?? this.fallbackType,
                text: this.inlineSanitizer.sanitizeHtml(element.innerHTML),
            });
        });
        return blocks;
    }

    public sanitizeValue(input: unknown): ContentValue {
        if (!Array.isArray(input)) {
            return [];
        }
        return input
            .map(block => this.normalizeBlockInput(block))
            .filter((block): block is ContentBlock => !!block);
    }

    public findBlockTypeForElement(element: HTMLElement | null): ContentBlockType | null {
        if (!element) {
            return null;
        }
        const tag = element.tagName.toLowerCase();
        const match = this.blocks.find(block => {
            if (block.tag.toLowerCase() !== tag) {
                return false;
            }
            if (!block.className) {
                return true;
            }
            return element.classList.contains(block.className);
        });
        return match?.type ?? null;
    }

    private normalizeBlockInput(block: unknown): ContentBlock | null {
        if (!block || typeof block !== 'object') {
            return null;
        }
        const candidate = block as Partial<ContentBlock>;
        const type = typeof candidate.type === 'string' && this.blockMap.has(candidate.type) ?
            candidate.type :
            this.fallbackType;
        const text = typeof candidate.text === 'string' ? candidate.text : '';
        return {
            type,
            text: this.inlineSanitizer.sanitizeHtml(text),
        };
    }

}
