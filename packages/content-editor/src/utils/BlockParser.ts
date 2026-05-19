import { BlockMarkupConfig, ContentBlock } from '../types.js';
import { ContentEditor } from './ContentEditor.js';
import { escapeHtml } from './escape.js';

export class BlockParser {

    constructor(public editor: ContentEditor) {}

    parseRoot(root: HTMLElement): ContentBlock[] {
        const blocks: ContentBlock[] = [];
        const defaultType = this.editor.config.defaultBlockType;
        for (const child of root.childNodes) {
            if (child.nodeType === Node.TEXT_NODE) {
                const text = child.textContent ?? '';
                if (!text.trim()) {
                    continue;
                }
                blocks.push({
                    type: defaultType,
                    text: escapeHtml(text),
                });
                continue;
            }
            if (child.nodeType !== Node.ELEMENT_NODE) {
                continue;
            }
            const element = child as HTMLElement;
            const blockDef = this.findBlockDefinition(element);
            if (!blockDef) {
                continue;
            }
            blocks.push({
                type: blockDef.type,
                text: element.innerHTML,
            });
        }
        return blocks;
    }

    findBlockDefinition(element: HTMLElement): BlockMarkupConfig | null {
        const tag = element.tagName.toLowerCase();
        for (const blockDef of this.editor.config.blocks) {
            if (blockDef.tag.toLowerCase() !== tag) {
                continue;
            }
            if (blockDef.className && !element.classList.contains(blockDef.className)) {
                continue;
            }
            return blockDef;
        }
        return null;
    }

}
