import type { ContentEditorController } from '../ContentEditorController.js';

export class DomMap {

    constructor(public controller: ContentEditorController) {}

    private get rootEl(): HTMLElement | null {
        return this.controller.getRootElement();
    }

    size(): number {
        return this.rootEl?.children.length ?? 0;
    }

    getBlockIndex(el: Element): number | null {
        if (!this.rootEl || el.parentElement !== this.rootEl) {
            return null;
        }
        let index = 0;
        let node: Element | null = el;
        while (node && node.previousElementSibling) {
            index += 1;
            node = node.previousElementSibling;
        }
        return index;
    }

    getElementByBlock(index: number): HTMLElement | null {
        if (!this.rootEl) {
            return null;
        }
        return this.rootEl.children.item(index) as HTMLElement | null;
    }

}
