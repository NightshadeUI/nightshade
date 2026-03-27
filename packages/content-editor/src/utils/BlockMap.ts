import type { ContentEditor } from '../ContentEditor.js';
import type { ContentBlock } from '../types.js';

export class BlockMap {

    constructor(public editor: ContentEditor) {}

    size(): number {
        const rootEl = this.editor.getRootElement();
        return rootEl?.children.length ?? 0;
    }

    getContentBlockByIndex(idx: number): ContentBlock | null {
        return this.editor.getValue()[idx] ?? null;
    }

    getContentElementByIndex(idx: number): HTMLElement | null {
        const rootEl = this.editor.getRootElement();
        if (!rootEl) {
            return null;
        }
        return rootEl.children.item(idx) as HTMLElement | null;
    }

    getContentElementIndex(el: HTMLElement): number {
        const rootEl = this.editor.getRootElement();
        if (!rootEl || el.parentElement !== rootEl) {
            return -1;
        }
        let idx = 0;
        let node: Element | null = el;
        while (node && node.previousElementSibling) {
            idx += 1;
            node = node.previousElementSibling;
        }
        return idx;
    }

}
